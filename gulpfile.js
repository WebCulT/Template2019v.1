var gulp = require('gulp'),
		sass = require('gulp-sass'),
		postcss = require('gulp-postcss'),
		autoprefixer = require('autoprefixer'),
		minify = require('gulp-csso'),
		rename = require('gulp-rename'),
		imagemin = require('gulp-imagemin'),
		webp = require('gulp-webp'),
		svgstore = require('gulp-svgstore'),
		notify = require('gulp-notify'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
		cmq	= require('gulp-merge-media-queries'),
		server = require('browser-sync').create();


gulp.task('style', function() {
	return gulp.src('app/sass/**/*.scss')
	.pipe(sass().on('error', notify.onError()))
	.pipe(postcss([
		autoprefixer()
	]))
	.pipe(cmq({
      log: true
    }))
	.pipe(gulp.dest('app/css'))
	.pipe(minify())
	.pipe(rename('main.min.css'))
	.pipe(gulp.dest('app/css'))
	.pipe(server.stream());
});

gulp.task('js', function() {
	return gulp.src([
		'app/js/jQuery/jQuery.js'
		'app/js/svg4everybody.min.js'
		'app/js/common.js', //Always at the end.
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js/'))
	.pipe(server.stream());
});


gulp.task('serve', function() {
	server.init({
		server: 'app/'
	});

	gulp.watch('app/sass/**/*.scss', gulp.parallel('style'));
	gulp.watch(['app/js/libs', 'app/js/common.js'], gulp.parallel('js'));
	gulp.watch('app/*.html').on('change', server.reload);
});

gulp.task('images', function() {
	return gulp.src('app/img/**/*.{png,jpg,svg}')
		.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.jpegtran({progressive: true}),
			imagemin.svgo()
		]))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('webp', function() {
	return gulp.src('app/img/**/*.{png,jpg}')
		.pipe(webp({quality: 90}))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('sprite', function() {
	return gulp.src('app/img/icon-*.svg')
		.pipe(svgstore({
			inlineSvg: true
		}))
		.pipe(rename('sprite.svg'))
		.pipe(gulp.dest('app/img'));
});

gulp.task('default', gulp.parallel('style', 'js', 'serve'));