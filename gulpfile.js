'use strict';

/*=====================================
=        Default Configuration        =
=====================================*/

// Please use config.js to override these selectively:

var config = {
  dest: 'www',
  minify_images: true,

  vendor: {
    js: [
      './bower_components/jquery/dist/jquery.js',
      './bower_components/modernizr/modernizr.js',
      './bower_components/angular/angular.js',
      './bower_components/angular-route/angular-route.js',
      './bower_components/angular-translate/angular-translate.js',
      './bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      './bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.js',
      './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      './bower_components/angular-ui-select/dist/select.js',
      './bower_components/angular-elastic/elastic.js',
      './bower_components/angular-bindonce/bindonce.js',
      './bower_components/waypoints/waypoints.js',
      './bower_components/SHA-1/sha1.js',
      './bower_components/angulartics/src/angulartics.js',
      './bower_components/angulartics/src/angulartics-piwik.js',
      './bower_components/angular-swellrt/angular-swellrt.js',
      './bower_components/hammerjs/hammer.js',
      './bower_components/ryanmullins-angular-hammer/angular.hammer.js',
      './bower_components/angular-sanitize/angular-sanitize.js',
      './bower_components/angular-animate/angular-animate.js'
    ],

    fonts: [
      './bower_components/font-awesome/fonts/fontawesome-webfont.*',
      './src/fonts/*'
    ]
  },

  swellrt: {
    server : 'http://localhost:9898',
    // user and pass have to be credentials of an existing user in wave server
    user : 'test@local.net',
    pass : 'test',
    // WaveIds have to exist in wave server
    waveId : 'local.net/gen+12345abcde',
    testimoniesWaveId : 'local.net/gen+12345abcde',
    helpWaveId : 'local.net/gen+12345abcde',
    thanksappWaveId : 'local.net/gen+12345abcde',
    chatpadWaveId : 'local.net/gen+12345abcde'
  },

  server: {
    host: '0.0.0.0',
    port: '8000'
  },

  serverTest: {
    host: '127.0.0.1',
    port: '9001'
  },

  weinre: {
    httpPort:     8001,
    boundHost:    'localhost',
    verbose:      false,
    debug:        false,
    readTimeout:  5,
    deathTimeout: 15
  },

  piwik: false,

  deploy: {
    branch: 'dist'
  }
};


if (require('fs').existsSync('./config.js')) {
  var configFn = require('./config');
  configFn(config);
}

// Use configuration in other modules, such as Karma
module.exports.config = config;

/*-----  End of Configuration  ------*/


/*========================================
=            Requiring stuffs            =
========================================*/

var gulp           = require('gulp'),
  seq            = require('run-sequence'),
  connect        = require('gulp-connect'),
  sass           = require('gulp-sass'),
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
  ngAnnotate     = require('gulp-ng-annotate'),
  replace        = require('gulp-replace'),
  ngFilesort     = require('gulp-angular-filesort'),
  streamqueue    = require('streamqueue'),
  rename         = require('gulp-rename'),
  path           = require('path'),
  watch          = require('gulp-watch'),
  jshint         = require('gulp-jshint'),
  karma          = require('karma').server,
  angularProtractor = require('gulp-angular-protractor'),
  ghPages        = require('gulp-gh-pages');


/*================================================
=            Report Errors to Console            =
================================================*/

gulp.on('error', function(e) {
  throw(e);
});


/*=========================================
=            Clean dest folder            =
=========================================*/

gulp.task('clean', function (cb) {
  return gulp.src([
    path.join(config.dest, 'index.html'),
    path.join(config.dest, 'images'),
    path.join(config.dest, 'css'),
    path.join(config.dest, 'js'),
    path.join(config.dest, 'fonts'),
    path.join(config.dest, 'l10n')
  ], { read: false })
 .pipe(rimraf());
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
  .pipe(connect.reload());
});


/*=====================================
=            Minify images            =
=====================================*/

gulp.task('images', function () {
  var stream = gulp.src('src/images/**/*');

  if (config.minify_images) {
    stream = stream.pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngcrush()]
    }));
  }

  return stream.pipe(gulp.dest(path.join(config.dest, 'images')));
});


/*==================================
=            Copy fonts            =
==================================*/

gulp.task('fonts', function() {
  return gulp.src(config.vendor.fonts)
    .pipe(gulp.dest(path.join(config.dest, 'fonts')));
});

/*==================================
=            Copy l10n            =
==================================*/

gulp.task('l10n', function() {
  return gulp.src('src/l10n/**/*')
    .pipe(gulp.dest(path.join(config.dest, 'l10n')));
});


/*=================================================
=            Copy html files to dest              =
=================================================*/

gulp.task('html', function() {
  var inject = [];

  if (config.swellrt) {
    inject.push('<script src="'+config.swellrt.server+'/swellrt/swellrt.nocache.js"></script>');
    inject.push('<script>var SwellRTConfig = '+JSON.stringify(config.swellrt)+';</script>');
  }

  if (config.piwik) {
    inject.push('<script type="text/javascript"> var _paq = _paq || []; _paq.push([\'trackPageView\']); _paq.push([\'enableLinkTracking\', true]); (function() { var u="' + config.piwik.server + '"; _paq.push([\'setTrackerUrl\', u+\'piwik.php\']); _paq.push([\'setSiteId\', ' + config.piwik.siteId + ']); var d=document, g=d.createElement(\'script\'), s=d.getElementsByTagName(\'script\')[0]; g.type=\'text/javascript\'; g.async=true; g.defer=true; g.src=u+\'piwik.js\'; s.parentNode.insertBefore(g,s); })(); </script>');
    inject.push('<noscript><p><img src="' + config.piwik.server + 'piwik.php?idsite=' + config.piwik.siteId + '" style="border:0;" alt="" /></p></noscript>');
  }

  if (typeof config.weinre === 'object') {
    inject.push('<script src="http://'+config.weinre.boundHost+':'+config.weinre.httpPort+'/target/target-script-min.js"></script>');
  }

  gulp.src(['src/html/**/*.html'])
  .pipe(replace('<!-- inject:js -->', inject.join('\n    ')))
  .pipe(gulp.dest(config.dest));
});


/*======================================================================
=            Compile, minify, mobilize Sass                            =
======================================================================*/

gulp.task('sass', function () {
  gulp.src('./src/sass/app.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [ path.resolve(__dirname, 'src/sass'), path.resolve(__dirname, 'bower_components') ]
    }).on('error', sass.logError))
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
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.join(config.dest, 'css')));
});

/*====================================================================
=                             jshint                                 =
====================================================================*/

gulp.task('jshint', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


/*====================================================================
=            Compile and minify js generating source maps            =
====================================================================*/
// - Orders ng deps automatically
// - Precompile templates to ng templateCache

gulp.task('js', function() {
    streamqueue({ objectMode: true },
      gulp.src(config.vendor.js),
      gulp.src('./src/js/**/*.js').pipe(ngFilesort()),
      gulp.src(['src/templates/**/*.html']).pipe(templateCache({ module: 'Pear2Pear' }))
    )
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(config.dest, 'js')));
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
  watch(config.vendor.js.concat(['./src/js/**/*', './src/templates/**/*']), function() { gulp.start(['jshint', 'js']); });
  watch(['./src/images/**/*'], function() { gulp.start('images'); });
  watch(['./src/l10n/**/*'], function() { gulp.start('l10n'); });
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
  var tasks = ['html', 'fonts', 'l10n', 'images', 'sass', 'js'];
  seq('clean', tasks, done);
});

/*======================================
=        Unit testing with Karma       =
======================================*/

gulp.task('unit-test', function(done) {
  karma.start({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done);
});

/*================================================
=        End to end testing with protractor      =
=================================================*/


gulp.task('e2e-test', function(done) {
  connect.server({
    root: config.dest,
    host: config.serverTest.host,
    port: config.serverTest.port
  });

  gulp.src(['./test/e2e/**/*.js'])
    .pipe(angularProtractor({
      'configFile': 'test/protractor.conf.js',
      'autoStartStopServer': true,
      'debug': true
    }))
    .on('error', function(e) { connect.serverClose(); throw e })
    .on('end', function() { connect.serverClose(); done(); });
});

/*====================================
=              Test Task             =
====================================*/

gulp.task('test', function(done){
  seq('unit-test', 'e2e-test', done);
});

/*====================================
=              Deploy Task           =
====================================*/

gulp.task('deploy', function() {
  return gulp.src('./www/**/*')
    .pipe(ghPages(config.deploy));
});

/*============================================
=         Continous Delivery Task            =
============================================*/

gulp.task('cd', function(done) {
  seq('build', 'test', 'deploy', done);
});



/*====================================
=            Default Task            =
====================================*/

gulp.task('default', function(done){
  var tasks = [];

  if (typeof config.weinre === 'object') {
    tasks.push('weinre');
  }

  if (typeof config.server === 'object') {
    tasks.push('connect');
  }

  tasks.push('watch');
  
  seq('build', tasks, done);
});
