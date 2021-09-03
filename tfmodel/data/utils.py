from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi import HTTPException, status, UploadFile
from . import schemas, model_base
import base64
from io import BytesIO 
from PIL import Image

def get_res(image: schemas.ImageModel):
    result = model_base.get_pred(image.image_data)
    return {"model_result": result}



    # base64_image_ascii = string_to_image(base64_image_string.image_data)
    
    # im_bytes = base64.b64decode(base64_image_string)   # im_bytes is a binary image 
    # im_file = BytesIO(im_bytes)  # convert image to file-like object 
    # img = Image.open(im_file)   # img is now PIL Image object 
    