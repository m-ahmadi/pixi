define(["core/util"], function (u) {
	let inst = {};
	
	const URL = "ws://echo.websocket.org/echo";
	let ws;
	let opened = false;
	let callbacks = {};
	let counter = 0;
	
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
	function init() {
		ws = new WebSocket(URL);
		
		ws.onopen = function (e) {
			console.log("Connection open...", e);
			opened = true;
		};
		ws.onmessage = function (e) {
			if ( u.isStr(e.data) ) {
				console.log("String message received", e.data);
			} else {
				console.log("Other message received", e.data);
			}
		};
		ws.onerror = function (e) {
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