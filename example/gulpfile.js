var gulp = require('gulp');
var del = require('del');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var rework = require('rework');
var path = require('path');
var fs = require('fs');
var mkpath = require('mkpath');

var PATHS = {
    src: {
        root: 'src',
        ts: 'src/**/*.ts',
        html: 'src/**/*.html',
        css: 'src/**/*.css'
    },
    lib: [
        'node_modules/*(ng2-chosen|angular2|zonz.js|rxjs|es6-shim|systemjs)/**/*.*',
        'bower_components/*(chosen)/**/*.*'
    ]
};

gulp.task('clean', function (done) {
    del(['dist'], done);
});

var tsProject = tsc.createProject('tsconfig.json', {typescript: require('typescript')});

gulp.task('ts', function () {
    return gulp.src(PATHS.src.ts)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject))
        .pipe(sourcemaps.write('source'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('html', function () {
    return gulp.src(PATHS.src.html)
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
    return gulp.src(PATHS.src.css).pipe(gulp.dest('dist'));
});

gulp.task('libs', function () {
    return gulp.src(PATHS.lib)
        .pipe(gulp.dest('dist/lib'));

});

gulp.task('copyNg2Chosen', function () {
    return gulp.src("../dist/*.*")
        .pipe(gulp.dest('dist/lib/ng2-chosen/dist'));
});

gulp.task('dev', ['default'], function () {

    var http = require('http');
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var open = require('open');

    var port = 8888, app;


    gulp.watch("../dist/*.*", ['copyNg2Chosen']);

    gulp.watch(PATHS.src.html, ['html']);
    gulp.watch(PATHS.src.ts, ['ts']);
    gulp.watch(PATHS.src.css, ['css']);

    app = connect().use(serveStatic(__dirname + '/dist'));  // serve everything that is static
    http.createServer(app).listen(port, function () {
        open('http://localhost:' + port);
    });
});

gulp.task('default', ['ts', 'css', 'html', 'libs']);
