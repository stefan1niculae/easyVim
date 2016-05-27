"use strict";

var paths = require('./../paths');
var	gulp = require('gulp');
var	rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');

gulp.task('icons', function ()  {
  return gulp.src(paths.icons)
    .pipe(imagemin())
    .pipe(rename({
                   dirname: '/'
                 }))
    .pipe(gulp.dest(paths.destIcons))
});
