#!/bin/sh

if [ $TRAVIS_PULL_REQUEST != "false" ]; then
  echo "Testing pull request"

  gulp buildAndTest
elif [ $TRAVIS_BRANCH = "master" ]; then
  echo "Testing and deploying to production"

  # Add deploy ssh key
  eval "$(ssh-agent -s)" #start the ssh agent
  ssh-add .travis/id_rsa

  echo "commit message:" $TRAVIS_COMMIT_MESSAGE

  if [[ $TRAVIS_COMMIT_MESSAGE == *"push and run"* ]]; then
      gulp cd:pushAndRun
  else
      gulp cd
  fi
elif [ $TRAVIS_BRANCH = "staging" ]; then
  echo "Deploying to staging and testing"

  # Add deploy ssh key
  eval "$(ssh-agent -s)" #start the ssh agent
  ssh-add .travis/id_rsa

  # Clean gh-pages cache
  # Travis cache gets the repo from master
  rm -rf node_modules/gh-pages/.cache

  gulp cd:pushAndRun
else
  echo "Testing branch $TRAVIS_BRANCH"

  gulp buildAndTest
fi
