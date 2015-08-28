var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    react = require('gulp-react'),
    del = require('del');

    path = {
        MINIFIED_OUT: 'build.min.js',
        ENTRIES: [
            'js/app',
        ],
        JSX_DEST: 'js/views',
        OUT: 'build.js',
        DEST: 'dist',
        DEST_BUILD: 'dist/build',
        SOURCE: 'js/app.js',
        REQUIREJS_FILE: 'requirejs_build.js'
    };

gulp.task('build', function() {
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
    .pipe(concat(path.OUT))
    .pipe(react())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('clean', function(cb){
    del(['build'], cb);
});

gulp.task('production', ['build', ]);
