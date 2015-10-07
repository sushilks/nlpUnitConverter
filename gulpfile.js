var gulp = require('gulp');
var gulpNewer = require('gulp-newer');
var gulpMocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var tslint = require('gulp-tslint');
var stylish = require('gulp-tslint-stylish');
var del = require('del');
var outDir = 'build';
var tsProject = ts.createProject('./tsconfig.json');
var server = require( 'gulp-develop-server' );
var shell=require('gulp-shell');
var spawn=require('gulp-spawn');
var connect=require('gulp-connect');
var tslintCfg=require('./tslint.json');

var paths = {
    typescript: ['src/**/*.ts'],
    js: ['src/**/*.js'],
    tests: [outDir + '/test/**/*.js']
};

gulp.task('build-ts', function() {
    return gulp.src(paths.typescript)
        .pipe(gulpNewer({dest: outDir, ext: '.js'}))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outDir));
});

gulp.task('build-js', function() {
    return gulp.src(paths.js)
        .pipe(gulpNewer({dest: outDir, ext: '.js'}))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outDir));
});

gulp.task('clean', function() {
    "use strict";
    return del([outDir]);
});

gulp.task('test', ['build'], function() {
    "use strict";
    return gulp.src(paths.tests)
        .pipe(gulpMocha({
            reporter: 'nyan',
            clearRequireCache: true,
            'ui': 'bdd'}));
});

gulp.task('watch', function() {
    "use strict";
    gulp.watch(paths.typescript, ['build-ts']);
    gulp.watch(paths.js, ['build-js']);
});

gulp.task('lint-style', function() {
    "use strict";
    return gulp.src(paths.typescript)
        .pipe(tslint())
        .pipe(tslint.report(stylish, {
            emitError: false,
            sort: true
        }));
});

/*
gulp.task('server:start', function(){
    "use strict";
    server.listen({
        path: 'build/corenlp_server.js',
        delay: 2000
    });
});
*/
gulp.task('server-start', shell.task([
    "node build/corenlp_server.js >& server.bg.log&"
]));

gulp.task('server-stop', shell.task([
    "pkill -f 'node build/corenlp_server.js'"
]));

gulp.task('server-connect', function() {
    "use strict";
    connect.server({
        root: '.',
        port: 8990
    });
});

gulp.task('lint', function() {
    return gulp.src(paths.typescript)
        .pipe(tslint())
        .pipe(tslint.report('prose', {
            emitError: false,
            configuration: tslintCfg
        }));
});

gulp.task('build', ['build-ts', 'build-js']);
gulp.task('default', ['build']);