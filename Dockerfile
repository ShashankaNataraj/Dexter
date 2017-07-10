FROM node:latest

ADD . /opt/Dexter
EXPOSE 8000
WORKDIR /opt/Dexter

RUN babel-node src/index.js