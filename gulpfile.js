var gulp = require('gulp'),
	htmlmin = require('gulp-htmlmin'), // For minifying HTML files
	minifyCss = require('gulp-minify-css'), // For minifying CSS files
	uglify = require('gulp-uglify'), // For minifying JS files
	plumber = require('gulp-plumber'); // To stop pipe from breaking in the event of an error

gulp.task('views', function() { // Task to run "views" methods
  	gulp.src('app/*.html') // File(s) source
  		.pipe(plumber())
    	.pipe(htmlmin({collapseWhitespace: true}))
    	.pipe(gulp.dest('public')) // File(s) destination
});

gulp.task('styles', function() { // Task to run "styles" methods
  	gulp.src(['app/css/*.css']) // File(s) source
  		.pipe(plumber())
    	.pipe(minifyCss({compatibility: 'ie8'}))
    	.pipe(gulp.dest('public/css')) // File(s) destination
});

gulp.task('scripts', function() { // Task to run "scripts" methods
	gulp.src('app/js/*.js') // File(s) source
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest('public/js')) // File(s) destination
});

gulp.task('watch', function() {
	gulp.watch('app/index.html', ['views']);
	gulp.watch('app/css/*.css', ['styles']);
	gulp.watch('app/js/*.js', ['scripts']);
})

gulp.task('default', ['views', 'styles', 'scripts', 'watch']);