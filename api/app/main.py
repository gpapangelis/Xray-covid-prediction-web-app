from fastapi import FastAPI, Depends, UploadFile, File
from typing import Dict, List
from datetime import timedelta
from sqlalchemy.orm import Session
from data.database import SessionLocal, engine
from typing import Optional
from fastapi.security import OAuth2PasswordRequestForm
from data import models, schemas, oauth2, utils
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request


models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/api/login", response_model=schemas.Token, tags=['users', 'admins'])
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return oauth2.get_access_token(form_data.username, form_data.password, db)

@app.post("/api/register", response_model=schemas.UserDBnoPass, tags=['users'])
def create_user(request: schemas.UserCreate, db: Session = Depends(get_db)):
    return utils.create_user(request, db)

@app.get("/api/users/me", response_model=schemas.UserDBnoPass, tags=['users'])
def get_user_me(current_user: schemas.UserDBnoPass = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    return current_user

@app.post("/api/users/me/update", response_model=schemas.UserDBnoPass, tags=['users'])
def update_user_me(updated_user: schemas.UpdateUser, current_user: schemas.UserDBnoPass = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    return utils.update_user(updated_user, current_user, db)

@app.get("/api/users/me/images", response_model= List[schemas.ImageDB], tags=['users'])
def get_images(current_user: schemas.UserDBnoPass = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    return utils.get_user_images(current_user, db)

@app.post("/api/users/me/images", response_model=schemas.ImageDB, tags=['users'])
async def upload_image(img: UploadFile = File(...), current_user: schemas.UserDBnoPass = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    image_to_string = utils.image_to_string(img)
    new_image = schemas.ImageCreate(filename=img.filename, image_data= image_to_string)
    # string_to_img = string_to_image(image_to_string)
    return utils.create_image(new_image, current_user, db)

@app.get("/api/users/me/images/{image_id}", response_model=schemas.ImageDB, tags=['users'])
def get_image(image_id: int, current_user: schemas.UserDBnoPass = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    return utils.get_image_by_id(image_id, current_user, db)

@app.post("/api/users/me/images/{image_id}", response_model=schemas.ImageDB, tags=['users'])
def update_image(image_id: int, updated_image: schemas.UpdateImage, current_user: schemas.UserDBnoPass = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    return utils.update_image_by_id(image_id, updated_image, current_user, db)

@app.delete("/api/users/me/images/{image_id}", response_model=schemas.ImageDB, tags=['users'])
def delete_image(image_id: int, current_user: schemas.UserDBnoPass = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    return utils.delete_image_by_id(image_id, current_user, db)

# MODEL ============================================


@app.get("/api/users/me/images/{image_id}/result", response_model=schemas.ImageDB, tags=['users'])
async def get_result_for_image(image_id: int, current_user: schemas.UserDBnoPass = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    return await utils.get_result_for_image(image_id,current_user, db)




# ===================
#                   #
#                   #
#       ADMIN       #
#                   #
#                   #
# ===================

@app.get("/api/users", response_model=List[schemas.UserDBforAdminUserInfo], tags=['admins'])
def get_all_users(current_user: schemas.UserDBnoPass = Depends(oauth2.check_is_supersuser), db: Session = Depends(get_db)):
    return utils.get_all_users(db)

@app.get("/api/users/email", response_model=schemas.UserDBforAdminUserInfo, tags=['admins'])
def get_user(user_email: str, current_user: schemas.UserDBnoPass = Depends(oauth2.check_is_supersuser), db: Session = Depends(get_db)):
    return utils.get_user_by_email(user_email, db)

@app.get("/api/users/userName", response_model=List[schemas.UserDBforAdminUserInfo], tags=['admins'])
def get_user(user_name: str, current_user: schemas.UserDBnoPass = Depends(oauth2.check_is_supersuser), db: Session = Depends(get_db)):
    return utils.get_user_by_name(user_name, db)

@app.get("/api/users/userId/{user_id}", response_model=schemas.UserDBforAdminUserInfo, tags=['admins'])
def get_user(user_id: int, current_user: schemas.UserDBnoPass = Depends(oauth2.check_is_supersuser), db: Session = Depends(get_db)):
    return utils.get_user_by_id(user_id, db)

@app.get("/api/users/setAdmin/{user_id}", response_model=schemas.UserDBforAdminUserInfo, tags=['admins'])
def set_admin(user_id: int, current_user: schemas.UserDBnoPass = Depends(oauth2.check_is_supersuser), db: Session = Depends(get_db)):
    return utils.set_admin(user_id, current_user, db)

@app.delete("/api/users/{user_id}", response_model=schemas.UserDBforAdminUserInfo, tags=['admins'])
def delete_user(user_id: int, current_user: schemas.UserDBnoPass = Depends(oauth2.check_is_supersuser), db: Session = Depends(get_db)):
    return utils.delete_user_by_id(user_id, current_user, db)
