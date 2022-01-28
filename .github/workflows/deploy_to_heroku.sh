#!/bin/bash

# Required environment variables:
# - HEROKU_API_KEY: Heroku long-lived user authorization key
# - PUBLIC_PATH: Optional public path to prefix all loaded assets in the app.

set -e

BASE_DIR=$(cd $(dirname $0); cd ../../; pwd -P)
APP_NAME=$(cat $BASE_DIR/package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]')

# In order to log into the Heroku Container Registry, you need a long-lived user authorization key.
# To create one, run `heroku authorizations:create` and set the key to the environment variable
# `HEROKU_API_KEY`, which will be automatically picked up by the Heroku CLI.

heroku container:login
heroku container:push --arg NODE_ENV=production,BUILD_NUMBER=$(echo $GITHUB_SHA | head -c7),PUBLIC_PATH=$PUBLIC_PATH -a $APP_NAME web
heroku container:release -a $APP_NAME web

echo
echo "Successfuly deployed to Heroku"
