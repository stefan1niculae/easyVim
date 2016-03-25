var paths = require('./../paths'),
	gulp = require('gulp'),
	concat = require('gulp-concat');

gulp.task('styles',['compile-features'], function () {
	return gulp.src(paths.binCss, {base: paths.root})
		.pipe(concat('style.css'))
		.pipe(gulp.dest(paths.destCss))
});
