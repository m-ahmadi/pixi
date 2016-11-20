var asghar = 0;
var a = (function () {
"use strict";

var core = (function () {
	
	var adjustLine = function (points, line) {
		if (!line) { return; }
		//line.clear();
		//line.destroy();
		line = pixi.createLine(points);
		a.pixi.stage.addChild(line);
	},
	getNodeInfo = function (node) {
		/*	node: A sprite or a graphics object, or a link object
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
		result.midLeft = {
			x: x,
			y: y + (height / 2)
		}
		result.midRight = {
			x: x + width,
			y: y + (height / 2)
		};
		result.midTop = {
			x: x + (width / 2),
			y: y
		};
		result.midBott = {
			x: x + (width / 2),
			y: y + height
		};
		
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
		result.linkCount = node.linkCount || node.TPL_linkCount;
		
		return result;
	},
	calcLinksPositions = function (links, source) {
		/*	INCOMPLETE
			argument is an array of objects ie: { x: value, y: value}
			each object in the array represents:
			x and y of a node that has a link to the current/clicked/dragged node */
		var result = [];
		
		
		return result;
	},
	calcSidePoints = function (source, target) {
		/*	source: An object representing the clicked/dragged node info.
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
	},
	calcOneLink = function () {
		
	},
	calcLinkPoints = function (node) {
		var points = [],
			source = getNodeInfo(node);
		
		node.TPL_links.forEach(function (link) {
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
				target = getNodeInfo(link),
				distanceX,
				distanceY,
				frm,
				to;
			
			// where is this link point in relation to the current node
			// target: one of the links of the dragged node
			
			if ( target.right < source.left ) { // farLeft
				farLeft = true;
			} else if ( target.left > source.right ) { // farRight
				farRight = true;
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
			
			distanceX = source.left - target.left;
			distanceY = source.top - target.top;
			
			var xDistLarger = false,
				yDistLarger = false,
				xyDistEqual = false;
			
			if (distanceX > distanceY) {
				xDistLarger = true;
			} else if (distanceY > distanceX) {
				yDistLarger = true;
			} else if (distanceX === distanceY) {
				xyDistEqual = true;
			}
			
			if (farUp && farLeft) {
				frm = source.midLeft;
				if (xDistLarger) {
					to = target.midRight;
				} else if (yDistLarger) {
					to = target.midBott;
				} else if (xyDistEqual) {
					to = target.bottomRight;
				}
			} else if (farUp && farRight) {
				frm = source.midRight;
				if (xDistLarger) {
					to = target.midLeft;
				} else if (yDistLarger) {
					to = target.midBott;
				} else if (xyDistEqual) {
					to = target.bottomLeft;
				}
			} else if (farDown && farLeft) {
				frm = source.midLeft;
				if (xDistLarger) {
					to = target.midRight;
				} else if (yDistLarger) {
					to = target.midTop;
				} else if (xyDistEqual) {
					to = target.topRight;
				}
			} else if (farDown && farRight) {
				frm = source.midRight;
				if (xDistLarger) {
					to = target.midLeft;
				} else if (yDistLarger) {
					to = target.midTop;
				} else if (xyDistEqual) {
					to = target.topLeft;
				}
			}
			
			points.push({
				line: link.line,
				ferom: frm,
				to: to
			});
			/*
			sourceSide = '',
			targetSide = '',
			if (farUp || midUp) {
				sourceSide = 'top';
				targetSide =  'bottom';
			} else if (farDown || midDown) {
				sourceSide = 'bottom';
				targetSide =  'top';
			} else if (farRight || midRight) {
				sourceSide = 'right';
				targetSide = 'left';
			} else if (farLeft || midLeft) {
				sourceSide = 'left';
				targetSide =  'right';
			}
			source.side = sourceSide;
			target.side = targetSide;
			
			*/
			//calcSidePoints( source, target );
		});
		
		console.log(points);
		return points;
	},
	adjustLines = function (node) {
		var points = calcLinkPoints(node);
		
		points.forEach(function (item) {
			var points = [
				item.ferom.x,
				item.ferom.y,
				item.to.x,
				item.to.y
			];
			adjustLine(points, item.line);
		});
	},
	makeTPLNode = function (node, links, o) {
		node.TPL_node = true;
		node.TPL_nodeID = 'no_id';
		node.TPL_linkCount = links.length;
		node.TPL_links = [];
		links.forEach(function (item) {
			node.TPL_links.push({
				get x() { return item.node.x; },
				get y() { return item.node.y; },
				get width() { return item.node.width; },
				get height() { return item.node.height; },
				get linkCount() { return item.node.TPL_linkCount; },
				get line() { return item.line; }
			});
		});
	},
	init = function () {
		var kids = [];
		
		kids.push(pixi.createSprite({
			image: 'images/computer.png',
			scale: 0.2,
			x: 900,
			y: 20
		}));
		kids.push(pixi.createSprite({
			image: 'images/hard-drive.png',
			scale: 0.1,
			x: 900,
			y: 250
		}));
		kids.push(pixi.createRect({
			color: 0x0033CC,
			lineWidth: 4,
			lineColor: 0xFF0000,
			alpha: 1,
			x: 600,
			y: 250,
			width: 120,
			height: 120
		}));
		kids.push(pixi.createText({
			text: 'salam',
			size: '24px',
			color: 'red',
		}));
		kids.push(pixi.createRect({
			color: 0x0033CC,
			x: 50,
			y: 250,
			width: 100,
			height: 100
		}));
		kids.push(pixi.createRect({
			color: 0x0033CC,
			x: 400,
			y: 50,
			width: 100,
			height: 100
		}));
		
		var line = pixi.createLine({
			color: 0xFFFFF,
			thickness: 2,
			points: [0, 0, 150, 150]
		});
		var n1 = pixi.createSprite({
			image: 'images/pcb.png',
			scale: 0.2,
			x: 200,
			y: 200
		});
		var n2 = pixi.createSprite({
			image: 'images/pcb.png',
			scale: 0.2,
			x: 500,
			y: 200
		});
		asghar = n2;
		makeTPLNode(n1, [{
			node: n2,
			line: line
		}]);
		makeTPLNode(n2, [{
			node: n1,
			line: line
		}]);
		kids.push(n1, n2, line);
		
		kids.forEach(function (i) {
			pixi.stage.addChild(i);
		});
		
	};
	
	return {
		adjustLines: adjustLines,
		makeTPLNode: makeTPLNode,
		init: init
	};
}());



var pixi = (function () {
	var p = {};
	p.renderer;
	p.stage;
	
	function init() {
		p.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight,
			{
				backgroundColor: 0xAB9999
			}
		);
		document.body.appendChild( p.renderer.view );
		p.stage = new PIXI.Container();
		p.stage.interactive = true;
		p.stage.buttonMode = true;
		
		requestAnimationFrame( animate );
		p.renderer.render( p.stage );
	}
	function dragStart(e) {
		this.data = e.data;
		this.alpha = 0.5;
		this.dragging = true;
		this.dragPoint = e.data.getLocalPosition(this.parent);
		this.dragPoint.x -= this.position.x;
		this.dragPoint.y -= this.position.y;
		
		// reorder children for z-index
		var arr = p.stage.children;
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
			core.adjustLines(this);
		}
	}
	function animate() {
		requestAnimationFrame(animate);
		//tink.update();
		//TWEEN.update();
		p.renderer.render(p.stage);
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
	function createSprite(o, noDrag) {
		var sprite = new PIXI.Sprite.fromImage(o.image);
		sprite.interactive = true;
		sprite.buttonMode = true;
		sprite.anchor.set(0, 0);
		sprite.scale.set(o.scale);
		sprite.position.x = o.x;
		sprite.position.y = o.y;
		
		if (!noDrag) {
			addDragDrop(sprite);
		}
		
		return sprite;
	}
	function createLine(o, noDrag) {
		var line = new PIXI.Graphics(),
			points,
			i;
		
		if ( util.isObject(o) ) {
			points = o.points;
		} else if ( util.isArray(o) ) {
			points = o;
		}
		
		line.interactive = true;
		line.buttonMode = true;
		line.beginFill();
		line.lineStyle(
			o.thickness || 2,
			o.color || 0x000000,
			o.alpha || 1
		);
		
		line.moveTo( points[0], points[1] );
		for (i=2; i < points.length ;i+=2) {
			line.lineTo( points[i], points[i+1] );
		}
		line.lineTo( points[0], points[1] );
		line.endFill();
		
		if (!noDrag) {
			addDragDrop(line);
		}
		
		return line;
	}
	function createRect(o, noDrag) {
		var rect = new PIXI.Graphics();
		
		rect.interactive = true;
		rect.buttonMode = true;
		rect.beginFill(o.color);
		rect.lineStyle(
			o.lineWidth || 0,
			o.lineColor || 0x000000,
			o.alpha || 1
		);
		rect.drawRect(
			o.x || 0,
			o.y || 0,
			o.width,
			o.height
		);
		rect.endFill();
		
		if (!noDrag) {
			addDragDrop(rect);
		}
		
		return rect;
	}
	function createText(o, noDrag) {
		var text = new PIXI.Text(o.text, {
			fontFamily: o.font || 'Impact',
			fontSize: o.size || '12px',
			fill: o.color || 'black'
		});
		text.interactive = true;
		text.buttonMode = true;
		
		if (!noDrag) {
			addDragDrop(text);
		}
		
		return text;
	}
	
	return {
		get renderer() { return p.renderer; },
		get stage() { return p.stage; },
		init: init,
		animate: animate,
		addDragDrop: addDragDrop,
		createSprite: createSprite,
		createLine: createLine,
		createRect: createRect,
		createText: createText
	};
}());
	



return {
	pixi: pixi,
	core: core
};
	

}());