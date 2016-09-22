var gulp = require('gulp');
var util = require('gulp-util');
var gulpprint = require('gulp-print');
var debug = require('gulp-debug');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var del = require('del');
var rename = require("gulp-rename");

var gulpif = require('gulp-if');
var args = require('yargs').argv;  // <---- dont forget argv

var includer = require('gulp-file-include');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var browserify = require('browserify');

var config = require('./gulp.config')();

// var $ = require('gulp-load-plugins')({lazy:true}); // disadvantage: i cant name my plugins anymore , advantage: i cant use occupied names like print or if, lazylodaing!

//jscs not working?

//eslint !



var pathes = {

}

gulp.task('sass', function () {
    return gulp
        .src(config.src_css) // to watch ALL: ./**/*.scss
        .pipe(sass().on('error', sass.logError)) // .on('error', sass.logError)  to swallow error   [.pipe(plumber())  seems to be the better option)]
        .pipe(gulp.dest(config.dist));
});

// gulp.dest(function(f) { return f.base; })  // returns file to its original src path - if not renamed .. files will override themselves

gulp.task('clean-css', function () {
    var filesToDelete = config.src_css;
    del(filesToDelete);
});

gulp.task('rename', function () {
    return gulp
    .src('./src/**/style.scss')
    .rename("custom.scss")
    .pipe(gulp.dest(config.dist))
});

gulp.task('includer', function () {
    log("Running includer ...");
    return gulp.src('./src/**/*.html')
        // .pipe(debug())
        .pipe(gulpif(args.verbose, gulpprint()))
        .pipe(plumber())
        .pipe(includer({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest("./dist"));
});

gulp.task('jshint', function () {
    return gulp.src([
        './src/**/*.js',
        './*.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe(jshint.reporter('fail'));
});

gulp.task('bundlejs', function () {
    browserify('main.js') // start analyzing main.js for further required files
        .bundle()
        .on('error', function (e) {
            util.log(e);
        })
        .pipe(source('bundle.js')) // create vinyl stream which is required by gulp
        .pipe(gulp.dest('./dist/js')) // folder where the bundle.js will be created
});



gulp.task('watch', function () {
    // dont use "./" in front of pathes, because otherwise gulp-watch isnt able to recognize newly or deleted files
    gulp.watch('src/**/*.scss', ['sass']);

    gulp.watch('path/to/file', ['gulp task name for js']);
});


gulp.task('js', function () {
    return gulp
        .src('./src/**/*.js')
});



gulp.task('default', ['sass'], function () {

});


///////////////////////

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                util.log(util.colors.blue(msg[item]));
            }
        }
    } else {
        util.log(util.colors.blue(msg));
    }
}