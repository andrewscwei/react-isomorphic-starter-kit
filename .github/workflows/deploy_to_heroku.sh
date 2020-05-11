#!/bin/bash

# Required environment variables:
# - HEROKU_USER: Heroku username (email)
# - HEROKU_KEY: Heroku API key
# = PUBLIC_PATH: Optional public path to prefix all loaded assets in the app.

set -e

APP_NAME=$(cat package.json | jq -r ".name")

wget -qO- https://cli-assets.heroku.com/install-ubuntu.sh | sh

cat > ~/.netrc << EOF
machine api.heroku.com
  login $HEROKU_USER
  password $HEROKU_KEY
machine git.heroku.com
  login $HEROKU_USER
  password $HEROKU_KEY
EOF

docker login -u "$HEROKU_USER" -p "$HEROKU_KEY" registry.heroku.com
docker build --rm=false --build-arg NODE_ENV=production --build-arg BUILD_NUMBER=$GITHUB_SHA --build-arg PUBLIC_PATH=$PUBLIC_PATH -t registry.heroku.com/$APP_NAME/web:latest .
docker push registry.heroku.com/$APP_NAME/web:latest

heroku container:login
heroku container:release web --app=$APP_NAME

echo
echo "Successfuly deployed to Heroku"
