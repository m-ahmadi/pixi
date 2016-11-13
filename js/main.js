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

var line = PIXI.Sprite.fromImage('images/line.png');
line.interactive = true;
line.buttonMode = true;
line.width = 200;
line.height = 100;
line.x = 200;
line.y = 100;
line.anchor.set(0);
addDragDrop(line);
stage.addChild(line);

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
sprite.position.x = 200;
sprite.position.y = 20;
//------------------------------------------------------------------------

var harddrive = PIXI.Sprite.fromImage('images/hard-drive.png');
harddrive.interactive = true;
harddrive.buttonMode = true;
harddrive.backgroundFill = 0x2099bb;
harddrive.x = 100;
harddrive.y = 250;
harddrive.anchor.set(0, 0);
harddrive.scale.set(0.5);

//------------------------------------------------------------------------

var graphics = new PIXI.Graphics();
graphics.interactive = true;
graphics.buttonMode = true;
graphics.beginFill(0x0033CC);
graphics.lineStyle(4, 0xFF0000, 1);
graphics.drawRect(50, 250, 120, 120);
graphics.endFill();
graphics.x = 64;
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

var g1 = new PIXI.Graphics();
g1.interactive = true;
g1.buttonMode = true;
g1.beginFill(0x0033CC);
g1.lineStyle(2, 0xFF0000, 1);
g1.drawRect(0, 0, 120, 120);
g1.endFill();
g1.x = 600;
g1.y = 200;

var line2 = PIXI.Sprite.fromImage('images/line.png');
line2.interactive = true;
line2.buttonMode = true;
line2.width = 200;
line2.height = 50;
line2.x = 720;
line2.y = 235;
line2.anchor.set(0);

var g2 = new PIXI.Graphics();
g2.interactive = true;
g2.buttonMode = true;
g2.beginFill(0x0033CC);
g2.lineStyle(1, 0xFF0000, 1);
g2.drawRect(0, 0, 120, 120);
g2.endFill();
g2.x = 920;
g2.y = 200;

stage.addChild(g1);
stage.addChild(g2);
stage.addChild(line2);


		
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
var prev;
function dm(e) {
	if (this.dragging) {
		prev = this.y
		var newPosition = this.data.getLocalPosition(this.parent),
			newX = newPosition.x - this.dragPoint.x;
			newY = newPosition.y - this.dragPoint.y;
		
		this.position.x = newX;
		this.position.y = newY;
		
		//line2.rotation -= 0.01;
		if (newY < prev) {
			console.log(0);
			line2.rotation = prev - newY;
		}
		line2.x = newX + 120;
		line2.y = newY + 35;
	}
}
function de() {
	this.alpha = 1;
	this.dragging = false;
	this.data = null;
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