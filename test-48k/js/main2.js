PIXI.utils.skipHello();
var renderer, stage, container, cnt,
	textures = {},
	HOW_MANY_NODES, HOW_MANY_LINES, NODE_AREA_SPAN, LINE_AREA_SPAN;


NODE_AREA_SPAN = 20;
LINE_AREA_SPAN = 600;
HOW_MANY_NODES = 16000;
HOW_MANY_LINES = 36000;



	
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
	var direction = (zoomIn) ? 1 : -1,
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
	stage.hitArea = new PIXI.Rectangle(-1000000, -1000000, 10000000, 10000000);
	makeDraggable(stage);
	$("canvas").on("mousewheel", function (e) {
		zoom(e.pageX, e.pageY, e.deltaY > 0);
	});
		
	requestAnimationFrame(animate);

	createTextures();
	
	container = new PIXI.ParticleContainer(600000, {
		scale:    false,
		position: false,
		rotation: false,
		uvs:      true,
		alpha:    false,
	}, 600000);
	cnt = new PIXI.ParticleContainer(600000, {
		scale:    false,
		position: false,
		rotation: false,
		uvs:      false,
		alpha:    false,
	}, 600000);
	stage.addChild(container);
	stage.addChild(cnt);

	for (var i = 0; i < HOW_MANY_LINES; i++) {
		newLine({
			x: Math.random()*renderer.width*-LINE_AREA_SPAN,
			y: Math.random()*renderer.height*-LINE_AREA_SPAN,
		}, {
			x: Math.random()*renderer.width*LINE_AREA_SPAN,
			y: Math.random()*renderer.height*LINE_AREA_SPAN,
		});
	}
	
	var spr;
	for (var j = 0; j < HOW_MANY_NODES; j++) {
		var k = ""+util.randInt(1, 10);
		// spr = new PIXI.Sprite( textures[k] );
		spr = new PIXI.Sprite.fromImage("images/t.png");
		spr.position.set(
			util.randInt(
				Math.random()*renderer.width*-NODE_AREA_SPAN,
				Math.random()*renderer.width*NODE_AREA_SPAN
			), util.randInt(
				Math.random()*renderer.height*-NODE_AREA_SPAN,
				Math.random()*renderer.height*NODE_AREA_SPAN
			)
		);
		cnt.addChild(spr);
	}
	
	// create();
}

var p1, p2;

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
var lineTexture = new PIXI.Texture.fromImage("images/line2.png");
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
		
	var s = new PIXI.Sprite(lineTexture);
	s.height = 1;
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