define(['wpix', 'wani', 'util', 'popupManager', 'contextMenu'], function (wpix, wani, u, popupManager, contextMenu) {
	var inst = {},
		p = {};
	
	p.nodes = {};
	p.links = {};
	p.idCounter = 0;
	/* p.types = [
		"tv-screen", "macintosh", "imac-blue", "smart-tv", "imac-red",
		"imac-grey", "monitor", "ipad", "iphone", "macbook",
		"computer", "gamepad", "playstation", "hard-drive",
		"smartphone", "smartwatch", "video-card", "xbox"
	]; */
	p.types = [
		"1", "2", "3", "4", "5",
		"6", "7", "8", "9"
	];
	
	function createNode(o, container, coefficient) {
		o = o ? o : {};
		var node,
			type, name, id, thisLinks,
			x, y,
			boxSpriteText;
		
		function setThings() {
			type      = o.type  || 0;
			id        = o.id    || "tpl_node_"+(p.idCounter+=1);
		//	name      = o.name  || "Node "+(p.idCounter+=1);
			name      = o.name  || o.management_ip  || "Node "+(p.idCounter+=1);
			x         = o.x;
			y         = o.y;
			thisLinks = o.links || false;
		}
		function createBox() {
			boxSpriteText = wpix.createBoxSpriteText({
				x: coefficient ? x*coefficient.x : x,
				y: coefficient ? y*coefficient.y : y,
				imgName: p.types[type],
				spriteScale: 0.5,
				spriteTint: type,
				textContent: name,
				boxAlpha: 0
			});
		}
		function addTplnodeCustomPositionGetters() {
			var b = boxSpriteText,
				s = b.sprite;
			
			function midX() {
				// return b.x + (b.width / 2);
				return b.x + (s.width / 2);
			}
			function midY() {
				// return b.y + (b.height / 2);
				return b.y + (s.height / 2);
			}
			Object.defineProperties(node, {
				"top": {
					get: function () { return b.y; }
				},
				"bott": {
					get: function () { return b.y + s.height; } // b.height
				},
				"left": {
					get: function () { return b.x; }
				},
				"right": {
					get: function () { return b.x + s.width; } // b.width
				},
				//--------------------------------------------------------
				"topLeft"  : {  get: function () { return wpix.coPoint( this.left  , this.top  ); }  },
				"topRight" : {  get: function () { return wpix.coPoint( this.right , this.top  ); }  },
				"bottLeft" : {  get: function () { return wpix.coPoint( this.left  , this.bott ); }  },
				"bottRight": {  get: function () { return wpix.coPoint( this.right , this.bott ); }  },
				"topMid"   : {  get: function () { return wpix.coPoint( midX()     , this.top  ); }  },
				"bottMid"  : {  get: function () { return wpix.coPoint( midX()     , this.bott ); }  },
				"leftMid"  : {  get: function () { return wpix.coPoint( this.left  , midY()    ); }  },
				"rightMid" : {  get: function () { return wpix.coPoint( this.right , midY()    ); }  },
				"center"   : {  get: function () { return wpix.coPoint( midX()     , midY()    ); }  }
			});
		}
		function createTplNode() {
			node = {};
			node.id = id;
			node.name = name;
			node.links = thisLinks;
			node.pixiEl = boxSpriteText;
			addTplnodeCustomPositionGetters();
		}
		function addHandlers() {
			boxSpriteText.setHandler('mousedown', function (e, node, tplLinks) {
				var links = node.links;
				
				popupManager.removeAll();
				
				this.bringToFront();
				
				if ( links.length ) {
					links.forEach(function (linkId) {
						var link = tplLinks[linkId];
						if (link) {
							link.pixiEl.clear();
						}
					});
				}
			}, [node, p.links]);
			boxSpriteText.setHandler('mouseup', function (e, node, tplLinks, tplNodes) {
				var nodeId = node.id,
					links = node.links;
				
				popupManager.create({name: name, id: id}, node.topLeft);
				
				if (links) {
					links.forEach(function (linkId) {
						var link = tplLinks[linkId],
							start, end;
						
						if (link) {
							if (link.src === nodeId) {
								start = node.center;
							}
							
							if (link.dest === nodeId) {
								end = node.center;
							}
							link.pixiEl.changePoints(start, end);
						}
					});
				}
				
			}, [node, p.links, p.nodes]);
			boxSpriteText.setHandler('mousemove', function (e) {
				/* var pos = e.data.global,
					bubble = popupManager.activeBox,
					pTop = bubble ? parseInt( bubble.css('top'), 10) : undefined,
					pLeft = bubble ? parseInt( bubble.css('left'), 10) : undefined;
					
				if (bubble) {
					bubble.css('left', (pos.x - 40)+'px');
					bubble.css('top', (pos.y - (bubble.height() + 40)) +'px');
				} */
			});
			boxSpriteText.setHandler('mouseover', function (e, node, tplLinks) {
				var links = node.links,
					el = this;
				if ( links.length ) {
					links.forEach(function (linkId) {
						var link = tplLinks[linkId],
							pixiEl, increaseWidth;
						if (link) {
							pixiEl = link.pixiEl;
							increaseWidth = pixiEl.increaseWidth;	
							pixiEl.bringToFront();
							if ( !el.dragging ) {
								increaseWidth();
							}
						}
					});
				}
			}, [node, p.links]);
			boxSpriteText.setHandler('mouseout', function (e, node, tplLinks) {
				var links = node.links,
					el = this;
				if ( links.length ) {
					links.forEach(function (linkId) {
						var link = tplLinks[linkId],
							defaultWidth;
						if (link) {
							defaultWidth = link.pixiEl.defaultWidth;
							if ( u.isFn(defaultWidth) ) {
								if ( !el.dragging ) {
									defaultWidth();
								}
							}
						}
					});
				}
			}, [node, p.links]);
			boxSpriteText.setHandler('rightup', function (e) {
				// contextMenu.show(e.data.global, 'node');
			});
		}
		
		setThings();
		createBox();
		createTplNode();
		addHandlers();
		
		p.nodes[ id ] = node;
		
		wpix.addChild(container, "nodeContainer", node.pixiEl);
		
		wani.fadeIn(node.pixiEl);
		
	}
	var createLink = (function () {
		var path = {},
			toggle = false;
		
		function create(start, end, srcId, destId, linkId, status, container) {
			var link, pixiEl, nth, curveLevel,
				srcdest, destsrc;
			
			srcdest = srcId + destId;
			destsrc = destId + srcId;
			link    = {};
			
			if ( !path[srcdest] && !path[destsrc] ) {
				path[srcdest] = 1;
			} else if ( path[srcdest] ) {
				path[srcdest] += 1;
			} else if ( path[destsrc] ) {
				path[destsrc] += 1;
			}
			
			nth = path[srcdest] || path[destsrc];
			curveLevel = (nth-1)*2;
			
			// nth === 1  one link
			// nth > 1    more than one link
			
			pixiEl = wpix.create2pointLine({
				start: start,
				end: end,
				color:  status === 0 ? 0x33691e : // green
						status === 1 ? 0x00695c : // cyan
						status === 2 ? 0xffd600 : // yellow
						status === 3 ? 0xe65100 : // orange
						status === 4 ? 0xff1744 : // pink
						status === 5 ? 0xb71c1c : undefined, // red
				alpha: 0
			});
				
			pixiEl.setHandler('mousedown', function () {
				//                      viewport.lineContainer
				this.bringToFront( wpix.viewport.children[0].children );
			});
			
			link.pixiEl = pixiEl;
			link.id = linkId;
			link.src = srcId;
			link.dest = destId;
			
			p.links[ linkId ] = link;
			
			
			wpix.addChild(container, "lineContainer", link.pixiEl);
			
			wani.fadeIn(pixiEl);
		}
		
		return create;
	}());
	
	function checkNode(node, container) {
		createNode( node, container );
	}
	function checkLink(link, container, bounds) {
		/*
		var src = link.src,
			dest = link.dest,
			b = bounds ? bounds : {},
			x1 = b.x1,
			x2 = b.x2,
			y1 = b.y1,
			y2 = b.y2,
			start, end,
			srcOut = false,
			destOut = false,
			nodes = p.nodes;
		
		if ( src.x > x1 &&
				src.x < x2 &&
				src.y > y1 &&
				src.y < y2 ) {
			start = nodes[src.id].center;
		} else {
			srcOut = true;
		}
		
		if ( dest.x > x1 &&
				dest.x < x2 &&
				dest.y > y1 &&
				dest.y < y2 ) {
			end = nodes[dest.id].center;
		} else {
			destOut = true;
		}
		
		if (srcOut) {
			start = calc();
		} else if (destOut) {
			end = calc();
		}
		*/
		// createLink(start, end, src.id, dest.id, link.id, container);
		
		var srcId, destId, srcNode, destNode, linkId,
			isObj = u.isObj,
			isStr = u.isStr;
		
		if (link.src) {
			if ( isObj(link.src) ) {
				srcId = link.src.id;
				
			} else if ( isStr(link.src) ) {
				srcId = link.src;
			}
		} else if (link.source_id) {
			srcId = link.source_id;
		}
		
		if (link.dest) {
			if ( isObj(link.dest) ) {
				destId = link.dest.id;
			} else if ( isStr(link.dest) ) {
				destId = link.dest;
			}
		} else if (link.destination_id) {
			destId = link.destination_id;
		}
		//debugger;
		srcNode = p.nodes[srcId];
		destNode = p.nodes[destId];
		//debugger;
		createLink(
			srcNode.center,
			destNode.center,
			srcId,
			destId,
			link.id,
			link.status,
			container
		);
	}
	function drawNodes(nodes, c, coefficient) {
		Object.keys(nodes).forEach(function (k) {
			// checkNode( nodes[k], c );
			createNode( nodes[k], c, coefficient );
		});
	}
	function drawLinks(links, c, b) {
		Object.keys(links).forEach(function (k) {
			checkLink( links[k], c, b );
		});
	}
	function draw(data, container, bounds, coefficient, flush) {
		container = container ? container : "viewport";
		bounds = bounds ? bounds : {};
		coefficient = coefficient ? coefficient : false;
		
		/* if ( flush ) {
			p.nodes = {};
			p.links = {};
		} */
		
		drawNodes(data.nodes, container, coefficient);
		drawLinks(data.links, container, bounds);
	}
	
	
	
	Object.defineProperties(inst, {
		"nodes": {
			get: function () { return p.nodes; }
		},
		"links": {
			get: function () { return p.links; }
		}
	});
	inst.checkLink = checkLink;
	inst.draw = draw;
	
	window.tpl = inst;
	return inst;
});