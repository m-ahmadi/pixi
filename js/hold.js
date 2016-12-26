//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function PREV_STYLE_createNode(conf) {
	if ( !conf ) { var conf = {}; }
	
	var node, links, hasLinks,
		nodeImg, name, id,
		line,
		x, y,
		boxSpriteText;
	
	function setThings() {
		node     = {};
		hasLinks = false;
		nodeImg  = conf.type; //image filename in './images/' (without extention)
		name     = conf.name;
		links    = conf.links;
		id       = conf.id   || 'tpl_node_'+(p.idCounter+=1);
		x        = conf.x;
		y        = conf.y
	}
	function handleLinks() {
		if ( links  &&  util.isArr( links )  &&  links.length ) {
			createLink();
		} else {
			node.links = false;
		}
	}
	function createLink() {
		node.links = {};
		node.linkCount = links.length;
		links.forEach(function (nodeIdStr) {
			var target = p.nodes[nodeIdStr]; // nodes["device_14"]
			// line = pixi.createLine();
			line = pixi.create2pointLine();
			if ( !target.links ) {
				target.links = {};
			}
			target.links[ node.id ] = {};
			target.links[ node.id ].line = line;
			target.linkCount = util.objLength( target.links );
			node.links[nodeIdStr] = {};
			node.links[nodeIdStr].line = line;
			pixi.addChild('mainContainer', line);
		});
	}
	function create() {
		boxSpriteText = pixi.createBoxSpriteText({
			spriteImg: nodeImg,
			spriteScale: 0.2,
			textContent: name,
			x: x,
			y: y,
			onmouseup: function (pixiEl) {
				adjustLines(pixiEl);
			}
		});
		node.name = name;
		node.id = id;
		node.pixiEl = boxSpriteText;
	}
	
	setThings();
	create();
	handleLinks();
	
	p.nodes[ id ] = node;
	pixi.addChild('mainContainer', node.pixiEl);
	//adjustLines(node.pixiEl);
	animateNode(node.pixiEl, {
		done: adjustLines,
		doneParams: [node.pixiEl]
	});
		
	return node;
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
makeTplNode = function (pixiElement, links, o) {
	/*
		links: [{
			node: pixiElement,
			line: pixiElement
		}, {}, {}]
		
	*/
	var hasLinks = false;
	if ( !o ) { var o = {}; }
	if ( links  &&  util.isArr(links) ) {
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
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var rectPos = getFullPositions(rect),
	panelPos = getFullPositions(panel),
	min = 0,
	maxX = panel.x + panel.width;

if ( rectPos.right <= panelPos.right ) {
	if ( rect.x > min ) {
		rect.width += resizeX;
		rect.position.x -= halfX;
	} else if ( rect.x <= min ) { // left reached
		rect.width += resizeX;
	} else if ( rectPos.right >= maxX ) {
		//rect.width -= resizeX;
	}
}


if ( rectPos.bott <= panelPos.bott ) {
	if ( rect.y > min ) {
		rect.height += resizeX;
		rect.position.y -= halfX;
		
	} else if ( rect.y <= min ) {
		rect.height += resizeX;
	}
}
/*
rect.width += resizeX;
rect.position.x -= halfX;

rect.height += resizeX; // resizeY
rect.position.y -= halfX; // halfY

dot.position.x += halfX;
dot.position.y += halfX; // halfY
rect.defaultCursor = 'nwse-resize';
*/
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var middleY;
function adjustLine(line, fromPoint, toPoint) {
	var x1 = fromPoint.x,
		y1 = fromPoint.y,
		x2 = toPoint.x,
		y2 = toPoint.y,
		distanceX, distanceY,
		midX, midY,
		bigX, smallX,
		bigY, smallY,
		diffY,
		toLeftX = false,
		toRightX = false,	
		toUpY = false,
		toDownY = false,
		rotateCalc,
		rotation;
	if (x1 < 0 ||
		y1 < 0 ||
		x2 < 0 ||
		y2 < 0) {
		throw new Error('adjustLine():  Something\'s not right');
	}
		
	if (x1 > x2) {	
		bigX = x1;
		smallX = x2;
		toLeftX = true;
	} else if (x2 > x1) {
		bigX = x2;
		smallX = x1;
		toRightX = true;
	}
	if (y1 > y2) {
		bigY = y1;
		smallY = y2;
		toUpY = true;
	} else if (y2 > y1) {
		bigY = y2;
		smallY = y1;
		toDownY = true;
	}
	distanceX = bigX - smallX;
	distanceY = bigY - smallY; // get diff in positive
	diffY = y1 - y2;           // get diff positive and negative
	
	midX = smallX + (distanceX / 2);
	midY = smallY + (distanceY/ 2);
	middleY = midY;
	
	/* how to rotate it?
		
	//rotation = ( ( (midY - smallY) / 2) + smallY ) / 1000;
	//rotation = a.util.makeNumberNegative( rotation )
	rotation = distanceY / 1000;
	*/
	
	if (toRightX) {
		rotateCalc = (y1 - y2) / 800;
		rotation = a.util.makeNumberNegative( rotateCalc );
	} else if (toLeftX) {
		rotation = (y1 - y2) / 800;
	}
	if (toUpY) {
		
	} else if (toDownY) {
		
	}
	
	//console.log( rotation );
	
	line.x = midX;
	line.y = midY;
	line.width = distanceX;
	line.rotation = rotation;
	
	
	/*
		which point is on left
		which one is right
		which point is upper
		which point is lower
		
		adjust line width in high rotations
	*/
	
	/*
		get two points that needs to be connected
		calc the x between them
		rotate but save 2 points of the line
		rotate and change width if 2 points of line changes
	*/
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var line = PIXI.Sprite.fromImage('images/line.png');
line.interactive = true;
line.buttonMode = true;

line.width = 200;
line.height = 10;
line.x = Math.random() * window.innerWidth *5;
line.y = Math.random() * window.innerHeight *5;
line.anchor.set(0);

addDragDrop(line);
stage.addChild(line);

//----------------------------------
var line = new PIXI.Graphics();
line.lineStyle(1, 0x101010, 1);
line.beginFill();
line.moveTo(Math.random() * window.innerHeight *10, Math.random() * window.innerHeight *10);
line.lineTo(Math.random() * window.innerHeight *10, Math.random() * window.innerHeight *10);
line.endFill();

var newline = line.clone();
newline.x = Math.random() * window.innerWidth *5;
newline.y = Math.random() * window.innerHeight *5;

addDragDrop(line);
stage.addChild(line);
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var i;
for (i = 0; i < 30000; i+=1) {
	var ll = new PIXI.Graphics();
	ll.interactive = true;
	ll.buttonMode = true;
	ll.lineStyle(2, 0x101010, 1);
	ll.beginFill();

	ll.moveTo(
		Math.random() * window.innerWidth *10,
		Math.random() * window.innerHeight *10
	);
	ll.lineTo(
		Math.random() * window.innerWidth *50,
		Math.random() * window.innerHeight *50
	);


	// // ll.drawRoundedRect(
		// // Math.random() * window.innerWidth *5,
		// // Math.random() * window.innerHeight *5,
		// // 200, 300, 100, 15);
	
	
	ll.endFill();
	addDragDrop(ll);
	stage.addChild(ll);
	
	-------------------------------------------------------------------
	var g = new PIXI.Graphics();
	g.interactive = true;
	g.buttonMode = true;
	g.beginFill(0x28ab99);
	g.lineStyle(0, 0xFF0000, 1);
	g.drawRect(
		Math.random() * window.innerWidth *10,
		Math.random() * window.innerWidth *10,
		60, 60);
	g.endFill();
	addDragDrop(g);
	stage.addChild(g);
	
	-------------------------------------------------------------------
	var s = new PIXI.Sprite.fromImage('images/computer.png');
	s.interactive = true;
	s.buttonMode = true;
	s.anchor.set(0.5);
	s.scale.set(0.09);
	s.position.x = Math.random() * window.innerWidth *10;
	s.position.y = Math.random() * window.innerWidth *10;
	addDragDrop(s);
	stage.addChild(s);
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var firstPoint = {
	x: 100,
	y: 150
},
secondPoint = {
	x: 500,
	y: 100
};
function adjustLine(line, fistPoint, secondPoint) {
	var x1 = firstPoint.x,
		y1 = firstPoint.y,
		x2 = secondPoint.x,
		y2 = secondPoint.y,
		distanceX, distanceY,
		midX, midY,
		bigX, smallX,
		bigY, smallY,
		rotation;
	
	if (x1 > x2) {	
		bigX = x1;
		smallX = x2;
	} else if (x2 > x1) {
		bigX = x2;
		smallX = x1;
	}
	if (y1 > y2) {
		bigY = y1;
		smallY = y2;
	} else if (y2 > y1) {
		bigY = y2;
		smallY = y1;
	}
	
	distanceX = bigX - smallX;
	distanceY = bigY - smallY;
	
	midX = smallX + (distanceX / 2);
	midY = smallY + (distanceY / 2);
	rotation = ( ( (midY - smallY) / 2) + smallY ) / 1000;
	console.log(midY, rotation);
	line.x = midX;
	line.y = midY;
	line.width = distanceX / 2;
	line.rotation = a.util.makeNumberNegative( rotation );
	//line.rotation = rotation;
	// adjust line width in high rotations
}
//adjustLine(line, firstPoint, secondPoint);
//line.x += newX - prevX;
//line.y += newY - prevY;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var prevX,
	prevY,
	howmuchUp = 0,
	howmuchDown = 0;

//line2.rotation -= 0.01;
var up = newY < prev,
	down = newY > prev;
if (up) {
	howmuchUp += prev - newY;
	
	line.rotation += howmuchUp / 5000;
	var calc = howmuchUp / 10;
	if ( a.util.isInt(calc) ) {
		console.log( howmuchUp);
		line.x += 10;
	}
	//console.log(howmuchUp);
} else if (down) {
	howmuchDown += newY - prev;
	
	line.rotation -= howmuchDown / 5000;
	var calc = howmuchUp / 10;
	if ( a.util.isInt(calc) ) { // every ten times
		line.x -= 1;
	}
	//console.log(howmuchDown);
}
//line2.x = newX + 120;
line.y = newY + 35;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@