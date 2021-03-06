import worldcup from "./worldcup2014";
import groups from "./groups";

const inst = u.extend( newPubSub() );

var network;
var allNodes: any;
var highlightActive = false;

var nodesDataset = new vis.DataSet(worldcup.nodes); // these come from WorldCup2014.js
var edgesDataset = new vis.DataSet(worldcup.edges); // these come from WorldCup2014.js

function redrawAll() {
	var container = $("#map_container");
	var options = {
		nodes: {
			shape: "dot",
			scaling: {
				min: 10,
				max: 30,
				label: {
					min: 8,
					max: 30,
					drawThreshold: 12,
					maxVisible: 20
				}
			},
			font: {
				size: 12,
				face: "Tahoma"
			}
		},
		// groups: groups,
		edges: {
			width: 0.15,
			color: {
				inherit: "from"
			},
			smooth: {
				type: "cubicBezier" //
			}
		},
		physics: false,
		interaction: {
			tooltipDelay: 200,
			hideEdgesOnDrag: true
		}
	};
	var data = {
		nodes: nodesDataset,
		edges: edgesDataset
	} // Note: data is coming from ./worldcup2014.js


	network = new vis.Network(container[0], data, options);
	container.height(window.innerHeight);
	// get a JSON object
	allNodes = nodesDataset.get({
		returnType: "Object"
	});

	network.on("click", neighbourhoodHighlight);
}
function neighbourhoodHighlight(params) {
	// if something is selected:
	if (params.nodes.length > 0) {
		highlightActive = true;
		var i,
		j;
		var selectedNode = params.nodes[0];
		var degrees = 2;

		// mark all nodes as hard to read.
		for (var nodeId in allNodes) {
			allNodes[nodeId].color = "rgba(200,200,200,0.5)";
			if (allNodes[nodeId].hiddenLabel === undefined) {
				allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
				allNodes[nodeId].label = undefined;
			}
		}
		var connectedNodes = network.getConnectedNodes(selectedNode);
		var allConnectedNodes: any = [];

		// get the second degree nodes
		for (i = 1; i < degrees; i++) {
			for (j = 0; j < connectedNodes.length; j++) {
				allConnectedNodes = allConnectedNodes.concat(network.getConnectedNodes(connectedNodes[j]));
			}
		}

		// all second degree nodes get a different color and their label back
		for (i = 0; i < allConnectedNodes.length; i++) {
			allNodes[allConnectedNodes[i]].color = "rgba(150,150,150,0.75)";
			if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
				allNodes[allConnectedNodes[i]].label = allNodes[allConnectedNodes[i]].hiddenLabel;
				allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
			}
		}

		// all first degree nodes get their own color and their label back
		for (i = 0; i < connectedNodes.length; i++) {
			allNodes[connectedNodes[i]].color = undefined;
			if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
				allNodes[connectedNodes[i]].label = allNodes[connectedNodes[i]].hiddenLabel;
				allNodes[connectedNodes[i]].hiddenLabel = undefined;
			}
		}

		// the main node gets its own color and its label back.
		allNodes[selectedNode].color = undefined;
		if (allNodes[selectedNode].hiddenLabel !== undefined) {
			allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
			allNodes[selectedNode].hiddenLabel = undefined;
		}
	} else if (highlightActive === true) {
		// reset all nodes
		for (var nodeId in allNodes) {
			allNodes[nodeId].color = undefined;
			if (allNodes[nodeId].hiddenLabel !== undefined) {
				allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
				allNodes[nodeId].hiddenLabel = undefined;
			}
		}
		highlightActive = false
	}

	// transform the object into an array
	var updateArray: any = [];
	for (nodeId in allNodes) {
		if (allNodes.hasOwnProperty(nodeId)) {
			updateArray.push(allNodes[nodeId]);
		}
	}
	nodesDataset.update(updateArray);
}




function initGoogleMap() {
	/* var uluru = {lat: -25.363, lng: 131.044};
	var map = new google.maps.Map(document.getElementById("map"), {
		zoom: 5,
		center: uluru
	});
	var marker = new google.maps.Marker({
		position: uluru,
		map: map
	}); */
	
}
inst.init = redrawAll;

export default inst
