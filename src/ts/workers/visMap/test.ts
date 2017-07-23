onmessage = function (e) {
	console.log(e.data);
	postMessage("worker says hello", "");
};