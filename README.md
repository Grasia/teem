# Teem

[![Join the chat at https://gitter.im/P2Pvalue/teem-bots](https://badges.gitter.im/P2Pvalue/teem-bots.svg)](https://gitter.im/P2Pvalue/teem-bots?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Teem is the [P2Pvalue](http://p2pvalue.eu/) collaboration tool for [common-based peer production communities (CBPPs)](https://en.wikipedia.org/wiki/Commons-based_peer_production)

http://teem.works/

[![Build Status](https://travis-ci.org/P2Pvalue/teem.svg?branch=master)](https://travis-ci.org/P2Pvalue/teem)
[![Join the chat at https://gitter.im/P2Pvalue/teem](https://img.shields.io/gitter/room/nwjs/nw.js.svg
)](https://gitter.im/P2Pvalue/teem)

## Getting Started

To get you started you can simply clone the teem repository and install the dependencies:

### Prerequisites

You need [git](http://git-scm.com/) to download the teem repository, [Node.js](http://nodejs.org/) (v4.2.x)
to run the code, and [npm](https://www.npmjs.com/) (node.js's package manager) to install the dependencies.

You can use [Docker](https://docs.docker.com/installation/) (v1.9.x) to have
[SwellRT](https://github.com/P2Pvalue/swellrt) running. SwellRT is a real-time
federated collaboration framework, which is installed and executed automatically by Teem though Docker.

Add your user into the `docker` group to have the necessary permissions. In GNU/Linux, try:

```
wget -qO- https://get.docker.com/ | sh
sudo usermod -aG docker <your_user>
```

And then restart your computer.

### Clone teem

Clone the teem repository using `git`:

```
git clone https://github.com/P2Pvalue/teem.git
cd teem
```

### Install Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the node package manager.
* We get the angular code via `bower`, a client-side code package manager.

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `bower_components` - contains the angular framework files

### Optional: Change configuration options

You can customize several options, such as server port, Weinre, SwellRT address via `config.js`

```
cp config.js.sample config.js
edit config.js
```

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is installing `gulp` and running it.

```
sudo npm install -g gulp
gulp
```

Now browse to the app at `http://localhost:8000/`


## Testing

There are two kinds of tests in the teem application: Unit tests and End to End tests.

To run both, you need the Java Development Kit (such as OpenJDK 7), and run:

```
gulp test
```

### Unit Tests

The teem app comes preconfigured with unit tests. These are written in
Jasmine, which we run with the Karma Test Runner. We provide a Karma
configuration file to run them.

* the configuration is found at `karma.conf.js`
* the unit tests are found in next to the code they are testing and are named as `..._test.js`.

### End-to-end Tests

The teem app comes with end-to-end tests, again written in Jasmine. These tests
are run with the Protractor End-to-End test runner.  It uses native events and has
special features for Angular applications.

* the configuration is found at `e2e-tests/protractor-conf.js`
* the end-to-end tests are found in `e2e-tests/scenarios.js`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

## Contact

For more information on P2Pvalue project please check out http://p2pvalue.eu/
