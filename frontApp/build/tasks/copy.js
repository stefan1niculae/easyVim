var paths = require('./../paths'),
  gulp = require('gulp');

gulp.task('copy', function () {

  gulp.src(['app/robots.txt'])
    .pipe(gulp.dest('www'));

  gulp.src(['lib/**/*'])
    .pipe(gulp.dest('www/lib'));

  gulp.src(['app/landing.md'])
    .pipe(gulp.dest('www/content'));

});
