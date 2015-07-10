# Pear2Pear

Pear2Pear is the P2Pvalue colaboration tool for Common-based Peer Production Communities (CBPPs)

http://p2pvalue.eu/

## Getting Started

To get you started you can simply clone the pear2pear repository and install the dependencies:

### Prerequisites

You need git to clone the pear2pear repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and test pear2pear You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

### Clone pear2pear

Clone the pear2pear repository using [git][git]:

```
git clone https://github.com/P2Pvalue/pear2pear.git
cd pear2pear
```

### Install Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `bower_components` - contains the angular framework files

### Install SwellRT

Pear2Pear uses [SwellRT](https://github.com/P2Pvalue/swellrt), a real-time federated collaboration framework.

You need to run SwellRT, which is extremelly easy using Docker. [Install Docker](https://docs.docker.com/installation/)

An instance of SwellRT will be automagically started for you


### Optional: Change configuration options

You can customize several options, such as server port, Weinre, SwellRT address via `config.js`

```
cp config.js.sample config.js
edit config.js
```

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
gulp
```

Now browse to the app at `http://localhost:8000/`


## Testing

There are two kinds of tests in the pear2pear application: Unit tests and End to End tests.

### Running Unit Tests

The pear2pear app comes preconfigured with unit tests. These are written in
[Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. We provide a Karma
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

The pear2pear app comes with end-to-end tests, again written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] End-to-End test runner.  It uses native events and has
special features for Angular applications.

* the configuration is found at `e2e-tests/protractor-conf.js`
* the end-to-end tests are found in `e2e-tests/scenarios.js`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

```
npm start
```

In addition, since Protractor is built upon WebDriver we need to install this.  The pear2pear
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

For more information on AngularJS please check out http://p2pvalue.eu/

