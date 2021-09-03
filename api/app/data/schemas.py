from typing import List, Optional
from pydantic import BaseModel, EmailStr

class ImageBase(BaseModel):
    filename: str
    image_data: str
    model_result: Optional[str] = None

class ImageCreate(ImageBase):
    pass

class ImageDB(ImageBase):
    image_id: int
    user_id: int
    class Config:
        orm_mode = True

class UpdateImage(BaseModel):
    new_filename: Optional[str] = None

class UserBase(BaseModel):
    name: str
    email:str

class UserCreate(UserBase):
    password: str

class UpdateUser(BaseModel):
    old_email: str
    old_password: str
    new_name: Optional[str] = None
    new_email: Optional[str] = None
    new_password: Optional[str] = None

class UpdateAdmin(BaseModel):
    current_admin_email: str
    current_admin_password: str
    set_is_superuser: bool

class UserDBnoPass(UserBase):
    user_id: int
    is_superuser: bool
    images: List[ImageDB] = []
    class Config:
        orm_mode = True

class UserDB(UserDBnoPass):
    hashed_password: str

class UserDBforAdmin(UserBase):
    user_id: int
    is_superuser: bool
    class Config:
        orm_mode = True

class UserDBforAdminUserInfo(UserDBforAdmin):
    name: str
    email:str
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None
    name: Optional[str] = None
    email: Optional[str] = None
    is_superuser: Optional[str] = None

class EmailSchema(BaseModel):
    email: List[EmailStr]