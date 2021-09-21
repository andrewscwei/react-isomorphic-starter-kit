# This is a Dockerfile with multi-stage builds.

# Builds the app with dev dependencies included.
FROM node:14.13.1 as build-dev

ARG BUILD_NUMBER
ARG PUBLIC_PATH

WORKDIR /var/app

COPY package*.json ./

RUN npm install

COPY config ./config
COPY src ./src
COPY ts*.json ./
COPY .babelrc ./

RUN NODE_ENV=production npm run build


# Rebuilds the app with unit tests included.
FROM build-dev as test

COPY tests ./tests

# Strips dev dependencies from the dev build.
FROM build-dev as build-prod

RUN npm prune --production


# Final production build.
FROM node:14.13.1-alpine

ARG BUILD_NUMBER

ENV NODE_ENV=production
ENV BUILD_NUMBER=$BUILD_NUMBER

WORKDIR /var/app

COPY package*.json ./
COPY --from=build-prod /var/app/build ./build
COPY --from=build-prod /var/app/node_modules ./node_modules

CMD npm start

EXPOSE 8080
