define(["core/util"], function (u) {
	var URL = "ws://echo.websocket.org/echo";

	var ws = new WebSocket(URL);

	ws.onopen = function (e) {
		ws.send("Hello WebSocket!");
	};

	ws.onmessage = function (e) {
		if (u.isStr(e.data)) {
			console.log("String message received", e, e.data);
		} else {
			console.log("Other message received", e, e.data);
		}
	};

	ws.onerror = function (e) {
		console.log("WebSocket Error: ", e);
	};

	ws.onclose = function (e) {
		console.log("Connection closed", e);
	};
});
//# sourceMappingURL=mainSocket.js.map