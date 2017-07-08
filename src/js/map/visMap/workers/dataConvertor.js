const JS = "../../../";
importScripts("/pixi/dist/lib/handlebars/handlebars.runtime.js")
importScripts("/pixi/dist/lib/templates.js");

// let template = nodepopup;
let template = Handlebars.templates.nodepopup;

self.onmessage = function (e) {
	var data = e.data,
		oldNodes = data.nodes,
		oldLinks = data.links,
		nodeTypes = data.nodeTypes,
		newData = {},
		newNodes = [],
		newEdges = [],
		keys, i, len,
		node, link, src, dest, status;
	
	keys = Object.keys(oldNodes);
	len = keys.length;
	
	for (i=0; i<len; i+=1) {
		node = oldNodes[ keys[i] ];
		
		newNodes.push({
			id: node.id,
			label: node.management_ip || node.name,
			group: nodeTypes[node.type],
			x: node.x,
			y: node.y,
			title: template(node)
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
	for (i=0; i<len; i+=1) {
		link = oldLinks[ keys[i] ];
		src = link.src;
		dest = link.dest;
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

function nodepopup(ctx) {
	let t = `
<table class="uk-table">
<tr>
	<th>Node Name</th>
	<th>Node Id</th>
	<th>IP Management</th>
	<th>Last Seen</th>
	<th>Serial</th>
	<th>Manufacturer</th>
	<th>Model</th>
</tr>
<tr>
	<td>${ ctx.name }</td>
	<td>${ ctx.id }</td>
	<td>${ ctx.ipManagement }</td>
	<td>${ ctx.lastSeen }</td>
	<td>${ ctx.serial }</td>
	<td>${ ctx.manufacturer }</td>
	<td>${ ctx.model }</td>
</tr>
</table>`;
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