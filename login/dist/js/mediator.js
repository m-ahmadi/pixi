define(["core/util", "core/pubsub", "./templates"], function (u, newPubSub) {
	var inst = u.extend(newPubSub());

	function addCustomEvts() {}
	function beforeReady() {}
	function onReady() {
		addCustomEvts();
	}

	inst.beforeReady = beforeReady;
	inst.onReady = onReady;

	return inst;
});
//# sourceMappingURL=mediator.js.map