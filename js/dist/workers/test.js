onmessage = function onmessage(e) {
	console.log(e.data);
	postMessage("worker says hello");
};