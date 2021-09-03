from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, LargeBinary
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):

    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    hashed_password = Column(String)
    is_superuser = Column(Boolean)

    images = relationship("Image", back_populates="creator", cascade="all, delete", passive_deletes=True)

class Image(Base):

    __tablename__ = 'images'

    image_id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    image_data = Column(String)
    model_result = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete="CASCADE"))

    creator = relationship("User", back_populates="images")