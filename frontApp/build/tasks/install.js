var paths = require('./../paths'),
	gulp = require('gulp'),
	mainBowerFiles = require('main-bower-files');

gulp.task('install', function() {
	gulp.src(
		mainBowerFiles({
			includeDev:false,
		    overrides: {
			   bootstrap: {
				   main: [
					   './dist/js/bootstrap.js',
					   './dist/css/*.min.*',
					   './dist/fonts/*.*'
				   ]
			   }
		    }
		}),
		{ base: paths.bower }
	)
		.pipe(gulp.dest(paths.lib));
});
