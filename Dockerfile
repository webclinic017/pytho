FROM node:lts

WORKDIR /root/js
COPY ./game/js /root/js
RUN yarn install
RUN yarn run buildprod

FROM python:3

ARG django_secret_key
ARG django_debug
ENV DJANGO_SECRET_KEY=$django_secret_key
ENV DJANGO_DEBUG=$django_debug

RUN mkdir /root/pytho
WORKDIR /root/pytho

COPY requirements.txt /root/pytho
RUN pip install -r requirements.txt
COPY . /root/pytho/

COPY --from=0 /root/js/dist /root/pytho/game/js/dist
RUN python3 manage.py collectstatic --noinput
