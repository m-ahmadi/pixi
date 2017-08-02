const inst = u.extend( newPubSub() );

function dragStart(e) {
	this.data = e.data;
	this.alpha = 0.5;
	this.dragging = true;
	this.dragPoint = e.data.getLocalPosition(this.parent);
	this.dragPoint.x -= this.position.x;
	this.dragPoint.y -= this.position.y;
	bringToFront(this);
}
function dragMove(e) {
	if (this.dragging) {
		const newPosition = this.data.getLocalPosition(this.parent);
		this.position.x = newPosition.x - this.dragPoint.x;
		this.position.y = newPosition.y - this.dragPoint.y;
	}
}
function dragEnd() {
	this.alpha = 1;
	this.dragging = false;
	this.data = null;
}
function addDragDrop(el) {
	el
		.on("mousedown", dragStart)
		.on("touchstart", dragStart)
		.on("mouseup", dragEnd)
		.on("mouseupoutside", dragEnd)
		.on("touchend", dragEnd)
		.on("touchendoutside", dragEnd)
		.on("mousemove", dragMove)
		.on("touchmove", dragMove);
}
function bringToFront(el) {
	const arr = el.parent.children;
	arr.splice( arr.indexOf(el), 1 );
	arr.push(el);
}

export default inst