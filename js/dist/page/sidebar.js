define(["core/util", "core/pubsub"], function (u, newPubSub) {
	var inst = u.extend(newPubSub());

	function init() {
		var sidebar = $('#newSide'),
		    windowHeight = window.innerHeight;

		sidebar.height(windowHeight);
		// $('#newSide').toggle('slide');
		$(window).on('resize', function () {
			sidebar.height(windowHeight);
		});
		$('#sidebar_btn').on('click', function () {
			this.closed = this.closed ? false : true;
			var sb = $('#newSide');
			if (!sb.is(':animated')) {
				sb.toggle('slide');
			}
		});
		$("#traceroute_item").on("click", function () {
			inst.emit("traceroute_item_clicked");
		});
		$("#discovery_item").on("click", function () {
			inst.emit("discovery_item_clicked");
		});
	}

	inst.init = init;

	return inst;
});
//# sourceMappingURL=sidebar.js.map