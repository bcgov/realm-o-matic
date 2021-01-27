FROM node:10.10

RUN apt-get update && \
  yes | apt-get upgrade

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm ci --silent
RUN npm i react-scripts --silent

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ] 
