/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
if (typeof Object.create !== 'function') {
	Object.create = function (o) {
		function F() {}
		F.prototype = o;
		return new F();
	};
}
if (typeof Object.keys !== 'function') {
	Object.keys = function (o) {
		var keys = [],
			k;
		for (k in o) {
			if ( o.hasOwnProperty(k) ) {
				keys.push(k);
			}
		}
		return keys;
	};
}
var util = (function () {
	function isObj(v) {
		return (
			v &&
			typeof v === 'object' &&
			typeof v !== null &&
			Object.prototype.toString.call(v) === '[object Object]'
		) ? true : false;
	}
	function isArr(v) {
		if ( typeof Array.isArray === 'function' ) {
			return Array.isArray(v);
		} else {
			return (
				v &&
				typeof v === 'object' &&
				typeof v.length === 'number' &&
				typeof v.splice === 'function' &&
				!v.propertyIsEnumerable('length') &&
				Object.prototype.toString.call(v) === '[object Array]'
			) ? true : false;
		}
	}
	function getArgs(a) {
		var args = new Array(a.length),
			i;
		for (i=0; i<args.length; i+=1) {
			args[i] = a[i];
		}
		return args;
	}
	function moveArrItem(a, f, t) { // array, from, to
		a.splice( t, 0, a.splice(f, 1)[0] );
	}
	function isInt(n) {
		return isNum(n)  &&  n % 1 === 0;
	}
	function negateNum(n) {
		return isNum(n) ? Math.abs(n) * -1 : undefined;
	}
	function positNum(n) {
		return isNum(n) ? Math.abs(n) : undefined;
	}
	function reverseNumSign(n) {
		if ( isNum(n) ) {
			if (n > 0) {
				return negateNum(n);
			} else if (n < 0) {
				return positNum(n);
			}
		}
	}
	function isNumOdd(n) {
		return isNum(n)  &&  (n % 2) ? true : false;
	}
	function randInt(min, max) { // default between 0 and 1
		min = min ? Math.ceil(min) : 0;
		max = max ? Math.floor(max) : 2;
		return Math.floor(Math.random() * (max - min)) + min;
	}
	function randFloat(min, max) {
		min = min ? min : 0;
		max = max ? max : 1;
		return Math.random() * (max - min) + min;
	}
	function toDecimalPlace(n, p) {
		return isNum(n) ? parseFloat( n.toFixed(p) ) : undefined;
	}
	function isEmptyObj(o) {
		var k;
		if ( isObj(o) ) {
			if ( typeof Object.getOwnPropertyNames === 'function' ) {
				return Object.getOwnPropertyNames(o).length === 0; // ES5
			} else {
				for ( k in o ) { 
					if (  o.hasOwnProperty( k )  ) {
						return false;
					}
				}
				return true;
			}
		}
	}
	function isFunc(v) {
		return typeof v === 'function';
	}
	function isStr(v) {
		return typeof v === 'string';
	}
	function isNum(v) {
		return typeof v === 'number';
	}
	function isBool(v) {
		return typeof v === 'boolean';
	}
	function isEmptyStr(v) {
		return typeof v === 'string'  &&  v.length === 0;
	}
	function objLength(o) {
		if ( isObj(o) ) {
			return Object.keys(o).length;
		}
	}
	function extend() {
		var args = Array.prototype.slice.call(arguments),
			len = args.length,
			arr = [],
			objects = [],
			first, last,
			result;
			
		if (len === 1) {
			first = args[0];
			if ( isArr(first)  &&  first.length > 1 ) {
				last = first.pop();
				objects = first;
			} else if ( isObj(first) ){
				result = Object.create(first);
			}
		} else if (len === 2) {
			first = args[0];
			last = args[len-1];
			if ( isObj(first) ) {
				result = Object.create(first);
			}
		} else if (len > 2) {
			last = args.pop();
			objects = args;
		}
		
		if (objects.length !== 0) {
			arr.push( {} );
			objects.forEach(function (el, i) {
				if ( isObj(el) ) {
					Object.keys(el).forEach(function (k) {
						arr[i][k] = el[k];
					});
					arr.push( Object.create(arr[i]) );
				}
			});
			result = arr[arr.length-1];
		}
		
		if ( last && isObj(last) ) {
			Object.keys(last).forEach(function(key) {
				result[key] = last[key];
			});
		}
		return result;
	}
	function getCommentsInside(selector) {
		return $(selector).contents().filter( function () { return this.nodeType == 8; } );
	}
	
	return {
		isObj: isObj,
		isArr: isArr,
		getArgs: getArgs,
		moveArrItem: moveArrItem,
		isInt: isInt,
		negateNum: negateNum,
		positNum: positNum,
		reverseNumSign: reverseNumSign,
		isNumOdd: isNumOdd,
		randInt: randInt,
		randFloat: randFloat,
		toDecimalPlace: toDecimalPlace,
		isEmptyObj: isEmptyObj,
		isFunc: isFunc,
		isStr: isStr,
		isNum: isNum,
		isEmptyStr: isEmptyStr,
		objLength: objLength,
		extend: extend,
		getCommentsInside: getCommentsInside,
	};
}());

/* harmony default export */ exports["a"] = util;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pubsub__ = __webpack_require__(2);



var inst = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].extend( __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__pubsub__["a" /* default */])() ),
	p = {};

p.renderer = {};
p.stage = {};
p.mainContainer = {};

p.viewport = {};
p.xSec1 = {};
p.xSec2 = {};
p.ySec1 = {};
p.ySec2 = {};

p.textures = {};
p.zoomDisabled = false;

function init(callback, panBounds, background) {
	var r;
	
	pan.setBounds(panBounds);
	PIXI.utils.skipHello();
	p.renderer = PIXI.autoDetectRenderer(
		window.innerWidth,
		window.innerHeight,
		{
			backgroundColor: background || 0xAB9988, // 0xAB9999,
			antialias: true,
	//		resolution: false,
	//		transparent: false,
	//		preserveDrawingBuffer: false,
	//		view: HTMLCanvasElement
		}
	//	noWebGL: false,                    // optional
	);
	r = p.renderer;
	
	// document.body.appendChild( p.renderer.view );
	$("#contents").append( p.renderer.view );
	p.stage = new PIXI.Container();
	p.mainContainer = new PIXI.Container();
	
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	//p.stage.buttonMode = true;
	p.mainContainer.interactive = true;
	p.mainContainer.hitArea = new PIXI.Rectangle( -100000, -100000, r.width / r.resolution * 100000, r.height / r.resolution *100000 );
	pan.add( p.mainContainer );
		
	$(document).on("mousewheel", function (e) {
		var zoomIn, mcPos, prevPos;
		// e.deltaX, e.deltaY, e.deltaFactor
		// zoom(e.pageX, e.pageY, e.deltaY > 0);
		// zoom(e);
		if (!p.zoomDisabled) {
			zoomIn = e.deltaY > 0,
			mcPos = p.mainContainer.position,
			prevPos = {x: mcPos.x, y: mcPos.y};
			
			zoom(e.pageX, e.pageY, zoomIn);
			
			inst.publish("zoom", {
				zoomIn: zoomIn,
				pos: mcPos
			});
		}
	});
	createContainers();
	p.stage.addChild( p.mainContainer );
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	requestAnimationFrame( animate );
	p.renderer.render( p.stage );
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	/* var basePath = "images/raw/edited/",
	images = [
		"computer", "gamepad", "hard-drive", "imac-blue",
		"imac-grey", "imac-red", "ipad", "iphone", "macbook",
		"macintosh", "monitor", "playstation", "smartphone",
		"smart-tv", "smartwatch", "tv-screen", "video-card", "xbox"
	];
	images.forEach(function (i) {
		var imgTrans = basePath+i+"-trans.png",
			imgFill = basePath+i+"-fill.png";
		PIXI.loader.add( imgTrans );
		PIXI.loader.add( imgFill );
	});
	PIXI.loader.load(); */
	
	PIXI.loader.add( "images/computer.png" );
	PIXI.loader.add( "images/hard.png" );
	PIXI.loader.add( "images/atlas-0.json" );
	PIXI.loader.load(function () {
		p.textures = PIXI.loader.resources["images/atlas-0.json"].textures;
		callback(r.width, r.height);
	});
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	inst.publish("init");
}

function disableZoom(v) {
	p.zoomDisabled = v;
}
function createContainers() {
	var viewport, xSec1, xSec2, ySec1, ySec2,
		main = p.mainContainer;
	
	viewport = new PIXI.Container();
	xSec1    = new PIXI.Container();
	xSec2    = new PIXI.Container();
	ySec1    = new PIXI.Container();
	ySec2    = new PIXI.Container();
	
	add( viewport );
	add( xSec1    );
	add( xSec2   );
	add( ySec1     );
	add( ySec2    );
	
	main.addChild( viewport );
	main.addChild( xSec1    );
	main.addChild( xSec2   );
	main.addChild( ySec1     );
	main.addChild( ySec2    );
	
	p.viewport = viewport;
	p.xSec1    = xSec1;
	p.xSec2    = xSec2;
	p.ySec1    = ySec1;
	p.ySec2    = ySec2;
}
function add(el) {
	var lineContainer = new PIXI.Container(),
		nodeContainer = new PIXI.Container();
	el.addChild(lineContainer);
	el.addChild(nodeContainer);
}
function clearContainer(k) {
	var r = p[k];
	r.children[0].destroy(true); // lineContainer
	r.children[0].destroy();     // nodeContainer
	add(r);
}
function addChild(k, str, child) {
	var i;
	if (str === "lineContainer") {
		i = 0;
	} else if (str === "nodeContainer") {
		i = 1;
	}
	p[k].children[i].addChild(child);
}
function animate() {
	requestAnimationFrame(animate);
	//tink.update();
	//TWEEN.update();
	p.renderer.render(p.stage);
}
function coPoint(x, y) {
	return new PIXI.Point(x, y);
}
function zoom(x, y, zoomIn) {
	var direction = (zoomIn) ? 1 : -1,
		factor = (1 + direction * 0.1),
		local_pt = new PIXI.Point(),
		point = new PIXI.Point(x, y),
		mainContainer = p.mainContainer;
	
	PIXI.interaction.InteractionData.prototype.getLocalPosition(mainContainer, local_pt, point);
	
	mainContainer.scale.x *= factor;
	mainContainer.scale.y *= factor;
	mainContainer.pivot = local_pt;
	mainContainer.position = point;
}
var pan = (function () {
	var isDragging = false,
		prevX,
		prevY,
		bounds = {};
	
	function down(e) {
		isDragging = true;
		//downX = e.data.global.x;
		//downY = e.data.global.y;
		
		var pos = e.data.global;
		prevX = pos.x;
		prevY = pos.y;
		isDragging = true;
	}
	function move(e) {
		if ( !isDragging ) { return; }
		var pos = e.data.global,
			dx = pos.x - prevX,
			dy = pos.y - prevY,
			mcX = p.mainContainer.position.x,
			mcY = p.mainContainer.position.y,
			bX1 = bounds.x1,
			bX2 = bounds.x2,
			bY1 = bounds.y1,
			bY2 = bounds.y2,
			negate = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].negateNum,
			posit = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].positNum;
		
		if (mcX <= bX1    &&    mcX >= bX2) {
			p.mainContainer.position.x += dx;
		} else {
			p.mainContainer.position.x = mcX > 0 ? bX1 : mcX < 0 ? bX2 : undefined;
		}
		
		if (mcY <= bY1    &&    mcY >= bY2) {
			p.mainContainer.position.y += dy;
		} else {
			p.mainContainer.position.y = mcY > 0 ? bY1 : mcY < 0 ? bY2 : undefined;
		}
		
		
		
		prevX = pos.x;
		prevY = pos.y;
		
		inst.publish("pan", p.mainContainer.position);
	}
	function up() {
		isDragging= false;
	}
	function pan(x, y) {
		if ( x  &&  y ) {
			p.mainContainer.position.x += x;
			p.mainContainer.position.y += y;
		}
	}
	function add(el) {
		el
			.on("mousedown", down)
			.on("touchstart", down)
			.on("mouseup", up)
			.on("mouseupoutside", up)
			.on("touchend", up)
			.on("touchendoutside", up)
			.on("mousemove", move)
			.on("touchmove", move);
	}
	function setBounds(o) {
		var posit = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].positNum,
			negate = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].negateNum;
			
		// changing bound signs for easier calculation later.
		bounds.x1 = posit(o.X_1);
		bounds.x2 = negate(o.X_2);
		bounds.y1 = posit(o.Y_1);
		bounds.y2 = negate(o.Y_2);
	}
	
	return {
		get: function () { return bounds; },
		setBounds: setBounds,
		pan: pan,
		add: add
	};
}());
var addDragDrop = (function () {
	function down(e) {
		e.stopPropagation();
		this.data = e.data;
		this.alpha = 0.5;
		this.dragging = true;
		this.dragPoint = e.data.getLocalPosition(this.parent);
		this.dragPoint.x -= this.position.x;
		this.dragPoint.y -= this.position.y;
		
		bringToFront(this);
	}
	function up() {
		this.alpha = 1;
		this.dragging = false;
		this.data = null;
		
		if ( this.TPL_Stuff  &&  this.TPL_Stuff.links ) {
			core.adjustLines(this);
		}
	}
	function move() {
		if ( this.dragging ) {
			var newPosition = this.data.getLocalPosition(this.parent);
			this.position.x = newPosition.x - this.dragPoint.x;
			this.position.y = newPosition.y - this.dragPoint.y;
		}
	}
	
	function add(el) {
		el
			.on("mousedown", down) 
			.on("touchstart", down)
			.on("mouseup", up)
			.on("mouseupoutside", up)
			.on("touchend", up)
			.on("touchendoutside", up)
			.on("mousemove", move)
			.on("touchmove", move);
	}
	
	
	return add;
}());
function create2pointLine(conf) {
	conf = conf ? conf : {};
	
	var line,
		start,
		end,
		lineWidth,
		color,
		p;
	
	function setThings() {
		start     =  conf.start     ||  {x: 0, y: 0};
		end       =  conf.end       ||  {x: 0, y: 0};
		lineWidth =  conf.lineWidth ||  2;
		color     =  conf.color     ||  0x000000;
		p = calcPoints(start, end, lineWidth);
	}
	function setStart(s) {
		if (s) {
			start = s;
		}
	}
	function setEnd(e) {
		if (e) {
			end = e;
		}
	}
	function setLineWidth(w) {
		if (w) {
			lineWidth = w;
		}
	}
	function setColor(c) {
		if (c) {
			color = c;
		}
	}
	function down(e) {
		e.stopPropagation();
		this.alpha = 0.5;
	}
	function up() {
		this.alpha = 1;
	}
	function move() {
		//console.log("move");
	}
	function addEvents() {
		line
			.on("mousedown", down) 
			.on("touchstart", down)
			.on("mouseup", up)
			.on("mouseupoutside", up)
			.on("touchend", up)
			.on("touchendoutside", up)
			.on("mousemove", move)
			.on("touchmove", move);
	}
	function toggleDirties() {
		var dirty = line.dirty,
			clearDirty = line.clearDirty;
		
		dirty = (dirty) ? false : true;
		clearDirty = (clearDirty) ? false : true;
	}
	function calcPoints() {
		var half = lineWidth / 2,
			sLeft = {},
			sRight = {},
			eRight = {},
			eLeft = {},
			sX = start.x,
			sY = start.y,
			eX = end.x,
			eY = end.y,
			results = {};

		if ( (sX < eX  &&  sY < eY)  || // topLeft to bottRight
				(sX > eX  &&  sY > eY) ) { // bottRight to topLeft
			sLeft = new PIXI.Point( sX-half, sY+half );
			sRight = new PIXI.Point( sX+half, sY-half );
			eRight = new PIXI.Point( eX+half, eY-half );
			eLeft = new PIXI.Point( eX-half, eY+half );
		} else if ( (sX > eX  &&  sY < eY) || // topRight to bottLeft
				(sX < eX  &&  sY > eY) ) { // bottLeft to topRight
			sLeft = new PIXI.Point( sX-half, sY-half );
			sRight = new PIXI.Point( sX+half, sY+half );
			eRight = new PIXI.Point( eX+half, eY+half );
			eLeft = new PIXI.Point( eX-half, eY-half );
		} else if ( sX === eX  &&
				(sY > eY  ||  sY < eY) ) { // vertical
			sLeft = new PIXI.Point( sX-half, sY );
			sRight = new PIXI.Point( sX+half, sY);
			eRight = new PIXI.Point( eX+half, eY );
			eLeft = new PIXI.Point( eX-half, eY );
			
		} else if ( sY === eY  &&
				(sX < eX  ||  sX > eX) ) { // horizontal
			sLeft = new PIXI.Point( sX, sY+half );
			sRight = new PIXI.Point( sX, sY-half );
			eRight = new PIXI.Point( eX, eY-half );
			eLeft = new PIXI.Point( eX, eY+half );
		}
		
		results.sLeft = sLeft;
		results.sRight = sRight;
		results.eRight = eRight;
		results.eLeft = eLeft;
		
		return results;
	}
	function changeColor(c) {
		setColor(c);
		line.clear();
		draw();
		toggleDirties();
	}
	function changePoints(s, e) {
		setStart(s);
		setEnd(e);
		p = calcPoints(start, end, lineWidth);
		line.clear();
		draw();
		toggleDirties();
	}
	function draw() {
		line.beginFill( color );
		line.moveTo( p.sLeft.x, p.sLeft.y );
		line.lineTo( p.sRight.x, p.sRight.y );
		line.lineTo( p.eRight.x, p.eRight.y );
		line.lineTo( p.eLeft.x, p.eLeft.y );
		line.endFill();
	}
	function createElement() {
		var line;
		
		line = new PIXI.Graphics();
		line.interactive = true;
		line.buttonMode = true;
		line.lineStyle(0);
		
		return line;
	}
	function create() {
		line = createElement();
		addEvents( line );
		draw();
	}
	
	setThings();
	create();
	line.changePoints = changePoints;
	line.changeColor = changeColor;
	Object.defineProperty(line, "points", {
		get: function () { return {start: start, end: end}; }
	});
	
	return line;
}
function create3pointLine(conf) {
	conf = conf ? conf : {};
	var line,
		start, end, ctrl,
		color, width,
		curveLevel, curveSide;
	
	function setThings() {
		start      = conf.start      || {x: 50 , y: 50};
		end        = conf.end        || {x: 600, y: 200};
		color      = conf.color      || 0x000000;
		width      = conf.width      || 2;
		curveLevel = conf.curveLevel || 0;
		curveSide  = conf.curveSide  || false; // true top, false down
		ctrl       = calcBetween(start, end);
	}
	function setStart(s) {
		if (s) {
			start = s;
		}
	}
	function setEnd(e) {
		if (e) {
			end = e;
		}
	}
	function setWidth(w) {
		if (w) {
			width = w;
		}
	}
	function setColor(c) {
		if (c) {
			color = c;
		}
	}
	function calcBetween(s, e) {
		var sX = s.x,
			sY = s.y,
			eX = e.x,
			eY = e.y,
			diffX, diffY,
			hX, hY;
			
		if (sX > eX) {
			diffX = sX - eX;
			hX = sX - (diffX / 2);
		} else if (sX < eX) {
			diffX = eX - sX;
			hX = sX + (diffX / 2);
		} else if (sX === eX) {
			hX = sX || eX;
		}
		
		if (sY > eY) {
			diffY = sY - eY;
			hY = sY - (diffY / 2);
		} else if (sY < eY) {
			diffY = eY + sY;
			hY = sY + (diffY / 2);
		} else if (sY === eY) {
			hY = sY || eY;
		}

		//debugger;
		return {
			x: hX,
			y: hY
		};
	}
	function changeColor(c) {
		setColor(c);
		line.clear();
		draw();
		toggleDirties();
	}
	function toggleDirties() {
		var dirty = line.dirty,
			clearDirty = line.clearDirty;
		
		dirty = (dirty) ? false : true;
		clearDirty = (clearDirty) ? false : true;
	}
	function incCurve() {
		var sX = start.x,
			sY = start.y,
			eX = end.x,
			eY = end.y,
			incX = 0,
			incY = 0,
			unit = 5;
		
		if ( (sX < eX  &&  sY < eY)  || // topLeft to bottRight
				(sX > eX  &&  sY > eY) ) { // bottRight to topLeft
			incX = curveSide ? unit : -unit;
			incY = curveSide ? -unit : unit;
		} else if ( (sX > eX  &&  sY < eY) || // topRight to bottLeft
				(sX < eX  &&  sY > eY) ) { // bottLeft to topRight
			incX = curveSide ? -unit : unit;
			incY = curveSide ? -unit : unit;
		} else if ( sX === eX  &&
				(sY > eY  ||  sY < eY) ) { // vertical
			incX = curveSide ? -unit : unit;
		} else if ( sY === eY  &&
				(sX < eX  ||  sX > eX) ) { // horizontal
			incY = curveSide ? -unit : unit;
		}
		
		ctrl.x += incX * curveLevel;
		ctrl.y += incY * curveLevel;
	}
	function changePoints(s, e) {
		setStart(s);
		setEnd(e);
		ctrl = calcBetween(start, end);
		line.clear();
		if (curveLevel) {
			incCurve();
		}
		draw();
		toggleDirties();
	}
	function draw() {
		line.lineStyle(width, color, 1);
		line.moveTo(start.x, start.y);
		line.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y);
	}
	function create() {
		line = new PIXI.Graphics();
		line.interactive = true;
		line.buttonMode = true;
	}
	
	setThings();
	create();
	if (curveLevel) {
		incCurve();
	}
	draw();
	
	line.changeColor = changeColor;
	line.changePoints = changePoints;
	
	//p.mainContainer.addChild(line);
	return line;
}
function createBoxSpriteText(conf) {
	conf = conf ? conf : {};
	var sprite,
		text,
		box,
		imgFill, imgBasePath, imgName, imgExt, img,
		spriteImg, spriteScale, spriteTint,
		textContent, textFont, textSize, textColor,
		boxX, boxY,
		onmouseup, onmouseupParam, onmousedown, onmousedownParam;
	
	function setThings() {
		imgFill     = conf.imgFill      || false;
		imgBasePath = conf.imgBasePath  || "images/raw/edited/"; // images/
		imgName     = conf.imgName      || "tv-screen"; // tv-screen computer
		imgExt      = conf.imgExt       || ".png";
		spriteScale = conf.spriteScale  || 0.2;
		spriteTint  = conf.spriteTint   || false;
		textContent = conf.textContent  || "no_name";
		textFont    = conf.textFont     || "Arial";
		textSize    = conf.textSize     || "16px";
		textColor   = conf.textColor    || "black";
		boxX        = conf.x            || 0;
		boxY        = conf.y            || 0;
		// spriteImg   = conf.spriteImg    || imgBasePath + imgName + (imgFill ? "-fill":"-trans") + imgExt;
		spriteImg   = conf.spriteImg    || imgName + (imgFill ? "-fill":"-trans") + imgExt;
	}
	function down(e) {
		e.stopPropagation();
		this.data = e.data;
		this.alpha = 0.5;
		this.dragging = true;
		this.dragPoint = e.data.getLocalPosition(this.parent);
		this.dragPoint.x -= this.position.x;
		this.dragPoint.y -= this.position.y;
		
		//bringToFront(this);
	}
	function up() {
		this.alpha = 1;
		this.dragging = false;
		this.data = null;
		if ( __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].isFunc(onmouseup) ) {
			onmouseup.apply(undefined, onmouseupParam);
		}
	}
	function move() {
		if ( this.dragging ) {
			var newPosition = this.data.getLocalPosition(this.parent);
			this.position.x = newPosition.x - this.dragPoint.x;
			this.position.y = newPosition.y - this.dragPoint.y;
		}
	}
	function addEvents(el) {
		el
			.on("mousedown", down) 
			.on("touchstart", down)
			.on("mouseup", up)
			.on("mouseupoutside", up)
			.on("touchend", up)
			.on("touchendoutside", up)
			.on("mousemove", move)
			.on("touchmove", move);
	}
	function makeSprite() {
		// sprite = new PIXI.Sprite.fromImage( spriteImg );
		sprite = new PIXI.Sprite( p.textures[spriteImg] );
		sprite.interactive = true;
		sprite.buttonMode = true;
		sprite.anchor.set(0, 0);
		sprite.alpha = 1;
		sprite.scale.set( spriteScale );
		if (spriteTint) {
			sprite.tint = 0xFFCC00 * spriteTint;
		}
	}
	function makeText() {
		text = new PIXI.Text( textContent, {
			fontFamily: textFont,
			fontSize: textSize,
			fill: textColor
		});
		text.interactive = true;
		text.buttonMode = true;
		text.y = sprite.y + sprite.height;
	}
	function makeBox() {
		box = new PIXI.Container();
		// box = new PIXI.particles.ParticleContainer();
		box.interactive = true;
		box.buttonMode = true;
		box.scale.set(1);
		box.alpha = 1;
		box.position.x = boxX;
		box.position.y = boxY;
		box.hitArea = new PIXI.Rectangle(0, 0, sprite.width, sprite.height);
		addEvents(box);
		box.addChild(sprite); 
		box.addChild(text);
	}
	
	setThings();
	makeSprite();
	makeText();
	makeBox();
	
	box.setOnmouseup = function (param, fn) {
		onmouseupParam = param;
		onmouseup = fn;
	};
	box.setOnmousedown = function (param, fn) {
		onmousedownParam = param;
		onmousedown = fn;
	};
	box.changeTint = function (n) {
		if (n) {
			sprite.tint = n;
		}
	};
	
	return box;
}
function bringToFront(el) {
	// reorder children for z-index
	var arr = p.mainContainer.children;
	arr.splice( arr.indexOf(el), 1 );
	arr.push(el);
}
function createSprite(o, noDrag) {
	// var sprite = new PIXI.Sprite.fromImage(o.image);
	var sprite = new PIXI.Sprite( PIXI.TextureCache[o.image] );
	sprite.interactive = true;
	sprite.buttonMode = true;
	sprite.anchor.set(0, 0);
	sprite.scale.set(o.scale);
	sprite.alpha = o.alpha || 0;
	sprite.rotation = o.rotation || 0;
	sprite.position.x = o.x;
	sprite.position.y = o.y;
	
	if ( !noDrag ) {
		addDragDrop(sprite);
	}
	
	return sprite;
}
function createLine(conf, noDrag) {
	var line = new PIXI.Graphics(),
		points,
		i;
	
	conf = conf ? conf : {};
	
	if ( __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].isObj(conf) ) {
		points = conf.points || [];
	} else if ( __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].isArr(conf) ) {
		points = conf;
	}
	
	
	if ( points.length === 0 ) {
		points = [0, 0, 1, 1];
	}
	
	
	line.interactive = true;
	line.buttonMode = true;
	line.beginFill();
	line.lineStyle(
		conf.thickness || 2,
		conf.color || 0x000000,
		conf.alpha || 1
	);
	
	line.moveTo( points[0], points[1] );
	for (i=2; i < points.length ;i+=2) {
		line.lineTo( points[i], points[i+1] );
	}
	line.lineTo( points[0], points[1] );
	line.endFill();
	line.hitArea = new PIXI.Polygon([
		
	]);
	
	if ( !noDrag ) {
		addDragDrop(line);
	}
	
	return line;
}
function redrawLine(ctx, o) {
	var points,
		i,
		dirty,
		clearDirty;
	
	if ( __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].isObj(o) ) {
		points = o.points;
	} else if ( __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].isArr(o) ) {
		points = o;
	}
	
	ctx.clear();
	ctx.beginFill();
	ctx.lineStyle(
		o.thickness || 2,
		o.color     || 0x000000,
		o.alpha     || 1
	);
	
	ctx.moveTo( points[0], points[1] );
	for (i=2; i < points.length ;i+=2) {
		ctx.lineTo( points[i], points[i+1] );
	}
	ctx.lineTo( points[0], points[1] );
	ctx.endFill();
	
	
	dirty = ctx.dirty;
	clearDirty = ctx.clearDirty;
	
	if ( dirty ) {
		dirty = false;
	} else if ( !dirty ) {
		dirty = true;
	}
	
	if ( clearDirty ) {
		clearDirty = false;
	} else if ( !clearDirty ) {
		clearDirty = true;
	}
	
}
function createRect(o, noDrag) {
	var rect = new PIXI.Graphics();
	
	rect.interactive = true;
	rect.buttonMode = true;
	rect.beginFill(o.color);
	rect.lineStyle(
		o.lineWidth || 0,
		o.lineColor || 0x000000,
		o.alpha || 1
	);
	rect.drawRect(
		o.x || 0,
		o.y || 0,
		o.width,
		o.height
	);
	rect.endFill();
	
	if ( !noDrag ) {
		addDragDrop(rect);
	}
	
	return rect;
}
function createText(o, noDrag) {
	o = o ? o : {};
	var txt = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].isStr( o ) ? o : o.text;
	
	var text = new PIXI.Text(txt, {
		fontFamily: o.font || "Arial",
		fontSize: o.size || "20px",
		fill: o.color || "black"
	});
	text.interactive = true;
	text.buttonMode = true;
	
	if ( !noDrag ) {
		addDragDrop(text);
	}
	
	return text;
}


Object.defineProperties(inst, {
	"renderer": {
		get: function () { return p.renderer; }
	},
	"stage": {
		get: function () { return p.stage; }
	},
	"mainContainer": {
		get: function () { return p.mainContainer; }
	},
	"textures": {
		get: function () { return p.textures; }
	}
});
inst.init = init;
inst.animate = animate;
inst.coPoint = coPoint;
inst.addDragDrop = addDragDrop;
inst.createSprite = createSprite;
inst.create2pointLine = create2pointLine;
inst.create3pointLine = create3pointLine;
inst.createBoxSpriteText = createBoxSpriteText;
inst.createLine = createLine;
inst.redrawLine = redrawLine;
inst.createRect = createRect;
inst.createText = createText;
inst.zoom = zoom;
inst.pan = pan;
inst.clearContainer = clearContainer;
inst.addChild = addChild;
inst.bringToFront = bringToFront;
inst.disableZoom = disableZoom;


/* harmony default export */ exports["a"] = inst;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
function coPubsub() {
	"use strict";
	if ( this instanceof coPubsub ) { throw new Error('coPubsub() was called with new'); }
	
	var subscribers = {},
		inst = {};
	
	inst.getSubscribers = function () {
		return subscribers;
	};
	
	inst.subscribe = function (evt, fn, par) {
		var events,
			add = function (str) {
				if ( typeof subscribers[str] === 'undefined' ) {
					subscribers[str] = [];
				}
				subscribers[str].push({
					fn: fn,
					par: par
				});
			};
		
		if (typeof evt === 'string') {
			if ( evt.indexOf(' ') === -1 ) {
				add(evt);
			} else {
				events = evt.split(' ');
				events.forEach(function (el) {
					add(el);
				});
			}
		} else if ( util.isObj(evt) ) {
			Object.keys(evt).forEach(function (i) {
				if (typeof subscribers[i] === 'undefined') {
					subscribers[i] = [];
				}
				if ( typeof evt[i] === 'function' ) {
					subscribers[i].push({
						fn: evt[i],
						par: undefined
					});
				} else if ( util.isObj(evt[i]) ) {
					subscribers[i].push({
						fn: evt[i].fn,
						par: evt[i].par
					});
				}
			});
		}
	};
	
	inst.publish = function (evtName, evtData) {
		if (typeof subscribers[evtName] !== 'undefined') {
			subscribers[evtName].forEach(function (i) {
				i.fn(evtData, i.par);
			});
		}
	};
	
	inst.on = function (evt, fn, par) { // alias
		this.subscribe(evt, fn, par);
	};
	
	inst.emit = function (evtName, evtData) { // alias
		this.publish(evtName, evtData);
	};
	
	return inst;
};


/* harmony default export */ exports["a"] = coPubsub;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pubsub__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pixi__ = __webpack_require__(1);




var inst = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].extend( __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__pubsub__["a" /* default */])() ),
	p = {};
	
p.nodes = {};
p.links = {};
p.idCounter = 0;
p.types = [
	"tv-screen", "macintosh", "imac-blue", "smart-tv", "imac-red",
	"imac-grey", "monitor", "ipad", "iphone", "macbook",
	"computer", "gamepad", "playstation", "hard-drive",
	"smartphone", "smartwatch", "video-card", "xbox"
];

function animateNode(pixiEl, o) {
	o = o ? o : {};
	var box = pixiEl;
	
	TweenLite.to(box, 0.3, {
		alpha: 1,
		yoyo: true,
		ease: Linear.easeInOut
	});

	TweenLite.to(box.scale, 0.3, {
		x: 1,
		y: 1,
		yoyo: true,
		ease: Linear.easeInOut,
		onComplete: o.done,
		onCompleteParams: o.doneParams,
		onCompleteScope: o.doneCtx
	});
}
function createNode(o, container, coefficient) {
	o = o ? o : {};
	var node,
		type, name, id, thisLinks,
		x, y,
		boxSpriteText;
	
	function setThings() {
		type      = o.type  || 0;
		id        = o.id    || "tpl_node_"+(p.idCounter+=1);
	//	name      = o.name  || "Node "+(p.idCounter+=1);
		name      = o.name  || o.management_ip  || "Node "+(p.idCounter+=1);
		x         = o.x;
		y         = o.y;
		thisLinks = o.links || false;
	}
	function createBox() {
		boxSpriteText = __WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */].createBoxSpriteText({
			x: coefficient ? x*coefficient.x : x,
			y: coefficient ? y*coefficient.y : y,
			imgName: p.types[type],
			spriteScale: 0.1,
			spriteTint: type,
			textContent: name,
			onmouseup: function () {
				
			},
			onmouseupParam: undefined
		});
	}
	function addTplnodeCustomPositionGetters(o) {
		var b = boxSpriteText;
		
		function midX() {
			return b.x + (b.width / 2);
		}
		function midY() {
			return b.y + (b.height / 2);
		}
		Object.defineProperties(node, {
			"top": {
				get: function () { return b.y; }
			},
			"bott": {
				get: function () { return b.y + b.height; }
			},
			"left": {
				get: function () { return b.x; }
			},
			"right": {
				get: function () { return b.x + b.width; }
			},
			//--------------------------------------------------------
			"topLeft"  : {  get: function () { return __WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */].coPoint( this.left  , this.top  ); }  },
			"topRight" : {  get: function () { return __WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */].coPoint( this.right , this.top  ); }  },
			"bottLeft" : {  get: function () { return __WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */].coPoint( this.left  , this.bott ); }  },
			"bottRight": {  get: function () { return __WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */].coPoint( this.right , this.bott ); }  },
			"topMid"   : {  get: function () { return __WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */].coPoint( midX()     , this.top  ); }  },
			"bottMid"  : {  get: function () { return __WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */].coPoint( midX()     , this.bott ); }  },
			"leftMid"  : {  get: function () { return __WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */].coPoint( this.left  , midY()    ); }  },
			"rightMid" : {  get: function () { return __WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */].coPoint( this.right , midY()    ); }  },
			"center"   : {  get: function () { return __WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */].coPoint( midX()     , midY()    ); }  }
		});
	}
	function createTplNode() {
		node = {};
		node.id = id;
		node.name = name;
		node.links = thisLinks;
		node.pixiEl = boxSpriteText;
		addTplnodeCustomPositionGetters(opt);
	}
	function addHandler() {
		/*
		boxSpriteText.setOnmousedown(function () {
			// clear line
		};
		*/
		
		boxSpriteText.setOnmouseup([node, p.links, p.nodes], function (node, tplLinks, tplNodes) {
			var nodeId = node.id;
			
			node.links.forEach(function (linkId) {
				var link = tplLinks[linkId],
					start, end;
				
				if (link) {
					if (link.src === nodeId) {
						start = node.center;
					}
					
					if (link.dest === nodeId) {
						end = node.center;
					}
					
					link.pixiEl.changePoints(start, end);
				}
			});
		});
	}
	
	setThings();
	createBox();
	createTplNode();
	addHandler();
	
	p.nodes[ id ] = node;
	
	__WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */].addChild(container, "nodeContainer", node.pixiEl);
}
var createLink = (function () {
	var path = {},
		toggle = false;
	
	function create(start, end, srcId, destId, linkId, status, container) {
		var link, pixiEl, nth, curveLevel,
			srcdest, destsrc;
		
		srcdest = srcId + destId;
		destsrc = destId + srcId;
		link    = {};
		
		if ( !path[srcdest] && !path[destsrc] ) {
			path[srcdest] = 1;
		} else if ( path[srcdest] ) {
			path[srcdest] += 1;
		} else if ( path[destsrc] ) {
			path[destsrc] += 1;
		}
		
		nth = path[srcdest] || path[destsrc];
		curveLevel = (nth-1)*2;
		
		if (nth === 1) {
			pixiEl = __WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */].create2pointLine({
				start: start,
				end: end,
				color: 0xCCAA00 * status
			});
		} else if (nth > 1) {
			pixiEl = __WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */].create3pointLine({
				start: start,
				end: end,
				color: 0xCCAA00 * status,
				curveLevel: curveLevel,
				curveSide: toggle ? false : true
			});
		}
		
		link.pixiEl = pixiEl;
		link.id = linkId;
		link.src = srcId;
		link.dest = destId;
		
		p.links[ linkId ] = link;
		
		
		__WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */].addChild(container, "lineContainer", link.pixiEl);
	}
	
	return create;
}());
function checkNode(node, container) {
	createNode( node, container );
}
function checkLink(link, container, bounds) {
	/*
	var src = link.src,
		dest = link.dest,
		b = bounds ? bounds : {},
		x1 = b.x1,
		x2 = b.x2,
		y1 = b.y1,
		y2 = b.y2,
		start, end,
		srcOut = false,
		destOut = false,
		nodes = p.nodes;
	
	if ( src.x > x1 &&
			src.x < x2 &&
			src.y > y1 &&
			src.y < y2 ) {
		start = nodes[src.id].center;
	} else {
		srcOut = true;
	}
	
	if ( dest.x > x1 &&
			dest.x < x2 &&
			dest.y > y1 &&
			dest.y < y2 ) {
		end = nodes[dest.id].center;
	} else {
		destOut = true;
	}
	
	if (srcOut) {
		start = calc();
	} else if (destOut) {
		end = calc();
	}
	*/
	// createLink(start, end, src.id, dest.id, link.id, container);
	
	var srcId, destId, srcNode, destNode, linkId,
		isObj = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].isObj,
		isStr = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].isStr;
	
	if (link.src) {
		if ( isObj(link.src) ) {
			srcId = link.src.id;
			
		} else if ( isStr(link.src) ) {
			srcId = link.src;
		}
	} else if (link.source_id) {
		srcId = link.source_id;
	}
	
	if (link.dest) {
		if ( isObj(link.dest) ) {
			destId = link.dest.id;
		} else if ( isStr(link.dest) ) {
			destId = link.dest;
		}
	} else if (link.destination_id) {
		destId = link.destination_id;
	}
	//debugger;
	srcNode = p.nodes[srcId];
	destNode = p.nodes[destId];
	//debugger;
	createLink(
		srcNode.center,
		destNode.center,
		srcId,
		destId,
		link.id,
		link.status,
		container
	);
}
function drawNodes(nodes, c, coefficient) {
	Object.keys(nodes).forEach(function (k) {
		// checkNode( nodes[k], c );
		createNode( nodes[k], c, coefficient );
	});
}
function drawLinks(links, c, b) {
	Object.keys(links).forEach(function (k) {
		checkLink( links[k], c, b );
	});
}
function draw(data, container, bounds, coefficient) {
	container = container ? container : "viewport";
	bounds = bounds ? bounds : {};
	coefficient = coefficient ? coefficient : false;
	
	p.nodes = {};
	p.links = {};
	drawNodes(data.nodes, container, coefficient);
	drawLinks(data.links, container, bounds);
}


inst.checkLink = checkLink;
inst.draw = draw;

/* harmony default export */ exports["a"] = inst;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pixi__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ajax__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ajax___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__ajax__);





var inst = {},
	p = {};

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

function loadData(container) {
	container = container ? container : "viewport";
	var abort = p.ajax ? p.ajax.xhr.abort : undefined;
	
	if (abort) {
		abort();
	}
	
	p.ajax = __WEBPACK_IMPORTED_MODULE_2__ajax___default()({
		data: p.data
	})
	.done(function (data) {
		__WEBPACK_IMPORTED_MODULE_1__pixi__["a" /* default */].clearContainer(container || "viewport");
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
	// ajax({
		// data: p.data
	// })
	// .done(function ( data ) { // {url: "js/d.txt"}
		// console.log(data);
		// t = data;
		// a.tpl.draw(data, "viewport");
	// });
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
		odd = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].isNumOdd,
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
	
	__WEBPACK_IMPORTED_MODULE_1__pixi__["a" /* default */].on("pan", panCallback);
	__WEBPACK_IMPORTED_MODULE_1__pixi__["a" /* default */].on("zoom", zoomCallback);
	
	navigation.on("zoom", function () {
		console.log("zoom");
		__WEBPACK_IMPORTED_MODULE_1__pixi__["a" /* default */].zoom();
	});
	navigation.on("pan", function () {
		__WEBPACK_IMPORTED_MODULE_1__pixi__["a" /* default */].pan.pan(1, 1);
	});
}
function init() {
	__WEBPACK_IMPORTED_MODULE_1__pixi__["a" /* default */].init(pixiCallback, p.GLOBAL_BOUNDS);
	//core.init();
	//navigation.init();
	
	// addCustomEvents();
}


inst.data = p.data;
inst.bounds = p.bounds;
inst.init = init;


/* harmony default export */ exports["a"] = inst;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pixi__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tpl__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__traceroute__ = __webpack_require__(7);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return onready; });





function onready(callback) {
	
	if ( __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].isFunc(callback) ) {
		callback();
	}
	
	
	$('#select_all').on('click', function (e) {
		e.preventDefault();
		var chks = $('input[type="checkbox"]');
		if (chks.length > 0) {
			chks.prop({checked: true});
		}
		
	});
	$('#add_device').on('click', function (e) {
		var name,
			x, y,
			type,
			links;
			
		e.preventDefault();
		
		name = $('input[type="text"][name="name"]').val();
		id = $('input[type="text"][name="id"]').val();
		x = $('input[type="text"][name="x"]').val();
		y = $('input[type="text"][name="y"]').val();
		type = $('select').find(':selected').val().trim();
		links = [];
		$('input[type="checkbox"]').each(function () {
			var id = this.id;
			if ( $(this).is(':checked')  &&  id ) {
				links.push(id);
			}
		});
		if (type) {
			$('input[type="checkbox"]').prop({checked: false});
			var finished = a.core.createTplNode({
				id: id,
				name: name,
				type: type,
				x: x,
				y: y,
				links: links
			});
			$('#devices').append('<label><input type="checkbox" id="'+finished+'"> '+finished+'</label>');
		}
		
		
	});
	$('#generate').on('click', function (e) {
		e.preventDefault();
		var nodeCount = $('input[type="text"][name="nodecount"]').val(),
			density = $('input[type="text"][name="density"]').val(),
			linkColor = $('input[type="text"][name="linkcolor"]').val(),
			each = $('input[type="text"][name="each"]').val(),
			fill = $('input[type="checkbox"][name="fill"]').is(':checked');
		
		linkColor = parseInt(linkColor, 16);
		each = parseInt(each, 10);
		
		__WEBPACK_IMPORTED_MODULE_2__tpl__["a" /* default */].test(
			nodeCount || 10,
			density || 1,
			linkColor,
			each,
			fill
		);
	});

	$('#clear').on('click', function (e) {
		e.preventDefault();
		
		//a.pixi.clear('lineContainer', true);
		//a.pixi.clear('nodeContainer');
		
		__WEBPACK_IMPORTED_MODULE_1__pixi__["a" /* default */].clearContainer('viewport');
	});

	$('#sidebar').on('show.uk.offcanvas', function () {
		__WEBPACK_IMPORTED_MODULE_1__pixi__["a" /* default */].disableZoom(true);
	});
	$('#sidebar').on('hide.uk.offcanvas', function () {
		__WEBPACK_IMPORTED_MODULE_1__pixi__["a" /* default */].disableZoom(false);
	});

	$('#scan').on('click', function (e) {
		var txtarea, checkbox, txt, arr;
		
		e.preventDefault();
		
		txtarea = $('#txtarea_thing');
		checkbox = $('input[type="checkbox"][name="secure"]').is(':checked');
		
		txt = txtarea.val().trim();
		if (txt) {
			arr = txt.split("\n");
			//console.log(arr, checkbox);
			
			__WEBPACK_IMPORTED_MODULE_3__traceroute__["a" /* default */].trace(arr, checkbox);
		}
		$('#abort').removeAttr('disabled');
	});

	$('#abort').on('click', function (e) {
		e.preventDefault();
		__WEBPACK_IMPORTED_MODULE_3__traceroute__["a" /* default */].abort();
	});
	
}




/***/ },
/* 6 */
/***/ function(module, exports) {

$.support.cors = true;

$.ajaxSetup({
	crossDomain: true
});
/*
$.ajaxSetup({
	accepts : null,                 // PlainObject (default: depends on DataType)
	async : true,                   // Boolean (default: true) ("async: false" deprecated as of jQuery 1.8)
	beforeSend :          null,     // Function ( jqXHR jqXHR, PlainObject settings )
	cache :               null,     // Boolean (default: true, false for dataType 'script' and 'jsonp')
	complete :            null,     // Function ( jqXHR jqXHR, String textStatus )
	contents :            null,     // PlainObject
	contentType :         null,     // String (default: 'application/x-www-form-urlencoded; charset=UTF-8')
	context :             null,     // PlainObject
	converters :          null,     // PlainObject (default: {"* text": window.String, "text html": true, "text json": jQuery.parseJSON, "text xml": jQuery.parseXML})
	crossDomain :         null,     // Boolean (default: false for same-domain requests, true for cross-domain requests)
	data :                null,     // PlainObject or String
	dataFilter :          null,     // Function ( String data, String type )
	dataType :            'text',   // String (default: Intelligent Guess (xml, json, script, or html))
	error :               null,     // Function ( jqXHR jqXHR, String textStatus, String errorThrown )
	global : true,                  // Boolean (default: true)
	headers : {},                   // PlainObject (default: {})
	ifModified :          null,     // Boolean (default: false)
	isLocal :             null,     // Boolean (default: depends on current location protocol)
	jsonp :               null,     // String { jsonp: false, jsonpCallback: "callbackName" }
	jsonpCallback :       null,     // String or Function
	mimeType :            null,     // String
	password :            null,     // String
	processData :         null,     // Boolean (default: true)
	scriptCharset :       null,     // String
	statusCode :          null,     // PlainObject (default: {})
	success :             null,     // Function ( PlainObject data, String textStatus, jqXHR jqXHR )
	timeout :             null,     // Number
	traditional : false,            // Boolean
	type :                null,     // String (default: 'GET')
	url :                 null,     // String  (default: The current page)
	username :            null,     // String
	xhr :                 null,     // Function (default: ActiveXObject when available (IE), the XMLHttpRequest otherwise)
	xhrFields :           null,     // PlainObject
});
*/
var ajax = (function () {
	var fns = {},
		counter = 0,
		xhr;
	
	fns.done = {};
	fns.fail = {};
	fns.always = {};
	
	function u() {
		return 'a'+(counter+=1);
	}
	function execute(type, uid, a, b, c) {
		var o = fns[type],
			f = o[uid];
		if (typeof f === 'function') {
			f(a, b, c);
		}
	}
	function ajax(o) {
		o = o ? o : {};
		
		var uid = u();
		
		ajax.id = uid;
		
		
		xhr = $.ajax({
			url: o.url || 'http://localhost:3000',
			type: o.type || 'GET',
			dataType: o.dataType || 'json',
			data: o.data,
			beforeSend: o.beforeSend,
			id: uid
		})
		.done(function (data, txt, obj) {
			
			if (this.id === ajax.id) {
				execute('done', uid, data, txt, obj);
			};
		})
		.fail(function (obj, txt, err) {
			
			execute('fail', uid, obj, txt, err);
			
		})
		.always(function (obj, txt) {
			
			execute('always', uid, obj, txt);
			
		});
		
		ajax.xhr = xhr;
		
		return ajax;
	};
	
	ajax.done = function (fn) {
		fns.done[this.id] = fn;
		return this;
	};
	ajax.fail = function (fn) {
		fns.fail[this.id] = fn;
		return this;
	};
	ajax.always = function (fn) {
		fns.always[this.id] = fn;
		return this;
	};
	ajax.callbacks = fns;
	
	return ajax;
}());

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pubsub__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tpl__ = __webpack_require__(3);




var inst = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].extend( __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__pubsub__["a" /* default */])() ),
	ws = {},
	path = 'ws://192.168.10.13:3000/network/icmp/traceroute',
	coefficient = {},
	nodes = {},
	links = {},
	msgCounter = 0,
	noteMsgs = {},
	scanBtn = {};


function filter(data) {
	var newLinks = data.links,
		newNodes = data.nodes,
		diffNodes = {},
		diffLinks = {};
		
	Object.keys(newNodes).forEach(function (k) {
		if ( !nodes[k] ) {
			nodes[k] = newNodes[k];
			diffNodes[k] = newNodes[k];
		}
	});
	Object.keys(newLinks).forEach(function (k) {
		if ( !links[k] ) {
			links[k] = newLinks[k];
			diffLinks[k] = newLinks[k];
		}
	});
	
	return {
		links: diffLinks,
		nodes: diffNodes
	};
}
function createSock(opt) {
	if (opt) { 
		path += '?portscanner=true';
	}
	ws = new WebSocket(path);
	console.log(ws);
}
function abort() {
	if ( !__WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].isEmptyObj(ws) ) {
		ws.close(4999);
	}
}
function addHandlers(cb) {
	ws.onopen = function (e) {
		console.log("Connection open...");
		
		// ws.send("Hello WebSocket!");
		cb();
	};

	ws.onmessage = function (e) {
		msgCounter += 1;
		
		if (msgCounter === 1) { // only for the first msg
			noteMsgs.init.close();
			pixi.clearContainer("viewport");
			pixi.mainContainer.x = pixi.renderer.width / 2;
			pixi.mainContainer.y = pixi.renderer.height / 2;
			UIkit.offcanvas.hide(false);
			
			noteMsgs.processing = UIkit.notify({
				message : '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i> در حال دریافت اطلاعات...',
				status  : 'info',
				timeout : 0,
				pos     : 'bottom-right'
			});
		}
		
		
		
		if (typeof e.data === "string") {
			console.log("String message received\n");
			noteMsgs.newData = UIkit.notify({
				message : '<i class="fa fa-check-circle" aria-hidden="true"></i> دریافت اطلاعات جدید.',
				status  : 'success',
				timeout : 1000,
				pos     : 'bottom-right'
			});
			
			
			
			var data = JSON.parse(e.data);
			console.log(data);
			
			data = filter(data);
			
			var nodesLen = Object.keys(data.nodes).length;
			var linksLen = Object.keys(data.links).length;
			
			console.log(nodesLen, linksLen);
			
			coefficient = {
				x: pixi.renderer.width / (300 + 80),
				y: pixi.renderer.height / (300 + 80),
			}
			// console.log(coefficient);
			
			__WEBPACK_IMPORTED_MODULE_2__tpl__["a" /* default */].draw(data, "viewport", undefined, coefficient);
			
		} else {
			console.log("Other message received\n", e.data);
		}
	};

	ws.onerror = function (e) {
		console.log("WebSocket Error: " , e);
		
		noteMsgs.processing.close();
		noteMsgs.error = UIkit.notify({
			message : '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> خطا در برقراری ارتباط!',
			status  : 'danger',
			timeout : 2000,
			pos     : 'bottom-right'
		});
	};


	ws.onclose = function (e) {
		console.log("Connection closed", e);
		scanBtn.removeAttr('disabled');
		
		noteMsgs.processing.close();
		noteMsgs.close = UIkit.notify({
			message : '<i class="fa fa-check" aria-hidden="true"></i> دریافت کامل اطلاعات با موفقیت به پایان رسید.',
			status  : 'success',
			timeout : 2000,
			pos     : 'bottom-right'
		});
	};
}
function trace(arr, opt) {
	noteMsgs['init'] = UIkit.notify({
		message : '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i> در حال بررسی...',
		status  : 'info',
		timeout : 0,
		pos     : 'top-center'
	});
	scanBtn = $('#scan');
	scanBtn.attr('disabled', '');
	
	createSock(opt);
	addHandlers(function () {
		ws.send( JSON.stringify(arr) );
	});
	
}


inst.abort = abort;
inst.trace = trace;

/* harmony default export */ exports["a"] = inst;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pubsub__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pixi__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tpl__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__mediator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__page__ = __webpack_require__(5);








window.util     = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */];
window.coPubsub = __WEBPACK_IMPORTED_MODULE_1__pubsub__["a" /* default */];
window.pixi     = __WEBPACK_IMPORTED_MODULE_2__pixi__["a" /* default */];
window.tpl      = __WEBPACK_IMPORTED_MODULE_3__tpl__["a" /* default */]
window.mediator = __WEBPACK_IMPORTED_MODULE_4__mediator__["a" /* default */];
window.ready    = __WEBPACK_IMPORTED_MODULE_5__page__["a" /* onready */];

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__page__["a" /* onready */])( __WEBPACK_IMPORTED_MODULE_4__mediator__["a" /* default */].init );

/***/ }
/******/ ]);