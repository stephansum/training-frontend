var gulp = require('gulp');
var util = require('gulp-util');
var plumber = require('gulp-plumber');
var includer = require('gulp-file-include');
var gulpprint = require('gulp-print');
var gulpif = require('gulp-if');
var yargs = require('yargs');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');

//jscs not working?

//eslint !

var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var pathes = {
    src_css: './src/**/*.css',
    src_less: './src/**/*.css',
    dest_css: './dist/**/*.css',
    dist_less: './dist/**/*.css',
}

gulp.task('sass', function() {
    return gulp
        .src('src/**/*.scss') // to watch ALL: ./**/*.scss
        .pipe(sass().on('error', sass.logError)) // .on('error', sass.logError)  to swallow error   [.pipe(plumber())  seems to be the better option)]
        .pipe(gulp.dest('./dist'));
});

// gulp.dest(function(f) { return f.base; })  // returns file to its original src path - if not renamed .. it will override itself

gulp.task('includer', function() {
    log("Running includer ...");
    return gulp.src('./src/**/*.html')
        .pipe(gulpprint())
        .pipe(plumber())
        .pipe(includer({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest("./dist"));
});

gulp.task('jshint', function(){
    return gulp.src([
        './src/**/*.js',
        './*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', { verbose: true}))
    .pipe(jshint.reporter('fail'));
});

gulp.task('bundlejs', function() {
    browserify('main.js') // start analyzing main.js for further required files
        .bundle()
        .on('error', function(e) {
            util.log(e);
        })
        .pipe(source('bundle.js')) // create vinyl stream which is required by gulp
        .pipe(gulp.dest('./dist/js')) // folder where the bundle.js will be created
});



gulp.task('watch', function() {
    // dont use "./" in front of pathes, because otherwise gulp-watch isnt able to recognize newly or deleted files
    gulp.watch('src/**/*.scss', ['sass']);

    gulp.watch('path/to/file', ['gulp task name for js']);
});


gulp.task('js', function() {
    return gulp
        .src('./src/**/*.js')
});



gulp.task('default', ['sass'], function() {

});


///////////////////////

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                util.log(util.colors.blue(msg[item]));
            }
        }
    } else {
        util.log(util.colors.blue(msg));
    }
}