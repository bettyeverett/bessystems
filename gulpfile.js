// Declare all variables
let gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');
let rename = require('gulp-rename');
let sass = require('gulp-sass');
let concat = require('gulp-concat')
let uglify = require('gulp-uglify-es').default;
let browserSync = require('browser-sync').create();

// Syncing the browser with our project updates
function reload(done) {
  browserSync.reload();
  done();
}

function serve(done) {
  browserSync.init({
    proxy: 'http://192.168.33.13/',
  });
  done();
}

// Declare files as a variable rather than listing in function, then only have to change in one place, if you want to add another file and have more than one function accessing these files.
let jsfiles = [];

// Update sass files to style.css
gulp.task('sass', function () {
    var stream = gulp.src('./library/scss/style.scss')
        .pipe(sass())
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./library/css/'));
    return stream;
});

// Minify style.css for a smaller file
gulp.task('minify-css', () => {
    return gulp.src('./library/css/style.css')
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./library/css/'));
  });

// Combine both of the above functions
gulp.task('style', gulp.series('sass', 'minify-css'))

// Concatonate all files
gulp.task('scripts', function () {
    return gulp.src(jsfiles)
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./library/js/in-between/'));
});

// Minify JS
gulp.task("uglify", function () {
    return gulp.src("./library/js/in-between/all.js")
        .pipe(rename("all.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./library/js/in-between"));
});

// Combine both of the above functions
gulp.task('minify-scripts', gulp.series('scripts', 'uglify'))

// Watch constantly for changes and to the above functions when saving
const watch = () => gulp.watch(['./library/scss/**/*.scss', './library/js/*.js'], gulp.series('style', 'minify-scripts', reload));

gulp.task('default', gulp.series(serve, watch)); // just run "gulp" or "gulp default"