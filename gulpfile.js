// Sass configuration
var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');


gulp.task('sass', function() {
    gulp.src('playground_modules/**/*.scss') // to watch ALL: ./**/*.scss
        .pipe(sass().on('error', sass.logError)) // .on('error', sass.logError)  to swallow error
        .pipe(gulp.dest(function(f) {
            return f.base;
        }))
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


gulp.task('default', ['sass'], function() {
    // dont use "./" in front of pathes, because otherwise gulp-watch isnt able to recognize newly or deleted files
    gulp.watch('playground_modules/**/*.scss', ['sass']);
});