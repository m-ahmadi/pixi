import * as $ from 'jquery';


$.support.cors = true;

$.ajaxSetup({
	crossDomain: true
});

var ajax: any = (function () {
	var fns: any  = {},
		counter = 0,
		xhr,
		jax: any;
	
	fns.done = {};
	fns.fail = {};
	fns.always = {};
	
	function u() {
		return 'a'+(counter+=1);
	}
	function execute(type: string, uid: string, a?: any, b?: any, c?:any) {
		var o = fns[type],
			f = o[uid];
		if (typeof f === 'function') {
			f(a, b, c);
		}
	}
	jax = function (o: any) {
		o = o ? o : {};
		
		var uid: string = u();
		var opt: any = {};
		
		ajax.id = uid;
		
		
		
		opt.url = o.url || 'http://localhost:3000';
		opt.type = o.type || 'GET';
		opt.dataType = o.dataType || 'json';
		opt.data = o.data;
		opt.beforeSend = o.beforeSend;
		opt.id = uid;

		xhr = $.ajax(opt)
		.done(function (data, txt, obj) {
			
			if (this.id === ajax.id) {
				execute('done', uid, data, txt, obj);
			};
		})
		.fail(function (obj, txt, err) {
			
			execute('fail', uid, obj, txt, err);
			
		})
		.always(function (obj, txt) {
			
			execute('always', uid, obj, txt);
			
		});
		
		ajax.xhr = xhr;
		
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

export default ajax