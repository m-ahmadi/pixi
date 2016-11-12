var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
	backgroundColor: 0x1099bb
});
document.body.appendChild(renderer.view);

// var tink = new Tink(PIXI, renderer.view);

var stage = new PIXI.Container();
stage.interactive = true;
stage.buttonMode = true;

//************************************************************************************************************
var background = new PIXI.Container();

var texture = PIXI.Texture.fromImage('images/computer.png');
var sprite = new PIXI.Sprite(texture);
sprite.interactive = true;
sprite.buttonMode = true;
sprite.anchor.set(0.5);
sprite.scale.set(0.2);


sprite.position.x = 200;
sprite.position.y = 20;


var harddrive = PIXI.Sprite.fromImage('images/hard-drive.png');
harddrive.interactive = true;
harddrive.buttonMode = true;
harddrive.backgroundFill = 0x2099bb;
harddrive.x = 100;
harddrive.y = 250;
harddrive.anchor.set(0, 0);
//harddrive.scale.set(0.5);



var rect = new PIXI.Graphics();
rect.interactive = true;
rect.buttonMode = true;
rect.beginFill(0x0033CC);
rect.lineStyle(4, 0xFF0000, 1);
rect.drawRect(0, 0, 96, 96);
rect.endFill();
rect.x = 64;
rect.y = 64;
rect.alpha = 0.5;



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
addDragDrop(rect);

// background.addChild(harddrive);
// background.addChild(rect);
// background.addChild(sprite);
// background.addChild(text);

stage.addChild(harddrive);
stage.addChild(rect);
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
		stage.scale.set( stage.scale.x -= 0.1  );
		stage.scale.set( stage.scale.y -= 0.1  );
	} else {
		console.log( 'Zoom in..' );
		stage.scale.set( stage.scale.x += 0.1  );
		stage.scale.set( stage.scale.y += 0.1  );
	}
	
});
//************************************************************************************************************

var tween = new TWEEN.Tween( rect.position );
tween.to( {x: 500}, 1000);
tween.start();

