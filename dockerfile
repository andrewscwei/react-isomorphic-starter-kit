# © Sybl

FROM node:8.9.4-alpine

# Set environment variables
ARG NODE_ENV=production
ARG PUBLIC_PATH

ENV NODE_ENV=$NODE_ENV
ENV PUBLIC_PATH=$PUBLIC_PATH

# Install NPM dependencies
ADD package.json /var/repo/
ADD yarn.lock /var/repo/
WORKDIR /var/repo
RUN yarn

# Clone built files
ADD build /var/repo/build

# Run
CMD npm start
