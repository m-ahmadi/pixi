define(["core/util", "core/pubsub"], function (u, newPubSub) {
	var inst = u.extend(newPubSub());
	var sidebar = void 0;

	function open() {
		if (!sidebar.is(":visible")) {
			sidebar.toggle("slide");
		}
	}
	function close() {
		if (sidebar.is(":visible")) {
			sidebar.toggle("slide");
		}
	}
	function toggle() {
		if (!sidebar.is(":animated")) {
			sidebar.toggle("slide");
		}
	}
	function init() {
		sidebar = $("#newSide");
		sidebar.height(window.innerHeight);
		// $("#newSide").toggle("slide");

		$(window).on("resize", function () {
			sidebar.height(window.innerHeight);
		});
		$("#sidebar_btn").on("click", toggle);
		$("#traceroute_item").on("click", function () {
			inst.emit("traceroute_item_clicked");
		});
		$("#discovery_item").on("click", function () {
			inst.emit("discovery_item_clicked");
		});
	}

	inst.open = open;
	inst.close = close;
	inst.toggle = toggle;
	inst.init = init;

	return inst;
});
//# sourceMappingURL=sidebar.js.map