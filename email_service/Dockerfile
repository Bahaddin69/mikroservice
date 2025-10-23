FROM node:22-alpine

WORKDIR /kafka_es

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 9005

CMD [ "yarn", "dev"]
