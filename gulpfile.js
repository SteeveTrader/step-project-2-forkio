import gulp from "gulp";
import htmlmin from "gulp-htmlmin";
import concat from "gulp-concat";
import terser from "gulp-terser";
import cleanCSS from "gulp-clean-css";
import clean from "gulp-clean";
import bs from "browser-sync";
import imagemin from 'gulp-imagemin';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);
const browserSync = bs.create();

function scss() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('./dist/css'));
};

const cleanDist = () => {
    return gulp.src('./dist', { read: false })
        .pipe(clean());
};

const imgMin = () => {
    return gulp.src('./src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'));
};

const html = () => {
    return gulp.src('./src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("./"));
};

const js = () => {
    return gulp.src('./src/js/*.js')
        .pipe(concat('scripts.min.js'))
        .pipe(terser())
        .pipe(gulp.dest("./dist/js"));
};

const dev = () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('./src/**/*', gulp.series(cleanDist, gulp.parallel(html, scss, js, imgMin), (next) => {
        browserSync.reload(),
            next();
    }));
};

gulp.task('html', html);
gulp.task('js', js);
gulp.task('img', imgMin);
gulp.task('cleanDist', cleanDist);
gulp.task('scss', scss);

gulp.task('build', gulp.parallel(html, scss, js, imgMin));
gulp.task('dev', gulp.series(cleanDist, 'build', dev));
