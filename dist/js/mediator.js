define(["core/util", "core/pubsub", "core/mainSocket", "core/wuk", "map/mediator", "./sidebar", "./header", "./traceroute", "./discovery/mediator", "./templates"], function (u, newPubSub, mainSocket, wuk, map, sidebar, header, traceroute, discovery) {
	var inst = u.extend(newPubSub());
	var note = wuk.note;

	function addCustomEvts() {
		header.on("menu_clicked", function () {
			sidebar.toggle();
		});
		sidebar.on("traceroute_item_clicked", function () {
			traceroute.begin();
		});

		sidebar.on("discovery_item_clicked", function () {
			discovery.begin();
		});

		discovery.on("submit", function (toSend) {
			mainSocket.send(JSON.stringify(toSend), function (e) {
				var data = JSON.parse(e.data);
				if (DEBUG) {
					console.log(data);
				}
				map.draw(data);
			});
		});
		map.on("node_position_changed", function (nodeNew) {
			var o = {
				action: "changeNodePosition",
				newX: nodeNew.x,
				newY: nodeNew.y
			};
			mainSocket.send(JSON.stringify(o), function (e) {
				var data = JSON.parse(e.data);
			});
			map.updateNode({
				id: nodeNew.id,
				x: nodeNew.x,
				y: nodeNew.y
			});
		});
	}
	function beforeReady() {
		mainSocket.init(mainSocket.send, [JSON.stringify({ "action": "getAllNodes" }), function (e) {
			var data = JSON.parse(e.data);
			if (DEBUG) {
				console.log(data);
			}
			map.draw(data);
		}]);
		// whb.compileAll();
	}
	function onReady() {
		wuk.init();
		map.init("visMap", "#map_container");
		sidebar.init();
		header.init();
		traceroute.init();
		discovery.init();
		addCustomEvts();
	}
	inst.beforeReady = beforeReady;
	inst.onReady = onReady;

	return inst;
});
//# sourceMappingURL=mediator.js.map