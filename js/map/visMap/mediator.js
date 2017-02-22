define(["core/util", "core/ajax", "core/whb"], function (u, ajax, whb) {
	var inst = {},
		g = {},
		tmpl = whb.tmpl;
	
	g.network = {};
	g.options = {};
	g.container = {};
	g.nodes = new vis.DataSet();
	g.edges = new vis.DataSet();
	g.nodeTypes = ["type1", "type2", "type3", "type4", "type5", "type6", "type7", "type8", "type9",];
	g.dataConvertor = {};
	
	g.options = {
		autoResize: true,
		height: "100%",
		width: "100%",
		locale: "en",
	//	locales: locales,
		clickToUse: false,
		configure: {
			enabled: false
		},
		edges: {
			width: 1,
			smooth: {
				type: "continuous" // "dynamic", "continuous", "discrete", "diagonalCross", "straightCross", "horizontal", "vertical", "curvedCW", "curvedCCW", "cubicBezier"
			},
			arrows: {
				to: {
					enabled: true,
					scaleFactor: 0.6,
					type: "arrow"
				},
				"from": {
					enabled: true,
					scaleFactor: 0.2,
					type: "circle"
				},
				
			},
			arrowStrikethrough: true // default true
		},
		nodes: {
			borderWidth: 1,
			shape: "dot",
			color: "#4CAF50",
			size: 10,
			font: {
				size: 12,
				face: "Tahoma"
			}
		},
		groups: {
			/* type1: {
				shape: "icon",
				icon: {
					face: "FontAwesome",
					code: "\uf0c0", // group
					size: 50,
					color: "#57169a"
				}
			},
			type2: {
				shape: "icon",
				icon: {
					face: "FontAwesome",
					code: "\uf007", // users
					size: 50,
					color: "#3f51b5"
				}
			}, */
			type1: {
				shape: "dot",
				color: "red"
			},
			type2: {
				shape: "dot",
				color: "blue"
			},
			type3: {
				shape: "dot",
				color: "#e91e63"
			},
			type4: {
				shape: "diamond",
				color: "#fb7e81"
			},
			type5: {
				shape: "star",
				color: "#FFEB3B"
			},
			type6: {
				shape: "triangle",
				color: "#ffff00"
			},
			type7: {
				shape: "dot",
				color: "#33691e"
			},
			type8: {
				shape: "square",
				color: "#ffd600"
			},
			type9: {
				shape: "triangleDown",
				color: "#ff1744"
			}
			
		},
		layout: {
			improvedLayout: false
		},
		interaction: {
			hideEdgesOnDrag: true,
			hover: true,
			tooltipDelay: 200
		},
	//	manipulation: {},
		physics: false // true false
	};
	
	function createWorker() {
		if (window.Worker) {
			g.dataConvertor = new Worker("js/workers/dataConvertor.js");
			
			g.dataConvertor.onmessage = function (e) {
				console.log("convert is finished.");
				var data = e.data;
				g.nodes.update(data.nodes);
				g.edges.update(data.edges);
			};
		} else {
			console.warn("Your browser doesn't support web workers.");
		}
	}
	function convertData(data) {
		var oldNodes = data.nodes,
			oldLinks = data.links,
			newData = {},
			newNodes = [],
			newEdges = [];
		
		Object.keys(oldNodes).forEach(function (k) {
			var node = oldNodes[k];
			
			g.nodes.add({
				id: node.id,
				label: node.name || node.management_ip,
				group: g.nodeTypes[node.type],
				x: node.x,
				y: node.y,
				title: tmpl.nodepopup({name: node.name, id: node.id})
			});
			
		});
		Object.keys(oldLinks).forEach(function (k) {
			var link = oldLinks[k],
				src = link.src,
				dest = link.dest;
			
			g.edges.add({
				/* from: link.src.id,
				to: link.dest.id */
				
				"from": u.isObj(src) ? src.id : src || link.source_id,
				to: u.isObj(dest) ? dest.id : dest || link.destination_id,
			});
		});
		
		newData.nodes = newNodes;
		newData.edges = newEdges;
		return newData;
	}
	function draw(data) {
		// data = convertData(data);
		data.nodeTypes = g.nodeTypes;
		g.dataConvertor.postMessage(data);
		
		// g.nodes.update(data.nodes);
		// g.edges.update(data.edges);
		
		// g.network.setData({nodes: data.nodes, edges: data.edges});
	}
	function init(elementId) {
		var width = window.innerWidth,
			height = window.innerHeight,
			hW = width / 2;
			hH = height / 2;
		
		g.container = $(elementId);
		g.container.height(window.innerHeight);
		
		g.network = new vis.Network(g.container[0], {nodes: g.nodes, edges: g.edges}, g.options);
		g.network.on("click", neighbourhoodHighlight); // neighbourhoodHighlight highlight highlight_2
		window.network = g.network;
		ajax({
			data: {
				x1: -hW,
				x2: hW,// window.innerWidth,
				y1: -hH,
				y2: hH // window.innerHeight
			}
		})
		.done(function (data) {
			console.log(data);
			t = data;
			draw(data);
		});
		createWorker();
	}
	
	
	var GRAYED_OUT_COLOR = "rgba(200, 200, 200, 0.5)";
	var active = false;
	
	function highlight(e) {
		var t0 = performance.now();
		
		var len = e.nodes.length,
			targetId = e.nodes[0],
			connectedNodes = g.network.getConnectedNodes(targetId),
			connectedEdges = g.network.getConnectedEdges(targetId),
			o = { returnType: "Object" },
			nodes = g.nodes.get(o),
			edges = g.edges.get(o),
			toUpdateNodes = [],
			toUpdateEdges = [];
			
		
		if (len > 0) {
			Object.keys(nodes).forEach(function (k) {
				var node = nodes[k],
					id = node.id;
				if ( connectedNodes.indexOf(id) === -1  &&  id !== targetId ) {
					node.tmpGroup = node.group;
					node.group = undefined;
					node.color = GRAYED_OUT_COLOR;
					node.hiddenLabel = node.label;
					node.label = undefined;
					toUpdateNodes.push(node);
				}
			});
			Object.keys(edges).forEach(function (k) {
				var edge = edges[k],
					id = edge.id;
				if ( connectedEdges.indexOf(id) === -1 ) {
					edge.tmpColor = edge.color;
					edge.color = GRAYED_OUT_COLOR;
					toUpdateEdges.push(edge);
				}
			});
			active = true;
		} else if (len === 0 && active) {
			Object.keys(nodes).forEach(function (k) {
				var node = nodes[k],
					tmpGroup = node.tmpGroup;
				if (tmpGroup) {
					node.color = undefined;
					node.group = tmpGroup;
					node.label = node.hiddenLabel;
				}
				toUpdateNodes.push(node);
			});
			Object.keys(edges).forEach(function (k) {
				var edge = edges[k];
					tmpColor = edge.tmpColor;
				if (tmpColor) {
					edge.color = tmpColor;
				}
				toUpdateEdges.push(edge);
			});
			active = false;
		}
		var t1 = performance.now();
		console.log("took " + (t1 - t0) + " milliseconds.");
		
		g.nodes.update(toUpdateNodes);
		g.edges.update(toUpdateEdges);
	}
	
	function highlight_2(e) {
		var t0 = performance.now();
		
		var newtork = g.network,
			nodes = g.nodes,
			edges = g.edges,
			selectedNode, target, connectedNodes, connectedEdges, highlightActive, allNodes, allEdges,
			len = e.nodes.length,
			updatedEdges, updatedNodes;
		
		allNodes = nodes.get({
			returnType: "Object"
		});
		allEdges = edges.get({
			returnType: "Object"
		});
		
		// if something is selected:
		if (len > 0) {
			highlightActive = true;
			targetId = e.nodes[0];
			selectedNode = allNodes[targetId];

			// gray-out all nodes and hide their labels
			Object.keys(allNodes).forEach(function (k) {
				var node = allNodes[k];
				node.color = GRAYED_OUT_COLOR;
				if (node.hiddenLabel === undefined) {
					node.hiddenLabel = node.label;
					node.label = undefined;
				}
			});
			
			// give selected node and its connected nodes their color and label back
			connectedNodes = network.getConnectedNodes(targetId);
			connectedNodes.forEach(function (k) {
				var node = allNodes[k],
					hiddenLabel = node.hiddenLabel;
				
				node.color = undefined;
				if (hiddenLabel !== undefined) {
					node.label = hiddenLabel;
					node.hiddenLabel = undefined;
				}
			});
			selectedNode.color = undefined;
			if (selectedNode.hiddenLabel !== undefined) {
				selectedNode.label = selectedNode.hiddenLabel;
				selectedNode.hiddenLabel = undefined;
			}
			
			// gray-out all edges
			Object.keys(allEdges).forEach(function (k) {
				var edge = allEdges[k];
				edge.originalColor = edge.color;
				edge.color = GRAYED_OUT_COLOR;
			});
			
			// give connected edges their color back
			connectedEdges = edges.get({
				filter: function (i) {
					return i["from"] === targetId || i.to === targetId ? i : false
				}
			});
			connectedEdges.forEach(function (item) {
				var edge = allEdges[item.id];
				
				edge.color = edge.originalColor;
			});
		} else if (len === 0) {
			// reset all nodes
			
			Object.keys(allNodes).forEach(function (k) {
				var node = allNodes[k],
					hiddenLabel = node.hiddenLabel;
				
				node.color = undefined;
				if (hiddenLabel !== undefined) {
					node.label = hiddenLabel;
					node.hiddenLabel = undefined;
				}
			});
			
			Object.keys(allEdges).forEach(function (k) {
				var edge = allEdges[k];
				edge.color = edge.originalColor;
			});
		}
		
		updatedNodes = [];
		updatedEdges = [];
		Object.keys(allNodes).forEach(function (k) {
			updatedNodes.push( allNodes[k] );
		});
		Object.keys(allEdges).forEach(function (k) {
			updatedEdges.push( allEdges[k] );
		});
		
		var t1 = performance.now();
		console.log("took " + (t1 - t0) + " milliseconds.");
		
		nodes.update(updatedNodes);
		edges.update(updatedEdges);
	}
	
	var allNodes;
	var highlightActive = false;
	// "rgba(150, 150, 150, 0.75)"
	// "rgba(200, 200, 200, 0.5)"
	function neighbourhoodHighlight(e) {
		var t0 = performance.now();
		
		var network,
			nodes,
			edges,
			k, i, node, edge, hiddenLabel, len, originalColor,
			targetId,
			connectedNodes, connectedEdges,
			o = {returnType: "Object"},
			toUpdateNodes = [],
			toUpdateEdges = [];
			
		
		
		nodes = g.nodes.get(o);
		edges = g.edges.get(o);
		
		if (e.nodes.length > 0) {
			console.log(1);
			network = g.network;
			highlightActive = true;
			targetId = e.nodes[0];
			
			for (k in nodes) {
				if ( nodes.hasOwnProperty(k) ) {
					node = nodes[k];
					hiddenLabel = node.hiddenLabel;
					
					node.color = GRAYED_OUT_COLOR;
					if (hiddenLabel === undefined) {
						node.hiddenLabel = node.label;
						node.label = undefined;
					}
				}
			}
			connectedNodes = network.getConnectedNodes(targetId); // array of ids
			len = connectedNodes.length;
			
			for (i=0; i < len; i+=1) {
				node = nodes[ connectedNodes[i] ];
				hiddenLabel = node.hiddenLabel;
				
				node.color = undefined;
				if (hiddenLabel !== undefined) {
					node.label = hiddenLabel;
					node.hiddenLabel = undefined;
				}
			}
			
			node = nodes[targetId];
			hiddenLabel = node.hiddenLabel;
			node.color = undefined;
			if (hiddenLabel !== undefined) {
				node.label = hiddenLabel;
				node.hiddenLabel = undefined;
			}
			
			
			connectedEdges = network.getConnectedEdges(targetId);
			
			k = undefined;
			for (k in edges) {
				if ( edges.hasOwnProperty(k) ) {
					edge = edges[k];
					originalColor = edge.originalColor;
					if (originalColor === undefined) {
						edge.originalColor = edge.color;
						edge.color = GRAYED_OUT_COLOR;
					}
				}
			}
			
			console.log(connectedEdges);
			connectedEdges = g.edges.get( connectedEdges, o );
			console.log(connectedEdges);
			
			k = undefined;
			for (k in connectedEdges) {
				if ( connectedEdges.hasOwnProperty(k) ) {
					edge = edges[k];
					originalColor = edge.originalColor;
					if (originalColor !== undefined) {
						edge.color = originalColor;
						edge.originalColor = undefined;
					}
				}
			}
			
		} else if (highlightActive === true) {
			console.log(2);
			k = undefined;
			for (k in nodes) {
				node = nodes[k];
				hiddenLabel = node.hiddenLabel;
				
				node.color = undefined;
				if (hiddenLabel !== undefined) {
					node.label = hiddenLabel;
					node.hiddenLabel = undefined;
				}
			}
			
			k = undefined;
			for (k in edges) {
				edge = edges[k];
				originalColor = edge.originalColor;
				if (originalColor !== undefined) {
					edge.color = originalColor;
					edge.originalColor = undefined;
				}
			}
			highlightActive = false
		}
		
		
		k = undefined;
		for (k in nodes) {
			if (nodes.hasOwnProperty(k)) {
				toUpdateNodes.push( nodes[k] );
			}
		}
		
		k = undefined;
		for (k in edges) {
			if (edges.hasOwnProperty(k)) {
				toUpdateEdges.push( edges[k] );
			}
		}
		
		var t1 = performance.now();
		console.log("took " + (t1 - t0) + " milliseconds.");
		
		
		g.nodes.update(toUpdateNodes);
		g.edges.update(toUpdateEdges);
	}

	
	
	
	
	inst.convertData = convertData;
	inst.draw = draw;
	inst.init = init;
	inst.clear = function () {
		g.nodes.clear();
		g.edges.clear();
	};
	inst.g = g;
	
	window.visMap = g;
	return inst;
});