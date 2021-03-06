define(function () {
	
	function newPubSub() {
		"use strict";
		if ( this instanceof newPubSub ) { throw new Error('newPubSub() was called with new'); }
		
		var subscribers = {},
			inst = {};
		
		inst.getSubscribers = function () {
			return subscribers;
		};
		
		inst.subscribe = function (evt, fn, par) {
			var events,
				add = function (str) {
					if ( typeof subscribers[str] === 'undefined' ) {
						subscribers[str] = [];
					}
					subscribers[str].push({
						fn: fn,
						par: par
					});
				};
			
			if (typeof evt === 'string') {
				if ( evt.indexOf(' ') === -1 ) {
					add(evt);
				} else {
					events = evt.split(' ');
					events.forEach(function (el) {
						add(el);
					});
				}
			} else if ( util.isObj(evt) ) {
				Object.keys(evt).forEach(function (i) {
					if (typeof subscribers[i] === 'undefined') {
						subscribers[i] = [];
					}
					if ( typeof evt[i] === 'function' ) {
						subscribers[i].push({
							fn: evt[i],
							par: undefined
						});
					} else if ( util.isObj(evt[i]) ) {
						subscribers[i].push({
							fn: evt[i].fn,
							par: evt[i].par
						});
					}
				});
			}
		};
		
		inst.publish = function (evtName, evtData) {
			if (typeof subscribers[evtName] !== 'undefined') {
				subscribers[evtName].forEach(function (i) {
					i.fn(evtData, i.par);
				});
			}
		};
		
		inst.on = function (evt, fn, par) { // alias
			this.subscribe(evt, fn, par);
		};
		
		inst.emit = function (evtName, evtData) { // alias
			this.publish(evtName, evtData);
		};
		
		return inst;
	};
	
	return newPubSub;
});