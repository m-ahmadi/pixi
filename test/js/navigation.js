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
rect.beginFill(0x3F51B5, 1);
rect.lineStyle(0);
rect.drawRect(0, 0, 200, 200);
rect.endFill();
rect.alpha = 0.5; 
rect.position.x = 50;
rect.position.y = 50;
rect.TPL_nav = 'box';

var dot = new PIXI.Graphics();
dot.interactive = true;
dot.buttonMode = true;
dot.beginFill(0x000000, 1);
dot.lineStyle(0);
dot.drawRect(0, 0, 10, 10);
dot.endFill();
dot.position.x = (rect.x + rect.width) -5;
dot.position.y = (rect.y + rect.height) -5;
dot.TPL_nav = 'dot';






box.addChild(rect);
box.addChild(dot);

addDragDrop(rect);
addDragDrop(dot);
stage.addChild(box);






animate();
function animate() {
    requestAnimationFrame( animate );
    renderer.render( stage );
}
function addDragDrop(el) {
	el
		.on('mousedown', mousedown)
		.on('touchstart', mousedown)
		.on('mouseup', mouseup)
		.on('mouseupoutside', mouseup)
		.on('touchend', mouseup)
		.on('touchendoutside', mouseup)
		.on('mousemove', mousemove)
		.on('touchmove', mousemove);
}
function mousedown(e) {
	//bringToFront(this);
	if (this.TPL_nav === 'box') {
		this.data = e.data;
		this.dragging = true;
		
		this.dragPoint = e.data.getLocalPosition(this.parent);
		
		/*
		console.log(
			this.position.x,
			this.dragPoint.x,
			this.dragPoint.x - this.position.x
		);
		*/
		
		this.dragPoint.x -= this.position.x;
		this.dragPoint.y -= this.position.y;
		
	}
	
	if (this.TPL_nav === 'dot') {
		this.mouseIsDown = true;
		this.clickPoint = e.data.global;
	}
}
var initX,
	initY;
function mousemove(e) {
	
	if (this.TPL_nav === 'box') {
		this.defaultCursor = 'move';
		
		if (this.dragging) {
			var newPosition = this.data.getLocalPosition(this.parent),
				newX = newPosition.x - this.dragPoint.x,
				newY = newPosition.y - this.dragPoint.y;
				
			this.position.x = newX;
			this.position.y = newY;
			
			dot.position.x = newX + (rect.width - 5);
			dot.position.y = newY + (rect.height - 5);
			
		}
		
		
	}
	
	if (this.TPL_nav === 'dot') {
		this.defaultCursor = 'nwse-resize';
		if (this.mouseIsDown) {
			var currentCursor = e.data.global,
				resizeX = ( currentCursor.x - this.x ),
				resizeY = ( currentCursor.y - this.y );
				halfX = resizeX / 2,
				halfY = resizeY / 2;
			
			console.log(halfX);
			
			rect.width += resizeX;
			rect.position.x -= halfX;
			
			rect.height += resizeX; // resizeY
			rect.position.y -= halfX; // halfY
			
			dot.position.x += halfX;
			dot.position.y += halfX; // halfY
			rect.defaultCursor = 'nwse-resize';
		}
	}
	
}
function mouseup() {
	this.dragging = false;
	this.data = null;
	
	if (this.TPL_nav === 'dot') {
		this.mouseIsDown = false;

	}
}
function bringToFront(el) {
	// reorder children for z-index
	var arr = stage.children;
	arr.splice( arr.indexOf(el), 1 );
	arr.push(el);
}

$(function () {
	box.hitArea = new PIXI.Rectangle(0, 0, rect.width, rect.height);
});

/*
	var mouse = data.global;
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
*/