define([
	"core/util",
	"core/pubsub",
	"core/mainSocket",
	"core/wuk",
	"map/mediator",
	"./sidebar",
	"./header",
	"./traceroute",
	"./discovery/mediator",
	"members/mediator",
	"./templates"
], function (u, newPubSub, mainSocket, wuk, map, sidebar, header, traceroute, discovery, members) {
	const inst = u.extend( newPubSub() );
	const note = wuk.note;
	
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
		
		discovery.on("submit", toSend => {
			mainSocket.send(JSON.stringify(toSend), e => {
				let data = JSON.parse(e.data);
				if (DEBUG) { console.log(data) }
				map.draw(data);
			});
		});
		map.on("node_position_changed", nodeNew => {
			let o = {
				action: "changeNodePosition",
				newX: nodeNew.x,
				newY: nodeNew.y
			};
			mainSocket.send(JSON.stringify(o), e => {
				let data = JSON.parse(e.data);
			});
			map.updateNode({
				id: nodeNew.id,
				x: nodeNew.x,
				y: nodeNew.y
			});
		});
	}
	function beforeReady() {
		mainSocket.init(mainSocket.send, [
			JSON.stringify({"action": "getAllNodes"}),
			e => {
				let data = JSON.parse(e.data);
				if (DEBUG) { console.log(data) }
				map.draw(data);
			}
		]);
		// whb.compileAll();
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