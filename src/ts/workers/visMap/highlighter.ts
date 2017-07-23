var highlightActive = false;
var GRAYED_OUT_COLOR = "rgba(200, 200, 200, 0.5)"; // "rgba(150, 150, 150, 0.75)"

self.onmessage = function (e) {
	var d = e.data,
		len = d.len,
		targetId = d.targetId,
		nodes = d.nodes,
		edges = d.edges,
		connectedNodes = d.connectedNodes,
		connectedEdges = d.connectedEdges,
		i, keys, len, node, edge, hiddenLabel, originalColor,
		toUpdateNodes: any = [],
		toUpdateEdges: any = [];
	
	if (len > 0) {
		highlightActive = true;
		
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
	
	
	self.postMessage({
		nodes: toUpdateNodes,
		edges: toUpdateEdges
	}, "");
}