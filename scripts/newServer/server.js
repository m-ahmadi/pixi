const app = require("express")();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const wss = new WebSocket.Server({server});
const cors = require("cors");
const data = require("./fakeData");
app.use( cors() );

const host = "127.0.0.1";
const port = 3000;

let x1 = -640;
let x2 = 640;
let y1 = -480;
let y2 = 480;
let ws;

function toInt(v) {
	return typeof v === "string" ? parseInt(v, 10) : undefined;
}
function setBounds(q) {
	if (q) {
		x1 = toInt(q.x1);
		x2 = toInt(q.x2);
		y1 = toInt(q.y1);
		y2 = toInt(q.y2);
	}
}
function get(req, res) {
	setBounds(req.body);
	var o = data.get(x1, x2, y1, y2);
	
	res.write( JSON.stringify(o) );
	res.end();
}
function post(req, res) {
	
	
	setBounds(req.body);
	
	var o = data.get(x1, x2, y1, y2);
	o.type = "graph_response";
	if (ws) {
		console.log(data);
		ws.send( JSON.stringify(o) );
	} else {
		res.write( JSON.stringify(o) );
		res.end();
	}
}



data.build();

app.get("/cmd", get);
app.post("/cmd", post);
wss.on("connection", function connection(_ws, req) {
	ws = _ws;
	console.log("Connection opened.");
});

server.listen(port, function () {
	console.log("Listening on %d", server.address().port);
});