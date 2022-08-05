#!/bin/sh

echo "remove public/packs/js"
rm -rf ./public/packs/js
echo "removing completed"

echo "rebuild frontend"
./bin/webpack
echo "frontend successfully rebilt"
