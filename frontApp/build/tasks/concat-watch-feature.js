var paths = require('./../paths'),
	gulp = require('gulp'),
	fs = require('fs'),
	glob = require('glob'),
	watch = require('gulp-watch'),
	order = require('gulp-order'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass');

var featureTasks = [];
var watchers = [];

glob.sync('app/*').forEach(function(featurePath) {
	var taskName, featureName, binFolder, glob;
	if (fs.statSync(featurePath).isDirectory()) {
		featureName = featurePath.split("/").pop().toLowerCase();
		taskName = "compile-"+featureName;
		binFolder = featurePath+"/.bin/";

		gulp.task(taskName, function(){
			return gulp.src(featurePath+"/script/**/*.js")
				.pipe(order([
					"**/*-module-*.js",
					"**/*-module.js",
					"**/*.js"
				]))
				.pipe(concat(featureName+'.js'))
				.pipe(gulp.dest(binFolder))
		});
		featureTasks.push(taskName);

		gulp.task("watch-"+taskName, function() {
			var watcher = gulp.watch(featurePath+"/script/**/*.js", [ taskName ]);
			watcher.on('change', function(event){
				console.log('File '+event.path+' was '+event.type+', running task '+ taskName);
			});
		});
		watchers.push("watch-"+taskName);

		gulp.task("sass-" + featureName, function(){
			return gulp.src([featurePath+"/sass/**/*.sass", "!"+featurePath+"/sass/**/_*.sass" ])
				.pipe(sass(
					{
						indentedSyntax: true,
						errLogToConsole: true,
						sourceComments: 'normal'
					}
				))
				.pipe(concat(featureName+".css"))
				.pipe(gulp.dest(binFolder))
		});
		featureTasks.push("sass-" + featureName);

		gulp.task("watch-sass-"+featureName, function(cb) {
			var taskName = "sass-" + featureName;
			var watcher = gulp.watch(featurePath+"/sass/**/*.sass", ["sass-" + featureName]);
			watcher.on('change', function(event){
				console.log('File '+event.path+' was '+event.type+', running task '+ taskName);
			})
		});

		watchers.push("watch-sass-"+featureName);

		gulp.task("watch-html-"+featureName, function(){
			gulp.watch(featurePath+"www/**/*", ["html"]).on('change', function(event){
				console.log('File '+event.path+' was '+event.type+', running task html');
			});
		});
		watchers.push("watch-html-"+featureName);

	}
});
gulp.task('compile-features', featureTasks);
gulp.task('watch-features', watchers);
