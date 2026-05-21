var gulp = require('gulp'),
    connect = require('gulp-connect');

gulp.task('connect', function(done) {
    connect.server();
    done();
});

gulp.task('default', gulp.series('connect'));