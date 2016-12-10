#!/usr/bin/env bash

cd ./site && rimraf dist && webpack --config ./config/webpack.prod.js --progress --profile --bail
cd .. && git add . && git commit -m 'automatic update' && git push