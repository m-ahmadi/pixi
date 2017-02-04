// PIXI.utils.skipHello();
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.interactive = true;
stage.hitArea = new PIXI.Rectangle( 0, 0, 100000, 100000 );

var s = new PIXI.Sprite.fromImage('../images/computer.png');
s.interactive = true;
s.scale.set(0.2);
s.x = 300;
var g = new PIXI.Graphics();
g.interactive = true;
g.beginFill();
g.drawRect(0, 0, 100, 100);
g.endFill();

addEvt(stage);
addEvt(g);
addEvt(s);
stage.addChild(s);
stage.addChild(g);

animate();
function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}
function down(e) {
	console.log(e);
}
function up(e) {
	console.log(e);
}
function addEvt(el) {
	el
		.on('mousedown', down)
		.on('touchstart', down)
		.on('mouseup', up)
		.on('mouseupoutside', up)
		.on('touchend', up)
		.on('touchendoutside', up);
}
$(function () {
	
});