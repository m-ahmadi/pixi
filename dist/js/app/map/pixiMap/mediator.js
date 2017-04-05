define(['./wpix', './tpl', './navigation', './popupManager', 'core/wuk', 'core/util', 'core/ajax'], function (wpix, tpl, navigation, popupManager, wuk, u, ajax) {
	var inst = {},
	    p = {};

	p.GLOBAL_BOUNDS = {
		X_1: -10000,
		X_2: 10000,
		Y_1: -6000,
		Y_2: 6000
	};
	p.data = {}; // unreversed for ajax data
	p.bounds = {}; // reversed to ease bound calculations
	p.width = 0;
	p.height = 0;
	p.counters = {
		xLeft: 0,
		xRight: 0,
		yUp: 0,
		yDown: 0
	};
	p.ajax;

	function movePopup(incX, incY) {
		var el = popupManager.activeBox,
		    pLeft,
		    pTop;

		if (el) {
			if (incX) {
				pLeft = parseInt(el.css('left'), 10);
				el.css('left', pLeft += incX);
			} else if (incY) {
				pTop = parseInt(el.css('top'), 10);
				el.css('top', pTop += incY);
			}
		}
	}
	function loadData(container) {
		container = container ? container : "viewport";
		var abort = p.ajax ? p.ajax.xhr.abort : undefined;

		if (abort) {
			abort();
		}

		p.ajax = ajax({
			data: p.data
		}).done(function (data) {
			wpix.clearContainer(container || "viewport");
			tpl.draw(data, container || "viewport", p.bounds);
		});
	}
	function pixiCallback(width, height) {
		var w = width,
		    h = height,
		    hW = w / 2,
		    hH = h / 2,
		    b = p.bounds,
		    d = p.data;
		p.width = w;
		p.height = h;

		// p.data.x1 = -hW;
		// p.data.x2 = w + hW;
		// p.data.y1 = -hH;
		// p.data.y2 = h + hH;

		d.x1 = -1000; // 0
		d.x2 = 2000; // w
		d.y1 = -500; // 0
		d.y2 = 900; // h

		// p.bounds.x1 = hW;
		// p.bounds.x2 = -hW;
		// p.bounds.y1 = hH;
		// p.bounds.y2 = -hH;

		b.xL = hW;
		b.xR = -hW;
		b.yU = hH;
		b.yD = -hH;

		console.log(p.bounds);
		console.log(p.data);

		// dataLoader.load(p.data);
		var xhr = ajax({
			data: p.data
		}).done(function (data) {
			// {url: "js/d.txt"}
			console.log(data);
			t = data;
			tpl.draw(data, "viewport");
		}).fail(function (a, b, c) {
			wuk.note.error('Request for initial draw has failed.');
		});
	}
	function panCallback(pos) {
		movePopup(pos);
		var x = Math.floor(pos.x),
		    y = Math.floor(pos.y),
		    b = p.bounds,
		    d = p.data,
		    w = p.width,
		    h = p.height,
		    hW = w / 2,
		    hH = h / 2,
		    c = p.counters,
		    odd = util.isNumOdd,
		    cnt;
		/*
  if (x >= b.xL) { // x1 512   x 0 1 2 3 4 5 6 7 8 9 (going left)
  	c.xLeft += 1;
  
  	
  	
  	b.xL += hW;
  	b.xR += hW;
  	
  	d.x1 -= hW;
  	d.x2 -= hW;
  	
  	console.log("salam");
  	
  	
  	if ( odd(c.xLeft) ) { // 
  		
  		console.log("first");
  		cnt = "xSec1";
  	} else if ( !odd(c.xLeft) ) {
  		
  		console.log("second");
  		cnt = "xSec2";
  	}
  	console.log(b);
  	console.log(d);
  	
  	loadData(cnt);
  }
  
  if (x <= b.xR) { // x2 -512 x -1 -2 -3 -4 -5 -6 -7 (going right)
  	
  	console.log("chetori");
  	b.xL -= hW;
  	b.xR -= hW;
  	
  	d.x1 += hW;
  	d.x2 += hW;
  	
  	console.log(b);
  	console.log(d);
  	loadData();
  }
  */
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		if (x >= b.xL) {
			// going left
			b.xL += hW;
			b.xR += hW;
			d.x1 -= hW;
			d.x2 -= hW;
			console.log("salam");
			console.log(b);
			console.log(d);
			loadData();
		}
		if (x <= b.xR) {
			// going right
			console.log("chetori");
			b.xL -= hW;
			b.xR -= hW;
			d.x1 += hW;
			d.x2 += hW;
			console.log(b);
			console.log(d);
			loadData();
		}

		if (y >= b.yU) {
			// going up
			b.yU += hH;
			b.yD += hH;
			d.y1 -= hH;
			d.y2 -= hH;
			console.log(b);
			console.log(d);
			loadData();
		}
		if (y <= b.yD) {
			// going down
			b.yU -= hH;
			b.yD -= hH;
			d.y1 += hH;
			d.y2 += hH;
			console.log(b);
			console.log(d);
			loadData();
		}

		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		/*
  if (x >= b.x1) { // x1 512   x 0 1 2 3 4 5 6 7 8 9 (going left)
  	console.log("salam");
  	b.x1 += hW;
  	b.x2 -= hW;
  	d.x1 -= hW;
  	d.x2 -= hW;
  	console.log(b);
  	console.log(d);
  	loadData();
  }
  
  if (x <= b.x2) { // x2 -512 x -1 -2 -3 -4 -5 -6 -7 (going right)
  	console.log("chetori");
  	b.x1 -= hW;
  	b.x2 += hW;
  	d.x1 += hW;
  	d.x2 += hW;
  	console.log(b);
  	console.log(d);
  	loadData();
  }
  
  if (y >= b.y1) { // y1 175   y1 10 20 30 (going up)
  	console.log("here");
  	b.y1 += hH;
  	b.y2 += hH;
  	d.y1 -= hH;
  	d.y2 += hH;
  	console.log(b);
  	console.log(d);
  	loadData();
  }
  
  if (y <= b.y2) { // y2 -175  y2 -10 -20 -30 (going down)
  	console.log("kitty");
  	b.y1 -= hH;
  	b.y2 -= hH;
  	d.y1 += hH;
  	d.y2 += hH;		
  	console.log(b);
  	console.log(d);
  	loadData();
  }
  */
		// console.log(Math.floor(x), Math.floor(y)); 
	}
	function zoomCallback(d) {
		var pos = d.pos,
		    x = pos.x,
		    y = pos.y,
		    b = p.bounds,
		    xL = b.xL,
		    xR = b.xR,
		    yU = b.yU,
		    yD = b.yD,
		    w = p.width,
		    h = p.height,
		    hW = w / 2,
		    hH = h / 2;

		// incX = aX > bX ? aX-bX : bX > aX ? bX-aX : undefined;
		// incY = aY > bY ? aY-bY : bY > aY ? bY-aY : undefined;
		// debugger;

		if (x >= xL) {
			b.xL = x + hW;
			b.xR = x - hW;

			console.log(b);
		}
		if (x <= xR) {}
		if (y >= yU) {}
		if (y <= yD) {}
		console.log(d.zoomIn);
		console.log(x, y);
	}
	function popup(e, d) {}
	function addCustomEvents() {
		// wpix.on("pan", panCallback);
		// wpix.on("zoom", zoomCallback);
		wpix.on('inboundPanX', function (dx) {
			movePopup(dx);
		});
		wpix.on('inboundPanY', function (dy) {
			movePopup(undefined, dy);
		});
		wpix.on('zoom', popup);
		/* wpix.on('panMouseDown', function () {
  	popupManager.hideActive();
  });
  wpix.on('panMouseUp', function () {
  	popupManager.showActive();
  }); */

		navigation.on("zoom", function () {
			console.log("zoom");
			wpix.zoom();
		});
		navigation.on("pan", function () {
			wpix.pan.pan(1, 1);
		});
	}
	function init(div) {
		wpix.init({
			containerDiv: div,
			callback: pixiCallback,
			panBounds: p.GLOBAL_BOUNDS
		});
		//core.init();
		//navigation.init();

		addCustomEvents();
	}

	inst.data = p.data;
	inst.bounds = p.bounds;

	// getters
	Object.defineProperties(inst, {
		"width": {
			get: function get() {
				return wpix.renderer.width;
			}
		},
		"height": {
			get: function get() {
				return wpix.renderer.height;
			}
		}
	});
	inst.draw = tpl.draw;
	inst.clear = tpl.clear;
	inst.resize = function (width, height) {
		wpix.renderer.resize(width, height);
	};
	inst.setPosition = function (x, y) {
		wpix.mainContainer.x = x;
		wpix.mainContainer.y = y;
	};
	inst.init = init;

	return inst;
});
//# sourceMappingURL=mediator.js.map