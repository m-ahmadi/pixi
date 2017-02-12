define(['page', 'map'], function (page, map) {
	var inst = {};
	
	function init() {
		page.init();
		map.init();
	}
	
	inst.init = init;
	return inst;
});