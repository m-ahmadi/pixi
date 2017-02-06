define(['./page', 'map/mediator'], function (page, map) {
	var inst = {};
	
	
	function init() {
		page.addEvt( map.init );
	}
	
	inst.init = init;
	
	return inst;
});