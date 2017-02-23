
define(['./page', 'map/mediator'], function (page, map) {
	var inst = {};
	
	
	function init() {
		page.addEvt( map.init, ['pixiMap', "#map_container"] );
	}
	
	inst.init = init;
	
	return inst;
});