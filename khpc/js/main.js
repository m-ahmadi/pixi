requirejs.config({
	baseUrl: "js/"
	
});

require(['mediator', 'chart'], function (core, chart) {
	$(function () {
		core.init();
		chart.create();
		
	});
});