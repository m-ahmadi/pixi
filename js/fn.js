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
	
	
	if ( !a.util.isEmptyObject(this.TPL) ) {
		calcLinkPoints(this);
	}
}

function adjustLines(points) {
	line.destroy();
	line = new PIXI.Graphics();
	points.forEach(function (item) {
		var to = {
			x: item.to.x,
			y: item.to.y
		},
		ferom = {
			x: item.ferom.x,
			y: item.ferom.y
		};
		moveTo(ferom.x, ferom.y);
		lineTo(to.x, to.y);
		lineTo(ferom.x, ferom.y);
	});
}
function getNodeInfo(node) {
	/*	node: A sprite or a graphics object
		return: An object containing only required information about the node. */
	var x = node.x,
		y = node.y,
		width = node.width,
		height = node.height,
		result = {};
	
	result.left = x;
	result.right = x + width;
	result.top = y;
	result.bottom = y + height;
	result.linkCount = node.linkCount || node.TPL.linkCount;
	result.sides = node.sides || node.TPL.sides;
	
	return result;
}
function calcLinksPositions(links, source) {
	/*	INCOMPLETE
		argument is an array of objects ie: { x: value, y: value}
		each object in the array represents:
		x and y of a node that has a link to the current/clicked/dragged node */
	var result = [];
	
	
	return result;
}
function calcSidePoints(source, target) {
	/*	source: An object representing the clicked node info.
		target: An object representing one of the clicked node links.
		return: An object containing from and to points. */
	
	var srcSide = source.sides[source.side],
		trgSide = target.sides[target.side],
		srcSideLen = srcSide.length,
		trgSideLen = trgSide.length;
	
	console.log(srcSide, trgSide);
	
	if ( target.linkCount === 1 ) {
		
	} else if ( target.linkCount > 1 ) {
		
		if ( target.linkCount === 2 ) {
			var i;
			for (i=0; i < target.linkCout ;i+=1) {
				
			}
		} else if ( target.linkCount > 2 ) {
			
		}	
	}
	
	return {
		
	};
}
function calcLinkPoints(node) {
	var points = [],
		source = getNodeInfo(node, '');
	
	node.TPL.links.forEach(function (item) {
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
			target = getNodeInfo(item),
			sourceSide = '',
			targetSide = '';
			
		
		// where is this link point in relation to the current node
		if ( target.right < source.left ) { // farLeft
			farLeft = true;
			item.farLeft = true;
		} else if ( target.left > source.right ) { // farRight
			farRight = true;
			item.farRight = true;
		} else if ( target.left < source.left &&
				target.right > source.left ) { // midLeft
			midLeft = true;
		} else if ( target.left < source.right &&
				target.right > source.right ) { // midRight
			midRight = true;
		} else if ( target.left === source.left ) {
			sameX = true;
		}
		
		if ( target.bottom < source.top ) { // farUp
			farUp = true;
		} else if ( target.top > source.bottom ) { // farDown
			farDown = true;
		} else if ( target.bottom > source.top &&
				target.top < source.top ) { // midUp
			midUp = true;
		} else if ( target.bottom > source.top &&
				target.top > source.top ) { // midDown
			midDown = true;
		} else if ( target.top === source.top ) {
			sameY = true;
		}
		
		if (farUp || midUp) {
			sourceSide = 'top';
			targetSide =  'bottom';
		} else if (farDown || midDown) {
			sourceSide = 'bottom';
			targetSide =  'top';
		} else if (farRight || midRight) {
			sourceSide = 'right';
			targetSide =  'left';
		} else if (farLeft || midLeft) {
			sourceSide = 'left';
			targetSide =  'right';
		}
		
		source.side = sourceSide;
		target.side = targetSide;
		
		
		calcSidePoints( source, target );
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
