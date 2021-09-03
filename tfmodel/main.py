from fastapi import FastAPI, Depends, UploadFile, File
from typing import Dict, List
from datetime import timedelta
from sqlalchemy.orm import Session
from typing import Optional
from fastapi.security import OAuth2PasswordRequestForm
from data import schemas, utils
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


@app.post("/result", response_model=schemas.AnswerModel, tags=['Main'])
def get_model_result(image: schemas.ImageModel):
    return utils.get_res(image)
