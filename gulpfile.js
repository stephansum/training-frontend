var gulp = require('gulp');
var watch = require('gulp-watch');
var util = require('gulp-util');
var gulpprint = require('gulp-print');
var debug = require('gulp-debug');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var del = require('del');
var rename = require("gulp-rename");

var gulpif = require('gulp-if');
var args = require('yargs').argv;  // <---- dont forget argv

var exec = require('child_process').exec; // part of nodejs - no npm package needed
var includer = require('gulp-file-include');
var sass = require('gulp-sass');

var config = require('./gulp.config.js');

// var $ = require('gulp-load-plugins')({lazy:true}); // disadvantage: i cant name my plugins anymore , advantage: i cant use occupied names like print or if, lazylodaing!

//eslint !


gulp.task('sass', function () {
    return gulp
        .src(config.src_scss) // to watch ALL: ./**/*.scss
        // .pipe(debug())
        .pipe(sass().on('error', sass.logError)) // .on('error', sass.logError)  to swallow error   [.pipe(plumber())  seems to be the better option)]
        .pipe(gulp.dest(config.dist));
});

// gulp.dest(function(f) { return f.base; })  // returns file to its original src path - if not renamed .. files will override themselves


// gulp-rimraf for deletion is deprecated:  instead use: https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
// also task naming convention clean:css  use colons! 
gulp.task('clean', function () {
    var toDelete = ["./dist"];
    del(toDelete);
});


gulp.task('rename', function () {
    return gulp
        .src('./src/**/style.scss')
        .pipe(rename(function (path) {
            path.basename = 'custom';
        }))
        .pipe(gulp.dest('./src/'));  // dest path gets appended to incoming relative file path of src (without the base! - base is everything without globs: ** / *)
});

gulp.task('includer', function () {
    // log("Running includer ...");
    return gulp.src(config.src_html)
        // .pipe(debug())
        // .pipe(gulpif(args.verbose, gulpprint()))
        .pipe(plumber())
        .pipe(includer({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest("./dist"));
});


gulp.task('watch', function () {
    // dont use "./" in front of pathes, because otherwise gulp-watch isnt able to recognize newly or deleted files

    // gulp.watch(config.src_scss, ['sass']);
    // gulp.watch(config.src_html, ['includer']);


    // switched from gulp.watch  to gulp-watch (seperate npm package), because it offers live recognition of new folders
    watch(config.src_scss, function() {
        gulp.start('sass');
    });
    watch(config.src_html, function() {
        gulp.start('includer');
    });
});



gulp.task('liveserver', function (cb) {
    exec('live-server', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// this task will be called when pressing Ctrl+Shift+B  (see .vscode/tasks.json)
gulp.task('default', ['sass', 'includer', 'watch', 'liveserver'], function () {
    
});



/////////////////////// custom functions ///////////////////////

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