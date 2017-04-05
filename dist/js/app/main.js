var baseRoot = "192.168.10.13:3000"; 
var DEBUG = true;

require.config({
	baseUrl: "js/app",
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