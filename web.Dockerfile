FROM python:3.9.5-buster

RUN mkdir /root/pytho
WORKDIR /root/pytho
RUN apt-get update
RUN apt-get -y install python-dev build-essential

COPY requirements.txt /root/pytho
RUN pip install -r requirements.txt
COPY . /root/pytho/
RUN cythonize -i helpers/portfolio/calculator/calcs/main.pyx
