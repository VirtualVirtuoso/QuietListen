'use strict';

const gulp         = require('gulp'),
      glob         = require('glob'),
      concat       = require('gulp-concat'),
      source       = require('vinyl-source-stream'),
      less         = require('gulp-less'),
      browserify   = require('browserify'),
      minify       = require('gulp-minify-css'),
      buffer       = require('vinyl-buffer'),
      uglify       = require('gulp-uglify-es').default,
      tmpCache     = require('gulp-angular-templatecache'),
      tsify        = require('tsify'),
      path         = require('path'),
      connect      = require('gulp-connect'),
      clean        = require('gulp-clean'),
      tslint       = require('gulp-tslint');

// Removes built files before a new build
gulp.task('clean', () => {
    return gulp.src([
        './app/resources/css',
        './app/resources/html',
        './app/resources/js'
    ], {read: false, allowEmpty: true})
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
       './node_modules/angular/angular.min.js',
       './node_modules/@uirouter/core/_bundles/ui-router-core.min.js',
       './node_modules/@uirouter/angularjs/release/angular-ui-router.min.js',
       './node_modules/@uirouter/angularjs/release/stateEvents.min.js',
       './node_modules/@uirouter/sticky-states/_bundles/ui-router-sticky-states.js',
       './node_modules/jquery/dist/jquery.min.js',
       './node_modules/bootstrap/dist/js/bootstrap.min.js',
       './node_modules/ng-dialog/js/ngDialog.min.js',
       './node_modules/modernizr/src/Modernizr.js'
   ])
       .pipe(concat('vendor-scripts.js'))
       .pipe(uglify({mangle: false}))
       .pipe(gulp.dest('./app/resources/js'));
});

// Takes the vendor font files and bundles into one file
gulp.task('vendor:fonts', () => {
    return gulp.src([
        './node_modules/font-awesome/fonts/FontAwesome.otf',
        './node_modules/font-awesome/fonts/fontawesome-webfont.eot',
        './node_modules/font-awesome/fonts/fontawesome-webfont.svg',
        './node_modules/font-awesome/fonts/fontawesome-webfont.ttf',
        './node_modules/font-awesome/fonts/fontawesome-webfont.woff',
        './node_modules/font-awesome/fonts/fontawesome-webfont.woff2',
    ])
        .pipe(gulp.dest('./app/resources/fonts'))
});

// Takes the vendor css files and bundles into one file
gulp.task('vendor:css', () => {
    return gulp.src([
        './node_modules/bootstrap/dist/css/bootstrap.min.css',
        './node_modules/font-awesome/css/font-awesome.min.css',
        './node_modules/ng-dialog/css/ngDialog.min.css',
        './node_modules/ng-dialog/css/ngDialog-theme-default.min.css',
    ])
        .pipe(concat('vendor-styles.css'))
        .pipe(gulp.dest('./app/resources/css'))
        .pipe(connect.reload());
});

// Compile the template files into one bundled production file
gulp.task('templates', () => {
    return gulp.src('./src/main/html/**/*.html')
        .pipe(tmpCache({
            root: 'appTemplates',
            module: 'app',
            filename: 'app.templates.ts'
        }))
        .pipe(gulp.dest('./src/main/ts'));
});

// Compile without preserving source maps
gulp.task('compile', () => {
    let files = glob.sync('./src/main/ts/**/*/ts');

    return browserify({
        debug: true,
        transform: ['babelify'],
        entries: files
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('./site-bundle.js'))
        .pipe(buffer())
        .pipe(concat('quietlisten.js'))
        .pipe(buffer())
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('./app/resources/js'))
        .pipe(connect.reload());
});

// Watch for file changes and trigger changes
gulp.task('watch', () => {
    gulp.watch(['./src/main/ts/**/*.ts'], ['dev:compile']);
    gulp.watch(['./src/main/less/**/*less'], ['less', 'vendor:css']);
    gulp.watch(['./src/main/html/**/*.html'], ['dev:compile']);
});

// Task to set up the dev environment
gulp.task('dev', (cb) => {
    gulpSequence(
        'clean',
        'less',
        'vendor:js',
        'vendor:css',
        'templates',
        'compile',
        'dev:connect',
        'watch'
    )(cb)
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

// 'gulp' task
gulp.task('default', gulp.series(
    'clean',
    'less',
    'vendor:js',
    'vendor:css',
    'templates',
    'compile'
));


