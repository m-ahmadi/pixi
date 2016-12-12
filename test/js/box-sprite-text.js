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



var sprite = new PIXI.Sprite.fromImage( '../images/computer.png' );
sprite.interactive = true;
sprite.buttonMode = true;
sprite.anchor.set(0.5);
sprite.alpha = 1;
sprite.scale.set( 0.2 );
sprite.position.set(0);

var text = new PIXI.Text( "ghoromdang", {
	fontFamily: 'Arial',
	fontSize: '20px',
	fill: 'black'
});
text.interactive = true;
text.buttonMode = true;



var box = new PIXI.Container();
box.interactive = true;
box.buttonMode = true;
//box.scale.set(0);
box.alpha = 1;
box.position.x = 400;
box.position.y = 50;
box.hitArea = new PIXI.Rectangle(0, 0, sprite.width, sprite.height);

box.addChild(sprite); 
box.addChild(text);
addDragDrop(box)
stage.addChild(box);






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
	text.y = sprite.y + sprite.height;
});