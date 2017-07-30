let element: PIXI.Container;
let isDragging, prevX, prevY;

function down(e) {
	const pos = e.data.global;
	prevX = pos.x;
	prevY = pos.y;
	isDragging = true;
}
function move(e) {
	if ( !isDragging ) return;
	const el = element;
	const pos = e.data.global;
	const dx = pos.x - prevX;
	const dy = pos.y - prevY;
	el.position.x += dx;
	el.position.y += dy;
	prevX = pos.x;
	prevY = pos.y;
}
function up() {
	isDragging = false;
}

export default function (el: PIXI.Container) {
	element = el;
	el
		.on('mousedown', down)
		.on('touchstart', down)
		.on('mouseup', up)
		.on('mouseupoutside', up)
		.on('touchend', up)
		.on('touchendoutside', up)
		.on('mousemove', move)
		.on('touchmove', move);
}