define(["core/util", "core/pubsub", "./templates"], function (u, newPubSub) {
	var inst = u.extend(newPubSub());

	var contents = void 0,
	    bgbubble = void 0;

	function init() {
		contents = $("#contents");
		bubbles = $(".bg-bubbles");

		bubbles.height(window.innerHeight);
		contents.height(window.innerHeight);
		$(window).on("resize", function () {
			bubbles.height(window.innerHeight);
			contents.height(window.innerHeight);
		});
	}

	function addCustomEvts() {}
	function beforeReady() {}
	function onReady() {
		addCustomEvts();
		init();
	}

	inst.beforeReady = beforeReady;
	inst.onReady = onReady;
	return inst;
});
//# sourceMappingURL=mediator.js.map