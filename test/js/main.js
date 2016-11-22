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

var pc = new PIXI.Sprite.fromImage('images/pcb.png');
pc.interactive = true;
pc.buttonMode = true;
pc.anchor.set(0, 0);
pc.scale.set(1);
pc.x = 0;
pc.y = 0;



var text = new PIXI.Text('Router 24S-Hi23');

box.addChild(pc);
box.addChild(text);




stage.addChild(box);



animate();
function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}


$(function () {
	text.x += pc.width /2;
	text.y = pc.y + pc.height;
});