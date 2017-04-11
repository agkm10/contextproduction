const gulp = require('gulp')
const concat = require('gulp-concat')
// const minifyCss = require('gulp-minify-css')
const clean = require('gulp-clean')
const gulpUglify = require('gulp-uglify')
// const babel = require('gulp-babel')
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');

const paths = {
    scripts: ['public/app.js', 'public/**/*.js'],
    styles: ['./**/*.css', ]
}
gulp.task('clean-js', function() {
    return gulp.src('./build.js')
        .pipe(clean())
})

gulp.task('build', ['clean-js'], function() {

    gulp.src(paths.scripts)
        .pipe(concat("build.js"))
        .pipe(gulpUglify())
        .pipe(gulp.dest('./public/'))
})

// gulp.task('minify-css', function() {
//     return gulp.src(paths.styles)
//         .pipe(concat('build.css'))
//         .pipe(minifyCss())
//         .pipe(gulp.dest('./'))
// })

// .pipe(babel({
//     presets: ['es2015']
// }))
