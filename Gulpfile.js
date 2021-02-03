var gulp = require("gulp"); 
let project_folder='dist';
let source_folder='app';

var cssnano = require("gulp-cssnano"), // Минимизация CSS
    autoprefixer = require('gulp-autoprefixer'), // Проставлет вендорные префиксы в CSS для поддержки старых браузеров
    imagemin = require('gulp-imagemin'), // Сжатие изображений
    concat = require("gulp-concat"), // Объединение файлов - конкатенация
    uglify = require("gulp-uglify"), // Минимизация javascript
    rename = require("gulp-rename"); // Переименование файлов
/* --------------------------------------------------------
   ----------------- Таски ---------------------------
------------------------------------------------------------*/ 

// Копирование файлов HTML в папку dist
gulp.task("html", function() {
    return gulp.src("app/index.html")
    .pipe(gulp.dest("dist"));
});



// Объединение и сжатие JS-файлов
gulp.task("scripts", function() {
    return gulp.src("app/*.js") // директория откуда брать исходники
        .pipe(concat('scripts.js')) // объеденим все js-файлы в один 
        .pipe(uglify()) // вызов плагина uglify - сжатие кода
        .pipe(rename({ suffix: '.min' })) // вызов плагина rename - переименование файла с приставкой .min
        .pipe(gulp.dest("dist/js")); // директория продакшена, т.е. куда сложить готовый файл
});


//Сжимаем css
gulp.task("minify-css", function() {
        return gulp.src("app/*.css")
            .pipe(concat('style.css'))
            .pipe(autoprefixer({
                overrideBrowserslist: ['last 2 versions'],
                cascade: false
             }))
            .pipe(cssnano())
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest("dist/css"));
    });
// Сжимаем картинки
gulp.task('imgs', function() {
    return gulp.src("app/img/*.+(jpg|jpeg|png|gif)")
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true
        }))
        .pipe(gulp.dest("dist/images"))
});

// Задача слежения за измененными файлами
gulp.task("watch", function() {
    gulp.watch("app/*.html", gulp.series("html"));
    gulp.watch("app/*.js", gulp.series("scripts"));
    gulp.watch("app/img/*.+(jpg|jpeg|png|gif)", gulp.series("imgs"));
});

///// Таски ///////////////////////////////////////

// Запуск тасков по умолчанию
gulp.task("default", gulp.parallel("html", "scripts", "minify-css", "imgs", "watch"));