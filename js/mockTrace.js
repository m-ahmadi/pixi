define(['wpix', 'tpl', 'wuk', 'util'], function (wpix, tpl, wuk, u) {
	var note = wuk.note;
	var msgCounter = 0;
	
	function onmessage(v) {
		note.success('New socket message received.');
		var data = v;
			msgCounter += 1;
		
		if (msgCounter === 1) {
			tpl.draw(data, "viewport", undefined, undefined, true);
		} else {
			tpl.draw(data, "viewport", undefined, undefined);
		}
	}
	function trace() {
		var socket = io.connect('ws://127.0.0.1:2000');
		socket.on('server msg', onmessage);
		socket.emit('start sending');
			
		
		
		
		
	}
	
	return {
		trace: trace
	};
});