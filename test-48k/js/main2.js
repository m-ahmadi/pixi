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
	p1 = new PIXI.Graphics();
	p1.beginFill(0xFF0000);
	p1.drawRect(0, 0, 5, 5);
	p1.endFill();
	p1.x = 100;
	p1.y = 200;
	stage.addChild(p1);
	
	p1 = new PIXI.Graphics();
	p1.beginFill(0xFF0000);
	p1.drawRect(0, 0, 5, 5);
	p1.endFill();
	p1.x = 400;
	p1.y = 200;
	stage.addChild(p1);
	
	
	
	s = new PIXI.Sprite.fromImage("images/line.png");
	s.x = 100;
	s.y = 100;
	s.anchor.set(0, 0);
	container.addChild(s);
}






$(onReady);