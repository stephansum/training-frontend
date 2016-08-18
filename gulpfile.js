// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
    gulp.src('playground_modules/**/*.scss') // to watch ALL: ./**/*.scss
        .pipe(sass().on('error', sass.logError)) // .on('error', sass.logError)  to swallow error
        .pipe(gulp.dest(function(f) {
            return f.base;
        }))
});



gulp.task('default', ['sass'], function() {
    // dont use "./" in front of pathes, because otherwise gulp-watch isnt able to recognize newly or deleted files
    gulp.watch('playground_modules/**/*.scss', ['sass']);
})