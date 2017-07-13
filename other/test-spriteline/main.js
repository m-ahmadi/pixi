PIXI.utils.skipHello();
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { backgroundColor: 0xAAAA, antialias: true } );
var stage = new PIXI.Container(0xFFFF00);
stage.interactive = true;
stage.hitArea = new PIXI.Rectangle(-1000000, -1000000, 10000000, 10000000);
document.body.appendChild(renderer.view);
function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);
}
requestAnimationFrame(animate);

var lineTexture;

var makeDraggable = (function () {
	var isDragging, prevX, prevY;
	function start(e) {
		var pos = e.data.global;
		isDragging = true;
		
		this.alpha = 0.5;
		prevX = pos.x;
		prevY = pos.y;
		isDragging = true;
	}
	function move(e) {
		if ( !isDragging ) { return; }
		var pos = e.data.global;
		this.position.x += pos.x - prevX;
		this.position.y += pos.y - prevY;
		prevX = pos.x;
		prevY = pos.y;
	}
	function end() {
		isDragging= false;
		this.alpha = 1;
	}
	function add(el) {
		el
			.on("mousedown", start)
			.on("touchstart", start)
			.on("mouseup", end)
			.on("mouseupoutside", end)
			.on("touchend", end)
			.on("touchendoutside", end)
			.on("mousemove", move)
			.on("touchmove", move);
	}
	return add;
}());
function newLine(start, end) {
	var sX = start.x,
		sY = start.y,
		eX = end.x,
		eY = end.y,
		pow = Math.pow,
		sqrt = Math.sqrt,
		atan = Math.atan,
		abs = Math.abs,
		PI = Math.PI,
		dx, dy, width, teta;
		
	var g = new PIXI.Graphics();
	g.beginFill(0xFF0000);
	g.drawRect(0,0,1,1);
	g.endFill();
	lineTexture = g.generateCanvasTexture();
	var s = new PIXI.Sprite(lineTexture);
	
	s.buttonMode = true;
	s.interactive = true;
	s.height = 4;
	dx = abs(eX-sX);
	dy = abs(eY-sY);
	
	if (sY === eY) { // horizontal
		if (sX < eX) {
			s.x = sX;
			s.y = sY;
			s.width = eX-sX;
		} else if (eX < sX) {
			s.x = eX;
			s.y = eY;
			s.width = sX-eX;
		}
	} else if (sX === eX) { // vertical
		if (sY < eY) {
			s.x = sX;
			s.y = sY;
			s.height = eY-sY;
		} else if (eY < sY) {
			s.x = eX;
			s.y = eY;
			s.height = sY-eY;
		}
	} else {
		s.x = sX;
		s.y = sY;
		if (sX < eX && eY > sY) { // to bott right
			s.width = sqrt( pow(dy, 2) + pow(dx, 2) );
			s.rotation = atan(dy / dx);
		} else if (sX < eX && eY < sY) { // to top right
			s.width = sqrt( pow(dy, 2) + pow(dx, 2) );
			s.rotation = -atan(dy / dx);;
		} else if (sX > eX && eY > sY) { // to bott left
			s.width = sqrt( pow(dy, 2) + pow(dx, 2) );
			s.rotation = PI-atan(dy / dx);;
		} else if (sX > eX && eY < sY) { // to top left
			s.width = sqrt( pow(dy, 2) + pow(dx, 2) );
			s.rotation = PI+atan(dy / dx);;
		}
	}
	
	return s;
}

var t;
$(function () {
	// lineTexture = new PIXI.Texture.fromImage("pixel.png");
	t = newLine({
		x: Math.random()*renderer.width,
		y: Math.random()*renderer.height,
	}, {
		x: Math.random()*renderer.width,
		y: Math.random()*renderer.height,
	});
	makeDraggable(t);
	
	stage.addChild(t);
});