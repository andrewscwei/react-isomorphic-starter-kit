#!/bin/bash

# Runs the app container.

set -e

source $(dirname $0)/get_opts.sh

echo -e "Running $(cyan $IMAGE_NAME:$IMAGE_TAG)..."

docker run -it --rm --net=$NET -p $PORT:8080 --name $APP_NAME $IMAGE_NAME:$IMAGE_TAG

echo -e "Running $(cyan $IMAGE_NAME:$IMAGE_TAG)..."
