# Update the VARIANT arg in docker-compose.yml to pick a Node version: 10, 12, 14
ARG VARIANT=12
FROM node:${VARIANT}-alpine

WORKDIR /minhdu-api

COPY package*.json ./minhdu-api

RUN yarn

RUN yarn build

RUN ls -la

CMD ["yarn", "start"]
EXPOSE 3000
