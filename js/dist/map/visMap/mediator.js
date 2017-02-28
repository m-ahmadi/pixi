define(["core/util", "core/ajax", "core/whb"], function (u, ajax, whb) {
	var inst = {},
	    g = {},
	    tmpl = whb.tmpl;

	g.WORKERS_DIR = "js/dist/workers";
	g.network = {};
	g.options = {};
	g.container = {};
	g.nodes = new vis.DataSet();
	g.edges = new vis.DataSet();
	g.nodeTypes = ["type1", "type2", "type3", "type4", "type5", "type6", "type7", "type8", "type9"];
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
				}

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

	var t0, t1;

	function createWorker() {
		if (window.Worker) {
			g.dataConvertor = new Worker(`${g.WORKERS_DIR}/dataConvertor.js`);
			g.highlighter = new Worker(`${g.WORKERS_DIR}/highlighter.js`);

			g.dataConvertor.onmessage = function (e) {
				console.log("convert is finished.");
				var data = e.data;
				g.nodes.update(data.nodes);
				g.edges.update(data.edges);
			};

			g.highlighter.onmessage = function (e) {
				t1 = performance.now();
				console.log("worker is finished: " + (t1 - t0));
				var data = e.data,
				    nodes = data.nodes,
				    edges = data.edges;

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
				title: tmpl.nodepopup({ name: node.name, id: node.id })
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
				to: u.isObj(dest) ? dest.id : dest || link.destination_id
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

		g.network = new vis.Network(g.container[0], { nodes: g.nodes, edges: g.edges }, g.options);
		g.network.on("click", workerHighlight); // workerHighlight neighbourhoodHighlight
		window.network = g.network;
		ajax({
			data: {
				x1: -hW, // hW
				x2: hW, // hW window.innerWidth,
				y1: -hH, // hH
				y2: hH // hH window.innerHeight
			}
		}).done(function (data) {
			console.log(data);
			t = data;
			draw(data);
		});
		createWorker();
	}

	var GRAYED_OUT_COLOR = "rgba(200, 200, 200, 0.5)";"rgba(150, 150, 150, 0.75)";
	var active = false;

	var highlightActive = false;
	function neighbourhoodHighlight(e) {
		var t0 = performance.now();

		var network,
		    nodes,
		    edges,
		    k,
		    i,
		    node,
		    edge,
		    hiddenLabel,
		    len,
		    originalColor,
		    keys,
		    targetId,
		    connectedNodes,
		    connectedEdges,
		    o = { returnType: "Object" },
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
			for (i = 0; i < len; i += 1) {
				node = nodes[keys[i]];
				hiddenLabel = node.hiddenLabel;

				node.color = GRAYED_OUT_COLOR;
				if (hiddenLabel === undefined) {
					node.hiddenLabel = node.label;
					node.label = undefined;
				}
			}

			connectedNodes = network.getConnectedNodes(targetId); // array of ids
			len = connectedNodes.length;

			for (i = 0; i < len; i += 1) {
				node = nodes[connectedNodes[i]];
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
			for (i = 0; i < len; i += 1) {
				edge = edges[keys[i]];
				originalColor = edge.originalColor;
				if (originalColor === undefined) {
					edge.originalColor = edge.color;
					edge.color = GRAYED_OUT_COLOR;
				}
			}

			connectedEdges = network.getConnectedEdges(targetId); // array of ids

			len = connectedEdges.length;
			for (i = 0; i < len; i += 1) {
				edge = edges[connectedEdges[i]];
				originalColor = edge.originalColor;
				if (originalColor !== undefined) {
					edge.color = originalColor;
					edge.originalColor = undefined;
				}
			}
		} else if (highlightActive === true) {
			keys = Object.keys(nodes);
			len = keys.length;
			for (i = 0; i < len; i += 1) {
				node = nodes[keys[i]];
				hiddenLabel = node.hiddenLabel;

				node.color = undefined;
				if (hiddenLabel !== undefined) {
					node.label = hiddenLabel;
					node.hiddenLabel = undefined;
				}
			}

			keys = Object.keys(edges);
			len = keys.length;
			for (i = 0; i < len; i += 1) {
				edge = edges[keys[i]];
				originalColor = edge.originalColor;
				if (originalColor !== undefined) {
					edge.color = originalColor;
					edge.originalColor = undefined;
				}
			}
			highlightActive = false;
		}

		keys = Object.keys(nodes);
		len = keys.length;
		for (i = 0; i < len; i += 1) {
			toUpdateNodes.push(nodes[keys[i]]);
		}

		keys = Object.keys(edges);
		len = keys.length;
		for (i = 0; i < len; i += 1) {
			toUpdateEdges.push(edges[keys[i]]);
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
		var o = { returnType: "Object" };
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
//# sourceMappingURL=mediator.js.map