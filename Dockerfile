FROM node:12.13.0-alpine

LABEL org.opencontainers.image.source="https://github.com/SundeepChand/strapi"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "develop"]
