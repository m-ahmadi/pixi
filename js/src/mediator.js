define([
//	"core/whb",
	"./mainSocket",
	"core/wuk",
	"map/mediator",
	"./sidebar",
	"./traceroute",
	"./discovery/mediator",
	"./templates"
], function (mainSocket, wuk, map, sidebar, traceroute, discovery) {
	var inst = {};
	
	function addCustomEvts() {
		sidebar.on("traceroute_item_clicked", function () {
			traceroute.begin();
		});
		
		sidebar.on("discovery_item_clicked", function () {
			discovery.begin();
		});
		
		discovery.on("submit", function (toSend) {
			mainSocket.send( JSON.stringify(toSend), function (e) {
				let data = JSON.parse(e.data);
				if (DEBUG) { console.log(data) }
				map.draw(data);
			});
		});
	}
	function beforeReady() {
		mainSocket.init(mainSocket.send, [
			JSON.stringify({"action": "getAllNodes"}),
			function (e) {
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
		traceroute.init();
		discovery.init();
		addCustomEvts();
		
		
		
	}
	inst.beforeReady = beforeReady;
	inst.onReady = onReady;
	
	return inst;
});