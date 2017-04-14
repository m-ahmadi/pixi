define(["core/util", "core/pubsub"], function (u, newPubSub) {
	const ROOT = "#main_header";
	let els;
	
	let inst = u.extend( newPubSub() );
	
	function init() {
		els = u.getEls(ROOT);
		els.menu.on("click", function () {
			inst.emit("menu_clicked");
		});
	}
	

	inst.init = init;
	
	return inst;
});