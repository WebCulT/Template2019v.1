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
		del = require('del'),
		server = require('browser-sync').create();


var myBase = 'app/';

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
		'app/js/jQuery/jQuery.js',
		'app/js/modernizr/modernizr-custom.js',
		'app/js/svg4everybody.min.js',
		'app/js/type/typed.min.js',
		'app/js/mixitup/mixitup.min.js',
		'app/js/common.js',
		'app/js/pages/index.js',
		'app/js/pages/page.js',
		'app/js/pages/about.js',
		'app/js/pages/services.js',
		'app/js/pages/portfolio.js'
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
	gulp.watch('app/js/pages/*.js', gulp.parallel('js'));
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
	return gulp.src('app/img/svg/icon-*.svg')
		.pipe(svgstore({
			inlineSvg: true
		}))
		.pipe(rename('sprite.svg'))
		.pipe(gulp.dest('app/img'));
});

gulp.task('complete', function(done) {
	var buildFiles = gulp.src([
		myBase + '*.html'
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		myBase + 'css/main.min.css',
		])
		.pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		myBase + 'js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		myBase + 'fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

	done();
});

gulp.task('removedist', function(done) { done(); return del.sync('dist');});

gulp.task('build', gulp.parallel('removedist', 'images', 'webp', 'style', 'js', 'complete'));

gulp.task('default', gulp.parallel('style', 'js', 'serve'));