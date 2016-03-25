var gulp = require('gulp');

gulp.task("compile", ['compile-features', 'scripts', 'styles', 'htmlSync', 'copy']);
