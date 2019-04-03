FROM node:11.0.0

RUN apt-get update
RUN npm install -g npm

# Create a non-root user
RUN groupadd -r nodejs \
    && useradd -m -r -g nodejs nodejs

USER nodejs

# Create a home for the application
RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app

# Install app dependencies
COPY package.json /home/nodejs/app
COPY package-lock.json /home/nodejs/app
RUN npm ci --silent

# Bundle app source
COPY ./ .

# Environment
COPY .env /home/nodejs/app
ENV NODE_PATH /home/nodejs/app/src

EXPOSE 8080 9229

CMD ["npm", "run", "dev:docker"]
