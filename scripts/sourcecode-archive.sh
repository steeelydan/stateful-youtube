#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Please specify a version number."
    exit 1
fi

7z a ./sourcecode-archive/source-code-"$1".zip ./public ./src ./manifest.json ./package-lock.json ./package.json ./tsconfig.json ./webpack.config.cjs
echo "Source code archived successfully (version $1)."