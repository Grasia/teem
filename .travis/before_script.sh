#!/bin/sh

if [ $TRAVIS_PULL_REQUEST != "false" ]; then
  echo "Not using config.js for pull requests"

  exit
fi

if [ $TRAVIS_BRANCH = "master" ] || [ $TRAVIS_BRANCH = "staging" ]; then
  echo "Using config.js for branch $TRAVIS_BRANCH"

  openssl aes-256-cbc -K $encrypted_f03f2d3a9637_key -iv $encrypted_f03f2d3a9637_iv -in .travis/secrets.tar.enc -out .travis/secrets.tar -d

  tar xvf .travis/secrets.tar --directory .travis

  chmod 600 .travis/id_rsa

  mv .travis/config.$TRAVIS_BRANCH.js config.js
fi
