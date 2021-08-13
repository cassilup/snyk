#!/usr/bin/env bash
set -e

if [[ $(uname -s) == "Darwin" ]];then
    echo "this is Mac"
    sed -i "" "s|\"name\": \"snyk\"|\"name\": \"@snyk/cli-preview\"|g" ./package.json
else
    echo "this is Linux"
    sed -i  "s|\"name\": \"snyk\"|\"name\": \"@snyk/cli-preview\"|g" ./package.json
fi
