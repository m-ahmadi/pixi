define([
	"core/util",
	"core/pubsub",
	"./templates"
], (u, newPubSub) => {
	const inst = u.extend( newPubSub() );
	
	let contents, bgbubble;
	
	function init() {
		contents = $("#contents");
		bubbles = $(".bg-bubbles");
		
		bubbles.height(window.innerHeight);
		contents.height(window.innerHeight);
		$(window).on( "resize", () => {
			bubbles.height(window.innerHeight);
			contents.height(window.innerHeight)
		});
	}
	
	
	function addCustomEvts() {
		
	}
	function beforeReady() {
		
	}
	function onReady() {
		addCustomEvts();
		init();
	}
	
	inst.beforeReady = beforeReady;
	inst.onReady = onReady;
	return inst;
});