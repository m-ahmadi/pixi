import pixiMap from "./pixiMap/main";
import visMap from "./visMap/mediator";

var inst: any = {},
	mapType = '',
	map:any = {};


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
		get: function () { return map.width; }
	},
	"height": {
		get: function () { return map.height; }
	},
	"resize": {
		get: function () { return map.resize; }
	},
	"setPosition": {
		get: function () { return map.setPosition; }
	},
	"clear": {
		get: function () { return map.clear; }
	},
	"getSubscribers": {
		get: function () { return map.getSubscribers; }
	},
	"subscribe": {
		get: function () { return map.subscribe; }
	},
	"publish": {
		get: function () { return map.publish; }
	},
	"on": {
		get: function () { return map.on; }
	},
	"emit": {
		get: function () { return map.emit; }
	},
	"updateNode": {
		get: function () { return map.updateNode; }
	},
	"show": {
		get: function () { return map.show; }
	},
	"hide": {
		get: function () { return map.hide; }
	},
	"toggle": {
		get: function () { return map.toggle; }
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

declare var window: any;
window.map = inst;

export default inst