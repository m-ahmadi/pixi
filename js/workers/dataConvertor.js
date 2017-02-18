self.onmessage = function (e) {
	var data = e.data,
		oldNodes = data.nodes,
		oldLinks = data.links,
		nodeTypes = data.nodeTypes,
		newData = {},
		newNodes = [],
		newEdges = [];
	
	Object.keys(oldNodes).forEach(function (k) {
		var node = oldNodes[k];
		newNodes.push({
			id: node.id,
			label: node.name || node.management_ip,
			group: nodeTypes[node.type],
			x: node.x,
			y: node.y,
			title: template(node.name, node.id)
		});
	});
	Object.keys(oldLinks).forEach(function (k) {
		var link = oldLinks[k],
			src = link.src,
			dest = link.dest;
		
		newEdges.push({
			from: isObj(src) ? src.id : src || link.source_id,
			to: isObj(dest) ? dest.id : dest || link.destination_id,
		});
	});
	
	newData.nodes = newNodes;
	newData.edges = newEdges;
	
	postMessage(newData);
};

function template(name, id) {
	var t = '' +
		'<table class="uk-table">'
	+		'<tr>'
	+			'<th>Node Name</th>'
	+			'<th>Node Id</th>'
	+		'</tr>'
	+		'<tr>'
	+			'<td>'+name+'</td>'
	+			'<td>'+id+'</td>'
	+		'</tr>'
	+	'</table>';
	
	return t;
}
function isObj(v) {
	return (
		v &&
		typeof v === 'object' &&
		typeof v !== null &&
		Object.prototype.toString.call(v) === '[object Object]'
	) ? true : false;
}