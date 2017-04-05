var baseRoot = "192.168.10.13:3000",
    t;
var DEBUG = true;

var BASE_URL = "js/app";
require.config({
	baseUrl: "/static/js/app",
	paths: {
		lib: "../lib"
	}
});

require(["./mediator"], function (page) {

	page.beforeReady();

	$(function () {

		page.onReady();
	});
});
//# sourceMappingURL=main.js.map