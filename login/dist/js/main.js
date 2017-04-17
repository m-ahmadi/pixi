require.config({
	baseUrl: "js/",
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