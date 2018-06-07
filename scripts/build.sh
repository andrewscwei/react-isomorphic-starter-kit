#!/bin/bash

# This script builds the Docker container for this project. It supports 3
# environments: development, staging and production. This environment directly
# reflects the runtime environment of the app. Note that if the environment is
# set to production, dev dependencies will not be installed.

set -e

source $(dirname $0)/get_opts.sh

echo -e "Building $(cyan ${IMAGE_NAME}:${IMAGE_TAG}) in $(cyan ${ENVIRONMENT})..."

npm run build

docker build \
  --build-arg NODE_ENV=${ENVIRONMENT} \
  --build-arg PUBLIC_PATH=${PUBLIC_PATH} \
  --rm=false \
  -f $BASE_DIR/Dockerfile \
  -t ${IMAGE_NAME}:${IMAGE_TAG} .
docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest${IMAGE_TAG_SUFFIX}
