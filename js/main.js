var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
	backgroundColor: 0x1099bb
});
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.interactive = true;

var texture = PIXI.Texture.fromImage('images/computer.png');

var background = PIXI.Sprite.fromImage('images/hard-drive.png');
background.interactive = true;
background.buttonMode = true;
background
	.on('mousedown', ds)
	.on('mouseup', de)
	.on('mouseupoutside', de)
	.on('mousemove', dm);

var ds = function ds(e) {
	this.data = e.data;
	this.alpha = 0.5;
	this.dragging = true;
};
var dm =  function () {
	if (this.dragging) {
		var newPosition = this.data.getLocalPosition(this.parent);
		this.position.x = newPosition.x;
		this.position.y = newPosition.y;
	}
};
var de =   function () {
	this.alpha = 1;
	this.dragging = false;
	this.data = null;
};

var sprite = new PIXI.Sprite(texture);
sprite.interactive = true;
sprite.buttonMode = true;
sprite.anchor.set(0.5);
sprite.scale.set(0.06);
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
rect.beginFill(0x0033CC);
rect.lineStyle(4, 0xFF0000, 1);
rect.drawRect(0, 0, 96, 96);
rect.endFill();
rect.x = 64;
rect.y = 64;
rect.alpha = 0.5;

var text = new PIXI.Text("Hello Pixi!", {font: "48px Impact", fill: "red"});

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
