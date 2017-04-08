const DIR = "src/js/lib/";
const LIBS_DEST_FILE = "dist/js/lib/all-libs.js";

const concat = require("concat");

var list = [
	"jquery/jquery",
	"jquery/jquery-ui",
	"jquery/jquery.mousewheel",
	"nouislider",
//	"vis/vis",
	"vis/vis-network",
	"uikit/v3/uikit",
	"uikit/v3/uikit-icons",
	"pixi/pixi",
	"ani/TweenLite",
	"socket.io",
//	"handlebars",
	"handlebars.runtime"
	// "require"
];
function getLibs(min) { // default: not minified
	list.forEach(function (itm, idx, arr) {
		arr[idx] = LIB + itm + (min ? ".min" : "") + ".js";
	});
	// arr.push("js/main-built.js");
	console.log(list);
	return list;
}
getLibs.DEST_FILE = LIBS_DEST_FILE;

module.exports = getLibs;