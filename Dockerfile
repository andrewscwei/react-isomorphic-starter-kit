################################################################################
# Development build
################################################################################
FROM node:22.2.0 AS dev

ARG BASE_PATH
ARG BASE_URL
ARG BUILD_NUMBER
ARG DEFAULT_LOCALE

WORKDIR /var/app

COPY package*.json ./

RUN npm install

COPY lib ./lib
COPY src ./src
COPY tests ./tests
COPY index.ts ./
COPY ts*.json ./
COPY vite.config.ts ./
COPY eslint.config.mjs ./
COPY .stylelintrc ./

RUN npm run build

################################################################################
# Production build
################################################################################
FROM dev AS prod

RUN npm prune --production

################################################################################
# Release build
################################################################################
FROM node:22.2.0-alpine AS release

ENV NODE_ENV=production

WORKDIR /var/app

COPY package*.json ./
COPY --from=prod /var/app/build ./build
COPY --from=prod /var/app/node_modules ./node_modules

CMD npm start

EXPOSE 8080
