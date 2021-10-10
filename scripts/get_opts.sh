#!/bin/bash

# This script processes all the input arguments supported by the other build scripts.

# Get the base path (repo root).
BASE_DIR=$(cd $(dirname $0); cd ../; pwd -P)

# App name.
APP_NAME=$(cat $BASE_DIR/package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]')

# Docker image name, can be overridden.
IMAGE_NAME=""

# Docker image tag.
IMAGE_TAG=""

# Docker image tag suffix.
IMAGE_TAG_SUFFIX=""

# App version.
IMAGE_VERSION=$(cat $BASE_DIR/package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]')

# Target environment for the Docker image to be built, can be overridden (only used during build
# script).
ENVIRONMENT="production"

# Target network to connect the container, can be overridden (only used during run script).
NET="bridge"

# Port to use when running the container.
PORT=8080

# Functions.
function red() { echo "\x1b[0;31m${1}\x1b[0m"; }
function green() { echo "\x1b[0;32m${1}\x1b[0m"; }
function yellow() { echo "\x1b[0;33m${1}\x1b[0m"; }
function blue() { echo "\x1b[0;34m${1}\x1b[0m"; }
function purple() { echo "\x1b[0;35m${1}\x1b[0m"; }
function cyan() { echo "\x1b[0;36m${1}\x1b[0m"; }
function grey() { echo "\x1b[0;37m${1}\x1b[0m"; }

# Source .env file if it exists.
if [ -f .env ]; then
  set -a
  source .env
fi

# Get CLI options.
while getopts "i:t:e:n:p:" FLAG; do
  case "${FLAG}" in
    i) IMAGE_NAME="${OPTARG}" ;;
    t) IMAGE_TAG="${OPTARG}" ;;
    e) ENVIRONMENT="${OPTARG}" ;;
    n) NET="${OPTARG}" ;;
    p) PORT="${OPTARG}" ;;
    *) exit 1 ;;
  esac
done

# Determine the target environment.
case "${ENVIRONMENT}" in
  dev|devel|development) ENVIRONMENT="development"; IMAGE_TAG_SUFFIX="-dev" ;;
      sta|stage|staging) ENVIRONMENT="staging"; IMAGE_TAG_SUFFIX="-sta" ;;
        prod|production) ENVIRONMENT="production" ;;
                      *) echo "$(red 'Unsupported environment:') $ENVIRONMENT" && exit 1 ;;
esac

# Set the default image name if it is not provided.
if [ "$IMAGE_NAME" == "" ]; then IMAGE_NAME="$APP_NAME"; fi

# Set the image tag if it is not provided.
if [ "$IMAGE_TAG" == "" ]; then IMAGE_TAG="${IMAGE_VERSION}${IMAGE_TAG_SUFFIX}"; fi
