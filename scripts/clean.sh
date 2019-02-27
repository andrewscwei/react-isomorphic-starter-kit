#!/bin/bash

# This script removes all Docker containers/images related to the project. It
# also removes all unnamed containers/images.

set -e

source $(dirname $0)/get_opts.sh

docker system prune -f

# Get all images related to this app and force delete them.
IMAGES=$(docker images | awk '$1 ~ /^'$(echo ${IMAGE_NAME} | sed -e "s/\//\\\\\//g")'$/ {print $3}')

if [ "$IMAGES" != "" ]; then
  docker rmi -f $IMAGES
fi
