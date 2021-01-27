FROM node:12.0-alpine

ARG NODE_MAJOR_VERSION=12
ARG NODE_VERSION=12.0.x

ENV WORK_PATH /opt/app
ENV SUMMARY="Keycloak Self-service App Web"  \
  DESCRIPTION="The frontend for Keycloak Self-service App running node nodejs ${NODE_VERSION} on Alpine Linux"
ENV LC_ALL=en_US.UTF-8 \
  LANG=en_US.UTF-8

LABEL summary="$SUMMARY" \
  description="$DESCRIPTION"

RUN apk update && \
  apk upgrade && \
  apk add bash git

RUN find / -perm +6000 -type f -not -path '/proc/*' -exec chmod a-s {} \; || true

WORKDIR $WORK_PATH

EXPOSE 3000

CMD [ "npm", "start" ]
