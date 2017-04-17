const CONF = require("./build/config");
const gulp = require("gulp");
const shell = require("gulp-shell");

gulp.task("html", shell.task([ CONF.C.html ]));
gulp.task("sass", shell.task([ CONF.C.sass ]));
gulp.task("temp", shell.task([ CONF.C.temp ]));
gulp.task("js", shell.task([ CONF.C.js ]));
gulp.task("all", shell.task( [CONF.C.all] ));

gulp.task("html-w", shell.task([ CONF.C.w.html ]));
gulp.task("sass-w", shell.task([ CONF.C.w.sass ]));
gulp.task("temp-w", () => {
	gulp.watch(`${CONF.I.TEMP}/**`, ["temp"]);
});
gulp.task("js-w", shell.task([ CONF.C.w.js ]));

gulp.task( "default", ["all"] );
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// livereload
const livereload = require("gulp-livereload");
const changed = require('gulp-changed');

gulp.task("live-html", () => {
	gulp.src("dist/index.html")
		.pipe( livereload() );
});
gulp.task("live-css", () => {
	gulp.src("dist/css/**/*.css")
	//	.pipe( changed("dist/css/") )
		.pipe( livereload() );
});
gulp.task("live-js", () => {
	gulp.src("dist/js/**/*.js")
	//	.pipe( changed("dist/js/") )
		.pipe( livereload() );
});
gulp.task("livereload", () => {
	livereload.listen();
	
	gulp.watch("dist/index.html", ["live-html"]);
	gulp.watch("dist/css/**/*", ["live-css"]);
	gulp.watch("dist/js/**/*", ["live-js"]);
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@