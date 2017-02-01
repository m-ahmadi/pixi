var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 2000;
var u = require('./u');
var MAX_DRAWING_ITERATIONS = 30;

app.get('/', function (req, res) {
	// 
});

var nodeCounter = 0;
var linkCounter = 0;
function generate(socket) {
	var data = {},
		nodes = {},
		links = {},
		ids = [],
		node, link, id, src, dest, d,
	//	counter = 0,
		max = u.randInt(3, 5),
		i;
	
	for (i=0; i<max; i+=1 ) {
		node = {};
		id = 'node_'+ (nodeCounter+=1);
			
		ids.push(id);
		
		node.x = u.randInt(0, 1920);
		node.y = u.randInt(0, 920);
		node.id = id;
		node.name = id;
		node.type = u.randInt(0, 9);
		node.status = u.randInt(0, 5);
		node.links = [];
		
		nodes[id] = node;
	}
	
	for (i=0; i<max; i+=1 ) {
		link = {};
		id = 'link_'+ (linkCounter+=1);
		
		d = rand();
		while ( d.srcId === d.destId ||
			(!nodes[d.srcId]  &&  !nodes[d.destId]) ) {
			d = rand();
		}
		
		src = nodes[d.srcId];
		dest = nodes[d.destId],
		
		link.id = id,
		link.src = { id: src.id, x: src.x, y: src.y };
		link.dest = { id: dest.id, x: dest.x, y: dest.y };
		link.status = u.randInt(0, 5);
		
		links[id] = link;
	}
	
	Object.keys(links).forEach(function (k) {
		var lnk = links[k],
			srcNode = nodes[lnk.src.id],
			destNode = nodes[lnk.dest.id];
		
		srcNode.links.push(lnk.id);
		destNode.links.push(lnk.id);
	});
	
	function rand() {
		return { 
			srcId: ids[ u.randInt(0, ids.length-1) ],
			destId: ids[ u.randInt(0, ids.length-1) ]
		};
	}
	
	data.nodes = nodes;
	data.links = links;
	
	
	socket.emit('server msg', data);
}

var timeoutId;
var count = 0;
io.on('connection', function (socket) {
	console.log('a user connected');
	socket.on('start sending', function () {
		ttt();
		function ttt() {
			if (count < MAX_DRAWING_ITERATIONS) {
				generate(socket);
				timeoutId = setTimeout(ttt, 1000);
			} else {
				clearTimeout(timeoutId);
			}
			count += 1;
		}
	});
	socket.on('disconnect', function () {
		console.log('user disconnected');
		clearTimeout(timeoutId);
	});
});

http.listen(port, function () {
	console.log('listening on *:'+port);
});