define(["core/util", "core/pubsub"], function (u, newPubSub) {
	const ROOT = "#sidebar";
	let sidebar, els;
	
	let inst = u.extend( newPubSub() );
	
	function open() {
		if ( !sidebar.is(":visible") ) {
			sidebar.toggle("slide");
		}
	}
	function close() {
		if ( sidebar.is(":visible") ) {
			sidebar.toggle("slide");
		}
	}
	function toggle() {
		if (  !sidebar.is(":animated")  ) {
			sidebar.toggle("slide");
		}
	}
	function init() {
		sidebar = $(ROOT);
		els = u.getEls(ROOT);
		sidebar.height(window.innerHeight);
		// $("#newSide").toggle("slide");
		
		$(window).on("resize", function () {
			sidebar.height(window.innerHeight);
		});
		$("#sidebar_btn").on("click", toggle);
		els.traceroute.on("click", function () {
			inst.emit("traceroute_item_clicked");
		});
		els.discovery.on("click", function () {
			inst.emit("discovery_item_clicked");
		});
	}
	
	inst.open = open;
	inst.close = close;
	inst.toggle = toggle;
	inst.init = init;
	
	return inst;
});