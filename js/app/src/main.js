var util = require('./util'),
	coPubsub = require('./pubsub'),
	pixi = require('./pixi-wrap'),
	core = require('./core'),
	mediator = require('./mediator'),
	ready = require('./docrdy');

window.util = util;
window.coPubsub = coPubsub;
window.pixi = pixi;
window.core = core;
window.mediator = mediator;
window.ready = ready;

ready.define( mediator.init );