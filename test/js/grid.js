PIXI.utils.skipHello();
var renderer = PIXI.autoDetectRenderer(
	window.innerWidth,
	window.innerHeight,
	{
		backgroundColor : 0xAB9988
	}
);
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
var textures;

var r = renderer;

var g = new PIXI.Graphics();
g.beginFill(0, 0.3);
g.drawRect(0, 0, r.width / 4, r.height / 4);
g.endFill();


var s;

function cb() {
	s = new PIXI.Sprite(textures['computer-trans.png']);
	s.interactive = true;
	s.buttonMode = true;
	s.scale.set(0.2);
	
	addDragDrop(s);
	stage.addChild(s);
}


stage.addChild(g);

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

$(function () {
	PIXI.loader.add( '../images/atlas-0.json' );
	PIXI.loader.load(function () {
		textures = PIXI.loader.resources["../images/atlas-0.json"].textures;
		cb();
	});
	
	
});