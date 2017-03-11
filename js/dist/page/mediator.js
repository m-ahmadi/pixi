define(['./page', 'map/mediator'], function (page, map) {
	var inst = {};

	function init() {
		page.init(map.init, ['visMap', "#map_container"]); // visMap pixiMap
	}

	inst.init = init;

	return inst;
});
//# sourceMappingURL=mediator.js.map