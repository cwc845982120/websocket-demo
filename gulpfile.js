var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var watch = require('gulp-watch');
var eslint = require('gulp-eslint');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;

gulp.task('eslint', function() {
    return gulp.src(['./**/*.js','!./node_modules/**/*.js','!gulpfile.js','!webpack.config.js','!./lib/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
});

gulp.task('bower', function () {
    return gulp.src('./tpls/index_1.html')
        .pipe(wiredep({
            optional: 'configuration',
            goes: 'here'
        }))
        .pipe(gulp.dest('./tpls'));
});

gulp.task('inject',function () {
    //default
    console.log('all js is injected!');
});

//端口3000
gulp.task('serve', function () {
    browserSync.init({
        startPath: 'tpls/index_1.html',
        server: {
            baseDir: '.'
        }
    });

    gulp.watch('src/**/*.*').on('change', browserSync.reload);
});

gulp.task('default',['eslint','bower','inject'],function() {
    gulp.run('serve');
});