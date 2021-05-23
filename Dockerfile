ARG VARIANT=12
FROM node:${VARIANT}-alpine

WORKDIR /minhdu_api

COPY package*.json ./
RUN yarn

ADD . /minhdu_api

RUN yarn generate

RUN yarn build

RUN ls -la

CMD ["yarn", "start:dev"]
EXPOSE 1130
