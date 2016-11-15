var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
	backgroundColor: 0x506699
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


// var newline = ll.clone();
// newline.x = Math.random() * window.innerWidth *5;
// newline.y = Math.random() * window.innerHeight *5;
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
var line = new PIXI.Graphics();
line.interactive = true;
line.buttonMode = true;
line.lineStyle(1, 0xff0000, 1);
line.beginFill();
line.moveTo(300, 100);
line.lineTo(291, 400);
line.lineTo(310, 100);
line.lineTo(300, 100);
line.currentPath.shape.closed = false;
line.endFill();

var g1 = new PIXI.Graphics();
g1.interactive = true;
g1.buttonMode = true;
g1.beginFill(0x0033CC);
g1.lineStyle(0, 0xFF0000, 1);
g1.drawRect(0, 0, 100, 100);
g1.endFill();
g1.x = 100;
g1.y = 100;

var g2 = new PIXI.Graphics();
g2.interactive = true;
g2.buttonMode = true;
g2.beginFill(0x0033CC);
g2.lineStyle(0, 0xFF0000, 1);
g2.drawRect(0, 0, 100, 100);
g2.endFill();
g2.x = 400;
g2.y = 50;


g1.linkPoints = {
	first: {
		get x() { return g1.x + g1.width; },
		get y() { return g1.y + (g1.height / 2); }
	}
};
g2.linkPoints = {
	first: {
		get x() { return g2.x; },
		get y() { return g2.y + (g2.height / 2); }
	}
};

g1.line = line;
g2.line = line;
g1.links = g2;
g2.links = g1;

function adjustLine(line, fromPoint, toPoint) {
	
}
//************************************************************************************************************
// tink.makeDraggable(harddrive);
//tink.makeDraggable(rect);
// tink.makeDraggable(sprite);
addDragDrop(text);
addDragDrop(sprite);
addDragDrop(harddrive);
addDragDrop(graphics);
addDragDrop(g1);
addDragDrop(g2);
addDragDrop(line);
addDragDrop(line1);
// background.addChild(harddrive);
// background.addChild(rect);
// background.addChild(sprite);
// background.addChild(text);
stage.addChild(harddrive);
stage.addChild(graphics);
stage.addChild(sprite);
stage.addChild(text);
stage.addChild(background);
stage.addChild(line1);
stage.addChild(g1);
stage.addChild(g2);
stage.addChild(line);
//************************************************************************************************************
requestAnimationFrame( animate );
renderer.render(stage);