#!/bin/bash
yarn build
mkdir -p docs
cp -a dist/spa/* docs/
git add *
git commit -m "update github page"
git push origin master
