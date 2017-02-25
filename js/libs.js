var LIB = "js/lib/";
var LIBS_DEST_FILE = "js/lib/all-libs.js";
var list = [
	"jquery/jquery",
	"jquery/jquery-ui",
	"jquery/jquery.mousewheel",
	"vis/vis",
	"uikit/v3/uikit",
	"pixi/pixi",
	"ani/TweenLite",
	"socket.io",
	"handlebars"
	// "require"
];
function getLibs(min) { // default: not minified
	var arr = list;
	arr.forEach(function (itm, idx, arr) {
		arr[idx] = LIB + itm + (min ? ".min" : "") + ".js";
	});
	// arr.push("js/main-built.js");
	console.log(arr);
	return arr;
}
getLibs.DEST_FILE = LIBS_DEST_FILE;

module.exports = getLibs;