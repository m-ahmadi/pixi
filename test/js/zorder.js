PIXI.utils.skipHello();
var renderer = PIXI.autoDetectRenderer(
	window.innerWidth,
	window.innerHeight,
	{
		backgroundColor : 0x1099bb
	}
);
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();

var main = new PIXI.Container();
var box1 = new PIXI.Container();
var box2 = new PIXI.Container();


var yellow = 0xFFFF00;
var red = 0xFF0000;

var g = rect(yellow);
var g2 = rect(yellow);
var g3 = rect(red);
var g4 = rect(red);


addDragDrop(g);
addDragDrop(g2)
addDragDrop(g3)
addDragDrop(g4)


box1.addChild(g);
box1.addChild(g2);
box2.addChild(g3);
box2.addChild(g4);


main.addChild(box2, box1);
stage.addChild(main);


function rect(color) {
	var r = new PIXI.Graphics();
	r.interactive = true;
	r.buttonMode = true;
	r.beginFill(color, 1);
	r.lineStyle(4, 0x0000FF, 1);
	r.drawRect(0, 0, 100, 100);
	r.endFill();
	return r;
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

$(function () {
	
});