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

docker login -u "$HEROKU_LOGIN" -p "$HEROKU_KEY" registry.heroku.com
docker build --rm=false --build-arg NODE_ENV=production --build-arg PUBLIC_PATH=$PUBLIC_PATH -t registry.heroku.com/$CIRCLE_PROJECT_REPONAME/web:latest .
docker push registry.heroku.com/$CIRCLE_PROJECT_REPONAME/web:latest

heroku container:login
heroku container:release web --app=react-isomorphic-starter-kit

echo
echo "Successfuly deployed to Heroku"
