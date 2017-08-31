'use strict';

/*=====================================
=        Default Configuration        =
=====================================*/

// Please use config.js to override these selectively:

var config = {
  dest: 'www',
  minifyImages: true,
  uglify: true,
  cssmin: true,

  vendor: {
    js: [
      './bower_components/jquery/dist/jquery.js',
      './bower_components/selectize/dist/js/standalone/selectize.js',
      './bower_components/modernizr/modernizr.js',
      './bower_components/angular/angular.js',
      './bower_components/angular-selectize2/dist/angular-selectize.js',
      './bower_components/angular-route/angular-route.js',
      './bower_components/angular-translate/angular-translate.js',
      './bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      './bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.js',
      './bower_components/bootstrap-material-design/dist/js/material.js',
      './bower_components/bootstrap-material-design/dist/js/ripples.js',
      './bower_components/dropdown.js/jquery.dropdown.js',
      './bower_components/angular-messages/angular-messages.js',
      './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      './bower_components/angular-ui-notification/dist/angular-ui-notification.js',
      './bower_components/angular-ui-layout/src/ui-layout.js',
      './bower_components/autosize/dist/autosize.js',
      './bower_components/angular-bindonce/bindonce.js',
      './bower_components/angular-utf8-base64/angular-utf8-base64.js',
      './bower_components/SHA-1/sha1.js',
      './bower_components/angulartics/src/angulartics.js',
      './bower_components/angulartics/src/angulartics-piwik.js',
      './bower_components/angular-swellrt/dist/angular-swellrt.js',
      './bower_components/hammerjs/hammer.js',
      './bower_components/ryanmullins-angular-hammer/angular.hammer.js',
      './bower_components/angular-sanitize/angular-sanitize.js',
      './bower_components/angular-animate/angular-animate.js',
      './bower_components/ngSticky/lib/sticky.js',
      './bower_components/angular-toArrayFilter/toArrayFilter.js',
      './bower_components/swiper/dist/js/swiper.js',
      './bower_components/avatar/build/avatar.js',
      './bower_components/avatar/vendor/md5.js',
      './bower_components/moment/moment.js',
      './bower_components/moment/locale/es.js',
      './bower_components/angular-moment/angular-moment.js',
      './bower_components/clipboard/dist/clipboard.js',
      './bower_components/ngclipboard/dist/ngclipboard.js',
      './bower_components/ng-img-crop-full-extended/compile/unminified/ng-img-crop.js',
      './bower_components/ng-file-upload/ng-file-upload.js',
      './bower_components/js-emoji/lib/emoji.js',
      './bower_components/textfit/textFit.js',
      './bower_components/angular-socialshare/dist/angular-socialshare.js',
      './bower_components/webrtc-adapter/release/adapter.js',
      './src/vendor/aggregation.js',
      './src/vendor/startswith.js',
      './node_modules/ng-infinite-scroll/build/ng-infinite-scroll.js'
    ],

    images: [
      './bower_components/emoji-data/sheet_apple_64.png',
      'src/images/**/*'
    ],

    fonts: [
      './bower_components/material-design-icons/iconfont/MaterialIcons-Regular.ttf',
      './bower_components/material-design-icons/iconfont/MaterialIcons-Regular.woff',
      './bower_components/material-design-icons/iconfont/MaterialIcons-Regular.woff2',
      './bower_components/font-awesome/fonts/fontawesome-webfont.*',
      './src/fonts/*'
    ]
  },

  swellrt: {
    host: 'localhost:9898',
    protocol: 'http://',
    docker: {
      projectName: 'teem'
    }
  },

  angularSwellrt: {
    path: './bower_components/angular-swellrt'
  },

  /*
   * Application Configuration
   *
   * Variables injected to AngularJs config value in src/js/app.js
   *
   * Example:
   * config.app.support = {
   *   communityId: 'local.net/s+EWN1NKmVbsO',
   *   projectId:   'local.net/s+3WKINJhZMp8'
   * };
   */
  app: {
  },

  /**
   * Window Configuration
   *
   * Variables injected in window.* object.
   */
  windowConfig: {
    gMapsApiKey: 'AIzaSyDizEEZnUmbrB2DEX9iW4gpGzoLrpsLb3A'
  },

  // The default URL of the links
  // Needed for HTML5 mode
  base: '/',

  server: {
    host: '0.0.0.0',
    port: '8000'
  },

  serverTest: {
    host: 'localhost',
    port: '9001'
  },

  serverTestKarma: {
    port: '8090'
  },

  weinre: false,

  piwik: false,

  deploy: {
    files: {
      branch: 'dist'
    },
    swellrt: {
      name:  'teem-swellrt',
      config: '/usr/local/etc/docker-compose/teem-swellrt.yml'
    }
  }
};


if (require('fs').existsSync('./config.js')) {
  var configFn = require('./config');
  configFn(config);
}

// Build SwellRT url
if (! config.swellrt.server) {
  config.swellrt.server = config.swellrt.protocol + config.swellrt.host;
  if (config.swellrt.port) {
    config.swellrt.server += ':' + config.swellrt.port;
  }
}

// Setup angular-swellrt stuff, depending on path
config.vendor.js.push(config.angularSwellrt.path + '/dist/angular-swellrt.js');
config.angularSwellrt.swellrt = require(config.angularSwellrt.path + '/swellrt.json');

// Track SwellRT version in SwellRT config
// This way, clients are updated with the new SwellRT version
// despite the code does not change
config.swellrt.version = config.angularSwellrt.swellrt.version;

// Fill docker options
if (config.swellrt.docker && !config.swellrt.docker.tag) {
  config.swellrt.docker.tag = config.angularSwellrt.swellrt.version;
}

if (config.deploy && !config.deploy.swellrt.tag) {
  config.deploy.swellrt.tag = config.angularSwellrt.swellrt.version;
}

// Use configuration in other modules, such as Karma
module.exports.config = config;

/*-----  End of Configuration  ------*/


/*========================================
=            Requiring stuffs            =
========================================*/

var gulp           = require('gulp'),
  gulpif         = require('gulp-if'),
  seq            = require('run-sequence'),
  connect        = require('gulp-connect'),
  sass           = require('gulp-sass'),
  babel          = require('gulp-babel'),
  uglify         = require('gulp-uglify'),
  sourcemaps     = require('gulp-sourcemaps'),
  cssmin         = require('gulp-cssmin'),
  order          = require('gulp-order'),
  concat         = require('gulp-concat'),
  ignore         = require('gulp-ignore'),
  rimraf         = require('gulp-rimraf'),
  imagemin       = require('gulp-imagemin'),
  pngcrush       = require('imagemin-pngcrush'),
  templateCache  = require('gulp-angular-templatecache'),
  mobilizer      = require('gulp-mobilizer'),
  postcss        = require('gulp-postcss'),
  autoprefixer   = require('autoprefixer'),
  ngAnnotate     = require('gulp-ng-annotate'),
  replace        = require('gulp-replace'),
  ngFilesort     = require('gulp-angular-filesort'),
  streamqueue    = require('streamqueue'),
  rename         = require('gulp-rename'),
  ssh            = require('ssh2').Client,
  path           = require('path'),
  watch          = require('gulp-watch'),
  jshint         = require('gulp-jshint'),
  karma          = require('karma').Server,
  ghPages        = require('gh-pages'),
  manifest       = require('gulp-manifest'),
  spawn          = require('child_process').spawn,
  gutil          = require('gulp-util');

/**
 * Logs the error occured in the pipe without killing the gulp process
 * emits an end event to the corresponding stream
 * @function endErrorProcess
 * @param {Error} err
 */
function endErrorProcess(err){
  console.log(err);
  this.emit('end');
}
/*================================================
=            Report Errors to Console            =
================================================*/

gulp.on('error', function(e) {
  throw(e);
});


/*=========================================
=            Clean dest folder            =
=========================================*/

gulp.task('clean', function () {
  return gulp.src([
    path.join(config.dest, '*.html'),
    path.join(config.dest, 'images'),
    path.join(config.dest, 'css'),
    path.join(config.dest, 'js'),
    path.join(config.dest, 'fonts'),
    path.join(config.dest, 'l10n'),
    path.join(config.dest, 'app.manifest')
  ], { read: false })
    .pipe(rimraf())
    .on('error', endErrorProcess);
});

gulp.task('clean:manifest', function () {
  return gulp.src([
    path.join(config.dest, 'app.manifest')
  ], { read: false })
    .pipe(rimraf())
    .on('error', endErrorProcess);
});


/*==========================================
=            Start a web server            =
==========================================*/

gulp.task('connect', function() {
  if (typeof config.server === 'object') {
    connect.server({
      root: config.dest,
      host: config.server.host,
      port: config.server.port,
      fallback: config.dest + '/index.html',
      livereload: true
    });
  } else {
    throw new Error('Connect is not configured');
  }
});

/*==============================================================
=            Setup live reloading on source changes            =
==============================================================*/

gulp.task('livereload', function () {
  gulp.src(path.join(config.dest, '*.html'))
    .pipe(connect.reload())
    .on('error', endErrorProcess);
});


/*=====================================
=            Minify images            =
=====================================*/

gulp.task('images', function () {
  var stream = gulp.src(config.vendor.images);

  if (config.minifyImages) {
    stream = stream.pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngcrush()]
    }))
      .on('error', endErrorProcess);
  }

  return stream.pipe(gulp.dest(path.join(config.dest, 'images')))
    .on('error', endErrorProcess);
});


/*==================================
=            Copy fonts            =
==================================*/

gulp.task('fonts', function() {
  return gulp.src(config.vendor.fonts)
    .pipe(gulp.dest(path.join(config.dest, 'fonts')))
    .on('error', endErrorProcess);
});

/*==================================
=            Copy l10n            =
==================================*/

gulp.task('l10n', function() {
  return gulp.src('src/l10n/**/*')
    .pipe(gulp.dest(path.join(config.dest, 'l10n')))
    .on('error', endErrorProcess);
});


/*=================================================
=            Copy html files to dest              =
=================================================*/
function buildHtml (env) {
  var inject = [];

  inject.push('<base href="' + config.base + '" />');

  if(typeof config.windowConfig === 'object') {
    inject.push('<script>window.config = '+JSON.stringify(config.windowConfig)+';</script>');
  }

  if (config.swellrt) {
    let url;

    if (env === 'production') {
      url = config.deploy.swellrt.remoteUrl;
    } else {
      url = config.swellrt.server;
    }

    inject.push('<meta property="swellrt:version" content="' + config.swellrt.version + '">');
    inject.push('<script src="'+ url +'/swellrt.js"></script>');
  }

  if (config.piwik && env === 'production') {
    // Note that Angulartics needs that the trackPageView event from the original is removed
    inject.push('<script type="text/javascript"> var _paq = _paq || []; _paq.push([\'enableLinkTracking\', true]); (function() { var u="' + config.piwik.server + '"; _paq.push([\'setTrackerUrl\', u+\'piwik.php\']); _paq.push([\'setSiteId\', ' + config.piwik.siteId + ']); var d=document, g=d.createElement(\'script\'), s=d.getElementsByTagName(\'script\')[0]; g.type=\'text/javascript\'; g.async=true; g.defer=true; g.src=u+\'piwik.js\'; s.parentNode.insertBefore(g,s); })(); </script>');
    inject.push('<noscript><p><img src="' + config.piwik.server + 'piwik.php?idsite=' + config.piwik.siteId + '" style="border:0;" alt="" /></p></noscript>');
  }

  if (typeof config.weinre === 'object') {
    inject.push('<script src="http://'+config.weinre.boundHost+':'+config.weinre.httpPort+'/target/target-script-min.js#anonymous"></script>');
  }

  return gulp.src(['src/html/**/*.html'])
    .pipe(replace('<!-- inject:js -->', inject.join('\n    ')))
    .on('error', endErrorProcess)
    .pipe(gulp.dest(config.dest))
    .on('error', endErrorProcess);
}

gulp.task('html', function() {
  return buildHtml();
});

// Rebuild html for production
gulp.task('html:production', function() {
  return buildHtml('production');
});

/*======================================================================
=            Compile, minify, mobilize Sass                            =
======================================================================*/

gulp.task('sass', function () {
  gulp.src('./src/sass/app.sass')
    .pipe(sourcemaps.init())
    .on('error', endErrorProcess)
    .pipe(sass({
      includePaths: [ path.resolve(__dirname, 'src/sass'), path.resolve(__dirname, 'bower_components'), path.resolve(__dirname, 'bower_components/bootstrap-sass/assets/stylesheets') ]
    }).on('error', sass.logError))
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions', 'Android >= 4'] }) ]))
    .on('error', endErrorProcess)
    /* Currently not working with sourcemaps
    .pipe(mobilizer('app.css', {
      'app.css': {
        hover: 'exclude',
        screens: ['0px']
      },
      'hover.css': {
        hover: 'only',
        screens: ['0px']
      }
    }))
    */
    .pipe(gulpif(config.cssmin, cssmin()))
    .on('error', endErrorProcess)
    .pipe(rename({suffix: '.min'}))
    .on('error', endErrorProcess)
    .pipe(sourcemaps.write('.', {
      sourceMappingURLPrefix: '/css/'
    }))
    .on('error', endErrorProcess)
    .pipe(gulp.dest(path.join(config.dest, 'css')))
    .on('error', endErrorProcess);
});

/*====================================================================
=                             jshint                                 =
====================================================================*/

gulp.task('jshint', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(jshint())
    .on('error', endErrorProcess)
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', endErrorProcess);
});


/*====================================================================
=            Compile and minify js generating source maps            =
====================================================================*/
// - Orders ng deps automatically
// - Precompile templates to ng templateCache

gulp.task('js:app', function() {
  return streamqueue({ objectMode: true },
    // Vendor: angular, mobile-angular-ui, etc.
    gulp.src(config.vendor.js)
      .pipe(sourcemaps.init())
      .on('error', endErrorProcess),
    // app.js is configured
    gulp.src('./src/js/app.js')
    .pipe(sourcemaps.init())
      .on('error', endErrorProcess)
    .pipe(replace('value(\'config\', {}). // inject:app:config',
                  'value(\'config\', ' + JSON.stringify(config.app) + ').'))
      .on('error', endErrorProcess)
    .pipe(babel({
      presets: ['es2015']
      }))
      .on('error', endErrorProcess),
    // rest of app logic
    gulp.src(['./src/js/**/*.js', '!./src/js/app.js', '!./src/js/widgets.js'])
    .pipe(sourcemaps.init())
      .on('error', endErrorProcess)
    .pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-object-assign']
    }))
      .on('error', endErrorProcess)
      .pipe(ngFilesort())
      .on('error', endErrorProcess),
    // app templates
    gulp.src(['src/templates/**/*.html']).pipe(templateCache({ module: 'Teem' }))
    .pipe(sourcemaps.init())
      .on('error', endErrorProcess)
    .pipe(babel({
      presets: ['es2015']
    }))
      .on('error', endErrorProcess)
  )
  .pipe(concat('app.js'))
    .on('error', endErrorProcess)
  .pipe(ngAnnotate())
    .on('error', endErrorProcess)
  .pipe(gulpif(config.uglify, uglify()))
    .on('error', endErrorProcess)
  .pipe(rename({suffix: '.min'}))
    .on('error', endErrorProcess)
  .pipe(sourcemaps.write('.', {
    sourceMappingURLPrefix: '/js/'
  }))
    .on('error', endErrorProcess)
    .pipe(gulp.dest(path.join(config.dest, 'js')))
    .on('error', endErrorProcess);
});

gulp.task('js:widgets', function() {
  return gulp.src('./src/js/widgets.js')
  .pipe(uglify())
    .on('error', endErrorProcess)
    .pipe(gulp.dest(path.join(config.dest, 'js')))
    .on('error', endErrorProcess);
});


gulp.task('js', function(callback) {
  var tasks = ['js:app', 'js:widgets'];

  seq(tasks, callback);
});

/*==================================
=            Cordova files         =
==================================*/

// Sync files from local cordova folder
// Note that this needs having cordova platform android and related plugins
// installed
gulp.task('cordova:sync:clean', function() {
  var dest = 'src/vendor/cordova';

  return gulp.src([dest],
           { read: false })
    .pipe(rimraf())
    .on('error', endErrorProcess);


});


gulp.task('cordova:sync:copy', function() {
  var source = 'cordova/platforms/android/assets/www/';
  var dest = 'src/vendor/cordova';


  return gulp.src([ source + '{cordova.js,cordova_plugins.js,plugins/**/*}'])
    .pipe(gulp.dest(dest))
    .on('error', endErrorProcess);
});

gulp.task('cordova:sync', function(cb) {
  seq('cordova:sync:clean', 'cordova:sync:copy', cb);
});


gulp.task('cordova', function() {
  return gulp.src('src/vendor/cordova/**/*')
    .pipe(gulp.dest(path.join(config.dest, 'js/cordova')))
    .on('error', endErrorProcess);
});


/*===================================================================
=                Generate HTML5 Cache Manifest files                =
===================================================================*/

function buildManifest (env) {
  var files = [
    'index.html',
    'css/app.min.css',
    'js/app.min.js'
  ],

  swellrtUrl = env === 'production' ? config.deploy.swellrt.remoteUrl : config.swellrt.server;


  return gulp.src(files.map(function(f) { return config.dest + '/' + f; }), { base: config.dest })
    .pipe(manifest({
      cache: [
        swellrtUrl + '/swellrt.js',
        swellrtUrl + '/swellrt/swellrt.nocache.js'
      ],
      exclude: 'app.manifest',
      hash: true
    }))
    .on('error', endErrorProcess)
    .pipe(gulp.dest(config.dest))
    .on('error', endErrorProcess);
}

gulp.task('manifest', function(){
  return buildManifest();
});

gulp.task('manifest:production', function(){
  return buildManifest('production');
});
/*===================================================================
=            Watch for source changes and rebuild/reload            =
===================================================================*/

gulp.task('watch', function () {
  if (typeof config.server === 'object') {
    watch([config.dest + '/**/*'], function() { gulp.start('livereload'); });
  }
  watch(['./src/html/**/*'], function() { gulp.start('html'); });
  watch(['./src/sass/**/*'], function() { gulp.start('sass'); });
  watch(config.vendor.js.concat(['./src/js/**/*', './src/templates/**/*', '!./src/js/widgets.js']), function() { gulp.start(['jshint', 'js:app']); });
  watch(config.vendor.js.concat(['./src/js/widgets.js']), function() { gulp.start(['jshint', 'js:widgets']); });
  watch(['./src/images/**/*'], function() { gulp.start('images'); });
  watch(['./src/l10n/**/*'], function() { gulp.start('l10n'); });
  watch(['./swellrt/config/**/*'], function() { gulp.start('docker:swellrt:restart'); });
});


/*===================================================
=            Starts a Weinre Server                 =
===================================================*/

gulp.task('weinre', function() {
  if (typeof config.weinre === 'object') {
    var weinre = require('./node_modules/weinre/lib/weinre');
    weinre.run(config.weinre);
  } else {
    throw new Error('Weinre is not configured');
  }
});


/*======================================
=            Build Sequence            =
======================================*/

gulp.task('build', function(done) {
  var tasks = ['html', 'fonts', 'l10n', 'images', 'sass', 'js', 'cordova'];
  seq('clean', tasks, done);
});

/*====================================
=      Run SwellRT with Docker       =
====================================*/

function dockerSwellrt (options, callback) {

  var args = [ '-p ' + config.swellrt.docker.projectName ];

  if (options.args) {
    Array.prototype.push.apply(args, options.args);
  }

  // Set SwellRT version
  process.env.SWELLRT_VERSION = config.swellrt.docker.tag;

  var child = spawn('docker-compose', args, {
                      cwd: process.cwd() + '/swellrt'
                    }),
      stdout = '',
      stderr = '';

  child.stdout.on('data', (data) => {

    stdout += data;
    gutil.log(gutil.colors.yellow(data));
  });

  child.stderr.on('data', (data) => {

    stderr += data;
    gutil.log(gutil.colors.yellow(data));
  });

  child.on('close', () => {

    callback();
  });
}

gulp.task('docker:swellrt', function(done) {
  dockerSwellrt({ args: [ 'up', '-d' ]}, done);
});

gulp.task('docker:swellrt:down', function(done) {
  dockerSwellrt({ args: [ 'down' ]}, done);
});

gulp.task('docker:swellrt:restart', function(done) {
  dockerSwellrt({ args: [ 'restart', 'swellrt' ]}, done);
});


/*======================================
=        Unit testing with Karma       =
======================================*/

gulp.task('test:unit', function(done) {
  new karma({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test:unit:loop', function(done) {
  new karma({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: false
  }, done).start();
});


/*================================================
=        End to end testing with protractor      =
=================================================*/

gulp.task('test:e2e', function(done) {
  var tasks = [ 'test:e2e:protractor:install', 'test:e2e:protractor', done ];

  if (config.swellrt.docker) {
    tasks.unshift('docker:swellrt');
  }

  seq.apply(this, tasks);
});


function getProtractorBinary(binaryName){
  var winExt = /^win/.test(process.platform)? '.cmd' : '';
  var pkgPath = require.resolve('protractor');
  var protractorDir = path.resolve(path.join(path.dirname(pkgPath), '..', 'bin'));

  return path.join(protractorDir, '/' + binaryName+winExt);
}

gulp.task('test:e2e:protractor:install', function(done){
  spawn(getProtractorBinary('webdriver-manager'), ['update'], {
    stdio: 'inherit'
  }).once('close', done);
});

// Run protractor from command line
gulp.task('test:e2e:protractor:run', function (done) {
  var argv = process.argv.slice(3); // forward args to protractor

  spawn(getProtractorBinary('protractor'), argv, {
    stdio: 'inherit'
  }).once('close', done);
});


gulp.task('test:e2e:protractor', function(done) {
  var args = [
    'test/protractor.conf.js',
    '--baseUrl http://' + config.serverTest.host + ':' + config.serverTest.port,
  ];

  connect.server({
    root: config.dest,
    host: config.serverTest.host,
    port: config.serverTest.port,
    fallback: config.dest + '/index.html'
  });

  spawn(getProtractorBinary('protractor'), args, {
    stdio: 'inherit'
  })
    .once('close', function(code) {
      connect.serverClose();

      if (code === 0) {
        done();
      } else {
        throw 'Protractor error';
      }
    });

});

/*====================================
=              Test Task             =
====================================*/

gulp.task('test', function(done){
  var tasks = [];

  tasks.push('test:unit', 'test:e2e');

  seq(tasks, done);
});

/*====================================
=              Deploy Task           =
====================================*/

gulp.task('deploy:swellrt', function(done) {
  var connection = new ssh();

  connection.on('ready', function() {
    var cmd = 'SWELLRT_VERSION=' + config.deploy.swellrt.tag +
          ' docker-compose -f ' + config.deploy.swellrt.config +
          ' -p ' + config.deploy.swellrt.name +
          ' up -d';

    console.log(cmd);

    connection.exec(cmd, function(err, stream) {

      if (err) { throw err ; }

      stream.
        on('data', function(d) {
          console.log('ssh: ' + d);
        }).
        on('close', function() {
          done();
          connection.end();
        }).
        stderr.on('data', function(data) { console.log('STDERR: ' + data); });
    });
  }).connect(config.deploy.swellrt.ssh);
});

gulp.task('deploy:files', function(done) {
  ghPages.publish(path.join(__dirname, config.dest),
                  config.deploy.files,
                  done);
});

gulp.task('deploy', function(done) {
  var tasks = ['deploy:swellrt', 'deploy:files'];

  seq('html:production', 'manifest:production', tasks, done);
});


/*============================================
=         Continous Delivery Task            =
============================================*/

gulp.task('cd', function(done) {
  seq('build', 'test', 'deploy', done);
});

/*============================================
=               Staging task                 =
= Always deploy and pass specs afterwards    =
============================================*/

gulp.task('cd:pushAndRun', function(done) {
  seq('build', 'deploy', [ 'clean:manifest', 'html' ], 'test', done);
});

/*============================================
=              Build and test                =
= Other branches just build and test         =
============================================*/

gulp.task('buildAndTest', function(done) {
  seq('build', 'test', done);
});


/*====================================
=            Default Task            =
====================================*/

gulp.task('default', function(done){
  var tasks = [];

  if (config.swellrt.docker) {
    tasks.push('docker:swellrt');
  }

  if (typeof config.weinre === 'object') {
    tasks.push('weinre');
  }

  if (typeof config.server === 'object') {
    tasks.push('connect');
  }

  tasks.push('watch');

  seq('build', tasks, done);
});
