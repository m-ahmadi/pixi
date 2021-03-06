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





var panel = new PIXI.Graphics(),
	panelWidth = 600,
	panelHeight = 400,
	panelOffset = 200;
	
panel.beginFill(0xE3E3E3);
panel.lineStyle(0);
panel.drawRect(0, 0, panelWidth, panelHeight);
panel.endFill();
//panel.position.set( panelPos.x, panelPos.y ); 



var rect = new PIXI.Graphics(),
	rectWidth = renderer.width / 10,
	rectHeight = renderer.height / 3;
rect.interactive = true;
rect.buttonMode = true;
rect.beginFill(0x2196F3, 1);
rect.lineStyle(0);
rect.drawRect(0, 0, 150, 150);
rect.endFill();
rect.alpha = 0.5;
rect.TPL_nav = 'box';

var dot = new PIXI.Graphics(),
	dotWH = 6,
	dotHalf = dotWH / 2,
	dotPos = {
		get x() { return (rect.x + rect.width) - dotHalf; },
		get y() { return (rect.y + rect.height) - dotHalf; }
	};
dot.interactive = true;
dot.buttonMode = true;
dot.beginFill(0x0000FF, 1);
dot.lineStyle(0);
dot.drawRect(0, 0, dotWH, dotWH);
dot.endFill();
dot.position.set( dotPos.x, dotPos.y );
dot.TPL_nav = 'dot';



var nav = new PIXI.Container();
var navPos = new PIXI.Point(
		renderer.width - (panelWidth + panelOffset),
		50
	);
nav.position.set( navPos.x, navPos.y );


nav.addChild(panel);
nav.addChild(rect);
nav.addChild(dot);

addDragDrop(rect);
addDragDrop(dot);
stage.addChild(nav);




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
function addCustomPos(el) {
	el.left = el.position.x;
	el.right = el.position.x + el.width;
	el.top = el.position.y;
	el.bott = el.position.y + el.height;
	
	/*
	return {
		left: el.position.x,
		right: el.position.x + el.width,
		top: el.position.y,
		bott: el.position.y + el.height
	};
	*/
}
function mousedown(e) {
	//bringToFront(this);
	this.data = e.data;
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

	if (this.TPL_nav === 'box') {
		this.dragging = true;
	}
	
	if (this.TPL_nav === 'dot') {
		this.mouseIsDown = true;
	}
}
function mousemove(e) {
	
	if (this.TPL_nav === 'box') {
		this.defaultCursor = 'move';
		
		if (this.dragging) {
			var newPosition = this.data.getLocalPosition(this.parent),
				newX = newPosition.x - this.dragPoint.x,
				newY = newPosition.y - this.dragPoint.y,
				dotNewX = newX + (rect.width - dotHalf),
				dotNewY = newY + (rect.height - dotHalf);
			
			var min = 0,
				maxX = panel.width - rect.width,
				maxY = panel.height - rect.height,
				rectNewPos = new PIXI.Point(),
				dotNewPos = new PIXI.Point();
			
			if ( newX > min  &&  newX <= maxX ) {
				rectNewPos.x = newX
			} else if ( newX < min ) {
				rectNewPos.x = min;
			} else if ( newX > maxX ) {
				rectNewPos.x = maxX;
			}
			
			if ( newY > min  &&  newY <= maxY ) {
				rectNewPos.y = newY;
			} else if ( newY < min ) {
				rectNewPos.y = min;
			} else if ( newY > maxY ) {
				rectNewPos.y = maxY;
			}
			
			dotNewPos.x = ( newX > min  &&  newX <= maxX ) ? dotNewX : dotPos.x;
			dotNewPos.y = ( newY > min  &&  newY <= maxY ) ? dotNewY : dotPos.y;
			
			
			
			rect.position.x = rectNewPos.x;
			rect.position.y = rectNewPos.y;
			dot.position.x = dotNewPos.x;
			dot.position.y = dotNewPos.y;
			
			//dot.position.x = (newX > 0) ? dotNewX: dotPos.x;
			//dot.position.y = (newY > 0) ? dotNewY : dotPos.y;
			
			/*
			rect.position.x = newX;
			rect.position.y = newY;
			dot.position.x = newX + (rect.width - dotHalf);
			dot.position.y = newY + (rect.height - dotHalf);
			*/
		}
		
		
	}
	
	if (this.TPL_nav === 'dot') {
		this.defaultCursor = 'nwse-resize';
		if (this.mouseIsDown) {
			var currentCursor = e.data.getLocalPosition(this.parent),
				resizeX = ( currentCursor.x - this.x ),
				resizeY = ( currentCursor.y - this.y );
				halfX = resizeX / 2,
				halfY = resizeY / 2;
			
			addCustomPos(rect);
			addCustomPos(panel);
			var	min = 0;
				nextRight = rect.width + resizeX,
				nextLeft = rect.position.x - halfX,
				nextBott = rect.height + resizeX,
				nextTop = rect.position.y - halfX,
				reachedRight = !(nextRight <= panel.right),
				reachedLeft = !(nextLeft > min),
				reachedBott = !(nextBott <= panel.bott),
				reachedTop = !(nextTop > min);
			
			if ( !reachedRight  &&  !reachedLeft ) {
				rect.width += resizeX;
				rect.position.x -= halfX;
				dot.position.x += halfX;
			} else if ( !reachedRight  &&  reachedLeft ) {
				rect.width += resizeX;
				dot.position.x += resizeX;
			}
			
			if ( !reachedBott  &&  !reachedTop ) {
				rect.height += resizeX;
				rect.position.y -= halfX;
				dot.position.y += halfX;
			} else if ( !reachedBott  &&  reachedTop ) {
				rect.height += resizeX;
				dot.position.y += resizeX;
			}
			
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
	// box.hitArea = new PIXI.Rectangle(0, 0, rect.width, rect.height);
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