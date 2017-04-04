var baseRoot = "192.168.10.13:3000",
    t;

require.config({
	baseUrl: "/static/js/dist",
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