// PIXI.utils.skipHello();
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {backgroundColor : 0x3F51B5});
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.interactive = true;
stage.hitArea = new PIXI.Rectangle( 0, 0, 100000, 100000 );

var s = new PIXI.Sprite.fromImage('https://placeholdit.imgix.net/~text?txtsize=15&txt=image1&w=120&h=120');
s.interactive = true;
s.buttonMode = true;

var g = new PIXI.Graphics();
g.interactive = true;
g.buttonMode = true;
g.beginFill();
g.drawRect(0, 0, 100, 100);
g.endFill();
g.x = 200;

var tc = new PIXI.Container();
tc.x = 400;

addEvt(stage);
addEvt(s, true);
addEvt(g, true);

stage.addChild(s);
stage.addChild(g);
stage.addChild(tc);

animate();
function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}

function addEvt(el, o) {
	var handler = o ? b : a;
	el
	//	.on('click', handler)
		.on('mousedown', handler)
	//	.on('mousemove', handler)
	//	.on('mouseout', handler)
	//	.on('mouseover', handler)
	//	.on('mouseup', handler)
	//	.on('mouseupoutside', handler)
	//	.on('pointerdown', handler)
	//	.on('pointermove', handler)
	//	.on('pointerout', handler)
	//	.on('pointerover', handler)
	//	.on('pointertap', handler)
	//	.on('pointerup', handler)
	//	.on('pointerupoutside', handler)
	//	.on('rightclick', handler)
	//	.on('rightdown', handler)
	//	.on('rightup', handler)
	//	.on('rightupoutside', handler)
	//	.on('tap', handler)
	//	.on('touchend', handler)
	//	.on('touchendoutside', handler)
	//	.on('touchmove', handler)
	//	.on('touchstart', handler);
}
function a(e) {
	console.log(e);
	log('event fired, which:'+e.data.originalEvent.which+' button: '+e.data.originalEvent.button)
}
function b(e) {
	e.stopPropagation();
	console.log(e);
	log('event fired, which:'+e.data.originalEvent.which+' button: '+e.data.originalEvent.button)
}



function clearLogs(e) {
	tc.removeChildren();
	txtY = 0;
}
var txtY = 0;
function log(str) {
	var t = new PIXI.Text(str);
	t.y = txtY;
	txtY+= t.height;
	tc.addChild(t);
}

$(function () {
	$('#clear').on('click', clearLogs);
});