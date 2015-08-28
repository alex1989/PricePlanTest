var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    react = require('gulp-react'),
    del = require('del');

    path = {
        js: 'build.js',
        css: 'style.css',
        dest: 'static/dist/',
    };

gulp.task('js:build', function() {
    gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/underscore/underscore-min.js',
      'bower_components/backbone/backbone-min.js',
      'bower_components/classnames/index.js',
      'bower_components/react/react.min.js',
      'static/js/ajax.js',
      'static/js/collections/collection.js',
      'static/js/mixins/backbone.mixin.js',
      'static/js/views/react.view.js',
      'static/js/app.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(concat(path.js))
    .pipe(react())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.dest));
});

gulp.task('clean', function(cb){
    del(['build'], cb);
});

gulp.task('css:build', function () {
    gulp.src(['bower_components/bootstrap/dist/css/bootstrap.min.css'])
        .pipe(sourcemaps.init())
        .pipe(concat(path.css))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dest));
});


gulp.task('production', ['js:build', 'css:build']);
