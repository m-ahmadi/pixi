PIXI.utils.skipHello();
var renderer, stage, container, cnt,
	textures = {};

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
		el.interactive = true;
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
function createTextures() {
	var arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
		DIR = "images/",
		EXT = ".png";
	arr.forEach(function (i) {
		textures[i] = new PIXI.Texture.fromImage(DIR + i + EXT);
	});
}
function zoom(x, y, zoomIn) {
	let direction = (zoomIn) ? 1 : -1,
		factor = (1 + direction * 0.1),
		local_pt = new PIXI.Point(),
		point = new PIXI.Point(x, y),
		el = stage;
	
	PIXI.interaction.InteractionData.prototype.getLocalPosition(el, local_pt, point);
	
	el.scale.x *= factor;
	el.scale.y *= factor;
	el.pivot = local_pt;
	el.position = point;
}
function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);
}
function onReady() {
	renderer = PIXI.autoDetectRenderer(
		window.innerWidth,
		window.innerHeight,
			{
				backgroundColor: 0xF5FFFF,
				antialias: true,
			//	resolution: false,
			//	transparent: false,
			//	preserveDrawingBuffer: false,
			//	view: HTMLCanvasElement
			}
		//	noWebGL: false,
	);
	$("#container").append(renderer.view);
	stage = new PIXI.Container(0xFFFF00);
	stage.interactive = true;
	stage.hitArea = new PIXI.Rectangle(-100000, -100000, 1000000, 1000000);
	makeDraggable(stage);
	$("canvas").on("mousewheel", function (e) {
		zoom(e.pageX, e.pageY, e.deltaY > 0);
	});
		
	requestAnimationFrame(animate);

	createTextures();
	
	container = new PIXI.ParticleContainer(200000, {
		scale:    true,
		position: true,
		rotation: true,
		uvs:      false,
		alpha:    false,
	});
	stage.addChild(container);
	/* for (var i = 0; i < 200000; i++) {
		s = new PIXI.Sprite(textures[util.randInt(1, 9)]);
		s.position.set(Math.random()*renderer.width*50, Math.random()*renderer.height*50);
		container.addChild(s);
	} */

	create();
}

var s, p1, p2;

function create() {
	var start = {x: 200, y: 400},
		end = {x: 100, y: 100};
	
	p1 = new PIXI.Graphics();
	p1.beginFill(0x0000FF, 0.5);
	p1.drawRect(0, 0, 6, 6);
	p1.endFill();
	p1.position.set(start.x, start.y);
	stage.addChild(p1);
	
	p2 = new PIXI.Graphics();
	p2.beginFill(0xFF0000, 0.5);
	p2.drawRect(0, 0, 6, 6);
	p2.endFill();
	p2.position.set(end.x, end.y);
	stage.addChild(p2);
	
	newLine(start, end);
}
var lineTexture = new PIXI.Texture.fromImage("images/line.png");
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
		
	s = new PIXI.Sprite(lineTexture);
	
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
	} else if (sX < eX && eY > sY) { // to bott right
		teta = atan(dy / dx);
		width = sqrt( pow(dy, 2) + pow(dx, 2) );
		s.x = sX;
		s.y = sY;
		s.width = width;
		s.rotation = teta;
	} else if (sX < eX && eY < sY) { // to top right
		teta = -atan(dy / dx);
		width = sqrt( pow(dy, 2) + pow(dx, 2) );
		s.x = sX;
		s.y = sY;
		s.width = width;
		s.rotation = teta;
		
	} else if (sX > eX && eY > sY) { // to bott left
		teta = PI-atan(dy / dx);
		width = sqrt( pow(dy, 2) + pow(dx, 2) );
		s.x = sX;
		s.y = sY;
		s.width = width;
		s.rotation = teta;
	} else if (sX > eX && eY < sY) { // to top left
		teta = PI+atan(dy / dx);
		width = sqrt( pow(dy, 2) + pow(dx, 2) );
		s.x = sX;
		s.y = sY;
		s.width = width;
		s.rotation = teta;
	}
	
	
	
	container.addChild(s);
}


/*
	else if (sX < eX && eY > sY) { // to bott right
		x = eX-sX;
		y = eY-sY;
		s.x = sX;
		s.y = sY;
		s.width = sqrt( pow(x, 2) + pow(y, 2) );
		s.rotation = atan( y / x );
	} 
*/


$(onReady);