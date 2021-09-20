FROM nikolaik/python-nodejs:python3.9-nodejs14

RUN apt-get update
RUN apt-get -y install python-dev build-essential

COPY . /workspaces/pytho
WORKDIR /workspaces/pytho

RUN cd ./game/js && yarn install && yarn global add webpack webpack-cli && cd /workspaces

COPY requirements.txt /workspaces/pytho
RUN pip install -r requirements.txt
RUN  cythonize -i helpers/portfolio/calculator/calcs/main.pyx