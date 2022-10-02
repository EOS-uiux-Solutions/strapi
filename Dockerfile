FROM node:14.15.0-alpine

LABEL org.opencontainers.image.source="https://github.com/EOS-uiux-Solutions/strapi"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "develop"]
