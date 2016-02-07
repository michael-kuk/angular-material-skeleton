/* jshint node:true */
'use strict';

/* Require Modules */
/* ========================================================================== */
var
  gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  usemin = require('gulp-usemin'),
  htmlmin = require('gulp-htmlmin'),
  sass = require('gulp-sass'),
  connect = require('gulp-connect'),
  rename = require('gulp-rename'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  concat = require('gulp-concat'),
  templatecache = require('gulp-angular-templatecache');

/* Load Config File */
/* ========================================================================== */

var config = require('./gulp-config.json');

/* Define Atomic Tasks */
/* ========================================================================== */

// Compile SASS
gulp.task('custom-styles', function(){
  return gulp
    .src(config.paths.mainStyle)
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({
      basename: 'app.min'
    }))
    .pipe(gulp.dest(config.paths.dest));
});

// Compile JavaScript
gulp.task('custom-js', function(){
  return gulp
    .src(config.paths.scripts)
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.paths.dest));
});

// Error-Check JavaScript
gulp.task('jshint', function(){
  return gulp
    .src(config.paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

// Copy Images
gulp.task('custom-images', function(){
  return gulp
    .src(config.paths.images)
    .pipe(rename({
      dirname: 'img'
    }))
    .pipe(gulp.dest(config.paths.dest));
});

// Copy Fonts
gulp.task('bower-fonts', function(){
  return gulp
    .src(config.paths.fonts)
    .pipe(rename({
      dirname: 'fonts'
    }))
    .pipe(gulp.dest(config.paths.dest));
});

// Compile templates
gulp.task('custom-templates', function(){
  return gulp
    .src(config.paths.templates)
    .pipe(htmlmin(config.htmlmin))
    .pipe(templatecache(config.templatecache))
    .pipe(uglify())
    .pipe(rename({
      basename: 'tpls.min',
      dirname: '/'
    }))
    .pipe(gulp.dest(config.paths.dest));
});

// Compile index.html
gulp.task('usemin', function(){
  return gulp
    .src(config.paths.index)
    .pipe(usemin({
      html: [htmlmin(config.htmlmin)]
    }))
    .pipe(gulp.dest(config.paths.dest));
});

// Create Local Webserver
gulp.task('server', function(){
  return connect
    .server({
      root: config.paths.dest,
      livereload: config.server.livereload,
      port: config.server.port
    });
});

// Enable Live Reload on Change
gulp.task('livereload', function(){
  return gulp
    .src(config.paths.dest)
    .pipe(connect.reload());
});

// Trigger tasks on change
gulp.task('watch', function(){
  gulp.watch([config.paths.scripts], ['jshint', 'custom-js']);
  gulp.watch([config.paths.styles], ['custom-styles']);
  gulp.watch([config.paths.images], ['custom-images']);
  gulp.watch([config.paths.templates], ['custom-templates']);
  gulp.watch([config.paths.index], ['usemin']);
  gulp.watch([config.paths.dest + '/**/*'], ['livereload']);
});

/* Composite Tasks */
/* ========================================================================== */

// Build Custom Sources
gulp.task('build-custom', ['custom-js', 'custom-styles', 'custom-images', 'custom-templates', 'usemin']);

// Bower components
gulp.task('build-components', ['bower-fonts']);

// Build for production
gulp.task('build-production', ['jshint', 'build-custom', 'build-components']);

// Default Task
gulp.task('default', ['build-custom', 'build-components', 'server', 'watch']);
