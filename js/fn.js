var t,s;
var a = (function () {
"use strict";

var pixi = (function () {
	var inst = util.extend( instantiatePubsub() ),
		p = {};
	
	p.defaults = {};
	p.renderer;
	p.stage;
	p.mainContainer;
	
	function init(o) {
		if (o) {
			p.defaults = o;
		}
		p.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight,
			{
				backgroundColor: p.defaults.background || 0xAB9999,
				antialias: true,
			}
		);
		document.body.appendChild( p.renderer.view );
		p.stage = new PIXI.Container();
		
		p.mainContainer = new PIXI.Container();
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		//p.stage.buttonMode = true;
		p.mainContainer.interactive = true;
		p.mainContainer.hitArea = new PIXI.Rectangle( -100000, -100000, p.renderer.width / p.renderer.resolution * 100000, p.renderer.height / p.renderer.resolution *100000 );
		p.mainContainer
			.on('mousedown', pan.start)
			.on('touchstart', pan.start)
			.on('mouseup', pan.end)
			.on('mouseupoutside', pan.end)
			.on('touchend', pan.end)
			.on('touchendoutside', pan.end)
			.on('mousemove', pan.move)
			.on('touchmove', pan.move);
			
		$(document).on('mousewheel', function (e) {
			// e.deltaX, e.deltaY, e.deltaFactor
			// zoom(e.pageX, e.pageY, e.deltaY > 0);
			// zoom(e);
			zoom(e.pageX, e.pageY, e.deltaY > 0);
		});
		p.stage.addChild( p.mainContainer );
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		requestAnimationFrame( animate );
		p.renderer.render( p.stage );
		
		inst.publish('init');
	}
	
	var zoom = (function () {
		var direction;
		
		var getGraphCoordinates = (function() {
			var ctx = {
				global: {
					x: 0,
					y: 0
				} // store it inside closure to avoid GC pressure
			};

			return function (x, y) {
				ctx.global.x = x;
				ctx.global.y = y;
				return PIXI.interaction.InteractionData.prototype.getLocalPosition.call(ctx, p.mainContainer);
			}
		}());
		function zoom(x, y, isZoomIn) {
			var mainContainer = p.mainContainer;
			
			direction = isZoomIn ? 1 : -1;
			var factor = (1 + direction * 0.1);
			mainContainer.scale.x *= factor;
			mainContainer.scale.y *= factor;

			// Technically code below is not required, but helps to zoom on mouse
			// cursor, instead center of graphGraphics coordinates
			
			var beforeTransform = getGraphCoordinates(x, y);
			mainContainer.updateTransform();
			var afterTransform = getGraphCoordinates(x, y);

			mainContainer.position.x += (afterTransform.x - beforeTransform.x) * mainContainer.scale.x;
			mainContainer.position.y += (afterTransform.y - beforeTransform.y) * mainContainer.scale.y;
			mainContainer.updateTransform();
		}
		function zam( e ) {
			var factor = 1,
				delta = e.deltaY,
				local_pt = new PIXI.Point(),
				point = new PIXI.Point(e.pageX, e.pageY),
				mainContainer = p.mainContainer;

			PIXI.interaction.InteractionData.prototype.getLocalPosition(mainContainer, local_pt, point);

			if ( delta > 0 ) {
				// Zoom in
				factor = 1.1;
			} else {
				// Zoom out
				factor = 1 / 1.1;
			}

			mainContainer.pivot = local_pt;
			mainContainer.position = point;
			mainContainer.scale.set(mainContainer.scale.x * factor);
		}
		function zoomba(x, y, isZoomIn) {
			var direction = (isZoomIn) ? 1 : -1,
				factor = (1 + direction * 0.1),
				local_pt = new PIXI.Point(),
				point = new PIXI.Point(x, y),
				mainContainer = p.mainContainer;
				
			PIXI.interaction.InteractionData.prototype.getLocalPosition(mainContainer, local_pt, point);
			
			mainContainer.scale.x *= factor;
			mainContainer.scale.y *= factor;
			mainContainer.pivot = local_pt;
			mainContainer.position = point;
		}
		
		return zoomba;
	}());
	var pan = (function () {
		var isDragging = false,
			prevX,
			prevY;
		
		function down(e) {
			isDragging = true;
			//downX = e.data.global.x;
			//downY = e.data.global.y;
			
			var pos = e.data.global;
			prevX = pos.x;
			prevY = pos.y;
			isDragging = true;
		}
		function move(e) {
			if ( !isDragging ) { return; }
			var pos = e.data.global,
				dx = pos.x - prevX,
				dy = pos.y - prevY;

			p.mainContainer.position.x += dx;
			p.mainContainer.position.y += dy;
			prevX = pos.x;
			prevY = pos.y;
		}
		function up() {
			isDragging= false;
		}
		
		return {
			start: down,
			move: move,
			end: up
		};
		
	}());
	function dragStart(e) {
		e.stopPropagation();
		this.data = e.data;
		this.alpha = 0.5;
		this.dragging = true;
		this.dragPoint = e.data.getLocalPosition(this.parent);
		this.dragPoint.x -= this.position.x;
		this.dragPoint.y -= this.position.y;
		
		bringToFront(this);
	}
	function dragMove() {
		if ( this.dragging ) {
			var newPosition = this.data.getLocalPosition(this.parent);
			this.position.x = newPosition.x - this.dragPoint.x;
			this.position.y = newPosition.y - this.dragPoint.y;
		}
	}
	function dragEnd() {
		this.alpha = 1;
		this.dragging = false;
		this.data = null;
		
		
		if ( this.TPL_Stuff  &&  this.TPL_Stuff.links ) {
			core.adjustLines(this);
		}
	}
	function animate() {
		requestAnimationFrame(animate);
		//tink.update();
		//TWEEN.update();
		p.renderer.render(p.stage);
	}
	function addDragDrop(element) {
		element
			.on('mousedown', dragStart)
			.on('touchstart', dragStart)
			.on('mouseup', dragEnd)
			.on('mouseupoutside', dragEnd)
			.on('touchend', dragEnd)
			.on('touchendoutside', dragEnd)
			.on('mousemove', dragMove)
			.on('touchmove', dragMove);
	}
	function bringToFront(el) {
		// reorder children for z-index
		var arr = p.mainContainer.children;
		arr.splice( arr.indexOf(el), 1 );
		arr.push(el);
	}
	function createSprite(o, noDrag) {
		var sprite = new PIXI.Sprite.fromImage(o.image);
		sprite.interactive = true;
		sprite.buttonMode = true;
		sprite.anchor.set(0, 0);
		sprite.scale.set(o.scale);
		sprite.alpha = o.alpha || 0;
		sprite.rotation = o.rotation || 0;
		sprite.position.x = o.x;
		sprite.position.y = o.y;
		
		if ( !noDrag ) {
			addDragDrop(sprite);
		}
		
		return sprite;
	}
	function createLine(conf, noDrag) {
		var line = new PIXI.Graphics(),
			points,
			i;
		
		if (!conf) { var conf = {}; }
		if ( util.isObject(conf) ) {
			points = conf.points || [];
		} else if ( util.isArray(conf) ) {
			points = conf;
		}
		
		
		if ( points.length === 0 ) {
			points = [0, 0, 1, 1];
		}
		
		
		line.interactive = true;
		line.buttonMode = true;
		line.beginFill();
		line.lineStyle(
			conf.thickness || 2,
			conf.color || 0x000000,
			conf.alpha || 1
		);
		
		line.moveTo( points[0], points[1] );
		for (i=2; i < points.length ;i+=2) {
			line.lineTo( points[i], points[i+1] );
		}
		line.lineTo( points[0], points[1] );
		line.endFill();
		
		if ( !noDrag ) {
			addDragDrop(line);
		}
		
		return line;
	}
	function redrawLine(ctx, o) {
		var points,
			i,
			dirty,
			clearDirty;
		
		if ( util.isObject(o) ) {
			points = o.points;
		} else if ( util.isArray(o) ) {
			points = o;
		}
		
		ctx.clear();
		ctx.beginFill();
		ctx.lineStyle(
			o.thickness || 2,
			o.color     || 0x000000,
			o.alpha     || 1
		);
		
		ctx.moveTo( points[0], points[1] );
		for (i=2; i < points.length ;i+=2) {
			ctx.lineTo( points[i], points[i+1] );
		}
		ctx.lineTo( points[0], points[1] );
		ctx.endFill();
		
		
		dirty = ctx.dirty;
		clearDirty = ctx.clearDirty;
		
		if ( dirty ) {
			dirty = false
		} else if ( !dirty ) {
			dirty = true;
		}
		
		if ( clearDirty ) {
			clearDirty = false
		} else if ( !clearDirty ) {
			clearDirty = true;
		}
		
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
		
		if ( !noDrag ) {
			addDragDrop(rect);
		}
		
		return rect;
	}
	function createText(o, noDrag) {
		if ( !o ) {	var o = {}; }
		var txt = util.isString( o ) ? o : o.text;
		
		var text = new PIXI.Text(txt, {
			fontFamily: o.font || 'Arial',
			fontSize: o.size || '20px',
			fill: o.color || 'black'
		});
		text.interactive = true;
		text.buttonMode = true;
		
		if ( !noDrag ) {
			addDragDrop(text);
		}
		
		return text;
	}
	function addStageChild(el) {
		p.stage.addChild(el);
	}
	function addMainChild(el) {
		p.mainContainer.addChild(el);
	}
	
	Object.defineProperties(inst, {
		"renderer": {
			get: function () { return p.renderer; }
		},
		"stage": {
			get: function () { return p.stage; }
		},
		"mainContainer": {
			get: function () { return p.mainContainer }
		}
		
	});
	inst.init = init;
	inst.animate = animate;
	inst.addDragDrop = addDragDrop;
	inst.createSprite = createSprite;
	inst.createLine = createLine;
	inst.redrawLine = redrawLine;
	inst.createRect = createRect;
	inst.createText = createText;
	inst.zoom = zoom;
	inst.addStageChild = addStageChild;
	inst.addMainChild = addMainChild;
	return inst;
}());


var core = (function () {
	var inst = util.extend( instantiatePubsub() ),
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
		pixi.redrawLine(line, {
			points: points
		});
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
				line = pixi.createLine();
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
	
	return inst;
}());


var navigation = (function () {
	var inst = util.extend( instantiatePubsub() ),
		p = {};
	
	function init() {
		var nav,
			panel,
			rect,
			dot;
		
		p.panel = new PIXI.Graphics(),
		p.panelWidth = 400;
		p.panelHeight = 200;
		p.panelOffset = 100;
		panel = p.panel;
		
		panel.beginFill(0xE3E3E3);
		panel.lineStyle(0);
		panel.drawRect(0, 0, p.panelWidth, p.panelHeight);
		panel.endFill();
		//panel.position.set( panelPos.x, panelPos.y ); 



		p.rect = new PIXI.Graphics();
		p.rectWidth = pixi.renderer.width / 10;
		p.rectHeight = pixi.renderer.height / 3;
		rect = p.rect;
		
		rect.interactive = true;
		rect.buttonMode = true;
		rect.beginFill(0x2196F3, 1);
		rect.lineStyle(0);
		rect.drawRect(0, 0, 150, 150);
		rect.endFill();
		rect.alpha = 0.5;
		rect.TPL_nav = 'box';

		p.dot = new PIXI.Graphics();
		p.dotWH = 6;
		p.dotHalf = p.dotWH / 2;
		p.dotPos = {
			get x() { return (rect.x + rect.width) - p.dotHalf; },
			get y() { return (rect.y + rect.height) - p.dotHalf; }
		};
		dot = p.dot
		
		dot.interactive = true;
		dot.buttonMode = true;
		dot.beginFill(0x0000FF, 1);
		dot.lineStyle(0);
		dot.drawRect(0, 0, p.dotWH, p.dotWH);
		dot.endFill();
		dot.position.set( p.dotPos.x, p.dotPos.y );
		dot.TPL_nav = 'dot';
		
		
		p.nav = new PIXI.Container();
		p.navPos = new PIXI.Point(
			pixi.renderer.width - (p.panelWidth + p.panelOffset),
			50
		);
		nav = p.nav;
		
		nav.position.set( p.navPos.x, p.navPos.y );
		nav.addChild(panel);
		nav.addChild(rect);
		nav.addChild(dot);
		addDragDrop(rect, 'rect');
		addDragDrop(dot, 'dot');
		pixi.addStageChild(nav);
	}
	
	function addDragDrop(el, name) {
		if (name === 'rect') {
			el
				.on('mousedown', rectDown)
				.on('touchstart', rectDown)
				.on('mouseup', rectUp)
				.on('mouseupoutside', rectUp)
				.on('touchend', rectUp)
				.on('touchendoutside', rectUp)
				.on('mousemove', rectMove)
				.on('touchmove', rectMove);
		} else if ( name === 'dot' ) {
			el
				.on('mousedown', dotDown)
				.on('touchstart', dotDown)
				.on('mouseup', dotUp)
				.on('mouseupoutside', dotUp)
				.on('touchend', dotUp)
				.on('touchendoutside', dotUp)
				.on('mousemove', dotMove)
				.on('touchmove', dotMove);
		}
	}
	function addCustomPos(el) {
		el.left = el.position.x;
		el.right = el.position.x + el.width;
		el.top = el.position.y;
		el.bott = el.position.y + el.height;
	}
	function panelDown(e) {
		e.stopPropagation();
	}
	function rectDown(e) {
		this.data = e.data;
		this.dragging = true;
		this.dragPoint = e.data.getLocalPosition(this.parent);
		this.dragPoint.x -= this.position.x;
		this.dragPoint.y -= this.position.y;
	}
	function dotDown() {
		this.mouseIsDown = true;
	}
	function rectUp() {
		this.dragging = false;
		this.data = null;
	}
	function dotUp() {
		this.mouseIsDown = false;
	}
	function rectMove() {
		this.defaultCursor = 'move';
		if (this.dragging) {
			var panel = p.panel,
				rect = p.rect,
				dot = p.dot,
				dotPos = p.dotPos,
				dotHalf = p.dotHalf,
				newPosition = this.data.getLocalPosition(this.parent),
				newX = newPosition.x - this.dragPoint.x,
				newY = newPosition.y - this.dragPoint.y,
				dotNewX = newX + (rect.width - dotHalf),
				dotNewY = newY + (rect.height - dotHalf);
				
			
			var min = 0,
				maxX = panel.width - rect.width,
				maxY = panel.height - rect.height,
				rectNewPos = new PIXI.Point(),
				dotNewPos = new PIXI.Point();
			
			if ( newX > min  &&  newX <= maxX ) {
				rectNewPos.x = newX
			} else if ( newX < min ) {
				rectNewPos.x = min;
			} else if ( newX > maxX ) {
				rectNewPos.x = maxX;
			}
			
			if ( newY > min  &&  newY <= maxY ) {
				rectNewPos.y = newY;
			} else if ( newY < min ) {
				rectNewPos.y = min;
			} else if ( newY > maxY ) {
				rectNewPos.y = maxY;
			}
			
			dotNewPos.x = ( newX > min  &&  newX <= maxX ) ? dotNewX : dotPos.x;
			dotNewPos.y = ( newY > min  &&  newY <= maxY ) ? dotNewY : dotPos.y;
			
			rect.position.x = rectNewPos.x;
			rect.position.y = rectNewPos.y;
			dot.position.x = dotNewPos.x;
			dot.position.y = dotNewPos.y;
		}
	}
	function dotMove(e) {
		this.defaultCursor = 'nwse-resize';
		if (this.mouseIsDown) {
			var currentCursor = e.data.getLocalPosition(this.parent),
				resizeX = ( currentCursor.x - this.x ),
				resizeY = ( currentCursor.y - this.y ),
				halfX = resizeX / 2,
				halfY = resizeY / 2,
				panel = p.panel,
				rect = p.rect,
				dot = p.dot;
				
			rect.defaultCursor = 'nwse-resize';
			addCustomPos(rect);
			addCustomPos(panel);
			var	min = 0,
				nextRight = rect.width + resizeX,
				nextLeft = rect.position.x - halfX,
				nextBott = rect.height + resizeX,
				nextTop = rect.position.y - halfX,
				reachedRight = !(nextRight <= panel.right),
				reachedLeft = !(nextLeft > min),
				reachedBott = !(nextBott <= panel.bott),
				reachedTop = !(nextTop > min);
			
			if ( !reachedRight  &&  !reachedLeft ) {
				rect.width += resizeX;
				rect.position.x -= halfX;
				dot.position.x += halfX;
			} else if ( !reachedRight  &&  reachedLeft ) {
				rect.width += resizeX;
				dot.position.x += resizeX;
			}
			
			if ( !reachedBott  &&  !reachedTop ) {
				rect.height += resizeX;
				rect.position.y -= halfX;
				dot.position.y += halfX;
			} else if ( !reachedBott  &&  reachedTop ) {
				rect.height += resizeX;
				dot.position.y += resizeX;
			}
			inst.publish('zoom');
		}
	}
	
	
	inst.init = init;
	return inst;
}());


var mediator = (function () {
	var i = {};
	
	i.init = function () {
		pixi.init();
		core.init();
		navigation.init();
		
		navigation.on('zoom', function () {
			console.log('zoom');
		});
	};
	
	return i;
}());
	



return {
	pixi: pixi,
	core: core,
	mediator: mediator
};
	

}());