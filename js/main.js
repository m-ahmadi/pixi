var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
	backgroundColor: 0x1099bb
});
document.body.appendChild(renderer.view);

var tink = new Tink(PIXI, renderer.view);

var stage = new PIXI.Container();
stage.interactive = true;
stage.buttonMode = true;

//************************************************************************************************************
var texture = PIXI.Texture.fromImage('images/computer.png');
var sprite = new PIXI.Sprite(texture);
sprite.interactive = true;
sprite.buttonMode = true;
sprite.anchor.set(0.5);
sprite.scale.set(0.2);
// sprite
	// .on('mousedown', dragstart)
	// .on('touchstart', dragstart)
	// .on('mouseup', dragend)
	// .on('mouseupoutside', dragend)
	// .on('touchend', dragend)
	// .on('touchendoutside', dragend)
	// .on('mousemove', dragmove)
	// .on('touchmove', dragmove);

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

// harddrive
	// .on('mousedown', ds)
	// .on('mouseup', de)
	// .on('mouseupoutside', de)
	// .on('mousemove', dm);
	

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

// rect
	// .on('mousedown', ds)
	// .on('mouseup', de)
	// .on('mouseupoutside', de)
	// .on('mousemove', dm);

var text = new PIXI.Text("salam", {fontFamily: "Impact", fontSize: "24px", fill: "red"});
//************************************************************************************************************
tink.makeDraggable(harddrive);
tink.makeDraggable(rect);
tink.makeDraggable(sprite);


stage.addChild(harddrive);
stage.addChild(rect);
stage.addChild(sprite);
stage.addChild(text);

//************************************************************************************************************
requestAnimationFrame( animate );


renderer.render(stage);


/*
var initX,
	initY,
	left = false,
	right = false,
	up = false,
	down = false;
	
$('canvas')
	.on('mousedown', function (e) {
		this.dragit = true;
		initX = e.pageX;
		initY = e.pageY
	})
	.on('mousemove', function (e) {
		var x = e.pageX,
			y = e.pageY;
		
		if (!this.dragit) { return; }
		
		
		if (x < initX) { // left
			right = false;
			left= true;
		} else if (x > initX) { // right
			right = true;
			left = false;
		}
		if (y < initY) { // up
			down = false;
			up = true;
		} else if (y >  initY) { // down
			up = false;
			down = true
		}
		
		if (left) {
			stage.x += 1;
		}
		if (right) {
			stage.x -= 1;
		}
		if (up) {
			stage.y += 1;
		}
		if (down) {
			stage.y -= 1;
		}
	})
	.on('mouseup', function () {
		this.dragit = false;
	});
*/