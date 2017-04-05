var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

self.onmessage = function (e) {
	var data = e.data,
	    oldNodes = data.nodes,
	    oldLinks = data.links,
	    nodeTypes = data.nodeTypes,
	    newData = {},
	    newNodes = [],
	    newEdges = [],
	    keys,
	    i,
	    len,
	    node,
	    link,
	    src,
	    dest,
	    status;

	keys = Object.keys(oldNodes);
	len = keys.length;

	for (i = 0; i < len; i += 1) {
		node = oldNodes[keys[i]];

		newNodes.push({
			id: node.id,
			label: node.name || node.management_ip,
			group: nodeTypes[node.type],
			x: node.x,
			y: node.y,
			title: template(node.name, node.id)
		});
	}
	/* Object.keys(oldNodes).forEach(function (k) {
 	var node = oldNodes[k];
 	newNodes.push({
 		id: node.id,
 		label: node.name || node.management_ip,
 		group: nodeTypes[node.type],
 		x: node.x,
 		y: node.y,
 		title: template(node.name, node.id)
 	});
 }); */
	keys = Object.keys(oldLinks);
	len = keys.length;
	for (i = 0; i < len; i += 1) {
		link = oldLinks[keys[i]];
		src = link.src;
		dest = link.dest;
		status = link.status;

		newEdges.push({
			id: link.id,
			"from": isObj(src) ? src.id : src || link.source_id,
			to: isObj(dest) ? dest.id : dest || link.destination_id,
			color: status === 0 ? "#33691e" : // green
			status === 1 ? "#00695c" : // cyan
			status === 2 ? "#0fd600" : // yellow
			status === 3 ? "#e65100" : // orange
			status === 4 ? "#ff1744" : // pink
			status === 5 ? "#b71c1c" : undefined });
	}
	/* Object.keys(oldLinks).forEach(function (k) {
 	var link = oldLinks[k],
 		src = link.src,
 		dest = link.dest,
 		status = link.status;
 	
 	newEdges.push({
 		id: link.id,
 		"from": isObj(src) ? src.id : src || link.source_id,
 		to: isObj(dest) ? dest.id : dest || link.destination_id,
 		color:	status === 0 ? "#33691e" : // green
 				status === 1 ? "#00695c" : // cyan
 				status === 2 ? "#0fd600"  : // yellow
 				status === 3 ? "#e65100" : // orange
 				status === 4 ? "#ff1744" : // pink
 				status === 5 ? "#b71c1c" : undefined, // red
 	});
 }); */

	newData.nodes = newNodes;
	newData.edges = newEdges;

	postMessage(newData);
};

function template(name, id) {
	var t = '' + '<table class="uk-table">' + '<tr>' + '<th>Node Name</th>' + '<th>Node Id</th>' + '</tr>' + '<tr>' + '<td>' + name + '</td>' + '<td>' + id + '</td>' + '</tr>' + '</table>';

	return t;
}
function isObj(v) {
	return v && (typeof v === "undefined" ? "undefined" : _typeof(v)) === 'object' && typeof v !== null && Object.prototype.toString.call(v) === '[object Object]' ? true : false;
}
//# sourceMappingURL=dataConvertor.js.map