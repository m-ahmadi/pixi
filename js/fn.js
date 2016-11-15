var asghar;
function dragStart(e) {
	this.data = e.data;
	this.alpha = 0.5;
	this.dragging = true;
    this.dragPoint = e.data.getLocalPosition(this.parent);
    this.dragPoint.x -= this.position.x;
    this.dragPoint.y -= this.position.y;
	asghar = this;
	console.log(this);
	// reorder children for z-index
	var arr = stage.children;
	arr.splice( arr.indexOf(this), 1 );
	arr.push(this);
}
function dragMove(e) {
	if (this.dragging) {
		var newPosition = this.data.getLocalPosition(this.parent);
		this.position.x = newPosition.x - this.dragPoint.x;
		this.position.y = newPosition.y - this.dragPoint.y;
	}
}
function dragEnd() {
	this.alpha = 1;
	this.dragging = false;
	this.data = null;
	
	
	if (this.deviceNode) {
		adjustLine(this.line, this.linkPoints.first, this.links.linkPoints.first);
	}
}


function animate() {
    requestAnimationFrame(animate);
	//tink.update();
	//TWEEN.update();
	
    renderer.render(stage);
}

function addDragDrop(sprite) {
	sprite
		.on('mousedown', dragStart)
		.on('touchstart', dragStart)
		.on('mouseup', dragEnd)
		.on('mouseupoutside', dragEnd)
		.on('touchend', dragEnd)
		.on('touchendoutside', dragEnd)
		.on('mousemove', dragMove)
		.on('touchmove', dragMove);
}
