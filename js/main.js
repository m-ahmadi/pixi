var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
	backgroundColor: 0x1099bb
});
document.body.appendChild(renderer.view);

//var tink = new Tink(PIXI, renderer.view);

var stage = new PIXI.Container();
stage.interactive = true;
stage.buttonMode = true;

//************************************************************************************************************
var background = new PIXI.Container();
//------------------------------------------------------------------------
// Line

var line1 = PIXI.Sprite.fromImage('images/line.png');
line1.interactive = true;
line1.buttonMode = true;
line1.width = 200;
line1.height = 100;
line1.x = 900;
line1.y = 100;
line1.anchor.set(0);
addDragDrop(line1);
stage.addChild(line1);

/*
	var line = PIXI.Sprite.fromImage('images/line.png');
	line.interactive = true;
	line.buttonMode = true;

	line.width = 200;
	line.height = 10;
	line.x = Math.random() * window.innerWidth *5;
	line.y = Math.random() * window.innerHeight *5;
	line.anchor.set(0);
	
	addDragDrop(line);
	stage.addChild(line);
	
	----------------------------------
	var line = new PIXI.Graphics();
	line.lineStyle(1, 0x101010, 1);
	line.beginFill();
	line.moveTo(Math.random() * window.innerHeight *10, Math.random() * window.innerHeight *10);
	line.lineTo(Math.random() * window.innerHeight *10, Math.random() * window.innerHeight *10);
	line.endFill();
	
	var newline = line.clone();
	newline.x = Math.random() * window.innerWidth *5;
	newline.y = Math.random() * window.innerHeight *5;
	
	addDragDrop(line);
	stage.addChild(line);
	
*/
//------------------------------------------------------------------------
var texture = PIXI.Texture.fromImage('images/computer.png');
var sprite = new PIXI.Sprite(texture);
sprite.interactive = true;
sprite.buttonMode = true;
sprite.anchor.set(0.5);
sprite.scale.set(0.2);
sprite.position.x = 900;
sprite.position.y = 20;
//------------------------------------------------------------------------

var harddrive = PIXI.Sprite.fromImage('images/hard-drive.png');
harddrive.interactive = true;
harddrive.buttonMode = true;
harddrive.backgroundFill = 0x2099bb;
harddrive.x = 900;
harddrive.y = 250;
harddrive.anchor.set(0, 0);
harddrive.scale.set(0.1);

//------------------------------------------------------------------------

var graphics = new PIXI.Graphics();
graphics.interactive = true;
graphics.buttonMode = true;
graphics.beginFill(0x0033CC);
graphics.lineStyle(4, 0xFF0000, 1);
graphics.drawRect(50, 250, 120, 120);
graphics.endFill();
graphics.x = 900;
graphics.y = 64;


//------------------------------------------------------------------------
// Text
var text = new PIXI.Text("salam", {fontFamily: "Impact", fontSize: "24px", fill: "red"});
text.interactive = true;
text.buttonMode = true;
//************************************************************************************************************
// tink.makeDraggable(harddrive);
//tink.makeDraggable(rect);
// tink.makeDraggable(sprite);
addDragDrop(text);
addDragDrop(sprite);
addDragDrop(harddrive);
addDragDrop(graphics);


// background.addChild(harddrive);
// background.addChild(rect);
// background.addChild(sprite);
// background.addChild(text);

stage.addChild(harddrive);
stage.addChild(graphics);
stage.addChild(sprite);
stage.addChild(text);

stage.addChild(background);

//************************************************************************************************************
requestAnimationFrame( animate );
renderer.render(stage);



//************************************************************************************************************
$(document).on('mousewheel', function (e) {
	// e.deltaX, e.deltaY, e.deltaFactor
	
	
	if (e.deltaY < 0) {
		console.log( 'Zoom out...');
		stage.scale.set( stage.scale.x -= 0.01  );
		stage.scale.set( stage.scale.y -= 0.01  );
	} else {
		console.log( 'Zoom in..' );
		stage.scale.set( stage.scale.x += 0.01  );
		stage.scale.set( stage.scale.y += 0.01  );
	}
	
});
//************************************************************************************************************

// var tween = new TWEEN.Tween( graphics.position );
// tween.to( {x: 500}, 1000);
// tween.start();

//************************************************************************************************************
// connect line to shape
var line = PIXI.Sprite.fromImage('images/line.png');
line.interactive = true;
line.buttonMode = true;
line.width = 100;
line.height = 50;
line.x = 171;
line.y = 160;
line.anchor.set(0.5, 0.5);
/*
	get two points that needs to be connected
	calc the x between them
	rotate but save 2 points of the line
	rotate and change width if 2 points of line changes
*/

var g1 = new PIXI.Graphics();
g1.interactive = true;
g1.buttonMode = true;
g1.beginFill(0x0033CC);
g1.lineStyle(2, 0xFF0000, 1);
g1.drawRect(0, 0, 100, 100);
g1.endFill();
g1.x = 100;
g1.y = 100;

g1.linkPoints = {
	first: {
		get x() { return g1.x; },
		get y() { return g1.y + 50; }
	},
	second: {
		x: 100,
		y: 200
	}
};


var g2 = new PIXI.Graphics();
g2.interactive = true;
g2.buttonMode = true;
g2.beginFill(0x0033CC);
g2.lineStyle(1, 0xFF0000, 1);
g2.drawRect(0, 0, 100, 100);
g2.endFill();
g2.x = 400;
g2.y = 50;

g2.linkPoints = {
	first: {
		get x() { return g2.x + g2.width; },
		get y() { return g2.y + 50; }
	}
};

g1.line = line;
g2.line = line;
g1.links = g2;
g2.links = g1;

stage.addChild(g1);
stage.addChild(g2);
stage.addChild(line);

function ds(e) {
	this.data = e.data;
	this.alpha = 0.5;
	this.dragging = true;
    this.dragPoint = e.data.getLocalPosition(this.parent);
    this.dragPoint.x -= this.position.x;
    this.dragPoint.y -= this.position.y;
	
	// reorder children for z-index
	var arr = stage.children;
	arr.splice( arr.indexOf(this), 1 );
	arr.push(this);
}
var prevX,
	prevY,
	howmuchUp = 0,
	howmuchDown = 0;

var fromPoint = {
	x: 100,
	y: 150
},
toPoint = {
	x: 500,
	y: 100
};
function dm(e) {
	if (this.dragging) {
		prevX = this.x;
		prevY = this.y;
		var newPosition = this.data.getLocalPosition(this.parent),
			newX = newPosition.x - this.dragPoint.x;
			newY = newPosition.y - this.dragPoint.y;
		
		this.position.x = newX;
		this.position.y = newY;
	}
}
function de() {
	this.alpha = 1;
	this.dragging = false;
	this.data = null;
	//console.log(this.links.linkPoints.first);
	adjustLine(this.line, this.linkPoints.first, this.links.linkPoints.first);
}
function adjustLine(line, fromPoint, toPoint) {
	var x1 = fromPoint.x,
		y1 = fromPoint.y,
		x2 = toPoint.x,
		y2 = toPoint.y,
		distanceX, distanceY,
		midX, midY,
		bigX, smallX,
		bigY, smallY,
		diffY,
		rotation;
	if (x1 < 0 ||
		y1 < 0 ||
		x2 < 0 ||
		y2 < 0) {
		throw new Error('adjustLine():  Something\'s not right');
	}
		
	if (x1 > x2) {	
		bigX = x1;
		smallX = x2;
	} else if (x2 > x1) {
		bigX = x2;
		smallX = x1;
	}
	if (y1 > y2) {
		bigY = y1;
		smallY = y2;
	} else if (y2 > y1) {
		bigY = y2;
		smallY = y1;
	}
	distanceX = bigX - smallX;
	distanceY = bigY - smallY; // get diff in positive
	diffY = y1 - y2;           // get diff positive and negative
	
	midX = smallX + (distanceX / 2);
	midY = smallY + (distanceY / 2);
	rotation = ( ( (midY - smallY) / 2) + smallY ) / 1000;
	rotation = distanceY / 1000;
	
	
	line.x = midX;
	line.y = midY;
	console.log(  );
	line.width = distanceX;
	//line.rotation = a.util.makeNumberNegative( rotation );
	line.rotation = rotation;
	
	// adjust line width in high rotations
}

g1
	.on('mousedown', ds)
	.on('touchstart', ds)
	.on('mouseup', de)
	.on('mouseupoutside', de)
	.on('touchend', de)
	.on('touchendoutside', de)
	.on('mousemove', dm)
	.on('touchmove', dm);
g2
	.on('mousedown', ds)
	.on('touchstart', ds)
	.on('mouseup', de)
	.on('mouseupoutside', de)
	.on('touchend', de)
	.on('touchendoutside', de)
	.on('mousemove', dm)
	.on('touchmove', dm);