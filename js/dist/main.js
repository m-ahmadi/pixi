var baseRoot = "192.168.10.13:3000",
    t;

require.config({
	baseUrl: "js/src",
	paths: {
		lib: "lib",
		core: "core",
		map: "map"
	}
});

require(["core/mediator"], function (core) {

	$(function () {
		core.init();
	});
});
//# sourceMappingURL=main.js.map