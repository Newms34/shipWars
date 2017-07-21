/*GULP:
Gulp is a node package that concatenates your files. It basically can convert a whole bunch of files (i.e., your whole js tree structure) into just ONE, minified file. At the time of writing, that reduces the js payload from 22kb to just 7kb. 
More importantly, it also means our user's browser only needs to fetch ONE file (all.min.js), instead of... however many i create. 
*/
// First, we'll just include gulp itself.
const gulp = require('gulp');

// Include Our Plugins
const jshint = require('gulp-jshint');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const cleany = require('gulp-clean-css');
const babel = require('gulp-babel');
const ngAnnotate = require('gulp-ng-annotate');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint({esversion:6}))
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(['build/scss/*.scss', 'build/scss/**/*.scss'])
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(cleany())
        .pipe(gulp.dest('public/css'));
});
// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(['build/js/**/*.js', 'build/js/*.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(rename('all.min.js'))
        .pipe(babel({presets: ['es2015']}))
        .pipe(ngAnnotate())
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('public/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['build/js/**/*.js', 'build/js/*.js'], ['lint', 'scripts']);
    gulp.watch(['build/scss/*.scss', 'build/scss/**/*.scss'], ['sass']);
});

//no watchin!
gulp.task('render', ['lint', 'sass', 'scripts'])

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
