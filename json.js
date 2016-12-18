var express = require('express'),
	util = require('./u'),
	server = express();

var nCount, m, e,
	x1, x2,
	y1, y2;

function toInt(v) {
	return typeof v === 'string' ? parseInt(v, 10) : undefined;
}
function setThings(o) {
	nCount =  o.count ?  toInt(o.count) :  10;
	m      =  o.m     ?  toInt(o.m)     :  1;
	e      =  o.e     ?  toInt(o.e)     :  5;
	x1     =  o.x1    ?  toInt(o.x1)    :  0;
	x2     =  o.x2    ?  toInt(o.x2)    :  640;
	y1     =  o.y1    ?  toInt(o.y1)    :  0;
	y2     =  o.y2    ?  toInt(o.y2)    :  480;
}
function generateJson(nc) {
	var nodes = {},
		links = {},
		counter = 0,
		nodeCount = util.randInt(nc, nc*2),
		linkCount = util.randInt(nc*2, nc*3),
		i;
	
	for (i=0; i<nodeCount; i+=1) {
		var node = {},
			id = 'node_'+(counter+=1);
		
		node.id = id;
		node.x = util.randInt(x1, x2);
		node.y = util.randInt(y1, y2);
		node.type = util.randInt(0, 5);
		node.status = util.randInt(0, 5);
		node.links = [];
		
		nodes[id] = node;
	}
	
	counter = 0;
	
	function rand() {
		return {
			srcId: 'node_' + util.randInt(1, nodeCount),
			destId: 'node_' + util.randInt(1, nodeCount)
		};
	}
	for (i=0; i<linkCount; i+=1) {
		var link = {}, data,
			id = 'link_'+(counter+=1);
		
		data = rand();
		while ( data.srcId === data.destId ) {
			data = rand();
		}
		
		link.id = id,
		link.src = data.srcId,
		link.dest = data.destId;
		link.status = util.randInt(0, 5);
		
		links[id] = link;
	}
	
	
	Object.keys(links).forEach(function (k) {
		var link = links[k];
		nodes[link.src].links.push(link.id);
		nodes[link.dest].links.push(link.id);
	});
	
	/*
	Object.keys(nodes).forEach(function (k) {
		var node = nodes[k];
		if ( !node.link ) {
			var newone = {
				id: 'link_'+(counter+=1),
				src: node.id,
				dest: 'node_' + util.randInt(1, nodeCount),
				status: util.randInt(0, 5)
			};
			node.links.push(newone.id);
		}
	});
	*/
	return { nodes: nodes, links: links };
}

function get(req, res) {
	setThings(req.query);
	
	var o = generateJson(nCount);
	
	res.write( JSON.stringify(o) );
	res.end();
}


server.get('/', get);
server.listen(3000);