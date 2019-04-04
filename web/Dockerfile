FROM node:10

ARG NODE_VERSION=10.15.3

ENV INSTALL_PATH /home/app
ENV SUMMARY="Keycloak Self-service App Web"  \
  DESCRIPTION="The frontend for Keycloak Self-service App running node nodejs ${NODE_VERSION} on Alpine Linux"
ENV LC_ALL=en_US.UTF-8 \
  LANG=en_US.UTF-8 

LABEL summary="$SUMMARY" \
  description="$DESCRIPTION"

RUN apt-get update && \
  yes | apt-get upgrade

RUN useradd --user-group --create-home --shell /bin/false app

USER app
WORKDIR $INSTALL_PATH

COPY . .
USER root
RUN chown -R app:app $INSTALL_PATH

RUN npm ci --silent
RUN npm i react-scripts --silent

EXPOSE 3000

CMD [ "npm", "start" ]
