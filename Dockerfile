FROM node:8

WORKDIR /app


COPY server/dist ./server/dist

RUN npm install

COPY site/dist ./site/dist


CMD ["node", "server/dist/server.js"]