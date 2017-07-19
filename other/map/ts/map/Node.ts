interface TextConfig {
	text: string;
	font: string;
	size: number;
	color: number;
}
function bringToFront(el: PIXI.DisplayObject) {
	let	arr = el.parent.children;
	arr.splice( arr.indexOf(el), 1 );
	arr.push(el);
}
function down(e) {
	e.stopPropagation();
	this.data = e.data;
	this.alpha = 0.5;
	this.dragging = true;
	this.dragPoint = e.data.getLocalPosition(this.parent);
	this.dragPoint.x -= this.position.x;
	this.dragPoint.y -= this.position.y;
}
function up(e) {
	e.stopPropagation();
	this.alpha = 1;
	this.dragging = false;
	this.data = null;
}
function move(e) {
	if ( this.dragging ) {
		var newPosition = this.data.getLocalPosition(this.parent);
		this.position.x = newPosition.x - this.dragPoint.x;
		this.position.y = newPosition.y - this.dragPoint.y;
	}
}
function addEvents(el) {
	el
		.on("mousedown", down) 
		.on("touchstart", down)
		.on("mouseup", up)
		.on("mouseupoutside", up)
		.on("touchend", up)
		.on("touchendoutside", up)
		.on("mousemove", move)
		.on("touchmove", move)
		.on("mouseover", over)
		.on("mouseout", out)
		.on('rightup', rightup);
}
function makeSprite(texture: PIXI.Texture) {
	let sprite = new PIXI.Sprite( texture );
	sprite.interactive = true;
	sprite.buttonMode = true;
	sprite.anchor.set(0, 0);
	sprite.alpha = 1;
	sprite.scale.set();
	sprite.position.x = 0.5;
	sprite.position.y = 0.5;
	return sprite;
}
function makeText( conf: TextConfig ) {
	let text = new PIXI.Text( conf.textContent, {
		fontFamily: conf.textFont,
		fontSize: conf.textSize,
		fill: conf.textColor
	});
	text.interactive = true;
	text.buttonMode = true;
	text.y = sprite.y + sprite.height;
}
function makeBox({ boxAlpha, x, y }) {
	let box = new PIXI.Container();
	// box = new PIXI.particles.ParticleContainer();
	box.interactive = true;
	box.buttonMode = true;
	box.scale.set(1);
	box.alpha = boxAlpha;
	box.position.x = x;
	box.position.y = y;
	box.hitArea = new PIXI.Rectangle(0, 0, sprite.width, sprite.height);
	addEvents(box);
	box.addChild(sprite); 
	box.addChild(text);
}
	
export default class Node {

	constructor() {
		
	}
}