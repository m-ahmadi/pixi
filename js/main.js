var baseRoot = "192.168.10.13:3000", t;

require.config({
	baseUrl: "js/",
	paths: {
		"lib": "lib",
        "core": "core",
		"map": "map"
    },
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		}
	}
});

require(["core/mediator"], function (core) {
	
	$(function () {
		core.init();
	});

});