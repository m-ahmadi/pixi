var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
	backgroundColor: 0x1099bb,
	id: 'abc'
});
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.interactive = true;

var texture = PIXI.Texture.fromImage('images/computer.png');

var background = PIXI.Sprite.fromImage('images/hard-drive.png');
background.interactive = true;
background.buttonMode = true;
background.x = 100;
background.y = 250;
background.anchor.set(0, 0);
background.scale.set(0.5);

background
	.on('mousedown', ds)
	.on('mouseup', de)
	.on('mouseupoutside', de)
	.on('mousemove', dm);
	
//var newPosition;
function ds(e) {
	//newPosition = e.data.getLocalPosition(this.parent);
	this.data = e.data;
	this.alpha = 0.5;
	this.dragging = true;
	
	//@@@console.log( e.data.global.x - this.x );
};
function dm(e) {
	if (this.dragging) {
		var newPosition = e.data.getLocalPosition(this.parent);
		
		this.position.x = newPosition.x;
		this.position.y = newPosition.y;
	}
};
function de() {
	this.alpha = 1;
	this.dragging = false;
	this.data = null;
};

var sprite = new PIXI.Sprite(texture);
sprite.interactive = true;
sprite.buttonMode = true;
sprite.anchor.set(0.5);
sprite.scale.set(0.1);
sprite
	.on('mousedown', dragstart)
	.on('touchstart', dragstart)
	.on('mouseup', dragend)
	.on('mouseupoutside', dragend)
	.on('touchend', dragend)
	.on('touchendoutside', dragend)
	.on('mousemove', dragmove)
	.on('touchmove', dragmove);

sprite.position.x = 200;
sprite.position.y = 20;

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

rect
	.on('mousedown', ds)
	.on('mouseup', de)
	.on('mouseupoutside', de)
	.on('mousemove', dm);
var text = new PIXI.Text("salam", {font: "24px Impact", fill: "red"});

stage.addChild(background);
stage.addChild(rect);
stage.addChild(sprite);
stage.addChild(text)

requestAnimationFrame( animate );

function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}


function dragstart(e) {
	console.log(this);
    this.data = e.data;
    this.alpha = 0.5;
    this.dragging = true;
}
function dragmove(e) {
	//console.log(e.data.global.x, e.data.global.y);
    if (this.dragging) {
		var newPosition = this.data.getLocalPosition(this.parent);
		this.position.x = newPosition.x;
		this.position.y = newPosition.y;
    }
}
function dragend() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

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