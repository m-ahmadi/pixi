define(['wpix', 'tpl', 'wuk', 'util'], function (wpix, tpl, wuk, u) {	
	var ws = {},
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
		
		wuk.notify({
			message : '<i class="fa fa-check-circle fa-lg" aria-hidden="true"></i> Socket connected.',
			status  : 'success',
			timeout : 1000,
			pos     : 'bottom-right'
		});
		
		noteMsgs.processing = wuk.notify({
			message : '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i> Waiting for socket messages...',
			status  : 'info',
			timeout : 0,
			pos     : 'bottom-right'
		});
			
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
			wuk.notify({
				message : '<i class="fa fa-check-circle fa-lg" aria-hidden="true"></i> New socket message received.',
				status  : 'success',
				timeout : 1000,
				pos     : 'bottom-right'
			});
			
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
			
			tpl.draw(data, "viewport", undefined, coefficient);
			
		} else {
			console.log("Other message received\n", e.data);
		}
	}
	function onerror(e) {
		console.log("WebSocket Error: " , e);
		
		closeModal();
		
		noteMsgs.init.close();
		// noteMsgs.processing.close();
		wuk.notify({
			message : '<i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true"></i> Socket error.',
			status  : 'danger',
			timeout : 2000,
			pos     : 'bottom-right'
		});
	}
	function onclose(e) {
		console.log("Connection closed", e);
		wuk.enable(scanBtn);
		
		
		noteMsgs.init.close();
		
		var note = noteMsgs.processing;
		if (note) {
			note.close();
		}
		wuk.notify({
			message : '<i class="fa fa-info-circle fa-lg" aria-hidden="true"></i> Socket closed.', // fa fa-check
			status  : 'info',
			timeout : 2000,
			pos     : 'bottom-right'
		});
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
		noteMsgs.init = wuk.notify({
			message : '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i> Opening socket...',
			status  : 'info',
			timeout : 0,
			pos     : 'top-center'
		});
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