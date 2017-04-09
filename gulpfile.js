const gulp = require("gulp");
const livereload = require("gulp-livereload");
const shell = require("gulp-shell");
const changed = require('gulp-changed');

const SRC_APP = "src/js/app";
const DIST_APP = "dist/js/app";
const SASS = "src/sass/";
const CSS = "dist/css/";
const TEMP = "src/template/";

gulp.task("compile-sass", shell.task([
	`sass ${SASS}style.scss : ${CSS}css/style.css`
]));
gulp.task("compile-sass-watch", shell.task([
	`sass ${SASS}style.scss:${CSS}style.css --watch`
]));
gulp.task("compile-temp", shell.task([
	`handlebars ${TEMP} -f ${DIST_APP}/templates.js -e hbs -m`
]));
gulp.task("compile-temp-watch", function () {
	livereload.listen();
	gulp.watch(`${TEMP}**`, ["compile-temp"]);
});
gulp.task("compile-js", shell.task([
	`babel ${SRC_APP} -d ${DIST_APP} -s`
]));
gulp.task("compile-js-watch", shell.task([
	`babel ${SRC_APP} -d ${DIST_APP} -s -w`
]));

gulp.task( "default", ["livereload"] );
gulp.task( "default", ["livereload"] );

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// livereload
gulp.task("live-html", function () {
	gulp.src("dist/index.html")
		.pipe( livereload() );
});
gulp.task("live-css", function () {
	gulp.src("dist/css/**/*.css")
	//	.pipe( changed("dist/css/") )
		.pipe( livereload() );
});
gulp.task("live-js", function () {
	gulp.src("dist/js/app/**/*.js")
	//	.pipe( changed("dist/js/app/") )
		.pipe( livereload() );
});
gulp.task("livereload", function () {
	livereload.listen();
	
	gulp.watch("dist/index.html", ["live-html"]);
	gulp.watch("dist/css/**/*", ["live-css"]);
	gulp.watch("dist/js/app/**/*", ["live-js"]);
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@