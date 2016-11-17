var asghar;
function dragStart(e) {
	this.data = e.data;
	this.alpha = 0.5;
	this.dragging = true;
    this.dragPoint = e.data.getLocalPosition(this.parent);
    this.dragPoint.x -= this.position.x;
    this.dragPoint.y -= this.position.y;
	
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
	
	
	if (this.TPL_node) {
		adjustLines(this);
	}
}

function adjustLines(node) {
	console.log( calcLinkPoints(node) );
}

function getPerimeterPoints(position) {
	if ( !position ) { throw new TypeError("getPerimeterPoints():  No argument!"); }
	if ( !a.util.isObject(position) ) { throw new TypeError("getPerimeterPoints():  Arg must be object"); }
	
	var x = position.x,
		y = position.y,
		width = position.width,
		height = position.height,
		result = {};
	
	result.topLeft = {
		x: x,
		y: y
	};
	result.topRight = {
		x: x + width,
		y: y
	};
	result.bottomLeft = {
		x: x,
		y: y + height
	};
	result.bottomRight = {
		x: x + width,
		y: y + height
	};
	return result;
}
function calcLinkPoints(node) {
	var points = [],
		source = getPerimeterPoints(node.position);
	
	
	
	node.TPL_links.positions.forEach(function (item) {
		var target = getPerimeterPoints(item);
		
		// where is this link point in relation to the current node
		
		if (target.topRight.x < source.topLeft.x) {
			console.log('1');
		} else if (target.topLeft.x > source.topLeft.x) {
			console.log('2');
		}
		
		if (target.topRight.y < source.topLeft.y) {
			console.log('3');
		} else if (target.topRight.y > source.topLeft.y) {
			console.log('4');
		}
		
		
	});
	
	return points;
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
