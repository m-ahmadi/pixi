var LIB = "js/lib/";
var LIBS_DEST_FILE = "js/lib/all-libs.js";
var list = [
	"jquery/jquery",
	"jquery/jquery-ui",
	"jquery/jquery.mousewheel",
	"nouislider",
//	"vis/vis",
	"vis/vis-network",
	"uikit/v3/uikit",
	"pixi/pixi",
	"ani/TweenLite",
	"socket.io",
	"handlebars",
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