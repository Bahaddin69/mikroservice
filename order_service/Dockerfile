FROM node:22-alpine

WORKDIR /kafka_es

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY drizzle.config.ts ./
COPY src ./src
COPY . .

EXPOSE 9002

CMD [ "yarn" ,"dev"]
