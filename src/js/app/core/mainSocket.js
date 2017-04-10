define(["./util", "./wuk"], function (u, wuk) {
	let inst = {};
	
	const URL = "ws://127.0.0.1:3000/socket/open";
	const msg = {
		PROCESS: "Performing action...",
		SUCCESS: "Action successfuly performed.",
		FAILED: "Action could not be performed.",
		DONE: "Done."
	};
	const note = wuk.note;
	
	let ws;
	let opened = false;
	
	function isOpen() {
		return opened;
	}
	function send(str, fn) {
		if ( isOpen() ) {
			if ( u.isFn(fn) ) {
				ws.onmessage = fn;
			}
			ws.send(str);
		}
	}
	function init(callback, callbackArgs) {
		let h1, h2;
		
		h1 = note.process("Opening WebSocket connection...");
		ws = new WebSocket(URL);
		
		ws.onopen = function (e) {
			h1.close();
			note.success("WebSocket is opened.");
			console.log("Connection open...", e);
			opened = true;
			
			if ( u.isFn(callback) ) {
				h2 = note.process(msg.PROCESS);
				callback.apply(undefined, callbackArgs);
				h2.close();
				note.info(msg.DONE);
			}
		};
		ws.onmessage = function (e) {
			if ( u.isStr(e.data) ) {
				console.log("String message received", e.data);
			} else {
				console.log("Other message received", e.data);
			}
		};
		ws.onerror = function (e) {
			h1.close();
			note.error("WebSocket could not be opened.");
			console.log("WebSocket Error: " , e);
		};
		ws.onclose = function (e) {
			opened = false;
			console.log("Connection closed", e);
		};
	
	}
	
	inst.isOpen = isOpen;
	inst.send = send;
	inst.init = init;
	
	window.mainSocket = inst;
	return inst;
});