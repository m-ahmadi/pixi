define(["./sidebar", "./traceroute", "./discovery"], function (sidebar, traceroute, discovery) {
	var inst = {};

	function addCustomEvts() {
		sidebar.on("traceroute_item_clicked", function () {
			traceroute.begin();
		});

		sidebar.on("discovery_item_clicked", function () {
			discovery.begin();
		});
	}
	function init() {
		sidebar.init();
		traceroute.init();
		discovery.init();

		addCustomEvts();
	}

	inst.init = init;

	return inst;
});
//# sourceMappingURL=mediator.js.map