# Update the VARIANT arg in docker-compose.yml to pick a Node version: 10, 12, 14
ARG VARIANT=12
FROM node:${VARIANT}-alpine

WORKDIR /minhdu_api

COPY package*.json ./
RUN yarn

ADD . /minhdu_api

RUN yarn generate

RUN yarn build

RUN ls -la

CMD ["yarn", "start"]
EXPOSE 1130