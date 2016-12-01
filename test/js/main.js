var renderer = PIXI.autoDetectRenderer(
	window.innerWidth,
	window.innerHeight,
	{
		backgroundColor : 0x1099bb
	}
);
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();

var rect = new PIXI.Graphics();
rect.interactive = true;
rect.buttonMode = true;
rect.beginFill(0xFFFF00, 1);
rect.lineStyle(60, 0xFF0000, 1);
rect.drawRect(0, 20, 400, 400);
rect.endFill();
addDragDrop(rect);
stage.addChild(rect);

var pol = new PIXI.Graphics();
pol.interactive = true;
pol.buttonMode = true;
pol.beginFill(0xFFFF00, 1);
pol.lineStyle(10, 0xFF0000, 1);
pol.drawPolygon([
	200, 100,
	210, 110,
	110, 210,
	100, 200
]);
/*
150, 100,
	170, 150,
	230, 155,
	185, 195,
	200, 250,
	150, 220,
	100, 250,
	115, 195,
	070, 155,
	130, 150
*/

pol.endFill();
addDragDrop(pol);
stage.addChild(pol);




var box = new PIXI.Container();
box.interactive = true;
box.buttonMode = true;
box.scale.set(0.5, 0.5);
box.alpha = 0;

var pc = new PIXI.Sprite.fromImage('images/pcb.png');
pc.interactive = true;
pc.buttonMode = true;
pc.anchor.set(0, 0);
pc.scale.set(0.5);
pc.x = 0;
pc.y = 0;


var text = new PIXI.Text('Router 24S-Hi23');
//text.interactive = true;
//text.buttonMode = true;

box.addChild(pc);
box.addChild(text);


addDragDrop(box);
//stage.addChild(box);





var tweenAlpha = TweenLite.to(box, 0.4, {
	alpha: 1,
	yoyo: true,
	ease: Linear.easeInOut
});

var tweenScale = TweenLite.to(box.scale, 0.4, {
	x: 1,
	y: 1,
	yoyo: true,
	ease: Linear.easeInOut
});


var t;
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
	box.hitArea = new PIXI.Rectangle( 0, 0, pc.width, pc.height);
	
	text.x += pc.width / 2;
	text.y = pc.y + pc.height;
});