'use strict';

const gulp = require('gulp');
const del  = require('del');

const browserSync = require('browser-sync').create();
/*
* Css Preprocessor
* */
const scss          = require('gulp-sass');
const sourcemap     = require('gulp-sourcemaps');
const autoprefix    = require('gulp-autoprefixer');

/*
* Image Minify
* */
const imagemin      = require('gulp-imagemin');
const pngquant      = require('imagemin-pngquant');
const cache         = require('gulp-cache');

/*
* Plugin JavaScript
* */
const uglifyjs    = require('gulp-uglify');
const concat      = require('gulp-concat');

/*
* Path directory
* */
var path = {
    src: {
        scss: 'src/assets/scss/**/*.scss',
        pluginJS: [
            'node_modules/jquery/dist/jquery.min.js'
        ],
        img: 'src/assets/img/**/*.*'
    },
    dest: {
        css: 'src/assets/css/',
        js: 'src/assets/js',
        img: 'src/assets/img'
    },
    production: {
        css: 'prod/css/',
        cssMain: 'prod/',
        fonts: 'prod/fonts',
        js: 'prod/js',
        img: 'prod/img',
        html: 'prod/'
    }
};

gulp.task('scss', function(){
    return gulp.src(path.src.scss)
        .pipe(sourcemap.init())
        .pipe(scss().on('error', scss.logError))
        .pipe(sourcemap.write())
        .pipe(autoprefix({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(path.dest.css))
        .pipe(browserSync.stream())
});

gulp.task('scripts', function(){
    return gulp.src(path.src.pluginJS)
        .pipe(concat('libs.min.js'))
        .pipe(uglifyjs())
        .pipe(gulp.dest(path.dest.js))
});

gulp.task('img', function(){
   return gulp.src(path.src.img)
       .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
       })))
       .pipe(gulp.dest(path.dest.img))

});

gulp.task('clean', function(){
   return del.sync('prod');
});


gulp.task('serve', ['scss'], function() {

    browserSync.init({
        server: "src"
    });

    gulp.watch("src/assets/scss/**/*.scss", ['scss']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('build', ['clean', 'scss', 'scripts', 'img'], function(){
    var biuldCss = gulp.src([
        'src/assets/scss/style.css'
        ])
        .pipe(gulp.dest(path.production.css))

    var buildFonts = gulp.src('src/assets/fonts/**/*')
        .pipe(gulp.dest(path.production.fonts))

    var buildHtml = gulp.src('src/*.html')
        .pipe(gulp.dest(path.production.html))

    var buildImg = gulp.src('src/assets/img/**/*.*')
        .pipe(gulp.dest(path.production.img))

    var buildJs = gulp.src('src/assets/js/**/*.js')
        .pipe(gulp.dest(path.production.js))
});

gulp.task('clear',function () {
    return cache.clearAll();
});
