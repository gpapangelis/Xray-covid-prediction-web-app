from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv(verbose=True)

#SQLALCHEMY_DATABASE_URL = "postgresql://postgres:1977@127.0.0.1/postgres"
SQLALCHEMY_DATABASE_URL=os.getenv("DB_URL", default="")

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()
