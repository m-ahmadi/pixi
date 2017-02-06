var LIB = 'js/lib/';
var DEST_FILE = 'js/lib/all.js';
var list = [
	"jquery/jquery.min.js",
	"vis.min.js",
	"uikit/v3/uikit.min.js",
	"jquery/jquery-ui.min.js",
	"jquery/jquery.mousewheel.min.js",
	"pixi/pixi.min.js",
	"ani/TweenLite.min.js",
	"socket.io.min.js",
	"handlebars.min.js",
];

list.forEach(function (itm, idx, arr) {
	arr[idx] = LIB + itm;
});

module.exports = {
	list: list,
	dest: DEST_FILE
};