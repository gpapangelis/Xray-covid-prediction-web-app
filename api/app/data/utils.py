from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi import HTTPException, status, UploadFile
from . import models, schemas, oauth2
import base64
from starlette.requests import Request
import json
import requests
from requests.exceptions import HTTPError
from fastapi_mail import FastMail, MessageSchema,ConnectionConfig
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv(verbose=True)

pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Hash():
    def bcrypt(password: str):
        hashedPassword = pwd_cxt.hash(password)
        return hashedPassword

    def verify(plain_password, hashed_password):
        return pwd_cxt.verify(plain_password, hashed_password)


def create_user(user: schemas.UserCreate, db: Session):
    if get_user_by_email(user.email, db):
        raise HTTPException(
            status_code=403,
            detail="Email already exists!"
        )
    new_user = models.User(name=user.name, email=user.email,hashed_password=Hash.bcrypt(user.password), is_superuser=False)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def update_user(updated_user: schemas.UpdateUser, current_user: schemas.UserDBnoPass, db):
    user = db.query(models.User).filter(models.User.email == current_user.email)
    # maybe it is Overkill...
    if not user.first():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not Hash.verify(updated_user.old_password, user.first().hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    if not updated_user.old_email == user.first().email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    if not (updated_user.new_email == None):
        if get_user_by_email(updated_user.new_email, db):
            raise HTTPException(
                status_code=403,
                detail="Email already exists!"
            )
        user.update({models.User.email: updated_user.new_email}, synchronize_session=False)
        #user.email = updated_user.new_email
    if not (updated_user.new_password == None):
        new_hashed_password = Hash.bcrypt(updated_user.new_password)
        user.update({models.User.hashed_password: new_hashed_password}, synchronize_session=False)
        #user.hashed_password = new_hashed_password
    if not (updated_user.new_name == None):
        user.update({models.User.name: updated_user.new_name}, synchronize_session=False)
        #user.name = updated_user.new_name
    db.commit()
    user = user.first()
    return user

def get_user_by_email(email: str, db: Session):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_name(name: str, db: Session):
    return db.query(models.User).filter(models.User.name == name).all()

def get_user_images(user: models.User, db: Session):
    return get_user_by_email(user.email, db).images

def image_to_string(img: UploadFile):
    binary_to_txt = base64.b64encode(img.file.read()).decode("ascii")
    return binary_to_txt

def string_to_image(img: str):
    return base64.b64decode(img.encode('ascii'))

def create_image(img: schemas.ImageCreate, current_user: schemas.UserDBnoPass, db: Session):
    new_image = models.Image(filename=img.filename,
                            image_data=img.image_data,
                            user_id=current_user.user_id)
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    return new_image

def get_image_by_id(image_id: int, current_user: schemas.UserDBnoPass, db: Session):
    return db.query(models.Image).filter(models.Image.image_id == image_id, models.Image.user_id == current_user.user_id).first()

def update_image_by_id(image_id: int, updated_image: schemas.UpdateImage, current_user: schemas.UserDBnoPass, db: Session):
    image = db.query(models.Image).filter(models.Image.image_id == image_id, models.Image.user_id == current_user.user_id)
    if not image.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The requested resource was not found"
        )
    if not (updated_image.new_filename == None):
        image.update({models.Image.filename: updated_image.new_filename}, synchronize_session=False)
    # if not (updated_image.new_image_data == None):
    #     image.update({models.Image.image_data: updated_image.new_image_data}, synchronize_session=False)
    db.commit()
    new_image = image.first()
    db.refresh(new_image)
    return new_image

def delete_image_by_id(image_id: int, current_user: schemas.UserDBnoPass, db: Session):
    image_query = db.query(models.Image).filter(models.Image.image_id == image_id, models.Image.user_id == current_user.user_id)
    if not image_query.first():
        raise HTTPException(
            status_code=404,
            detail="The requested resource was not found"
        )
    image = image_query.first()
    # We cant assign new object because there is a conflict
    # We cant return image object (through another variable deleted_image = image.first())
    # because lazy-load so there is not image to get in return AFTER delete.
    deleted_image = {"image_id" : image.image_id, "filename" : image.filename, "image_data" : image.image_data, "model_result" : image.model_result, "user_id" : image.user_id, "creator" : image.creator}
    image_query.delete(synchronize_session=False)
    db.commit()
    return deleted_image

async def get_result_for_image(image_id: int, current_user: schemas.UserDBnoPass, db: Session):
    image_query = db.query(models.Image).filter(models.Image.image_id == image_id, models.Image.user_id == current_user.user_id)
    if not image_query.first():
        raise HTTPException(
            status_code=404,
            detail="The requested resource was not found"
        )
    image = image_query.first()
    data = image.image_data
    get_test_url= "http://model-clip:8000/result/"
    inp_post_response = requests.post(get_test_url, json={"image_data": data})
    if inp_post_response.status_code != 200:
        raise HTTPException(
            status_code=inp_post_response.status_code,
        )
    else:
        image_query.update({models.Image.model_result: json.loads(inp_post_response.text)["model_result"]}, synchronize_session=False)
        db.commit()
        new_image = image_query.first()
        db.refresh(new_image)
        await send_email(current_user.email, new_image.model_result)
        await send_email_mlhg(current_user.email, new_image.model_result)
        return new_image

async def send_email(email: str, result: str):
    mail_content = "Your Image result is: " + result
    sender_address = os.getenv("EMAIL_USERNAME", default="")
    sender_pass = os.getenv("EMAIL_PASSWORD", default="")
    receiver_address = []
    receiver_address.append(email)
    #Setup the MIME
    message = MIMEMultipart()
    message['From'] = sender_address
    message['To'] = receiver_address
    message['Subject'] = 'Image Result'
    #The body and the attachments for the mail
    conf = ConnectionConfig(
        MAIL_USERNAME = sender_address,
        MAIL_PASSWORD = sender_pass,
        MAIL_FROM = sender_address,
        MAIL_PORT = 465, # 465, 587
        MAIL_SERVER = 'smtp.gmail.com',
        MAIL_TLS = False,
        MAIL_SSL = True,
        USE_CREDENTIALS = True,
        VALIDATE_CERTS = True
    )

    message = MessageSchema(
        subject='Image Result',
        recipients=receiver_address,  # List of recipients, as many as you can pass
        body=mail_content
    )
    fm = FastMail(conf)
    await fm.send_message(message)
    return "OK"

async def send_email_mlhg(email: str, result: str):
    mail_content = "Your Image result is: " + result
    sender_address = os.getenv("EMAIL_USERNAME", default="")
    sender_pass = os.getenv("EMAIL_PASSWORD", default="")
    receiver_address = []
    receiver_address.append(email)
    #Setup the MIME
    message = MIMEMultipart()
    message['From'] = sender_address
    message['To'] = receiver_address
    message['Subject'] = 'Image Result'
    #The body and the attachments for the mail
    conf = ConnectionConfig(
        MAIL_USERNAME = sender_address,
        MAIL_PASSWORD = sender_pass,
        MAIL_FROM = sender_address,
        MAIL_PORT = 1025, # 465, # 465, 587
        MAIL_SERVER = 'mailhog-service',
        MAIL_TLS = False,
        MAIL_SSL = False,
        USE_CREDENTIALS = True,
        VALIDATE_CERTS = False
    )

    message = MessageSchema(
        subject='Image Result',
        recipients=receiver_address,  # List of recipients, as many as you can pass
        body=mail_content
    )
    fm = FastMail(conf)
    await fm.send_message(message)
    return "OK"


def get_all_users(db: Session):
    return db.query(models.User).all()

def get_user_by_id(user_id: int, db: Session):
    return db.query(models.User).filter(models.User.user_id == user_id).first()

# def set_admin(user_id: int, update_admin: schemas.UpdateAdmin, db):
#     admin_user = db.query(models.User).filter(models.User.email == update_admin.current_admin_email)
#     other_user = db.query(models.User).filter(models.User.user_id == user_id)
#     if not admin_user.first():
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     if not Hash.verify(update_admin.current_admin_password, admin_user.first().hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     if not update_admin.current_admin_email == admin_user.first().email:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     if not other_user.first():
#         raise HTTPException(
#             status_code=404,
#             detail="The requested resource was not found"
#         )
#     other_user.update({models.User.is_superuser: update_admin.set_is_superuser}, synchronize_session=False)
#     db.commit()
#     user = other_user.first()
#     return user

def set_admin(user_id: int, current_user: schemas.UserDBforAdminUserInfo, db):
    admin_user = db.query(models.User).filter(models.User.email == current_user.email)
    other_user = db.query(models.User).filter(models.User.user_id == user_id)
    if not admin_user.first():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not other_user.first():
        raise HTTPException(
            status_code=404,
            detail="The requested resource was not found"
        )
    other_user.update({models.User.is_superuser: current_user.is_superuser}, synchronize_session=False)
    db.commit()
    user = other_user.first()
    return user

def delete_user_by_id(user_id: int, current_user: schemas.UserDBnoPass, db: Session):
    user_query = db.query(models.User).filter(models.User.user_id == user_id, models.User.user_id != current_user.user_id)
    if not user_query.first():
        raise HTTPException(
            status_code=404,
            detail="The requested resource was not found"
        )
    user = user_query.first()
    deleted_user = {"user_id" : current_user.user_id, "name" : current_user.name, "email" : current_user.email, "is_superuser" : current_user.is_superuser}
    # We cant assign new object because there is a conflict
    # We cant return image object (through another variable deleted_image = image.first())
    # because lazy-load so there is not image to get in return AFTER delete.
    if current_user.is_superuser:
        deleted_user = {"user_id" : user.user_id, "name" : user.name, "email" : user.email, "is_superuser" : user.is_superuser}
        user_query.delete(synchronize_session=False)
        db.commit()
    else:
        if current_user.user_id == user.user_id and current_user.email == user.email:
            user_query.delete(synchronize_session=False)
            db.commit()
    return deleted_user
