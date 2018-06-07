#!/bin/bash

# Runs the app container.

set -e

source $(dirname $0)/get_opts.sh

echo -e "Running $(cyan $IMAGE_NAME:latest$IMAGE_TAG_SUFFIX)..."

# Volume mapping.
VOLUME_MAPPING=" \
  -v $(pwd)/src:/var/$APP_NAME/src"

docker run -it --rm --net=$NET -p $PORT:8080 --name $APP_NAME $VOLUME_MAPPING $IMAGE_NAME:latest$IMAGE_TAG_SUFFIX
