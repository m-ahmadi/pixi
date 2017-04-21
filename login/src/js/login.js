define([
	"core/util",
	"core/pubsub"
], (u, newPubSub) => {
	let inst = u.extend( newPubSub() );
	const ROOT = "#login";
	
	let login;
	function init() {
		
	}
	inst.init = init;
	return inst;
});