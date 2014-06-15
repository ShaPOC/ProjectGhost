/**
 * TEST DRIVEN DEVELOPMENT USING GULP
 * This file defines the use of nodeunit and jshint.
 */

var gulp     = require('gulp'),
    nodeunit = require('gulp-nodeunit'),
    jshint   = require('gulp-jshint'),
    stylish = require('jshint-stylish');

    path = {
        test : ['./test/*.test.js', './test/**/*.test.js'],
        lint : ['./src/*.js', './src/**/*.js']
    }

gulp.task('test', function () {
    gulp.src(path.test)
        .pipe(nodeunit({
            reporter: 'junit',
            reporterOptions: {
                output: 'test'
            }
        }));
});

gulp.task('lint', function() {
    return gulp.src(path.lint)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['test', 'lint']);