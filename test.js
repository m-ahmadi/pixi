const EXT = "hbs";
const APP = "src/js/app/";
const TEMPS = "src/template/dynamic/";

const glob = require("glob");
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const colors = require("colors/safe");

let files = glob.sync(`${APP}**/temps/**/*.${EXT}`);

files.forEach(i => {
	let filename = path.baseName(i);
	let t = fs.readFileSync(i, "utf-8");
	fs.writeFileSync(`${TEMPS}${filename}`);
});

shell.cd("node_modules/.bin");
let res = shell.exec(`handlebars ../../${TEMPS} > ../../${APP}templates.js -e ${EXT} -m`);
if (res.code !== 0) {
	console.log(colorst.red.bold("Could not compile the templates."));
}
console.log(
	colors.green.bold("Done.")
);