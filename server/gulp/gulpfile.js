const gulp = require('gulp');

//config
const config = require('./config.json');

//middleware
const sass = require('gulp-sass');
const del = require('del');
const typescript  = require('gulp-typescript');
const sourceMaps = require('gulp-sourceMaps');
const shell = require('gulp-shell');
const clean = require('gulp-clean');


{

    //*******************
    //gulp tasks
    //*******************

    gulp.task('build', ['copy:node_modules']);

    gulp.task('default', ['watch']);

    gulp.task('serve', ['copy:node_modules', 'watch']);

    //watch functions

    gulp.task('watch', function () {
        gulp.watch([config.source + "**/*.ts"], ['compile']);
    });

    //****************
    //gulp functions
    //****************


    gulp.task('delete', function () {
        return gulp.src(config.dist, {read: false})
            .pipe(clean({force: true}))
    });


    gulp.task('copy:node_modules', ['copy:package'], function () {
        return gulp.src([config.source + '/node_modules/**/*'])
            .pipe(gulp.dest(config.dist + '/node_modules'))
    });


    gulp.task('copy:package', ['compile'], function () {
        return gulp.src([config.source + 'package.json'])
            .pipe(gulp.dest(config.dist))
    });

    gulp.task('compile', ['clean'], function () {
        return  gulp.src(config.source + '**/*.ts')
            .pipe(sourceMaps.init())
            .pipe(typescript())
            .js
            .pipe(sourceMaps.write())
            .pipe(gulp.dest(config.dist));

    });

    gulp.task('clean', function () {
        return gulp.src([config.dist + '/server', config.dist + 'server.js'], {read: false})
            .pipe(clean({force: true}))
    });

}