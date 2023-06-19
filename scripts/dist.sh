#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Please specify a version number."
    exit 1
fi

7z a ./dist/stateful-youtube-"$1".zip ./manifest.json ./public/ ./build/
echo "Distribution created successfully (version $1)."