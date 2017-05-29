define(["./config", "./wuk"], function (conf, wuk) {
	const inst = u.extend( newPubSub() );
	
	console.log(conf)
	const URL = conf.WS + "socket/open";
	const note = wuk.note;
	
	let ws = {};
	let opened = false;
	
	function isOpen() {
		return opened;
	}
	function init() {
		let processNote;
		
		processNote = note.process("Opening WebSocket connection...");
		ws = new WebSocket(URL);
		
		ws.onopen = function (e) {
			processNote.close();
			note.success("WebSocket opened.");
			console.log("Connection open...", e);
			opened = true;
			
			inst.emit("open");
		};
		ws.onmessage = function (e) {
			if ( u.isStr(e.data) ) {
				console.log("String message received", e.data);
				
				inst.emit( "message", JSON.parse(e.data) );
			} else {
				console.log("Other message received", e.data);
			}
		};
		ws.onerror = function (e) {
			processNote.close();
			note.error("WebSocket could not be opened.");
			console.log("WebSocket Error: " , e);
		};
		ws.onclose = function (e) {
			opened = false;
			console.log("Connection closed", e);
		};
	
	}
	
	inst.isOpen = isOpen;
	inst.init = init;
	
	window.mainSocket = inst;
	return inst;
});