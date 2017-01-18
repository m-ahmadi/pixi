var util = require('./util'),
	coPubsub = require('./pubsub');


var inst = util.extend( coPubsub() ),
	tplNodes = {},
	idCounter = 0; // createTplNode uses this
	t = function () { return tplNodes; }; // testing purposes

var
animateNode = function (element, o) {
	if ( !o ) { var o = {}; }
	var box = element;
	
	TweenLite.to(box, 0.3, {
		alpha: 1,
		yoyo: true,
		ease: Linear.easeInOut
	});

	TweenLite.to(box.scale, 0.3, {
		x: 1,
		y: 1,
		yoyo: true,
		ease: Linear.easeInOut,
		onComplete: o.done,
		onCompleteParams: o.doneParams,
		onCompleteScope: o.doneCtx
	});
},
adjustLine = function (line, points) {
	pixi.twoPointsLine.adjust({
		shape: line,
		start: {
			x: points[0],
			y: points[1]
		},
		end: {
			x: points[2],
			y: points[3]
		}
	});
	/*
	pixi.redrawLine(line, {
		points: points
	});
	*/
},
getNodeInfo = function (node) {
	/*	node: A sprite or a graphics object, or a link object
		return: An object containing only required information about the node. */
	var x = node.x,
		y = node.y,
		width = node.width,
		height = node.height,
		pos = {},
		result = {};
	
	result.linkCount = node.linkCount || node.TPL_linkCount;
	
	pos.left = x;
	pos.right = x + width;
	pos.top = y;
	pos.bottom = y + height;
	
	pos.midLeft = {
		x: x,
		y: y + (height / 2)
	}
	pos.midRight = {
		x: x + width,
		y: y + (height / 2)
	};
	pos.midTop = {
		x: x + (width / 2),
		y: y
	};
	pos.midBott = {
		x: x + (width / 2),
		y: y + height
	};
	
	pos.topLeft = {
		x: x,
		y: y
	};
	pos.topRight = {
		x: x + width,
		y: y
	};
	pos.bottomLeft = {
		x: x,
		y: y + height
	};
	pos.bottomRight = {
		x: x + width,
		y: y + height
	};
	
	result.pos = pos;
	
	return result;
},
getOneLinkRelativePosition = function (source, target) {
	// where is this link point in relation to the current node
	// target: one of the links of the dragged node
	var rel = {};
	rel.farLeft = false;
	rel.farRight = false;
	rel.midLeft = false;
	rel.midRight = false;
	rel.farUp = false;
	rel.farDown = false;
	rel.midUp = false;
	rel.midDown = false;
	rel.sameX = false;
	rel.sameY = false;
	
	if ( target.right < source.left ) { // farLeft
		rel.farLeft = true;
	} else if ( target.left > source.right ) { // farRight
		rel.farRight = true;
	} else if ( target.left < source.left &&
			target.right > source.left ) { // midLeft
		rel.midLeft = true;
	} else if ( target.left < source.right &&
			target.right > source.right ) { // midRight
		rel.midRight = true;
	} else if ( target.left === source.left ) {
		rel.sameX = true;
	}
	
	if ( target.bottom < source.top ) { // farUp
		rel.farUp = true;
	} else if ( target.top > source.bottom ) { // farDown
		rel.farDown = true;
	} else if ( target.bottom > source.top &&
			target.top < source.top ) { // midUp
		rel.midUp = true;
	} else if ( target.bottom > source.top &&
			target.top > source.top ) { // midDown
		rel.midDown = true;
	} else if ( target.top === source.top ) {
		rel.sameY = true;
	}
	
	target.rel = rel;
	return target;
},
calcDistance = function (x, y) {
	var distance = {},
		distX,
		distY;
	
	distX = x.bigX - x.smallX;
	distY = y.bigY - y.smallY;
	
	if ( distX > distY ) {
		
		distance.largerX = true;
		
	} else if ( distY > distX ) {
		
		distance.largerY = true;
		
	} else if ( distX === distY ) {
		
		distance.equalXY = true;
		
	}
	
	distance.x = distX;
	distance.y = distY;
	
	return distance;
},
calcLinkPoints = function (node) {
	var points = [],
		source = getNodeInfo(node),
		links = node.TPL_Stuff.links,
		srcTplNodeId = node.TPL_Stuff.id;
		
	Object.keys( links ).forEach(function (keyStr) {
		var tplNode = tplNodes[keyStr],
			link = tplNode.node,
			target,
			srcPos,
			trgPos,
			rel,
			dist,
			frm,
			to;
			
		target = getNodeInfo(link);
		srcPos = source.pos;
		trgPos = target.pos
		target = getOneLinkRelativePosition(srcPos, trgPos);
		rel = target.rel;
		
		if ( rel.farUp  &&  rel.farLeft ) {
			dist = calcDistance({
				bigX: srcPos.left,
				smallX: trgPos.right
			}, {
				bigY: srcPos.top,
				smallY: trgPos.bottom
			});
			
			if ( dist.largerX ) {
				frm = srcPos.midLeft;
				to = trgPos.midRight;
			} else if ( dist.largerY ) {
				frm = srcPos.midTop;
				to = trgPos.midBott;
			} else if ( dist.equalXY ) {
				frm = srcPos.topLeft;
				to = trgPos.bottomRight;
			}
		} else if ( rel.farUp  &&  rel.farRight ) {
			dist = calcDistance({
				bigX: trgPos.left,
				smallX: srcPos.right
			}, {
				bigY: srcPos.bottom,
				smallY: trgPos.top
			});
			
			if ( dist.largerX ) {
				frm = srcPos.midRight;
				to = trgPos.midLeft;
			} else if ( dist.largerY ) {
				frm = srcPos.midTop;
				to = trgPos.midBott;
			} else if ( dist.equalXY ) {
				frm = srcPos.topRight;
				to = trgPos.bottomLeft;
			}
		} else if ( rel.farDown  &&  rel.farLeft ) {
			dist = calcDistance({
				bigX: srcPos.left,
				smallX: trgPos.right
			}, {
				bigY: trgPos.top,
				smallY: srcPos.bottom
			});
			
			if ( dist.largerX ) {
				frm = srcPos.midLeft;
				to = trgPos.midRight;
			} else if ( dist.largerY ) {
				frm = srcPos.midBott;
				to = trgPos.midTop;
			} else if ( dist.equalXY ) {
				frm = srcPos.bottomLeft;
				to = trgPos.topRight;
			}
		} else if ( rel.farDown  &&  rel.farRight ) {
			dist = calcDistance({
				bigX: trgPos.left,
				smallX: srcPos.right
			}, {
				bigY: trgPos.top,
				smallY: srcPos.bottom
			});
			
			if ( dist.largerX ) {
				frm = srcPos.midRight;
				to = trgPos.midLeft;
			} else if ( dist.largerY ) {
				frm = srcPos.midBott;
				to = trgPos.midTop;
			} else if ( dist.equalXY ) {
				frm = srcPos.bottomRight;
				to = trgPos.topLeft;
			}
		}
		
		if ( rel.midLeft  ||  rel.midRight ) {
			if ( rel.farUp ) {
				frm = srcPos.midTop;
				to = trgPos.midBott;
				
			} else if ( rel.farDown ) {
				frm = srcPos.midBott;
				to = trgPos.midTop;
			}
		}
		
		if ( rel.midUp  ||  rel.midDown ) {
			if ( rel.farLeft ) {
				frm = srcPos.midLeft;
				to = trgPos.midRight;
			} else if ( rel.farRight ) {
				frm = srcPos.midRight;
				to = trgPos.midLeft;
			}
		}
		
		if (  !( (rel.midLeft || rel.midRight) &&
				(rel.midUp || rel.midDown) )  ) {
			
			points.push({
				line: tplNode.links[srcTplNodeId].line,
				ferom: frm,
				to: to
			});
		
		}
		
		
		
	});
	
	
	return points;
},
adjustLines = function (node) {
	var points = calcLinkPoints(node);
	
	if (points) {
		points.forEach(function (item) {
			if (!item.ferom  ||  !item.to) { console.warn("adjustLine(): Bad points olaghe sag"); return; }
			var points = [
				item.ferom.x,
				item.ferom.y,
				item.to.x,
				item.to.y
			];
			adjustLine(item.line, points);
		});
	}
	
},
makeTplNode = function (pixiElement, links, o) {
	/*
		links: [{
			node: pixiElement,
			line: pixiElement
		}, {}, {}]
		
	*/
	var hasLinks = false;
	if ( !o ) { var o = {}; }
	if ( links  &&  util.isArray(links) ) {
		hasLinks = true;
	}
	
	pixiElement.TPL_node = true;
	pixiElement.TPL_nodeID = o.nodeId || 'no_id';
	pixiElement.TP_nodeName = o.nodeName || 'no_name';
	
	if (hasLinks) {
		pixiElement.TPL_links = [];
		pixiElement.TPL_linkCount = links.length;
		links.forEach(function (item) {
			pixiElement.TPL_links.push({
				get x() { return item.node.x; },
				get y() { return item.node.y; },
				get width() { return item.node.width; },
				get height() { return item.node.height; },
				get linkCount() { return item.node.TPL_linkCount; },
				get line() { return item.line; }
			});
		});
	} else {
		pixiElement.TPL_links = false;
	}
	
},
crapola = function () {
	var kids = [];
	
	kids.push(pixi.createSprite({
		image: 'images/computer.png',
		scale: 0.2,
		x: 900,
		y: 20
	}));
	kids.push(pixi.createSprite({
		image: 'images/hard.png',
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
	kids.forEach(function (i) {
		pixi.mainContainer.addChild(i);
	});
},
addTplLink = function () {
	
},
createTplNode = function (conf) {
	if ( !conf ) { var conf = {}; }
	var imgPath = 'images/',
		hasLinks = false,
		links = conf.links,
		tplNode = {},
		sprite,
		text,
		box,
		line,
		id;
	
	if ( links &&
			util.isArray( links ) &&
			links.length > 0 ) {
		hasLinks = true;
	}
	
	//---------------------------------------------------------------
	//	Creating Pixi Elements
	imgPath += conf.type || 'computer';
	imgPath += '.png';
	sprite = pixi.createSprite({
		image: imgPath,
		scale: 0.2,
		alpha: 1,
		x: conf.x || 0,
		y: conf.x || 0
	}, true);
	text = pixi.createText( conf.name || 'no_name', true );
	text.y = sprite.y + sprite.height;
	
	box = new PIXI.Container();
	box.interactive = true;
	box.buttonMode = true;
	box.scale.set(0); 
	box.alpha = 1;
	box.hitArea = new PIXI.Rectangle(0, 0, sprite.width, sprite.height);
	box.addChild(sprite);
	box.addChild(text);
	pixi.addDragDrop(box);
	//---------------------------------------------------------------
	
	id = conf.id || 'tpl_node_'+(idCounter+=1);
	tplNode.name = conf.name || 'no_name';
	tplNode.id = id;
	tplNode.node = box;
	if (hasLinks) {
		tplNode.links = {};
		tplNode.linkCount = links.length;
		links.forEach(function (linkIdStr) {
			var target = tplNodes[linkIdStr]; // tplNodes["device_14"]
			// line = pixi.createLine();
			line = pixi.twoPointsLine.create();
			if ( !target.links ) {
				target.links = {};
			}
			target.links[ tplNode.id ] = {};
			target.links[ tplNode.id ].line = line;
			target.linkCount = util.objectLength( target.links );
			
			
			tplNode.links[linkIdStr] = {};
			tplNode.links[linkIdStr].line = line;
			/*
			{
				
				
				get x() { return target.node.x; },
				get y() { return target.node.y; },
				get width() { return target.node.width; },
				get height() { return target.node.height; },
				line: pixi.createLine()
				
			}
			*/
			pixi.addMainChild( line );
		});
	} else {
		tplNode.links = false;
	}
	
	tplNodes[ tplNode.id ] = tplNode;
	box.TPL_Stuff = tplNode;
	
	pixi.addMainChild( tplNode.node );
	
	//adjustLines(tplNode.node);
	animateNode(tplNode.node, {
		done: adjustLines,
		doneParams: [tplNode.node]
	});
	return id;
},
init = function () {
	crapola();
	var kids = [],
		tplNode1,
		tplNode2;
	
	var line = pixi.createLine({
		color: 0xFFFFF,
		thickness: 2,
		points: [0, 0, 150, 150]
	});
	var n1 = pixi.createSprite({
		image: 'images/computer.png',
		scale: 0.2,
		x: 200,
		y: 200
	});
	var n2 = pixi.createSprite({
		image: 'images/computer.png',
		scale: 0.2,
		x: 500,
		y: 200
	});
	
	s = n2;
	/*
	tplNode1 = {
		node: n1,
		line: line
	};
	tplNode2 = {
		node: n2,
		line: line
	};
	
	makeTplNode(n1, [tplNode2], {
		nodeName: 'device_1'
	});
	makeTplNode(n2, [tplNode1], {
		nodeName: 'device_2'
	});
	
	kids.push(n1, n2, line);
	
	
	kids.forEach(function (i) {
		pixi.mainContainer.addChild(i);
	});
	*/
	
};

Object.defineProperties(inst, {
	"some": {
		get: function () { return "some"; }
	}
});
inst.adjustLines = adjustLines;
inst.createTplNode = createTplNode;
inst.tplNodes = tplNodes;
inst.init = init;



module.exports = inst;