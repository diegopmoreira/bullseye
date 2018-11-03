var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix    = require('gulp-autoprefixer');
var minifycss = require('gulp-clean-css');
var browserSync = require('browser-sync').create();





gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "/home/inquisitor/Git/bullseye",
        middleware: function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
         }
    });

    gulp.watch("src/scss/*.scss", ['sass']);
    gulp.watch("index.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/scss/*.scss")
        .pipe(sass())
        .pipe(minifycss())
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
       
               
});

gulp.task('default', ['serve']);