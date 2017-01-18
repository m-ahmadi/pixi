import util from './util';
import coPubsub from './pubsub';

var inst = util.extend( coPubsub() ),
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
			negate = util.negateNum,
			posit = util.positNum;
		
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
		var posit = util.positNum,
			negate = util.negateNum;
			
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
		if ( util.isFunc(onmouseup) ) {
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
	
	if ( util.isObj(conf) ) {
		points = conf.points || [];
	} else if ( util.isArr(conf) ) {
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
	
	if ( util.isObj(o) ) {
		points = o.points;
	} else if ( util.isArr(o) ) {
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
	var txt = util.isStr( o ) ? o : o.text;
	
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


export default inst