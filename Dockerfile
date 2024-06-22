FROM node:21.7.2-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 8100

CMD [ "npm", "start" ]