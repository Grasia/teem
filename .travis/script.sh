#!/bin/sh

if [ $TRAVIS_PULL_REQUEST != "false" ]; then
  echo "Testing pull request"

  gulp buildAndTest
elif [ $TRAVIS_BRANCH = "master" ]; then
  echo "Testing and deploying to production"

  gulp cd
elif [ $TRAVIS_BRANCH = "staging" ]; then
  echo "Deploying to staging and testing"

  gulp cd:pushAndRun
else
  echo "Testing branch $TRAVIS_BRANCH"

  gulp buildAndTest
fi
