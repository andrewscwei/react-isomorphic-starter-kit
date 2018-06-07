#!/bin/bash

set -e

wget -qO- https://cli-assets.heroku.com/install-ubuntu.sh | sh

cat > ~/.netrc << EOF
machine api.heroku.com
  login $HEROKU_LOGIN
  password $HEROKU_API_KEY
machine git.heroku.com
  login $HEROKU_LOGIN
  password $HEROKU_API_KEY
EOF

# Add heroku.com to the list of known hosts
ssh-keyscan -H heroku.com >> ~/.ssh/known_hosts

# Deploy to Heroku container registry
# heroku plugins:install @heroku-cli/plugin-container-registry
heroku container:login
heroku container:push release --app=$CIRCLE_PROJECT_REPONAME

echo
echo "Successfuly deployed to Heroku"
