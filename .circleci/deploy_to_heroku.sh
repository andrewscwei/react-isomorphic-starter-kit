#!/bin/bash

set -e

APP_NAME="$CIRCLE_PROJECT_REPONAME"

wget -qO- https://cli-assets.heroku.com/install-ubuntu.sh | sh

cat > ~/.netrc << EOF
machine api.heroku.com
  login $HEROKU_LOGIN
  password $HEROKU_KEY
machine git.heroku.com
  login $HEROKU_LOGIN
  password $HEROKU_KEY
EOF

docker login -u "$HEROKU_LOGIN" -p "$HEROKU_KEY" registry.heroku.com
docker build --rm=false --build-arg NODE_ENV=production --build-arg BUILD_NUMBER=$CIRCLE_SHA1 --build-arg PUBLIC_PATH=$PUBLIC_PATH -t registry.heroku.com/$APP_NAME/web:latest .
docker push registry.heroku.com/$APP_NAME/web:latest

heroku container:login
heroku container:release web --app=$APP_NAME

echo
echo "Successfuly deployed to Heroku"
