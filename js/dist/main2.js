var baseRoot = '192.168.10.13:3000',
    t;

require.config({
	baseUrl: 'js/'

});

require(['wpix'], function (wpix) {
	console.log(wpix);
	t = wpix;

	$(function () {

		wpix.init();
	});
});