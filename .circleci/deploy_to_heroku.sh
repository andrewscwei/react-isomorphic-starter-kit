#!/bin/bash

set -e

wget -qO- https://cli-assets.heroku.com/install-ubuntu.sh | sh

cat > ~/.netrc << EOF
machine api.heroku.com
  login $HEROKU_LOGIN
  password $HEROKU_KEY
machine git.heroku.com
  login $HEROKU_LOGIN
  password $HEROKU_KEY
EOF

# Add heroku.com to the list of known hosts
# ssh-keyscan -H heroku.com >> ~/.ssh/known_hosts

# # Deploy to Heroku container registry
# # heroku plugins:install @heroku-cli/plugin-container-registry
# heroku container:login
# heroku container:push web --app=$CIRCLE_PROJECT_REPONAME
# heroku container:release web --app=$CIRCLE_PROJECT_REPONAME
docker login -u "$HEROKU_LOGIN" -p "$HEROKU_KEY" registry.heroku.com
docker build --rm=false --build-arg NODE_ENV=production --build-arg PUBLIC_PATH=$PUBLIC_PATH -t registry.heroku.com/$CIRCLE_PROJECT_REPONAME/web:$CIRCLE_SHA1 .
docker push registry.heroku.com/$CIRCLE_PROJECT_REPONAME/web:$CIRCLE_SHA1

echo
echo "Successfuly deployed to Heroku"
