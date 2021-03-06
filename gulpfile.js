const gulp = require("gulp");
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// watching templates
const shell = require("gulp-shell");
const p = "handlebars ./src/templates/partial/ -f ./dist/lib/partials.js -p -e hbs -m -o";
const t = "handlebars ./src/templates/template/ -f ./dist/lib/templates.js -e hbs -m -o";

gulp.task("part", shell.task([ p ]));
gulp.task("temp", shell.task([ t ]));

gulp.task("part-w", () => {
	gulp.start("part");
	gulp.watch("./src/templates/partial/**", ["part"]);
});
gulp.task("temp-w", () => {
	gulp.start("temp");
	gulp.watch("./src/templates/template/**", ["temp"]);
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// livereload
const livereload = require("gulp-livereload");
const h = "./dist/index.html";
const c = "./dist/css/**/*.css";
const j = "./dist/js/**/*.js";

gulp.task("live-html", () => {
	gulp.src(h)
		.pipe( livereload() );
});
gulp.task("live-css", () => {
	gulp.src(c)
		.pipe( livereload() );
});
gulp.task("live-js", () => {
	gulp.src(j)
		.pipe( livereload() );
});
gulp.task("live", () => {
	livereload.listen();
	
	gulp.watch(h, ["live-html"]);
	gulp.watch(c, ["live-css"]);
	gulp.watch(j, ["live-js"]);
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@