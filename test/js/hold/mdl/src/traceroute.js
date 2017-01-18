import util from './util';
import coPubsub from './pubsub';
import tpl from './tpl';

var inst = util.extend( coPubsub() ),
	ws = {},
	path = 'ws://192.168.10.13:3000/network/icmp/traceroute',
	coefficient = {},
	nodes = {},
	links = {},
	msgCounter = 0,
	noteMsgs = {},
	scanBtn = {};


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
function createSock(opt) {
	if (opt) { 
		path += '?portscanner=true';
	}
	ws = new WebSocket(path);
	console.log(ws);
}
function abort() {
	if ( !util.isEmptyObj(ws) ) {
		ws.close(4999);
	}
}
function addHandlers(cb) {
	ws.onopen = function (e) {
		console.log("Connection open...");
		
		// ws.send("Hello WebSocket!");
		cb();
	};

	ws.onmessage = function (e) {
		msgCounter += 1;
		
		if (msgCounter === 1) { // only for the first msg
			noteMsgs.init.close();
			pixi.clearContainer("viewport");
			pixi.mainContainer.x = pixi.renderer.width / 2;
			pixi.mainContainer.y = pixi.renderer.height / 2;
			UIkit.offcanvas.hide(false);
			
			noteMsgs.processing = UIkit.notify({
				message : '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i> در حال دریافت اطلاعات...',
				status  : 'info',
				timeout : 0,
				pos     : 'bottom-right'
			});
		}
		
		
		
		if (typeof e.data === "string") {
			console.log("String message received\n");
			noteMsgs.newData = UIkit.notify({
				message : '<i class="fa fa-check-circle" aria-hidden="true"></i> دریافت اطلاعات جدید.',
				status  : 'success',
				timeout : 1000,
				pos     : 'bottom-right'
			});
			
			
			
			var data = JSON.parse(e.data);
			console.log(data);
			
			data = filter(data);
			
			var nodesLen = Object.keys(data.nodes).length;
			var linksLen = Object.keys(data.links).length;
			
			console.log(nodesLen, linksLen);
			
			coefficient = {
				x: pixi.renderer.width / (300 + 80),
				y: pixi.renderer.height / (300 + 80),
			}
			// console.log(coefficient);
			
			tpl.draw(data, "viewport", undefined, coefficient);
			
		} else {
			console.log("Other message received\n", e.data);
		}
	};

	ws.onerror = function (e) {
		console.log("WebSocket Error: " , e);
		
		noteMsgs.processing.close();
		noteMsgs.error = UIkit.notify({
			message : '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> خطا در برقراری ارتباط!',
			status  : 'danger',
			timeout : 2000,
			pos     : 'bottom-right'
		});
	};


	ws.onclose = function (e) {
		console.log("Connection closed", e);
		scanBtn.removeAttr('disabled');
		
		noteMsgs.processing.close();
		noteMsgs.close = UIkit.notify({
			message : '<i class="fa fa-check" aria-hidden="true"></i> دریافت کامل اطلاعات با موفقیت به پایان رسید.',
			status  : 'success',
			timeout : 2000,
			pos     : 'bottom-right'
		});
	};
}
function trace(arr, opt) {
	noteMsgs['init'] = UIkit.notify({
		message : '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i> در حال بررسی...',
		status  : 'info',
		timeout : 0,
		pos     : 'top-center'
	});
	scanBtn = $('#scan');
	scanBtn.attr('disabled', '');
	
	createSock(opt);
	addHandlers(function () {
		ws.send( JSON.stringify(arr) );
	});
	
}


inst.abort = abort;
inst.trace = trace;

export default inst