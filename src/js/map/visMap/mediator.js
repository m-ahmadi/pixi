define(["core/config", "core/util", "core/pubsub", "core/mainSocket", "./groups"], function (CONF, u, newPubSub, mainSocket, groups) {
	const WORKERS_DIR = `${CONF.ROOT}js/map/visMap/workers`;
	
	let inst = u.extend( newPubSub() );
	let g = {};
	let tmpl = Handlebars.templates;
	
	g.network = {};
	g.options = {};
	g.container = {};
	g.nodes = {};
	g.edges = {};
	
	g.nodeTypes = ["type0", "type1", "type2", "type3", "type4", "type5", "type6"];
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
			
			/* arrows: {
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
				
			}, */
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
		groups: groups,
		layout: {
			improvedLayout: false
		},
		interaction: {
			hideEdgesOnDrag: true,
			hover: true,
			tooltipDelay: 300
		},
	//	manipulation: {},
		physics: false // true false
	};
	
	var t0, t1;
	
	function createWorker() {
		if (window.Worker) {
			g.dataConvertor = new Worker(`${WORKERS_DIR}/dataConvertor.js`);
			g.highlighter = new Worker(`${WORKERS_DIR}/highlighter.js`);
			
			g.dataConvertor.onmessage = function (e) {
			//	console.log("convert is finished.");
				var data = e.data;
				g.nodes.update(data.nodes);
				g.edges.update(data.edges);
			};
			
			g.highlighter.onmessage = function (e) {
				t1 = performance.now();
			//	console.log("worker is finished: "+ (t1-t0) );
				var data = e.data,
					nodes = data.nodes,
					edges = data.edges
				
				if (nodes.length) {
					g.nodes.update(data.nodes);
				}
				
				if (edges.length) {
					g.edges.update(data.edges);
				}
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
	function updateNode(newInfo) {
		g.nodes.update(newInfo);
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
		
		g.nodes = new vis.DataSet();
		g.edges = new vis.DataSet();
	
		g.container = $(elementId);
		g.container.height(window.innerHeight);
		
		g.network = new vis.Network(g.container[0], {nodes: g.nodes, edges: g.edges}, g.options);
		g.network.on("dragEnd", changeNodePos);
		g.network.on("click", workerHighlight); // workerHighlight neighbourhoodHighlight
		window.network = g.network;
		
		$(window).on("resize", function () {
			g.container.height(window.innerHeight);
		});
		/* $.ajax({
			url: "http://localhost:3000",
			type: "POST",
			dataType: "json",
			data: {
				x1: -1000,// -hW
				x2: 1000,// hW window.innerWidth,
				y1: -600, // -hH
				y2: 600 // hH window.innerHeight
			}
		})
		.done(function (data) {
			console.log(data);
			t = data;
			draw(data);
		}); */
		createWorker();
	}
	
	
	var GRAYED_OUT_COLOR = "rgba(200, 200, 200, 0.5)"; "rgba(150, 150, 150, 0.75)"
	var active = false;
	
	
	
	
	var highlightActive = false;
	function neighbourhoodHighlight(e) {
		var t0 = performance.now();
		
		var network,
			nodes,
			edges,
			k, i, node, edge, hiddenLabel, len, originalColor,
			keys,
			targetId,
			connectedNodes, connectedEdges,
			o = {returnType: "Object"},
			toUpdateNodes = [],
			toUpdateEdges = [];
			
		
		nodes = g.nodes.get(o);
		edges = g.edges.get(o);
		
		if (e.nodes.length > 0) {
			network = g.network;
			highlightActive = true;
			targetId = e.nodes[0];
			
			keys = Object.keys(nodes);
			len = keys.length;
			for (i=0; i<len; i+=1) {
				node = nodes[ keys[i] ];
				hiddenLabel = node.hiddenLabel;
				
				node.color = GRAYED_OUT_COLOR;
				if (hiddenLabel === undefined) {
					node.hiddenLabel = node.label;
					node.label = undefined;
				}
			}
			
			connectedNodes = network.getConnectedNodes(targetId); // array of ids
			len = connectedNodes.length;
			
			for (i=0; i<len; i+=1) {
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
			
			keys = Object.keys(edges);
			len = keys.length;
			for (i=0; i<len; i+=1) {
				edge = edges[ keys[i] ];
				originalColor = edge.originalColor;
				if (originalColor === undefined) {
					edge.originalColor = edge.color;
					edge.color = GRAYED_OUT_COLOR;
				}
			}
			
			connectedEdges = network.getConnectedEdges(targetId); // array of ids
			
			len = connectedEdges.length;
			for (i=0; i<len; i+=1) {
				edge = edges[ connectedEdges[i] ];
				originalColor = edge.originalColor;
				if (originalColor !== undefined) {
					edge.color = originalColor;
					edge.originalColor = undefined;
				}
			}
			
		} else if (highlightActive === true) {
			keys = Object.keys(nodes);
			len = keys.length;
			for (i=0; i<len; i+=1) {
				node = nodes[ keys[i] ];
				hiddenLabel = node.hiddenLabel;
				
				node.color = undefined;
				if (hiddenLabel !== undefined) {
					node.label = hiddenLabel;
					node.hiddenLabel = undefined;
				}
			}
			
			keys = Object.keys(edges);
			len = keys.length;
			for (i=0; i<len; i+=1) {
				edge = edges[ keys[i] ];
				originalColor = edge.originalColor;
				if (originalColor !== undefined) {
					edge.color = originalColor;
					edge.originalColor = undefined;
				}
			}
			highlightActive = false
		}
		
		keys = Object.keys(nodes);
		len = keys.length;
		for (i=0; i<len; i+=1) {
			toUpdateNodes.push( nodes[ keys[i] ] );
		}
		
		keys = Object.keys(edges);
		len = keys.length;
		for (i=0; i<len; i+=1) {
			toUpdateEdges.push( edges[ keys[i] ] );
		}
		
		var t1 = performance.now();
		console.log("took " + (t1 - t0) + " milliseconds.");
		
		g.nodes.update(toUpdateNodes);
		g.edges.update(toUpdateEdges);
	}
	
	var highlightActive = false;
	function workerHighlight(e) {
		
		var targetId = e.nodes[0];
		var network = g.network;
		var o = {returnType: "Object"};
		var data = {
			len: e.nodes.length,
			targetId: targetId,
			nodes: g.nodes.get(o),
			edges: g.edges.get(o),
			connectedNodes: targetId ? network.getConnectedNodes(targetId) : [],
			connectedEdges: targetId ? network.getConnectedEdges(targetId) : []
		};
		
		t0 = performance.now();
		g.highlighter.postMessage(data);
	}
	function changeNodePos(e) {
		let targetId = e.nodes[0];
		if (targetId) {
			let node = g.nodes.get(targetId);
			let c = e.pointer.canvas;
			let nodeNew = {
				id: targetId,
				x: c.x,
				y: c.y
			};
			inst.emit("node_position_changed", nodeNew);
		}
		
	}
	
	
	
	inst.convertData = convertData;
	inst.updateNode = updateNode;
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