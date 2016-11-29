var renderer = PIXI.autoDetectRenderer(
	window.innerWidth,
	window.innerHeight,
	{
		backgroundColor : 0x1099bb
	}
);
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();


var box = new PIXI.Container();

var rect = new PIXI.Graphics();
rect.interactive = true;
rect.buttonMode = true;

rect.beginFill(0x3f51b5, 1);
rect.lineStyle(6, 0x000000, 1);
rect.drawRect(0, 0, 200, 200);
rect.endFill();

var dot = new PIXI.Graphics();
dot.beginFill(0x000000, 1);
dot.lineStyle(10, 0x000000, 1);
dot.drawRect(0, 0, 10, 10);
dot.endFill();

box
	.on('mousedown', mousedown)
	.on('touchstart', mousedown)
	.on('mouseup', mouseup)
	.on('mouseupoutside', mouseup)
	.on('touchend', mouseup)
	.on('touchendoutside', mouseup)
	.on('mousemove', mousemove)
	.on('touchmove', mousemove);


box.addChild(rect);
box.addChild(dot);



animate();
function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}
function mousedown(e) {
	this.data = e.data;
	this.dragging = true;
	this.dragPoint = e.data.getLocalPosition(this.parent);
	this.dragPoint.x -= this.position.x;
	this.dragPoint.y -= this.position.y;
	
	//bringToFront(this);
}
function mousemove(e) {
	var mouse = e.data.global;
	alert()
	if ( mouse.x > rect.x  &&
			mouse.x < rect.x + 10 ) {
		console.log(1);
		rect.defaultCursor = 'nwse-resize';
	} else {
		rect.defaultCursor = 'move';
	}
	
	if ( mouse.x > rect.x  &&
			mouse.x < (rect.x + rect.width) &&
			mouse.x > (rect.x + rect.width) - 10) {
		console.log(2);
		rect.defaultCursor = 'nwse-resize';
	} else {
		rect.defaultCursor = 'move';
	}
	// rect.defaultCursor = 'nwse-resize';
	
	
	
	
	if (this.dragging) {
		var newPosition = this.data.getLocalPosition(this.parent);
		this.position.x = newPosition.x - this.dragPoint.x;
		this.position.y = newPosition.y - this.dragPoint.y;
	}
}
function mouseup() {
	this.dragging = false;
	this.data = null;
}
function bringToFront(el) {
	// reorder children for z-index
	var arr = stage.children;
	arr.splice( arr.indexOf(el), 1 );
	arr.push(el);
}

$(function () {
	box.hitArea = new PIXI.Rectangle(0, 0, rect.width, rect.height);
	stage.addChild(box);
});