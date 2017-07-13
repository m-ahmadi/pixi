require.config({
	baseUrl: "js/"
});

require(["./page"], function (page: any) {
	page.beforeReady();
	
	$(function () {
		
		page.onReady();
		
	});
});