var renderer = PIXI.autoDetectRenderer(
	window.innerWidth,
	window.innerHeight,
	{
		backgroundColor : 0x10999F,
		antialias: true
	}
);
document.body.appendChild( renderer.view );
var stage = new PIXI.Container();




var lineWidth = 2,
	half = lineWidth / 2,
    start = {x: 600, y: 100},
    end = {x: 50, y: 100};
var line = new PIXI.Graphics();
line.beginFill(0xFF0000, 1);
line.interactive = true;
line.buttonMode = true;
line.alpha = 1;
line.lineStyle( 0 );

var polygonPoints,
	sLeft = {},
	sRight = {},
	eRight = {},
	eLeft = {},
	sX = start.x,
	sY = start.y,
	eX = end.x,
	eY = end.y;

if ( (sX < eX  &&  sY < eY)  || // topLeft to bottRight
		(sX > eX  &&  sY > eY) ) { // bottRight to topLeft
	sLeft = new PIXI.Point( sX-half, sY+half );
	sRight = new PIXI.Point( sX+half, sY-half );
	eRight = new PIXI.Point( eX+half, eY-half );
	eLeft = new PIXI.Point( eX-half, eY+half );
} else if ( (sX > eX  &&  sY < eY) || // topRight to bottLeft
		(sX < eX  &&  sY > eY) ) { // bottLeft to topRight
	sLeft = new PIXI.Point( sX-half, sY-half );
	sRight = new PIXI.Point( sX+half, sY+half );
	eRight = new PIXI.Point( eX+half, eY+half );
	eLeft = new PIXI.Point( eX-half, eY-half );
} else if ( sX === eX  &&
		(sY > eY  ||  sY < eY) ) { // vertical
	sLeft = new PIXI.Point( sX-half, sY );
	sRight = new PIXI.Point( sX+half, sY);
	eRight = new PIXI.Point( eX+half, eY );
	eLeft = new PIXI.Point( eX-half, eY );
	
} else if ( sY === eY  &&
		(sX < eX  ||  sX > eX) ) { // horizontal
	sLeft = new PIXI.Point( sX, sY+half );
	sRight = new PIXI.Point( sX, sY-half );
	eRight = new PIXI.Point( eX, eY-half );
	eLeft = new PIXI.Point( eX, eY+half );
}


console.log(sLeft, sRight, eRight, eLeft);


// line.lineStyle( lineWidth, 0x000000, 1 );

line.moveTo( sLeft.x, sLeft.y );
line.lineTo( sRight.x, sRight.y );
line.lineTo( eRight.x, eRight.y );
line.lineTo( eLeft.x, eLeft.y );
line.endFill();
addDragDrop(line);
stage.addChild(line);
/*
polygonPoints = [
	topLeft.x, topLeft.y,
	topRight.x, topRight.y,
	bottRight.x, bottRight.y,
	bottLeft.x, bottLeft.y
]
*/

var pol = new PIXI.Graphics();
pol.interactive = true;
pol.buttonMode = true;
pol.alpha = 0.5;
pol.beginFill(0xFFFF00, 1);
pol.lineStyle(0);
pol.drawPolygon( polygonPoints );

// pol.drawPolygon([
	/*
	95, 105,
	105, 95,
	205, 195,
	195, 205
	*/
	
	/*
	95, 105,
	105, 95,
	205, 195,
	195, 205
	*/
	
	/*
	start.x - half, start.y - half,
	start.x + half, start.y + half,
	end.x + half, end.x + half,
	end.x - half, end.x - half
	*/
	
	/*
	start.x - half, start.y + half,
	start.x + half, start.y - half,
	end.x + half, end.x - half,
	end.x - half, end.x + half
	*/
// ]);

pol.endFill();
addDragDrop(pol);
stage.addChild(pol);


var dot = new PIXI.Graphics();
dot.interactive = true;
dot.buttonMode = true;
dot.beginFill(0xFFFF00);
dot.lineStyle(0);
dot.drawRect(0, 0, 4, 4);
dot.endFill();
addDragDrop(dot);
stage.addChild(dot);
dot.position.set( start.x, start.y );
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
	
});