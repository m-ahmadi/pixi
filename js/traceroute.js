define(['wpix', 'tpl', 'wuk', 'util'], function (wpix, tpl, wuk, u) {
	var note = wuk.note,
		ws = {},
		path = 'ws://'+ baseRoot +'/network/icmp/traceroute', // window.location.host
		openCallback,
		coefficient = {},
		nodes = {},
		links = {},
		msgCounter = 0,
		noteMsgs = {},
		scanBtn = {},
		cancelBtn = {};
	
	// var v = prompt('change the address if you want:', path);
	// if (v) { path = v;}
	
	function filter(data) {
		var newLinks = data.links,
			newNodes = data.nodes,
			diffNodes = {},
			diffLinks = {};
			
		Object.keys(newNodes).forEach(function (k) {
			if ( !nodes[k] ) {
				nodes[k] = newNodes[k];
				diffNodes[k] = newNodes[k];
			}
		});
		Object.keys(newLinks).forEach(function (k) {
			if ( !links[k] ) {
				links[k] = newLinks[k];
				diffLinks[k] = newLinks[k];
			}
		});
		
		return {
			links: diffLinks,
			nodes: diffNodes
		};
	}
	function abort() {
		if ( !u.isEmptyObj(ws) ) {
			ws.close(4999);
		}
	}
	function closeModal() {
		var u;
		// $('#newSide').toggle('slide');
		// $("body").trigger( $.Event("keydown", { keyCode: 27 }) );
		
		u = UIkit.modal('#modal_traceroute')[0];
		if ( u.isActive() ) {
			u.toggle('close');
		}
	}
	function closeSidebar() {
		var sb = $('#newSide')
		
		if ( sb.is(':visible') ) {
			sb.toggle('slide');
		}
	}
	function prepare() {
		wpix.clearContainer("viewport");
		wpix.mainContainer.x = wpix.renderer.width / 2;
		wpix.mainContainer.y = wpix.renderer.height / 2;
		
		closeModal();
		closeSidebar();
	}
	function onopen(e) {
		var cb = openCallback;
		
		console.log("Connection open...");
		
		noteMsgs.init.close();
		
		note.success('Socket connected.');
		
		noteMsgs.processing = note.process('Waiting for socket messages...', 0);
		
		
			
		// ws.send("Hello WebSocket!");
		
		if ( u.isFn(cb) ) {
			cb();
		}
	}
	function onmessage(e) {
		var data;
		msgCounter += 1;
			
		if (msgCounter === 1) { // first message
			prepare();
		}
		
		if ( u.isStr(e.data) ) {
			console.log("String message received\n");
			note.success('New socket message received.');
			
			
			
			data = JSON.parse(e.data);
			console.log(data);
			
			data = filter(data);
			
			var nodesLen = Object.keys(data.nodes).length;
			var linksLen = Object.keys(data.links).length;
			
			console.log(nodesLen, linksLen);
			
			coefficient = {
				x: wpix.renderer.width / (300 + 80), // 600 80
				y: wpix.renderer.height / (300 + 80), // 600 80
			}
			// console.log(coefficient);
			
			
			if (msgCounter === 1) {
				console.log('fud');
				tpl.draw(data, "viewport", undefined, coefficient, true);
			} else {
				tpl.draw(data, "viewport", undefined, coefficient);
			}
		} else {
			console.log("Other message received\n", e.data);
		}
	}
	function onerror(e) {
		console.log("WebSocket Error: " , e);
		
		closeModal();
		
		noteMsgs.init.close();
		// noteMsgs.processing.close();
		
		note.error('Socket error.');
		
	}
	function onclose(e) {
		console.log("Connection closed", e);
		wuk.enable(scanBtn);
		
		
		noteMsgs.init.close();
		
		var process = noteMsgs.processing;
		if (process) {
			process.close();
		}
		
		note.info('Socket closed.', 2000);

	}
	function addHandlers(fn) {
		openCallback = fn;
		
		ws.onopen = onopen;
		ws.onmessage = onmessage;
		ws.onerror = onerror;
		ws.onclose = onclose;
	}
	function createSock(opt) {
		if (opt) { 
			path += '?portscanner=true';
		}
		ws = new WebSocket(path);
		console.log(ws);
	}
	function trace(arr, opt) {
		noteMsgs.init = wuk.note.process('Opening socket...', false, 'top-center');
		
		scanBtn = $('#traceroute_scan');
		cancelBtn = $('#traceroute_scan');
		wuk.disable(scanBtn);
		
		createSock(opt);
		addHandlers(function () {
			ws.send( JSON.stringify(arr) );
		});
		
	}
	
	return {
		abort: abort,
		trace: trace
	};
	
});