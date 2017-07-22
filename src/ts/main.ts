var baseRoot = "192.168.10.13:3000", t;
var DEBUG = true;

require.config({
	baseUrl: "js/"
});

require(["./mediator"], function (page: any) {
	
	page.beforeReady();
	
	$(function () {
		
		page.onReady();
		
	});
});