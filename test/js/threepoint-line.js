PIXI.utils.skipHello();
var renderer = PIXI.autoDetectRenderer(
	window.innerWidth,
	window.innerHeight,
	{
		backgroundColor : 0x1099bb,
		antialias: true
	}
);
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
stage.interactive = true;
stage.hitArea = new PIXI.Rectangle( -100000, -100000, renderer.width / renderer.resolution * 100000, renderer.height / renderer.resolution *100000 );


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
			
		stage.position.x += dx;
		stage.position.y += dy;
		//console.log(p.mainContainer.position.x, p.mainContainer.position.y);
		prevX = pos.x;
		prevY = pos.y;
	}
	function up() {
		isDragging= false;
	}
	function pan(x, y) {
		if ( x  &&  y ) {
			stage.position.x += x;
			stage.position.y += y;
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
function zoom(x, y, isZoomIn) {
	var direction = isZoomIn ? 1 : -1,
		factor = (1 + direction * 0.1),
		local_pt = new PIXI.Point(),
		point = new PIXI.Point(x, y);
		
	PIXI.interaction.InteractionData.prototype.getLocalPosition(stage, local_pt, point);
	
	stage.scale.x *= factor;
	stage.scale.y *= factor;
	stage.pivot = local_pt;
	stage.position = point;
}
pan.add( stage );

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
			unit = 10;
		
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
	
	stage.addChild(line);
	return line;
}



animate();
function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}
function dragStart(e) {
	t = this;
	console.log(this);
	this.data = e.data;
	this.alpha = 0.5;
	this.dragging = true;
	this.dragPoint = e.data.getLocalPosition(this.parent);
	this.dragPoint.x -= this.position.x;
	this.dragPoint.y -= this.position.y;
	
	//bringToFront(this);
}
function dragMove(e) {
	if (this.dragging) {
		var newPosition = this.data.getLocalPosition(this.parent);
		this.position.x = newPosition.x - this.dragPoint.x;
		this.position.y = newPosition.y - this.dragPoint.y;
	}
}
function dragEnd() {
	this.alpha = 1;
	this.dragging = false;
	this.data = null;
}
function addDragDrop(el) {
	el
		.on('mousedown', dragStart)
		.on('touchstart', dragStart)
		.on('mouseup', dragEnd)
		.on('mouseupoutside', dragEnd)
		.on('touchend', dragEnd)
		.on('touchendoutside', dragEnd)
		.on('mousemove', dragMove)
		.on('touchmove', dragMove);
}
function bringToFront(el) {
	// reorder children for z-index
	var arr = stage.children;
	arr.splice( arr.indexOf(el), 1 );
	arr.push(el);
}

var s = 0,
	t = false, b;
$(function () {
	
	while ( (s/2) !== 5) {
		t = t ? false : true;
		b = create3pointLine({start: {x: 600, y: 70}, end: {x: 50, y: 200}, curveLevel: s+=2, curveSide: t})
	}
	
	
	
	
	$(document).on('mousewheel', function (e) {
		zoom(e.pageX, e.pageY, e.deltaY > 0);
	});
});