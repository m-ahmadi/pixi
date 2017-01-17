import util from '../util';

import wpix from '../wpix';
import tpl from '../tpl';
import navigation from '../navigation';
import ajax from '../ajax';


declare var window: any;

var mediator = (function () {
	var inst: any = {},
		p: any = {};
	
	p.GLOBAL_BOUNDS = {
		X_1: -10000,
		X_2: 10000,
		Y_1: -6000,
		Y_2: 6000
	};
	p.data = {};    // unreversed for ajax data
	p.bounds = {};  // reversed to ease bound calculations
	p.width = 0;
	p.height = 0;
	p.counters = {
		xLeft:  0,
		xRight: 0,
		yUp:    0,
		yDown:  0
	};
	p.ajax;
	
	function loadData(container?: string) {
		container = container ? container : "viewport";
		var abort = p.ajax ? p.ajax.xhr.abort : undefined;
		
		if (abort) {
			abort();
		}
		
		p.ajax = ajax({
			data: p.data
		})
		.done(function (data) {
			wpix.clearContainer(container || "viewport");
			tpl.draw(data, container || "viewport", p.bounds);
		});
	}
	function wpixCallback(width, height) {
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
		
		d.x1 = 0;
		d.x2 = w;
		d.y1 = 0;
		d.y2 = h;
		
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
		ajax({
			data: p.data
		})
		.done(function ( data ) { // {url: "js/d.txt"}
			console.log(data);
			window.t = data;
			tpl.draw(data, "viewport");
		});
	}
	function panCallback(pos) {
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
		if (x >= b.xL) { // going left
			b.xL += hW;
			b.xR += hW;
			d.x1 -= hW;
			d.x2 -= hW;
			console.log("salam");
			console.log(b);
			console.log(d);
			loadData();
		}
		if (x <= b.xR) { // going right
			console.log("chetori");
			b.xL -= hW;
			b.xR -= hW;
			d.x1 += hW;
			d.x2 += hW;
			console.log(b);
			console.log(d);
			loadData();
		}
		
		if (y >= b.yU) { // going up
			b.yU += hH;
			b.yD += hH;
			d.y1 -= hH;
			d.y2 -= hH;
			console.log(b);
			console.log(d);
			loadData();
		}
		if (y <= b.yD) { // going down
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
			b.xL = x+hW;
			b.xR = x-hW;
			
			console.log(b);
		}
		if (x <= xR) {
			
		}
		if (y >= yU) {
			
		}
		if (y <= yD) {
			
		}
		console.log(d.zoomIn);
		console.log(x, y);
		
	}
	function addCustomEvents() {
		
		wpix.on("pan", panCallback);
		wpix.on("zoom", zoomCallback);
		
		navigation.on("zoom", function () {
			console.log("zoom");
			wpix.zoom();
		});
		navigation.on("pan", function () {
			wpix.pan.pan(1, 1);
		});
	}
	function init() {
		wpix.init(wpixCallback, p.GLOBAL_BOUNDS);
		//core.init();
		//navigation.init();
		
		// addCustomEvents();
	}
	
	
	inst.data = p.data;
	inst.bounds = p.bounds;
	inst.init = init;
	
	return inst;
}());

export default mediator