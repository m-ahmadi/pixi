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
stage.hitArea = new PIXI.Rectangle( -100000, -100000, renderer.width / renderer.resolution * 100000, renderer.height / renderer.resolution *100000 );
function zoom(x, y, isZoomIn) {
	var direction = isZoomIn ? 1 : -1,
		factor = (1 + direction * 0.1),
		local_pt = new PIXI.Point(),
		point = new PIXI.Point(x, y);
		
	PIXI.interaction.InteractionData.prototype.getLocalPosition(stage, local_pt, point);
	
	stage.scale.x *= factor;
	stage.scale.y *= factor;
	stage.pivot = local_pt;
	stage.position = point;
}






var g = new PIXI.Sprite.fromImage('../images/n/0.png');
g.interactive = true;
g.buttonMode = true;
g.scale.set(0.1);
addDragDrop(g);
stage.addChild(g);

var arr = [], i, s;

for (i=0; i<6; i+=1) {
	// s = new PIXI.Sprite.fromImage('../images/n/'+(i+1)+'.png');
	s = new PIXI.Sprite.fromImage('../images/new-icons/icon-0'+(i+1)+'.png');
	s.interactive = true;
	s.buttonMode = true;
	addDragDrop(s);
	stage.addChild(s);
}






var t;
animate();
function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}
function dragStart(e) {
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
	$(document).on('mousewheel', function (e) {
		zoom(e.pageX, e.pageY, e.deltaY > 0);
	});
});