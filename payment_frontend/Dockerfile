FROM node:22-alpine AS build

WORKDIR /kafka_es

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /kafka_es/dist /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
