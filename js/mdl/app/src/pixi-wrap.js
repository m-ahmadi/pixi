var util = require('./util'),
	coPubsub = require('./pubsub');

var inst = util.extend( coPubsub() ),
	p = {};

p.defaults = {};
p.renderer;
p.stage;
p.mainContainer;

function init(o) {
	if (o) {
		p.defaults = o;
	}
	p.renderer = PIXI.autoDetectRenderer(
		window.innerWidth,
		window.innerHeight,
		{
			backgroundColor: p.defaults.background || 0xAB9999,
			antialias: true,
		}
	);
	// document.body.appendChild( p.renderer.view );
	$('#contents').append( p.renderer.view );
	p.stage = new PIXI.Container();
	
	p.mainContainer = new PIXI.Container();
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	//p.stage.buttonMode = true;
	p.mainContainer.interactive = true;
	p.mainContainer.hitArea = new PIXI.Rectangle( -100000, -100000, p.renderer.width / p.renderer.resolution * 100000, p.renderer.height / p.renderer.resolution *100000 );
	pan.add( p.mainContainer );
		
	$(document).on('mousewheel', function (e) {
		// e.deltaX, e.deltaY, e.deltaFactor
		// zoom(e.pageX, e.pageY, e.deltaY > 0);
		// zoom(e);
		zoom(e.pageX, e.pageY, e.deltaY > 0);
	});
	p.stage.addChild( p.mainContainer );
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	requestAnimationFrame( animate );
	p.renderer.render( p.stage );
	
	inst.publish('init');
}

function animate() {
	requestAnimationFrame(animate);
	//tink.update();
	//TWEEN.update();
	p.renderer.render(p.stage);
}
var zoom = (function () {
	var direction;
	
	var getGraphCoordinates = (function() {
		var ctx = {
			global: {
				x: 0,
				y: 0
			} // store it inside closure to avoid GC pressure
		};

		return function (x, y) {
			ctx.global.x = x;
			ctx.global.y = y;
			return PIXI.interaction.InteractionData.prototype.getLocalPosition.call(ctx, p.mainContainer);
		}
	}());
	function zoom(x, y, isZoomIn) {
		var mainContainer = p.mainContainer;
		
		direction = isZoomIn ? 1 : -1;
		var factor = (1 + direction * 0.1);
		mainContainer.scale.x *= factor;
		mainContainer.scale.y *= factor;

		// Technically code below is not required, but helps to zoom on mouse
		// cursor, instead center of graphGraphics coordinates
		
		var beforeTransform = getGraphCoordinates(x, y);
		mainContainer.updateTransform();
		var afterTransform = getGraphCoordinates(x, y);

		mainContainer.position.x += (afterTransform.x - beforeTransform.x) * mainContainer.scale.x;
		mainContainer.position.y += (afterTransform.y - beforeTransform.y) * mainContainer.scale.y;
		mainContainer.updateTransform();
	}
	function zam( e ) {
		var factor = 1,
			delta = e.deltaY,
			local_pt = new PIXI.Point(),
			point = new PIXI.Point(e.pageX, e.pageY),
			mainContainer = p.mainContainer;

		PIXI.interaction.InteractionData.prototype.getLocalPosition(mainContainer, local_pt, point);

		if ( delta > 0 ) {
			// Zoom in
			factor = 1.1;
		} else {
			// Zoom out
			factor = 1 / 1.1;
		}

		mainContainer.pivot = local_pt;
		mainContainer.position = point;
		mainContainer.scale.set(mainContainer.scale.x * factor);
	}
	function zoomba(x, y, isZoomIn) {
		var direction = (isZoomIn) ? 1 : -1,
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
	
	return zoomba;
}());
var pan = (function () {
	var isDragging = false,
		prevX,
		prevY;
	
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
			dy = pos.y - prevY;

		p.mainContainer.position.x += dx;
		p.mainContainer.position.y += dy;
		prevX = pos.x;
		prevY = pos.y;
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
			.on('mousedown', down)
			.on('touchstart', down)
			.on('mouseup', up)
			.on('mouseupoutside', up)
			.on('touchend', up)
			.on('touchendoutside', up)
			.on('mousemove', move)
			.on('touchmove', move);
	}
	
	return {
		pan: pan,
		add: add
	}
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
			.on('mousedown', down) 
			.on('touchstart', down)
			.on('mouseup', up)
			.on('mouseupoutside', up)
			.on('touchend', up)
			.on('touchendoutside', up)
			.on('mousemove', move)
			.on('touchmove', move);
	}
	
	
	return add;
}());
var twoPointsLine = (function () {
	
	function down() {
		console.log('down');
	}
	function up() {
		console.log('up');
	}
	function move() {
		//console.log('move');
	}
	function addEvent(el) {
		el
			.on('mousedown', down) 
			.on('touchstart', down)
			.on('mouseup', up)
			.on('mouseupoutside', up)
			.on('touchend', up)
			.on('touchendoutside', up)
			.on('mousemove', move)
			.on('touchmove', move);
	}
	function calcPoints(start, end, lineWidth) {
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
	function changeColor(line, color) {
		
	}
	function redraw(line, start, end) {
		var dirty,
			clearDirty;
		
		line.clear();
		line.beginFill();
		line.lineStyle(
			o.thickness || 2,
			o.color     || 0x000000,
			o.alpha     || 1
		);
		
		line.moveTo(  );
		line.lineTo(  );
		line.endFill();
		
		
		dirty = ctx.dirty;
		clearDirty = ctx.clearDirty;
		
		if ( dirty ) {
			dirty = false
		} else if ( !dirty ) {
			dirty = true;
		}
		
		if ( clearDirty ) {
			clearDirty = false
		} else if ( !clearDirty ) {
			clearDirty = true;
		}
	}
	function draw( line, start, end, lineWidth, color ) {
		var p = calcPoints(start, end, lineWidth);
		
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
	function create(conf) {
		if ( !conf ) { var conf = {}; }
		
		var line,
			start     =  conf.start     ||  {x: 0, y: 0},
			end       =  conf.end       ||  {x: 1, y: 1},
			lineWidth =  conf.lineWidth ||  2,
			color     =  conf.color     ||  0x000000;
		
		line = createElement();
		addEvent( line );
		
		draw( line, start, end, lineWidth, color );
		
		return line;
	}
	
	return {
		create: create,
		adjust: redraw
		
	}
}());
function bringToFront(el) {
	// reorder children for z-index
	var arr = p.mainContainer.children;
	arr.splice( arr.indexOf(el), 1 );
	arr.push(el);
}
function createSprite(o, noDrag) {
	var sprite = new PIXI.Sprite.fromImage(o.image);
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
	
	if (!conf) { var conf = {}; }
	if ( util.isObject(conf) ) {
		points = conf.points || [];
	} else if ( util.isArray(conf) ) {
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
	
	if ( util.isObject(o) ) {
		points = o.points;
	} else if ( util.isArray(o) ) {
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
		dirty = false
	} else if ( !dirty ) {
		dirty = true;
	}
	
	if ( clearDirty ) {
		clearDirty = false
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
	if ( !o ) {	var o = {}; }
	var txt = util.isString( o ) ? o : o.text;
	
	var text = new PIXI.Text(txt, {
		fontFamily: o.font || 'Arial',
		fontSize: o.size || '20px',
		fill: o.color || 'black'
	});
	text.interactive = true;
	text.buttonMode = true;
	
	if ( !noDrag ) {
		addDragDrop(text);
	}
	
	return text;
}
function addStageChild(el) {
	p.stage.addChild(el);
}
function addMainChild(el) {
	p.mainContainer.addChild(el);
}
function createPoint(x, y) {
	return new PIXI.Point(x, y);
}
Object.defineProperties(inst, {
	"renderer": {
		get: function () { return p.renderer; }
	},
	"stage": {
		get: function () { return p.stage; }
	},
	"mainContainer": {
		get: function () { return p.mainContainer }
	}
	
});
	


inst.init = init;
inst.animate = animate;
inst.addDragDrop = addDragDrop;
inst.createSprite = createSprite;
inst.twoPointsLine = twoPointsLine;
inst.createLine = createLine;
inst.redrawLine = redrawLine;
inst.createRect = createRect;
inst.createText = createText;
inst.zoom = zoom;
inst.pan = pan;
inst.addStageChild = addStageChild;
inst.addMainChild = addMainChild;
inst.createPoint = createPoint;

module.exports = inst;