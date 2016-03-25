var paths = require('./../paths'),
	gulp = require('gulp');

gulp.task('watch-bins', function() {
	gulp.watch([paths.root + "www/**/*.html", paths.root + "www/**/*.css", paths.root + "www/**/*.json", "!"+ paths.root + "www/**/_*"], ['html']);

	gulp.watch(paths.root+".bin/*.js", ["scripts"]).on('change', function(event){
		console.log('File '+event.path+' was '+event.type+', running task scripts');
	});
	gulp.watch(paths.root+".bin/*.css", ['styles']).on('change', function(event){
		console.log('File '+event.path+' was '+event.type+', running task styles');
	});
});

gulp.task('watch', ['watch-features', 'watch-bins']);
