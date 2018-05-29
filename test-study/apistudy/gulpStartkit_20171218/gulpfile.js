var gulp = require('gulp'),// 載入後可使用gulp功能 ex.gulp.task、gulp.watch
    watch = require('gulp-watch'),//gulp watcher
    connect = require('gulp-connect'),//Gulp plugin to run a webserver (with LiveReload)
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),//Prevent pipe breaking caused by errors from gulp 
    runsequence = require('gulp-run-sequence'),
    gulpif = require('gulp-if'),
    concat = require('gulp-concat');

var isDev = false;
// Pug Jade to html , html pretty
gulp.task('pug', function () {
    let pug = require('gulp-pug');

    return gulp.src(['src/*.pug', '!src/_*.pug', 'src/*.jade', '!src/_*.jade'])
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist/'))
});

gulp.task('html', ['pug'], function () {
    console.log('start BEAUTIFY-HTML')
    let htmlbeautify = require('gulp-html-beautify'),
        options = {
            "indent_size": 4
        };
    gulp.src('dist/*.html')
        .pipe(htmlbeautify(options))
        .pipe(gulp.dest('dist/'))
            .pipe(connect.reload())
});

// Sass option same as node-sass
gulp.task('sass', function () {
    let sass = require('gulp-sass'),
        autoprefixer = require('gulp-autoprefixer')
    
    gulp.src(['src/scss/**/*.scss'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded', // compressed, expanded
            errLogToConsole: true
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ["last 4 versions", "Firefox >= 27", "Blackberry >= 7", "IE 8", "IE 9"],
            cascade: false
        }))
        .pipe(gulpif(isDev,sourcemaps.write()))
        .pipe(gulp.dest('dist/css/'))
        .pipe(connect.reload());
});

gulp.task('js', ['vendor-script', 'library-script'], function () {
    let uglify = require('gulp-uglify'),
        babel = require('gulp-babel');
    gulp.src('src/js/*.js')
        .pipe(gulpif(isDev, sourcemaps.init({ loadMaps: true})))
        .pipe(babel({
            "presets": ["es2015"]
        }))
        .pipe(concat('app.js'))
        .pipe(uglify()) // uglify js
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload())
});

gulp.task('vendor-script', function () {
    gulp.src('src/vendor/*.js')
        .pipe(plumber())
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(concat('vendor.js'))
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
})

gulp.task('library-script', function () {

    gulp.src('src/json/*.json')
        .pipe(gulp.dest('dist/json'));
    
    gulp.src('src/lib/*.js')
        .pipe(plumber())
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(concat('lib.js'))
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
})
//Sever
gulp.task('connectDist', function () {
    connect.server({
        root: 'dist',
        port: 3001,
        livereload: true
    });
});

gulp.task('copyCSS', function () {
    gulp.src(['src/css/**'])
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

gulp.task('copyImg', function () {
    gulp.src(['src/images/*', '!src/images/sprite'])
        .pipe(gulp.dest('dist/images'))
        .pipe(connect.reload());
});

gulp.task('copyAssets', function () {
    gulp.src(['src/assets/**'])
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('copyAll', ['copyLib', 'copyJS', 'copyCSS', 'copyImg', 'copyAssets'], function () { });
//Copy file End

//Open
gulp.task('open', function () {
    let open = require('gulp-open');//Open files and URLs with gulp
    gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:3001',
            app: 'chrome'
        }));
});
// Watch
gulp.task('watch', function () {
    gulp.watch(['src/*.pug', 'src/*.jade '], ['html']);
    gulp.watch('src/scss/**/**.scss', ['sass']);
    gulp.watch(['src/js/**', 'src/lib/**', 'src/vendor/**'], ['js']);
    gulp.watch(['src/images/*'], ['copyImg']);
});

//Build
gulp.task('build', function (cd) {
    runsequence('clean', ['html', 'sass', 'js','copyImg'], cd);
});

//Group Dev
gulp.task('dev', function (cd) {
    isDev = true;
    runsequence('clean', ['html', 'sass', 'js', 'copyImg', 'connectDist'],'open','watch' ,cd);
 });

//Default  Task
gulp.task('default', ['dev'], function () {
    // 可透過default先載入
});

gulp.task('clean', function (cd) {
    let clean = require('gulp-clean'); //Removes files and folders.
    return gulp.src(['dist/'], { read: false })
        .pipe(clean());
})
