PIXI.utils.skipHello();
var renderer = PIXI.autoDetectRenderer(
	window.innerWidth,
	window.innerHeight,
	{
		backgroundColor : 0xAB9988
	}
);
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();


var line = new PIXI.Graphics();
line.interactive = true;
line.buttonMode = true;
line.lineStyle(10, 0x224444, 1);
line.beginFill(0x00FFFF);
line.moveTo(50, 50);
line.lineTo(600, 50);
line.lineTo(600, 55);
line.lineTo(50, 55);
line.lineTo(50, 50);
line.endFill();

stage.addChild(line);
addDragDrop(line);

animate();
function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}
function down() {
	
}
function move(e) {
	
}
function over() {
	console.log(1);
}
function out() {
	console.log(2);
}
function up() {
	
}
function addDragDrop(el) {
	el
		.on('mousedown', down)
		.on('touchstart', down)
		.on('mouseup', up)
		.on('mouseupoutside', up)
		.on('touchend', up)
		.on('touchendoutside', up)
		.on('mousemove', move)
		.on('touchmove', move)
		.on('mouseover', over)
		.on('mouseout', out);
}
function bringToFront(el) {
	// reorder children for z-index
	var arr = stage.children;
	arr.splice( arr.indexOf(el), 1 );
	arr.push(el);
}

$(function () {
	
});