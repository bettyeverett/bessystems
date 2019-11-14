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
    server: {
      baseDir: './'
    }
  });
  done();
}

// Declare files as a variable rather than listing in function, then only have to change in one place, if you want to add another file and have more than one function accessing these files.
let jsfiles = [];

// Update sass files to styles.css
gulp.task('sass', function () {
    var stream = gulp.src('./scss/styles.scss')
        .pipe(sass())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('./css/'));
    return stream;
});

// Minify styles.css for a smaller file
gulp.task('minify-css', () => {
    return gulp.src('css/styles.css')
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./css/'));
  });

// Combine both of the above functions
gulp.task('styles', gulp.series('sass', 'minify-css'))

// Watch constantly for changes and to the above function when saving
gulp.task('watch', function () {
    return gulp.watch('./scss/**/*.scss', gulp.series('styles'));
});

// Concatonate all files
gulp.task('scripts', function () {
    return gulp.src(jsfiles)
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./js/in-between/'));
});

// Minify JS
gulp.task("uglify", function () {
    return gulp.src("js/in-between/all.js")
        .pipe(rename("all.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("js/in-between"));
});

// Combine both of the above functions
gulp.task('minify-scripts', gulp.series('scripts', 'uglify'))

// Watch constantly for changes and to the above function when saving
gulp.task('watch-js', function () {
    return gulp.watch('./js/*.js', gulp.series('minify-scripts'));
});

const watch = () => gulp.watch(['./scss/**/*.scss', 'js/script.js'], gulp.series('sass-minify', 'js-combine-minify', reload));

gulp.task('default', gulp.series(serve, watch)); // just run "gulp" or "gulp default"