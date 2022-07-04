# Update the VARIANT arg in docker-compose.yml to pick a Node version: 10, 12, 14
ARG VARIANT=12
FROM node:${VARIANT}-alpine

WORKDIR /minhdu-api

COPY package*.json ./

COPY . .

RUN npm run push

RUN npm install --production

WORKDIR /app/dist/

CMD ["npm", "start"]
EXPOSE 3000
