var gulp = require('gulp'),
 uglify = require('gulp-uglify'),
 plumber = require('gulp-plumber'),
 notify = require('gulp-notify'),
 rename = require('gulp-rename'),
 jscs = require('gulp-jscs'),
 jshint = require('gulp-jshint'),
 autoprefixer = require('gulp-autoprefixer'),
 minifyCSS = require('gulp-minify-css'),
 sass = require('gulp-sass'),
 browserSync = require('browser-sync').create();

gulp.task('uglify', function(){
    gulp.src('js/*.js') // What files do we want gulp to consume?
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(uglify()) // Call the uglify function on these files
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('build/js')); // Where do we put the result?
});

gulp.task('sass', function() {
  gulp.src('scss/*.scss')
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 versions']
  }))
  .pipe(gulp.dest('build/css'))
  .pipe(minifyCSS())
  .pipe(rename({extname: '.min.css'}))
  .pipe(gulp.dest('build/css'));
});

gulp.task('watch', function() {
  gulp.watch(['js/*.js'], ['uglify']);
  gulp.watch(('scss/*.scss'), ['sass']);
  gulp.watch(['build/js/*.min.js', 'index.html', 'build/css/*.min.css', 'css/styles.css']).on('change', browserSync.reload);
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('default', ['watch']);
