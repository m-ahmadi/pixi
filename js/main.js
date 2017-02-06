var baseRoot = "192.168.10.13:3000", t;

require.config({
	baseUrl: "js/",
	paths: {
        "core": "core",
		"map": "map"
    }
});

require(["core/mediator"], function (core) {
	
	$(function () {
		core.init();
	});

});