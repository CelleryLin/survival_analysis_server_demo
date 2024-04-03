# This image run the flask app
# don't have to include nodejs
# because the frontend has already 
# built and saved to the static.

FROM python:3.10

WORKDIR /code

ADD . /code

RUN pip install -r requirements.txt

CMD ["python", "./api/app.py"]