import gulp from "gulp";
import watch from "gulp-watch";
import util from "gulp-util";
import plumber from "gulp-plumber";
import {deleteAsync} from 'del';
import rename from "gulp-rename";
import exec from "child_process";
import includer from "gulp-file-include";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import liveServer from "live-server";

var params = {
	// port: 8181, // Set the server port. Defaults to 8080.
	// host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
	// root: "/public", // Set root directory that's being served. Defaults to cwd.
	// open: false, // When false, it won't load your browser by default.
	// ignore: 'scss,my/templates', // comma-separated string for paths to ignore
	// file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
	// wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
	// mount: [['/components', './node_modules']], // Mount a directory to a route.
	// logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
	// middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
};


const sass = gulpSass(dartSass);


// dont forget to install the following modules globally:
// npm install -g live-server


let config = {
    src: './src',
    dist: './dist',
    src_css: './src/**/*.css',
    src_scss: './src/**/*.scss',
    src_html: './src/**/*.html',
    dest_css: './dist/**/*.css',
    dist_scss: './dist/**/*.scss'
}


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
gulp.task('clean', async function () {
    var toDelete = ["./dist"];
    await deleteAsync(toDelete);
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
    liveServer.start(params);

    // exec('live-server', function (err, stdout, stderr) {
    //     console.log(stdout);
    //     console.log(stderr);
    //     cb(err);
    // });
});

// this task will be called when pressing Ctrl+Shift+B  (see .vscode/tasks.json)
gulp.task('default', gulp.parallel('sass', 'includer', 'watch', 'liveserver'), function () {
    
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