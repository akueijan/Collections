var gulp = require('gulp'),// 載入後可使用gulp功能 ex.gulp.task、gulp.watch
    watch = require('gulp-watch'),//gulp watcher
    open = require('gulp-open'),//Open files and URLs with gulp
    clean = require('gulp-clean'),//Removes files and folders.
    connect = require('gulp-connect'),//Gulp plugin to run a webserver (with LiveReload)
    plumber = require('gulp-plumber'),//Prevent pipe breaking caused by errors from gulp plugins
    pug = require('gulp-pug'),
    htmlbeautify = require('gulp-html-beautify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel');
// bowerFiles = require('bower-files');
// plumber : Prevent pipe breaking caused by errors from gulp plugins

// Pug Jade to html , html pretty
gulp.task('pug', function() {
    gulp.src(['src/*.pug','!src/_*.pug','src/*.jade', '!src/_*.jade'])
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        })) 
        .pipe(gulp.dest('dist/'));
});

gulp.task('html', function() {
    gulp.src('dist/*.html')
        .pipe(connect.reload());
});

gulp.task('htmlbeautify', function() {
    console.log('start BEAUTIFY-HTML')
    var options = {
        "indent_size": 4
    };

    gulp.src('dist/*.html')
        .pipe(htmlbeautify(options))
        .pipe(gulp.dest('dist/html/'))
});

// Sass option same as node-sass
gulp.task('sass', function() {
    gulp.src(['src/scss/**/*.scss', '!src/scss/**/_*.scss'])
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'expanded', // compressed, expanded
            errLogToConsole: true
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ["last 4 versions", "Firefox >= 27", "Blackberry >= 7", "IE 8", "IE 9"],
            cascade: false
        }))
        .pipe(gulp.dest('dist/assets/css/'))
        .pipe(connect.reload());
});

//babelgulp
gulp.task('es6', function() {
    gulp.src('src/es6/*.js')
        .pipe(plumber())
        .pipe(babel({
            "presets": ["es2015"]
        }))
        .pipe(gulp.dest('dist/js/'))
        .pipe(connect.reload());
});

//Sever
gulp.task('connectDist', function() {
    connect.server({
        root: 'dist',
        port: 3001,
        livereload: true
    });
});

//Copy file Start

gulp.task('copyFonts', function() {
    gulp.src(['src/fonts/**'])
        .pipe(gulp.dest('dist/assets/fonts'))
        .pipe(connect.reload());
});

gulp.task('copyJS', function() {
    gulp.src(['src/js/**'])
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(connect.reload());
});

gulp.task('copyLib', function() {
    gulp.src(['src/lib/**'])
        .pipe(gulp.dest('dist/lib'))
        .pipe(connect.reload());
});

gulp.task('copyCSS', function() {
    gulp.src(['src/css/**'])
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(connect.reload());
});

gulp.task('copyImg', function() {
    gulp.src(['src/images/*','!src/images/sprite'])
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(connect.reload());
});

gulp.task('copyAssets', function() {
    gulp.src(['src/assets/**'])
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('copyAll', ['copyLib','copyJS','copyCSS', 'copyImg', 'copyAssets', 'copyFonts'], function() {});
//Copy file End

//Clean
gulp.task('reset', function() {
    gulp.src(['dist/'], {read: false})
        .pipe(clean());
});

//Open
gulp.task('open', function() {
    gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:3001',
            app: 'chrome'
        }));
});

// Watch
gulp.task('watch', function() {
    gulp.watch(['src/*'], ['copyFonts']);
    gulp.watch(['src/*.jade'], ['pug']);
    gulp.watch(['src/*.pug'], ['pug']);
    gulp.watch('src/scss/**/**.scss', ['sass']);
    gulp.watch(['src/js/**'], ['copyJS']);
    gulp.watch(['src/images/*'], ['copyImg']);
    gulp.watch(['dist/*.html'], ['html']);
    gulp.watch(['dist/*.html'], ['htmlbeautify']);
});

//Build
gulp.task('build', ['pug', 'htmlbeautify', 'sass', 'copyAll'], function() {
    // 預設啟動時執行一次
});

//Group Dev
gulp.task('dev', ['build', 'connectDist', 'sass', 'watch', 'open','pug', 'copyFonts'], function() {});

//Default  Task
gulp.task('default', ['dev'], function() {
    // 可透過default先載入
});
