import * as $ from 'jquery';
import util from '../util';
import wpix from '../wpix';
import tpl from '../tpl';
import UIkit from 'uikit';

let u = util;

var traceroute = (function () {
	var ws: any = {},
		path = 'ws://'+ baseRoot +'/network/icmp/traceroute', // window.location.host
		openCallback,
		coefficient = {},
		nodes = {},
		links = {},
		msgCounter = 0,
		noteMsgs: any = {},
		scanBtn: any = {};
	
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
	function createSock(opt) {
		if (opt) { 
			path += '?portscanner=true';
		}
		ws = new WebSocket(path);
		console.log(ws);
	}
	function abort() {
		if ( !u.isEmptyObj(ws) ) {
			ws.close(4999);
		}
	}
	function addHandlers(cb) {
		openCallback = cb;
		
		ws.onopen = onopen;
		ws.onmessage = onmessage;
		ws.onerror = onerror;
		ws.onclose = onclose;
	}
	function onopen(e) {
		var cb = openCallback;
		
		console.log("Connection open...");
			
		// ws.send("Hello WebSocket!");
		
		if ( u.isFn(cb) ) {
			cb();
		}
	}
	function onmessage(e) {
		msgCounter += 1;
			
		if (msgCounter === 1) { // only for the first msg
			noteMsgs.init.close();
			wpix.clearContainer("viewport");
			wpix.mainContainer.x = wpix.renderer.width / 2;
			wpix.mainContainer.y = wpix.renderer.height / 2;
			UIkit.offcanvas.hide(false);
			
			noteMsgs.processing = UIkit.notify({
				message : '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i> در حال دریافت اطلاعات...',
				status  : 'info',
				timeout : 0,
				pos     : 'bottom-right'
			});
		}
		
		
		
		if ( u.isStr(e.data) ) {
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
				x: wpix.renderer.width / (300 + 80),
				y: wpix.renderer.height / (300 + 80),
			}
			// console.log(coefficient);
			
			tpl.draw(data, "viewport", undefined, coefficient);
			
		} else {
			console.log("Other message received\n", e.data);
		}
	}
	function onerror(e) {
		console.log("WebSocket Error: " , e);
		
		noteMsgs.init.close();
		// noteMsgs.processing.close();
		noteMsgs.error = UIkit.notify({
			message : '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> خطا در برقراری ارتباط!',
			status  : 'danger',
			timeout : 2000,
			pos     : 'bottom-right'
		});
	}
	function onclose(e) {
		console.log("Connection closed", e);
		scanBtn.removeAttr('disabled');
		
		// noteMsgs.processing.close();
		noteMsgs.init.close();
		noteMsgs.close = UIkit.notify({
			message : '<i class="fa fa-info" aria-hidden="true"></i> پایان دریافت.', // fa fa-check
			status  : 'info',
			timeout : 2000,
			pos     : 'bottom-right'
		});
	}
	function trace(arr, opt) {
		noteMsgs.init = UIkit.notify({
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
	
	return {
		abort: abort,
		trace: trace
		
	};
	
}());

export default traceroute