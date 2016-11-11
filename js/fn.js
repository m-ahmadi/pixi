function ds(e) {
	//newPosition = e.data.getLocalPosition(this.parent);
	this.data = e.data;
	this.alpha = 0.5;
	this.dragging = true;
	
	var pointerX = e.data.global.x;
	var offsetX = pointerX - this.x; // previousX
	
	console.log( this.width, pointerX, offsetX );
	//@@@console.log( e.data.global.x - this.x );
}
function dm(e) {
	
	if (this.dragging) {
		var newPosition = e.data.getLocalPosition(this.parent);
		console.log(this);
		var pointerX = e.data.global.x;
		var pointerY = e.data.global.y;
		var offsetX = newPosition.x;
		var offsetY = newPosition.y;
		
		this.position.x = offsetX;
		this.position.y = offsetY;
	}
}
function de() {
	this.alpha = 1;
	this.dragging = false;
	this.data = null;
}


function dragstart(e) {
    this.data = e.data;
    this.alpha = 0.5;
    this.dragging = true;
}
function dragmove(e) {
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


function animate() {
    requestAnimationFrame(animate);
	tink.update();
    renderer.render(stage);
}