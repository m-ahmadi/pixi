var baseRoot = "192.168.10.13:3000", t;
var DEBUG = true;

require.config({
	baseUrl: "js/",
	paths: {
		lib: "lib"
	}
});

require(["./mediator"], function (page) {
	
	page.beforeReady();
	
	$(function () {
		
		page.onReady();
		
	});
});