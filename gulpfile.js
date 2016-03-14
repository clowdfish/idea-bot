// include gulp
var gulp = require('gulp');

// include core modules
var path = require('path'),
    fs = require('fs');

// include gulp plug-ins
var ts      = require('gulp-typescript'),
    notify  = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    concat  = require('gulp-concat'),
    replace = require('gulp-replace');

/****************************************************************************************************/
/* SETTING UP DEVELOPMENT ENVIRONMENT                                                               */
/****************************************************************************************************/

// the title and icon that will be used for notifications
var notifyInfo = {
    title: 'Gulp',
    icon: path.join(__dirname, 'gulp.png')
};

// error notification settings for plumber
var plumberErrorHandler = {
    errorHandler: notify.onError({
        title: notifyInfo.title,
        icon: notifyInfo.icon,
        message: "Error: <%= error.message %>"
    })
};

// typescript compiler configuration
var tsConfig = {
    target: 'es5',
    module: 'commonjs',
    declaration: true,
    noImplicitAny: false,
    noExternalResolve: true,
    removeComments: true,
    preserveConstEnums: true,
    suppressImplicitAnyIndexErrors: true,
    sourceMap: true
};

/****************************************************************************************************/
/* DEVELOPMENT TASKS                                                                                */
/****************************************************************************************************/

// typescript based tasks
gulp.task('typescript', function() {

    var tsResult = gulp.src([
            'typings/main/**/*.d.ts',
            'app/**/*.ts',
            'index.ts'
        ], { base: "." })
        .pipe(plumber(plumberErrorHandler))
        .pipe(ts(tsConfig));

    return tsResult.js
        .pipe(gulp.dest('dist/'));
});

/****************************************************************************************************/
/* GULP TASK SUITES                                                                                 */
/****************************************************************************************************/

gulp.task('live', ['typescript'], function() {

    // watch for code changes
    gulp.watch(['./**/*.ts'], ['typescript'], function(event) {
        onModification(event);
    });

    function onModification (event) {
        gulp.src(event.path)
            .pipe(plumber())
            .pipe(notify({
                title: notifyInfo.title,
                icon: notifyInfo.icon,
                message: event.path.replace(__dirname, '').replace(/\\/g, '/') + ' was ' + event.type + '.'
            }));
    }
});