FROM node:lts

WORKDIR /root/js
COPY ./game/js /root/js
RUN yarn install
RUN yarn run buildprod

FROM python:3.9.5-buster

RUN apt-get update
RUN apt-get -y install python-dev build-essential

#RUN addgroup --gid 1000 calum
#RUN adduser --disabled-password --uid 1000 --gid 1000 calum
#RUN usermod -aG sudo calum

RUN mkdir /root/workspace
RUN mkdir /root/workspace/pytho
WORKDIR /root/workspace/pytho

COPY requirements.txt /root/workspace/pytho
RUN pip install -r requirements.txt
COPY . /root/workspace/pytho

RUN cd helpers/portfolio/calculator/calcs/ && python setup.py build_ext && cd ~/

COPY --from=0 /root/js/dist /root/workspace/pytho/game/js/dist