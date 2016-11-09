var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
	backgroundColor: 0x1099bb
});
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.interactive = true;

var texture = PIXI.Texture.fromImage('images/computer.png');


var bunny = new PIXI.Sprite(texture);
bunny.interactive = true;
bunny.buttonMode = true;
bunny.anchor.set(0.5);
bunny.scale.set(0.06);
bunny
	.on('mousedown', dragstart)
	.on('touchstart', dragstart)
	.on('mouseup', dragend)
	.on('mouseupoutside', dragend)
	.on('touchend', dragend)
	.on('touchendoutside', dragend)
	.on('mousemove', dragmove)
	.on('touchmove', dragmove);
bunny.position.x = 200;
bunny.position.y = 20;

var rect = new PIXI.Graphics();
rect.beginFill(0x0033CC);
rect.lineStyle(4, 0xFF0000, 1);
rect.drawRect(0, 0, 96, 96);
rect.endFill();
rect.x = 64;
rect.y = 64;
rect.alpha = 0.5;
stage.addChild(rect);



stage.addChild(bunny);

var text = new PIXI.Text("Hello Pixi!", {font: "48px Impact", fill: "red"});

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
