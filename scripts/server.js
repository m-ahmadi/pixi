var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var u = require("util-ma");
var port = 3000;

function generate(socket) {
	
	socket.emit("graph_response", data);
}


app.post("/cmd", function (req, res) {
	
});

io.on("connection", function (socket) {
	console.log("a user connected");
	socket.on("start sending", function () {
		generate(socket);
	});
	socket.on("disconnect", function () {
		console.log("user disconnected");
	});
});

http.listen(port, function () {
	console.log("listening on *:"+port);
});