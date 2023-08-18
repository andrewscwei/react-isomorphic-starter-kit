# Builds the app with dev dependencies included.
FROM node:18.8.0 AS dev

ARG BASE_PATH
ARG BASE_URL
ARG BUILD_NUMBER
ARG DEBUG_CHANNELS
ARG DEBUG_ENABLED
ARG DEFAULT_LOCALE
ARG PUBLIC_PATH
ARG PUBLIC_URL

WORKDIR /var/app

COPY package*.json ./

RUN npm install

COPY config ./config
COPY scripts ./scripts
COPY lib ./lib
COPY src ./src
COPY tests ./tests
COPY ts*.json ./
COPY .babelrc ./
COPY .eslintrc ./
COPY .stylelintrc ./

RUN npm run build


# Rebuilds the app with unit tests included.
FROM dev AS test

COPY tests ./tests

# Strips dev dependencies from the dev build.
FROM dev AS prod

# RUN npm prune --production


# Final production build.
FROM node:18.8.0-slim AS release

ENV NODE_ENV=production

WORKDIR /var/app

COPY package*.json ./
COPY --from=prod /var/app/build ./build
COPY --from=prod /var/app/node_modules ./node_modules

CMD npm start

EXPOSE 8080
