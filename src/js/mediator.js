define([
	"core/config",
	"core/mainSocket",
	"core/wuk",
	"map/mediator",
	"./sidebar",
	"./header",
	"./traceroute",
	"./discovery/mediator",
	"members/mediator",
	"./templates"
], function (conf, mainSocket, wuk, map, sidebar, header, traceroute, discovery, members) {
	const inst = u.extend( newPubSub() );
	const note = wuk.note;
	
	
	function request(o) {
		$.ajax({
			url: conf.BASE,
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(o)
		})
		.done()
		.fail( () => note.error("requeste ke cmd mizane fail shod") );
	}
	function addCustomEvts() {
		header.on("menu_clicked", () => {
			sidebar.toggle();
		});
		header.on("map_clicked", () => {
			members.hide();
			map.show();
		});
		header.on("members_clicked", () => {
			map.hide();
			members.show();
		});
		sidebar.on("traceroute_item_clicked", () => {
			traceroute.begin();
		});
		
		sidebar.on("discovery_item_clicked", () => {
			discovery.begin();
		});
		mainSocket.on("open", e => {
			request({action: "all_nodes"});
		});
		mainSocket.on("message", e => {
			if (e.type === "graph_response") {
				delete e.type;
				map.draw(e);
			}
		});
		discovery.on("submit", toSend => {
			console.log(toSend);
			request(toSend);
		});
		map.on("node_position_changed", nodeNew => {
			let o = {
				action: "change_node_position",
				newX: nodeNew.x,
				newY: nodeNew.y
			};
			request(o);
			map.updateNode({
				id: nodeNew.id,
				x: nodeNew.x,
				y: nodeNew.y
			});
		});
	}
	function beforeReady() {
		mainSocket.init();
	}
	function onReady() {
		wuk.init();
		map.init("visMap", "#map_container");
		sidebar.init();
		header.init();
		traceroute.init();
		discovery.init();
		members.init();
		
		addCustomEvts();
	}
	inst.beforeReady = beforeReady;
	inst.onReady = onReady;
	
	return inst;
});