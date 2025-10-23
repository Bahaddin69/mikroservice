FROM node:22-alpine

WORKDIR /kafka_es

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

EXPOSE 9001

CMD [ "yarn", "dev" ]
