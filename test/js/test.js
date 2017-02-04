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
stage.interactive = true;

var g, box;

g = new PIXI.Sprite.fromImage('../images/n/256/1.png');
g.interactive = true;
g.buttonMode = true;
g.scale.set(1);


box = new PIXI.Container();
box.interactive = true;
box.buttonMode = true;

box.addChild(g);
addDragDrop(box);
stage.addChild(box);




var t;
animate();
function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}
function down(e) {
	console.log(e.data);
	this.data = e.data;
	this.alpha = 0.5;
	this.dragging = true;
	this.dragPoint = e.data.getLocalPosition(this.parent);
	this.dragPoint.x -= this.position.x;
	this.dragPoint.y -= this.position.y;
	
	//bringToFront(this);
}
function move(e) {
	if (this.dragging) {
		var newPosition = this.data.getLocalPosition(this.parent);
		this.position.x = newPosition.x - this.dragPoint.x;
		this.position.y = newPosition.y - this.dragPoint.y;
	}
}
function up() {
	this.alpha = 1;
	this.dragging = false;
	this.data = null;
}
function addDragDrop(el) {
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
function bringToFront(el) {
	// reorder children for z-index
	var arr = stage.children;
	arr.splice( arr.indexOf(el), 1 );
	arr.push(el);
}

$(function () {
	
});