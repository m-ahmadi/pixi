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
stage
	.on('mousedown', down2)
	.on('touchstart', down2)
	.on('mouseup', up2)
	.on('mouseupoutside', up2)
	.on('touchend', up2)
	.on('touchendoutside', up2)
	.on('mousemove', move2)
	.on('touchmove', move2);

var rect = new PIXI.Graphics();
rect.interactive = true;
rect.buttonMode = true;
rect.beginFill(0xFFFF00, 1);
rect.lineStyle(60, 0xFF0000, 1);
rect.drawRect(0, 20, 400, 400);
rect.endFill();



addDragDrop(rect);
addDragDrop(stage);
stage.addChild(rect);



var t;
animate();
function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}
function down(e) {
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
function up() {
	this.alpha = 1;
	this.dragging = false;
	this.data = null;
}
function move(e) {
	if (this.dragging) {
		var newPosition = this.data.getLocalPosition(this.parent);
		this.position.x = newPosition.x - this.dragPoint.x;
		this.position.y = newPosition.y - this.dragPoint.y;
	}
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

function down2() {
	
}
function up2() {
	
}
function move2() {
	
}
$(function () {
	stage.hitArea = new PIXI.Rectangle( 0, 0, 2000, 1000);
	
});