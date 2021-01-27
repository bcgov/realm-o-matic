FROM caddy:2.1.1-alpine

ENV INSTALL_PATH /srv

ENV SUMMARY="Keycloak Self-service App Web"  \
  DESCRIPTION="The frontend for Keycloak Self-service App running node nodejs 10.10 on Alpine Linux"
ENV LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8

LABEL summary="$SUMMARY" \
  description="$DESCRIPTION"

RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY build/ $INSTALL_PATH

EXPOSE 2015

