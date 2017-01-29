var baseRoot = '192.168.10.13:3000', t;

require.config({
	baseUrl: 'js/'
	
});

require(['mediator', 'page'], function (mediator, page) {
	
	
	$(function () {
		
		page.onReady( mediator.init );
		
	});

});