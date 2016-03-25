var paths = require('./../paths'),
	path = require('path'),
	gulp = require('gulp'),
	rename = require('gulp-rename');

function htmlTask(){
	return gulp.src(paths.html, {base: 'app/'})
		.pipe(rename(function (p) {
			var feature = p.dirname.split(/\\|\//)[0],
				newDir = p.dirname.replace(path.join(feature, "www"), "");
			p.dirname = newDir;
		}))
		.pipe(gulp.dest(paths.dest))
}
gulp.task('html', htmlTask);
gulp.task("htmlSync", ['compile-features', 'scripts', 'styles'], htmlTask);
