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
				from: {
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
			size: 15,
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
				
				from: u.isObj(src) ? src.id : src || link.source_id,
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
		g.network.on("click", highlight);
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
	
	
	var highlightActive = false;
	var allNodes;
	var allEdges;
	function highlight(e) {
		var newtork = g.network,
			nodes = g.nodes,
			edges = g.edges,
			i, j,
			selectedNode, degrees, target,
			iNode, iEdge,
			updatedEdges = [],
			updatedNodes = [];
		
		allNodes = nodes.get({
			returnType: "Object"
		});
		allEdges = edges.get({
			returnType: "Object"
		});
		
		// if something is selected:
		if (e.nodes.length > 0) {
			highlightActive = true;
			targetId = e.nodes[0],
			selectedNode = allNodes[targetId];
			degrees = 2;

			// mark all nodes as hard to read.
			Object.keys(allNodes).forEach(function (k) {
				var node = allNodes[k];
				node.color = "rgba(200, 200, 200, 0.5)";
				if (node.hiddenLabel === undefined) {
					node.hiddenLabel = node.label;
					node.label = undefined;
				}
			});
			
			var connectedNodes = network.getConnectedNodes(targetId);
			var allConnectedNodes = [];

			// get the second degree nodes
			/* for (i = 1; i < degrees; i++) {
				for (j = 0; j < connectedNodes.length; j++) {
					allConnectedNodes = allConnectedNodes.concat(  network.getConnectedNodes( connectedNodes[j] )  );
				}
			} */

			
			// all second degree nodes get a different color and their label back
			/* allConnectedNodes.forEach(function (k) {
				var node = allNodes[k],
					hiddenLabel = node.hiddenLabel;
				
				node.color = 'rgba(150,150,150,0.75)';
				if (hiddenLabel !== undefined) {
					node.label = hiddenLabel;
					node.hiddenLabel = undefined;
				}
			}); */


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
			
			
			Object.keys(allEdges).forEach(function (k) {
				allEdges[k].color = "rgba(200, 200, 200, 0.5)";
				updatedEdges.push(allEdges[k]);
			});
			var connectedEdges = edges.get({
				filter: function (i) {
					return i.from === targetId || i.to === targetId ? i : false
				}
			});
		} else if (highlightActive === true) {
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
			highlightActive = false;
		}

		// transform the object into an array
		
		
		for (nodeId in allNodes) {
			if (allNodes.hasOwnProperty(nodeId)) {
				updatedNodes.push(allNodes[nodeId]);
			}
		}
		nodes.update(updatedNodes);
		
		//-------------------------------------------------------------
		edges.update(updatedEdges);
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