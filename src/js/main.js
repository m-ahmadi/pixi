var baseRoot = "192.168.10.13:3000", t;
var DEBUG = true;

const BASE_URL = "js/";
require.config({
	baseUrl: BASE_URL,
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