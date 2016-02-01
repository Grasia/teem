# Teem

Teem is the P2Pvalue collaboration tool for Common-based Peer Production Communities (CBPPs)

http://p2pvalue.eu/

## Getting Started

To get you started you can simply clone the teem repository and install the dependencies:

### Prerequisites

You need [git](http://git-scm.com/) to download the teem repository, [Node.js](http://nodejs.org/)
to run the code, and `npm` (node.js's package manager) to install the dependencies.

You can use [Docker](https://docs.docker.com/installation/) to have
[SwellRT](https://github.com/P2Pvalue/swellrt) running. SwellRT is a real-time
federated collaboration framework, which is installed and executed automatically by Teem though Docker.

You should add your user into the `docker` group to have the necessary permissions. Try:

```
sudo adduser <your_user> docker
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

### Running Unit Tests

The teem app comes preconfigured with unit tests. These are written in
Jasmine, which we run with the Karma Test Runner. We provide a Karma
configuration file to run them.

* the configuration is found at `karma.conf.js`
* the unit tests are found in next to the code they are testing and are named as `..._test.js`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm test
```

This script will start the Karma test runner to execute the unit tests. Moreover, Karma will sit and
watch the source and test files for changes and then re-run the tests whenever any of them change.
This is the recommended strategy; if your unit tests are being run every time you save a file then
you receive instant feedback on any changes that break the expected code functionality.

You can also ask Karma to do a single run of the tests and then exit.  This is useful if you want to
check that a particular version of the code is operating as expected.  The project contains a
predefined script to do this:

```
npm run test-single-run
```


### End to end testing

The teem app comes with end-to-end tests, again written in Jasmine. These tests
are run with the Protractor End-to-End test runner.  It uses native events and has
special features for Angular applications.

* the configuration is found at `e2e-tests/protractor-conf.js`
* the end-to-end tests are found in `e2e-tests/scenarios.js`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

```
npm start
```

In addition, since Protractor is built upon WebDriver we need to install this.  The teem
project comes with a predefined script to do this:

```
npm run update-webdriver
```

This will download and install the latest version of the stand-alone WebDriver tool.

Once you have ensured that the development web server hosting our application is up and running
and WebDriver is updated, you can run the end-to-end tests using the supplied npm script:

```
npm run protractor
```

This script will execute the end-to-end tests against the application being hosted on the
development server.


## Contact

For more information on P2Pvalue project please check out http://p2pvalue.eu/
