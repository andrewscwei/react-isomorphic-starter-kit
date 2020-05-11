#!/bin/bash

__PACKAGE_FILE__=$(npm pack | tail -1)
mkdir -p package
mv $__PACKAGE_FILE__ package/
