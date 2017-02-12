define(['core/util', 'core/ajax', 'core/whb'], function (u, ajax, whb) {
	var inst = {},
		p = {},
		tmpl = whb.tmpl;
	
	p.network = {};
	p.options = {};
	p.container = {};
	p.nodes = {};
	p.edges = {};
	p.nodeTypes = ["type1", "type2", "type3", "type4", "type5"];
	
	p.options = {
		autoResize: true,
		height: '100%',
		width: '100%',
		locale: 'en',
	//	locales: locales,
		clickToUse: false,
		configure: {
			enabled: false
		},
		edges: {
			width: 1,
			smooth: {
				type: 'dynamic' // 'continuous', 'discrete', 'diagonalCross', 'straightCross', 'horizontal', 'vertical', 'curvedCW', 'curvedCCW', 'cubicBezier'
			}
		},
		nodes: {
			borderWidth: 2,
			shape: 'dot',
			
			font: {
				size: 12,
				face: 'Tahoma'
			}
		},
		groups: {
			type1: {
				shape: 'icon',
				icon: {
					face: 'FontAwesome',
					code: '\uf0c0', // group
					size: 50,
					color: '#57169a'
				}
			},
			type2: {
				shape: 'icon',
				icon: {
					face: 'FontAwesome',
					code: '\uf007', // users
					size: 50,
					color: '#3f51b5'
				}
			},
			type3: {
				shape: 'dot',
				color: '#e91e63'
			},
			type4: {
				shape: 'diamond',
				color: '#fb7e81'
			},
			type5: {
				shape: 'star',
				color: '#FFEB3B'
			},
			type6: {
				shape: 'triangle',
				color: '#ffff00'
			},
			type7: {
				shape: 'dot',
				color: '#33691e'
			},
			type8: {
				shape: 'square',
				color: '#ffd600'
			},
			type9: {
				shape: 'triangleDown',
				color: '#ff1744'
			}
			
		},
		layout: {
			improvedLayout: false
		},
		interaction: {
			hideEdgesOnDrag: false,
			tooltipDelay: 200
		},
	//	manipulation: {},
		physics: false // true false
	};
	
	function convertData(data) {
		var oldNodes = data.nodes,
			oldLinks = data.links,
			newData = {},
			newNodes = [],
			newEdges = [];
		
		Object.keys(oldNodes).forEach(function (k) {
			var node = oldNodes[k];
			
			p.nodes.add({
				id: node.id,
				label: node.name,
				group: p.nodeTypes[node.type],
				x: node.x,
				y: node.y,
				title: tmpl.nodepopup({name: node.name, id: node.id})
			});
			
		});
		Object.keys(oldLinks).forEach(function (k) {
			var link = oldLinks[k],
				src = link.src,
				dest = link.dest;
			
			p.edges.add({
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
		data = convertData(data);
		// p.nodes.update(data.nodes);
		// p.edges.update(data.edges);
		console.log('convert is finished.');
		// p.network.setData({nodes: data.nodes, edges: data.edges});
	}
	function init(elementId) {
		var width = window.innerWidth,
			height = window.innerHeight,
			hW = width / 2;
			hH = height / 2;
		
		p.container = $(elementId);
		p.container.height(window.innerHeight);
		
		p.nodes = new vis.DataSet();
		p.edges = new vis.DataSet();
		p.network = new vis.Network(p.container[0], {nodes: p.nodes, edges: p.edges}, p.options);
		
		window.network = p.network;
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
	}
	
	inst.convertData = convertData;
	inst.draw = draw;
	inst.init = init;
	inst.clear = function () {
		p.nodes.clear();
		p.edges.clear();
	}
	
	window.vismap = inst;
	return inst;
});