var gulp = require('gulp'), // 載入後可使用gulp功能 ex.gulp.task、gulp.watch
    watch = require('gulp-watch'), //gulp watcher
    connect = require('gulp-connect'), //Gulp plugin to run a webserver (with LiveReload)
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'), //Prevent pipe breaking caused by errors from gulp 
    runsequence = require('gulp-run-sequence'),
    gulpif = require('gulp-if'),
    changed = require('gulp-changed'),
    babel = require('gulp-babel'),
    gutil = require("gulp-util"),
    parentName = require('parent-folder'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

var version = 'v0.9.5';

var isDev, destPath,
    projectName = parentName(),
    port = 2001,
    // pordApi = "https://visaapi.azurewebsites.net/api/",
    pordApi = "https://cmpnapi.friendo.com.tw/api/",
    devApi = "https://sp-develop.azurewebsites.net/api/",
    jsFolder = "js/",
    buildPath = `../../deploy/${projectName}/`,
    devPath = `./dist/`;

const checkPath = function () {
    destPath = isDev ? devPath : buildPath;
}


/*
 
 ████████╗     █████╗     ███████╗    ██╗  ██╗    ███████╗    
 ╚══██╔══╝    ██╔══██╗    ██╔════╝    ██║ ██╔╝    ██╔════╝    
    ██║       ███████║    ███████╗    █████╔╝     ███████╗    
    ██║       ██╔══██║    ╚════██║    ██╔═██╗     ╚════██║    
    ██║       ██║  ██║    ███████║    ██║  ██╗    ███████║    
    ╚═╝       ╚═╝  ╚═╝    ╚══════╝    ╚═╝  ╚═╝    ╚══════╝    
    
*/

gulp.task('html', ['pug'], function () {
    console.log('start BEAUTIFY-HTML')
    var htmlbeautify = require('gulp-html-beautify'),
        options = {
            "indent_size": 4
        };
    gulp.src(destPath + '*.html')
        .pipe(htmlbeautify(options))
        .pipe(gulp.dest(destPath))
        .pipe(connect.reload())
});

// Pug Jade to html , html pretty
gulp.task('pug', function () {
    var pug = require('gulp-pug');

    return gulp.src(['src/**/*.pug','!src/**/_*.pug', 'src/*.jade', '!src/_*.jade'])
        .pipe(plumber())
        .pipe(pug({
            pretty: true,
            locals: {
                apiUrl: (isDev) ? devApi : pordApi,
                jsFolder: jsFolder,
                dev_mode: isDev,
                timestamp: Date.now()
            }
        }))
        .pipe(gulp.dest(destPath))
});

// Sass option same as node-sass
gulp.task('sass', function () {
    var sass = require('gulp-sass'),
        autoprefixer = require('gulp-autoprefixer')

    gulp.src(['src/sass/**/*.s{a,c}ss'])
        .pipe(plumber())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sass({
            outputStyle: (isDev) ? 'expanded' : 'compressed', // compressed, expanded
            errLogToConsole: true
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ["last 4 versions", "Firefox >= 27", "Blackberry >= 7", "IE 8", "IE 9"],
            cascade: false
        }))
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(gulp.dest(destPath + 'css'))
        .pipe(connect.reload());
});

gulp.task('js', ['static', 'vendor-script', 'library-script'], function () {

    gulp.src('src/js/**/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify()) // uglify js
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(gulp.dest(destPath + jsFolder))
        .pipe(connect.reload())
});

gulp.task('vendor-script', function () {
    gulp.src('src/vendor/*.js')
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(concat('vendor.js'))
        .pipe(gulpif(!isDev, uglify()))
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(gulp.dest(destPath + jsFolder))
        .pipe(connect.reload());
});

gulp.task('library-script', function () {
    gulp.src(['src/lib/*.js', '!src/lib/_*.js'])
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(concat('lib.js'))
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulpif(!isDev, uglify()))
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(gulp.dest(destPath + jsFolder))
        .pipe(connect.reload());
})
//Sever
gulp.task('connectDist', function () {
    connect.server({
        root: devPath,
        host: '0.0.0.0',
        port: port,
        livereload: true
    });
});

gulp.task('copyImg', function () {
    var imagemin = require('gulp-image');
    gulp.src(['src/images/**', '!src/images/sprite'])
        .pipe(changed(destPath + 'images'))
        // .pipe(gulpif(!isDev, imagemin()))
        .pipe(gulp.dest(destPath + 'images'))
        .pipe(connect.reload());
});

gulp.task('static', function () {
    gulp.src(['src/static/**'])
        .pipe(gulp.dest(destPath + 'static'));
});


//Open
gulp.task('open', function () {
    var open = require('gulp-open'); //Open files and URLs with gulp
    gulp.src(__filename)
        .pipe(open({
            uri: (port != "") ? 'http://localhost:' + port : 'http://localhost',
            app: 'chrome'
        }));
});

// Watch
gulp.task('watch', function () {
    gulp.watch(['src/*.pug', 'src/*.jade '], ['html']);
    gulp.watch('src/sass/**/**.s{c,a}ss', ['sass']);
    gulp.watch(['src/js/**', 'src/lib/**', 'src/vendor/**'], ['js']);
    gulp.watch(['src/images/*'], ['copyImg']);
});

//Build
gulp.task('build', function (cd) {
    isDev = false;
    destPath = `./deploy/${projectName}${new Date().getFullYear()}${new Date().getMonth()+1}${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}/`
    runsequence('clean', ['html', 'sass', 'js', 'copyImg'], cd);
});

//Showcase
gulp.task('showcase', function (cd) {
    isDev = false;
    checkShowcase();
    runsequence('clean', ['html', 'sass', 'js', 'copyImg'], cd);
});

//Group Dev
gulp.task('dev', function (cd) {
    isDev = true;
    checkPath();
    runsequence('clean', ['html', 'sass', 'js', 'copyImg', 'connectDist'], 'watch', cd);
});

//Default  Task
gulp.task('default', ['dev'], function () {
    // 可透過default先載入
});

gulp.task('clean', function (cd) {
    var clean = require('gulp-clean'); //Removes files and folders.
    var delArr = [devPath, destPath];
    //     delArr.push
    // if (!isDev) {
    //     gulp.src([devPath])
    //         .pipe(clean({    
    //             force: true
    //         }));
    // }
    return gulp.src(delArr)
        .pipe(clean({
            force: true
        }));
})


gulp.task('ftpDeploy', function (cd) {
    const ftp = require("vinyl-ftp");
    const ftpConn = ftp.create(ftpConfig);
    const localFile = [
        destPath + '**',
    ];
    return gulp.src(localFile, {
        base: destPath,
        buffer: false
    })
    .pipe(ftpConn.dest('/site/wwwroot/' + projectName)) //
    .pipe(ftpConn.newerOrDifferentSize('/site/wwwroot/' + projectName)) //conn.dest( '/dst' )
})
gulp.task('writeVersion', function () { 
    require('fs').writeFileSync(destPath + 'version.txt', `version: ${version}\r\n`);
})

gulp.task('testing', function (cd) {
    isDev = true;
    destPath = buildPath
    runsequence('clean', ['html', 'sass', 'js', 'copyImg'], 'writeVersion', cd);
});

gulp.task('production', function (cd) {
    isDev = false;
    destPath = buildPath
    runsequence('clean', ['html', 'sass', 'js', 'copyImg'], 'writeVersion', cd);
});
