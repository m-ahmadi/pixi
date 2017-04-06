const gulp = require("gulp");
const livereload = require("gulp-livereload");
const shell = require("gulp-shell");
const changed = require('gulp-changed');

const UP = "../../";

gulp.task("sass", shell.task([
	"sass src/sass/style.scss:dist/css/style.css"
]));
gulp.task("sass-watch", shell.task([
	"sass src/sass/style.scss:dist/css/style.css --watch"
]));
gulp.task("compile-js", shell.task([
	"cd node_modules/.bin/  &&  babel ../../src/js/app -d ../../dist/js/app -s"
]));
gulp.task("compile-js-watch", shell.task([
	"cd node_modules/.bin/  &&  babel ../../src/js/app -d ../../dist/js/app -s -w"
]));


gulp.task("compile-temps", shell.task([
	"cd node_modules/.bin/  &&  handlebars ../../src/template/dynamic/ > ../../src/js/app/templates.js -e hbs -m"
	// "npm run compile-temps"
]));
gulp.task("watch-temps", function () {
	livereload.listen();
	gulp.watch("src/template/dynamic/**", ["compile-temps"]);
});
gulp.task( "default", ["livereload"] );

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@