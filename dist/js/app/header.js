define(["core/util", "core/pubsub"], function (u, newPubSub) {
	var ROOT = "#main_header";
	var els = void 0;

	var inst = u.extend(newPubSub());

	function init() {
		els = u.getEls(ROOT);
		els.menu.on("click", function () {
			inst.emit("menu_clicked");
		});
	}

	inst.init = init;

	return inst;
});
//# sourceMappingURL=header.js.map