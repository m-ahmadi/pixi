const gulp = require("gulp");
const livereload = require("gulp-livereload");
const shell = require("gulp-shell");
const changed = require('gulp-changed');

const UP = "../../";

gulp.task("compile-temps", shell.task([
	"cd node_modules/.bin/  &&  handlebars ../../src/template/dynamic/ > ../../src/js/app/templates.js -e hbs -m"
	// "npm run compile-temps"
]));

gulp.task("compile-js", shell.task([
	"cd node_modules/.bin/  &&  babel ../../src/js/app -d ../../dist/js/app -s"
]));

gulp.task( "default", ["watch-live"] );

gulp.task("watch-temps", function () {
	livereload.listen();
	gulp.watch("src/template/dynamic/**", ["compile-temps"]);
});

gulp.task("live-html", function () {
	gulp.src("dist/index.html")
		.pipe( livereload() );
});
gulp.task("live-css", function () {
	gulp.src("dist/css/**/*.css")
		.pipe( changed("dist/css/") )
		.pipe( livereload() );
});
gulp.task("live-js", function () {
	gulp.src("dist/js/app/**/*.js")
		.pipe( changed("dist/js/app/") )
		.pipe( livereload() );
});
gulp.task("watch-live", function () {
	livereload.listen();
	
	gulp.watch("dist/index.html", ["live-html"]);
	gulp.watch("dist/css/**/*", ["live-css"]);
	gulp.watch("dist/js/app/**/*", ["live-js"]);
});