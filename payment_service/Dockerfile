FROM node:22-alpine

WORKDIR /kafka_es

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 9003

CMD [ "yarn", "dev"]
