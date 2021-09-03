# Use an existing docker image as a base
FROM python:3.9-buster

# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


#Change working directory
WORKDIR /app

# COPY requirements.txt
COPY ./requirements.txt ./

RUN pip install -r requirements.txt
# Copy main.py file
COPY ./app ./

# Tell what to do when it starts as a container
CMD ["uvicorn","main:app","--host","0.0.0.0","--port","6000"]
