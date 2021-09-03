from typing import List, Optional
from pydantic import BaseModel

class ImageModel(BaseModel):
    image_data: str

class AnswerModel(BaseModel):
    model_result: str
