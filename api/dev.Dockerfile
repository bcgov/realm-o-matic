FROM node:10

ARG NODE_VERSION=10.15.3

ENV INSTALL_PATH /home/app

RUN apt-get update && \
  yes | apt-get upgrade

# Create a non-root user
RUN useradd --user-group --create-home --shell /bin/false app
USER app

# Create a home for the application
WORKDIR $INSTALL_PATH

COPY . .
USER root
RUN chown -R app:app $INSTALL_PATH

# Install app dependencies
RUN npm ci --silent

EXPOSE 8089 9229

CMD ["npm", "run", "dev:docker"]
