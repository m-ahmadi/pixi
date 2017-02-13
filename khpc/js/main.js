requirejs.config({
	baseUrl: "js/",
	paths: {
		jquery: "lib/jquery.min"
	}
	
});

require(['jquery', 'mediator'], function ($, core) {
	$(function () {
		core.init();
	});
});