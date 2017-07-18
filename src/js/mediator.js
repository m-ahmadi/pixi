define([
	"core/config",
	"core/mainSocket",
	"core/uk",
	"map/mediator",
	"./sidebar",
	"./header",
	"./traceroute",
	"./discovery/mediator",
	"members/mediator"
], function (
	conf,
	mainSocket,
	uk,
	map,
	sidebar,
	header,
	traceroute,
	discovery,
	members
) {
	const inst = u.extend( newPubSub() );
	const note = uk.note;
	
	
	function request(o) {
		$.ajax({
			url: `${conf.JX}cmd`,
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(o)
		})
		.done()
		.fail( x => {
			note.error("")
		} );
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
				if (e.append) {
					delete e.append;
					map.draw(e);
				} else {
					map.clear();
					map.draw(e);
				}
			}
		});
		discovery.on("submit", toSend => {
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
	//	map.init("visMap", "#map_container");
		map.init("pixiMap", "#map_container");
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