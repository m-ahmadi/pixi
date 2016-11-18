var asghar = 0;
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
		calcLinkPoints(this);
	}
}

function adjustLines(node) {
	
}
function getPerimeterPoints(node) {
	// if ( !position ) { throw new TypeError("getPerimeterPoints():  No argument!"); }
	// if ( !a.util.isObject(position) ) { throw new TypeError("getPerimeterPoints():  Arg must be object."); }
	
	var x = node.x,
		y = node.y,
		width = node.width,
		height = node.height,
		result = {};
	
	result.left = x;
	result.right = x + width;
	result.top = y;
	result.bottom = y + height;
	
	return result;
}
function calcLinksPositions(links, source) {
	/*	argument is an array of objects ie: { x: value, y: value}
		each object in the array represents:
		x and y of a node that has a link to the current node being processed. */
	var result = [];
	
	
	return result;
}
function calcLinkPoints(node) {
	var points = [],
		source = getPerimeterPoints(node);
	
	node.TPL_links.positions.forEach(function (item) {
		var farLeft = false,
			farRight = false,
			midLeft = false,
			midRight = false,
			farUp = false,
			farDown = false,
			midUp = false,
			midDown = false,
			sameX = false,
			sameY = false,
			target = getPerimeterPoints(item);
		
		// where is this link point in relation to the current node
		if ( target.right < source.left ) { // farLeft
			farLeft = true;
			item.farLeft = true;
			console.log('farLeft');
			
		} else if ( target.left > source.right ) { // farRight
			farRight = true;
			item.farRight = true;
			console.log('farRight');
		} else if ( target.left < source.left &&
				target.right > source.left ) { // midLeft
			midLeft = true;
			console.log('midLeft');
		} else if ( target.left < source.right &&
				target.right > source.right ) { // midRight
			midRight = true;
			console.log('midRight');
		} else if ( target.left === source.left ) {
			sameX = true;
			console.log('sameX');
		}
		
		if ( target.bottom < source.top ) { // farUp
			farUp = true;
			console.log('farUp');
		} else if ( target.top > source.bottom ) { // farDown
			farDown = true;
			console.log('farDown');
		} else if ( target.bottom > source.top &&
				target.top < source.top ) { // midUp
			midUp = true;
			console.log('midUp');
		} else if ( target.bottom > source.top &&
				target.top > source.top ) { // midDown
			midDown = true;
			console.log('midDown');
		} else if ( target.top === source.top ) {
			sameY = true;
			console.log('sameY');
		}
		
		if (farLeft && farUp) {
			
		}
		
	});
	
	
	// return [{
		// ferom: {
			// x: v,
			// y: v
		// },
		// to: {
			// x: v,
			// y: v
		// }
	// }, {
		
	// }];
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
