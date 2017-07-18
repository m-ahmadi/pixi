var u = require("util-ma");
var randInt = u.randInt;

var nodes = {};
var	links = {};
var TOTAL_NODES = 20000;
var TOTAL_LINKS = 1000000;
var MIN_X = -10000;
var MAX_X = 10000;
var MIN_Y = -6000;
var MAX_Y = 6000;

function build() {
	var i, counter = 0,
		node, link, id,
		data, src, dest,
		ids = [];
	
	for (i=0; i<TOTAL_NODES; i+=1) {
		node = {};
		id = (counter+=1);
		
		ids.push(id);
		
		node.id = id;
		// node.name = id;
		node.name = "node_"+id;
		node.x = randInt(MIN_X, MAX_X);
		node.y = randInt(MIN_Y, MAX_Y);
		node.type = randInt(0, 6);
		node.status = randInt(0, 6);
		node.links = [];
		
		nodes[id] = node;
	}
	
	counter = 0;
	for (i=0; i<TOTAL_LINKS; i+=1) {
		link = {};
		id = (counter+=1);
		
		data = rand();
		while ( data.srcId === data.destId ||
			(!nodes[data.srcId]  &&  !nodes[data.destId]) ) {
			data = rand();
		}
		src = nodes[data.destId];
		dest = nodes[data.srcId],
		link.id = id,
		link.src = src.id;
		link.dest = dest.id;
		link.status = randInt(0, 5);
		
		links[id] = link;
	}
	
	function rand() {
		return { 
			srcId: ids[ randInt(0, ids.length-1) ],
			destId: ids[ randInt(0, ids.length-1) ]
		};
	}
	
	Object.keys(links).forEach(function (k) {
		var lnk = links[k],
			srcNode = nodes[lnk.src],
			destNode = nodes[lnk.dest];
		srcNode.links.push(lnk.id);
		destNode.links.push(lnk.id);
	});
}
function get(x1, x2, y1, y2) {
	var d = {},
		filteredNodes = {},
		filteredLinks = {},
		arr = [];
	
	Object.keys(nodes).forEach(function (k) {
		var n = nodes[k],
			x = n.x,
			y = n.y,
			links = n.links;
		
		var cond = x >= x1 &&
			x <= x2 &&
			y >= y1 &&
			y <= y2;
		
		if (cond) {
			filteredNodes[n.id] = n;
		}
	});
	
	Object.keys(nodes).forEach(function (k) {
		var n = nodes[k],
			nLinks = n.links;
		
		if ( !nLinks.length ) return;
		nLinks.forEach(function (id) {
			var lnk = links[id];
			if ( (filteredNodes[ lnk.src ] &&
					filteredNodes[ lnk.dest ] ) &&
					arr.indexOf(id) === -1 ) {
				arr.push(id);
			}
		});
	});
	
	arr.forEach(function (i) {
		filteredLinks[i] = links[i];
	});
	
	
	d.nodes = filteredNodes;
	d.links = filteredLinks;
	return d;
}

module.exports = { build, get};