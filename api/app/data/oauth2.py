from datetime import datetime, timedelta
from fastapi import Depends, status, HTTPException
from typing import Optional
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from . import schemas, utils

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_access_token(username:str, password: str, db: Session):
    user = authenticate_user(username, password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta()
    authenticated_user = schemas.UserDBnoPass(user_id=user.user_id, name=user.name, email=user.email, is_superuser=user.is_superuser)
    access_token = create_access_token(extra_info=authenticated_user.dict(), expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

def authenticate_user(email: str, password: str, db: Session):
    user = utils.get_user_by_email(email, db)
    if not user:
        return False
    if not utils.Hash.verify(password, user.hashed_password):
        return False
    return user

def create_access_token(extra_info: dict, expires_delta: Optional[timedelta] = None):
    to_encode = extra_info.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt



async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload is None:
            raise credentials_exception
        token_data = schemas.TokenData(user_id=payload.get("user_id"), name = payload.get("name"), email = payload.get("email"), is_superuser = payload.get("is_superuser"))
    except JWTError:
        raise credentials_exception
    # in login phase we have checked if user exists
    user = schemas.UserDBnoPass(**token_data.dict())
    return user

async def check_is_supersuser(current_user: schemas.UserDBnoPass = Depends(get_current_user)):
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden 403",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user
