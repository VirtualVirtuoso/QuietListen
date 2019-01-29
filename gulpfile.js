'use strict';

const gulp       = require('gulp'),
      glob       = require('glob'),
      concat     = require('gulp-concat'),
      less       = require('gulp-less'),
      refresh    = require('gulp-livereload'),
      minify     = require('gulp-minify-css'),
      buffer     = require('vinyl-buffer'),
      uglify     = require('gulp-uglify-es').default,
      tsify      = require('tsify'),
      path       = require('path'),
      connect    = require('gulp-connect'),
      clean      = require('gulp-clean'),
      sequence   = require('gulp-sequence'),
      tslint     = require('gulp-tslint'),
      typescript = require('gulp-typescript');

// 'gulp' task
gulp.task('default', (callback) => {
    gulpSequence(
        'clean',
        'less',
        'vendor:js',
        'vendor:css',
        'templates',
        'compile'
    )(callback)
});

// Removes built files before a new build
gulp.task('clean', () => {
    return gulp.src([
        './app/resources/css',
        './app/resources/html',
        './app/resources/js'
    ], {read: false})
        .pipe(clean());
});

// Compiles LESS to CSS
gulp.task('less', () => {
   return gulp.src([
       './src/main/less/main.less'
   ])
       .pipe(less())
       .pipe(minify())
       .pipe(gulp.dest('./app/resources/css'))
});

// Compiles vendor files into one uglified vendor file
gulp.task('vendor:js', () => {
   return gulp.src([
       './node_modules/angular/angular/angular.min.js',
       './node_modules/@uirouter/core/_bunde'
   ])
});

// Takes the vendor font files and bundles into one file
gulp.task('vendor:fonts', () => {

});

// Takes the vendor css files and bundles into one file
gulp.task('vendor:css', () => {

});

// Compile the template files into one bundled production file
gulp.task('templates', () => {

});

// Compile without preserving source maps
gulp.task('compile', () => {

});

// Watch for file changes and trigger changes
gulp.task('watch', () => {

});

// Task to set up the dev environment
gulp.task('dev', () => {

});

// Compiles TypeScript into JavaScript
gulp.task('dev:compile', () => {

});

// Sets up the livereload server
gulp.task('dev:connect', () => {
    connect.server({
        livereload: true
    });
});

// Runs TypeScript through a linter and reports code issues
gulp.task('dev:tslint', () => {
    tsProject.src()
        .pipe(tslint({formatter: verbose}))
        .pipe(tslint.report());
});


