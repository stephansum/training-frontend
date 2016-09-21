// Sass configuration
var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var includer = require('gulp-file-include');

var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');


gulp.task('sass', function() {
    return gulp
        .src('playground_modules/**/*.scss') // to watch ALL: ./**/*.scss
        .pipe(sass().on('error', sass.logError)) // .on('error', sass.logError)  to swallow error
        .pipe(gulp.dest(function(f) {
            return f.base;
        }))
});




gulp.task('includer', function() {
    return gulp.src('./src/**/*.html')
        .pipe(plumber())
        .pipe(includer({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(function(f) {
            return f.base;
        }));
});


gulp.task('bundlejs', function() {
    browserify('main.js') // start analyzing main.js for further required files
        .bundle()
        .on('error', function(e) {
            gutil.log(e);
        })
        .pipe(source('bundle.js')) // create vinyl stream which is required by gulp
        .pipe(gulp.dest('./dist/js')) // folder where the bundle.js will be created
});



gulp.task('watch', function() {
    // dont use "./" in front of pathes, because otherwise gulp-watch isnt able to recognize newly or deleted files
    gulp.watch('playground_modules/**/*.scss', ['sass']);

    gulp.watch('path/to/file', ['gulp task name for js']);
});


gulp.task('js', function() {
    return gulp
        .src('./src/**/*.js')
});



gulp.task('default', ['sass'], function() {

});