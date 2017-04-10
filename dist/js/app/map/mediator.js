define([/* './pixiMap/mediator',  */'./visMap/mediator', 'core/util'], function ( /* pixiMap,  */visMap, u) {
	var inst = {},
	    mapType = '',
	    map = {};

	function init(type, conf) {
		mapType = type;
		if (type === 'pixiMap') {
			map = pixiMap;
		} else if (type === 'visMap') {
			map = visMap;
		}
		map.init(conf);
	}

	Object.defineProperties(inst, {
		"width": {
			get: function get() {
				return map.width;
			}
		},
		"height": {
			get: function get() {
				return map.height;
			}
		},
		"resize": {
			get: function get() {
				return map.resize;
			}
		},
		"setPosition": {
			get: function get() {
				return map.setPosition;
			}
		},
		"clear": {
			get: function get() {
				return map.clear;
			}
		},
		"getSubscribers": {
			get: function get() {
				return map.getSubscribers;
			}
		},
		"subscribe": {
			get: function get() {
				return map.subscribe;
			}
		},
		"publish": {
			get: function get() {
				return map.publish;
			}
		},
		"on": {
			get: function get() {
				return map.on;
			}
		},
		"emit": {
			get: function get() {
				return map.emit;
			}
		},
		"updateNode": {
			get: function get() {
				return map.updateNode;
			}
		}
	});
	inst.draw = function (a, b, c, d, e) {
		if (mapType === 'pixiMap') {
			map.draw(a, b, c, d, e);
		} else if (mapType === 'visMap') {
			map.draw(a);
		}
	};
	inst.init = init;

	window.map = inst;
	return inst;
});
//# sourceMappingURL=mediator.js.map