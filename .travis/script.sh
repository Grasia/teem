#!/bin/sh

if [ $TRAVIS_PULL_REQUEST != "false" ]; then
  echo "Testing pull request"

  gulp buildAndTest
elif [ $TRAVIS_BRANCH = "master" ]; then
  echo "Testing and deploying to production"

  # Add deploy ssh key
  eval "$(ssh-agent -s)" #start the ssh agent
  ssh-add .travis/id_rsa

  gulp cd
elif [ $TRAVIS_BRANCH = "staging" ]; then
  echo "Deploying to staging and testing"

  # Add deploy ssh key
  eval "$(ssh-agent -s)" #start the ssh agent
  ssh-add .travis/id_rsa

  gulp cd:pushAndRun
else
  echo "Testing branch $TRAVIS_BRANCH"

  gulp buildAndTest
fi
