var baseRoot = "192.168.10.13:3000", t;

require.config({
	baseUrl: "js/dist",
	paths: {
		lib: "lib",
        core: "core",
		map: "map",
		page: "page"
    }
});

require(["page/mediator", "map/mediator", "core/whb", "core/wuk"], function (page, map, whb, wuk) {
	whb.compileAll();
	
	$(function () {
		wuk.init();
		page.init();
		map.init("visMap", "#map_container");
	});
});