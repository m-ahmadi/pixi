var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var JS = "../../../../";
importScripts(JS + "lib/handlebars.runtime.min.js");
importScripts(JS + "app/templates.js");

// let template = nodepopup;
var template = Handlebars.templates.nodepopup;

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
			label: node.managementIp || node.name,
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

function nodepopup(ctx) {
	var t = "\n<table class=\"uk-table\">\n<tr>\n\t<th>Node Name</th>\n\t<th>Node Id</th>\n\t<th>IP Management</th>\n\t<th>Last Seen</th>\n\t<th>Serial</th>\n\t<th>Manufacturer</th>\n\t<th>Model</th>\n</tr>\n<tr>\n\t<td>" + ctx.name + "</td>\n\t<td>" + ctx.id + "</td>\n\t<td>" + ctx.ipManagement + "</td>\n\t<td>" + ctx.lastSeen + "</td>\n\t<td>" + ctx.serial + "</td>\n\t<td>" + ctx.manufacturer + "</td>\n\t<td>" + ctx.model + "</td>\n</tr>\n</table>";
	return t;
}
function isObj(v) {
	return v && (typeof v === "undefined" ? "undefined" : _typeof(v)) === 'object' && typeof v !== null && Object.prototype.toString.call(v) === '[object Object]' ? true : false;
}
//# sourceMappingURL=dataConvertor.js.map