requirejs.config({
	baseUrl: "js/",
	paths: {
		lib: "lib"
	}
	
});

require(['lib/jquery', 'mediator'], function ($, core) {
	$(function () {
		core.init();
	});
});