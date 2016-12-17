var ajax = (function () {
	var fns = {},
		counter = 0;
	
	fns.done = {};
	fns.fail = {};
	fns.always = {};
	
	function u() {
		return 'a'+(counter+=1);
	}
	function execute(type, uid, a, b, c) {
		var o = fns[type],
			f = o[uid];
		if (typeof f === 'function') {
			f(a, b, c);
		}
	}
	function ajax(o) {
		o = o ? o : {};
		
		var uid = u();
		
		ajax.id = uid;
		
		$.ajax({
			url: o.url || 'http://127.0.0.1:3000',
			type: o.type || 'GET',
			dataType: o.dataType || 'json',
			data: o.data,
			beforeSend: o.beforeSend
		})
		.done(function (data, txt, obj) {
			
			execute('done', uid, data, txt, obj);
			
		})
		.fail(function (obj, txt, err) {
			
			execute('fail', uid, obj, txt, err);
			
		})
		.always(function (obj, txt) {
			
			execute('always', uid, obj, txt);
			
		});
		return ajax;
	};
	
	ajax.done = function (fn) {
		fns.done[this.id] = fn;
		return this;
	};
	ajax.fail = function (fn) {
		fns.fail[this.id] = fn;
		return this;
	};
	ajax.always = function (fn) {
		fns.always[this.id] = fn;
		return this;
	};
	ajax.callbacks = fns;
	
	return ajax;
}());