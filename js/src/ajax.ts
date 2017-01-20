declare let $: any;

$.support.cors = true;

$.ajaxSetup({
	crossDomain: true
});

var ajax: any = {};


ajax = (function () {
	var fns: any = {},
		counter = 0,
		xhr,
		jax: any;
	
	fns.done = {};
	fns.fail = {};
	fns.always = {};
	
	function u() {
		return 'a'+(counter+=1);
	}
	function execute(type, uid, a?, b?, c?) {
		var o = fns[type],
			f = o[uid];
		if (typeof f === 'function') {
			f(a, b, c);
		}
	}
	jax = function (o: any) {
		o = o ? o : {};
		
		let uid = u();
		let cnf: any = {};
		
		jax.id = uid;

		cnf.url = o.url            || 'http://localhost:3000',
		cnf.type = o.type          || 'GET',
		cnf.dataType = o.dataType  || 'json',
		cnf.data = o.data,
		cnf.beforeSend = o.beforeSend,
		cnf.id = uid
		
		xhr = $.ajax(cnf)
		.done(function (data, txt, obj) {
			
			if (this.id === jax.id) {
				execute('done', uid, data, txt, obj);
			};
		})
		.fail(function (obj, txt, err) {
			
			execute('fail', uid, obj, txt, err);
			
		})
		.always(function (obj, txt) {
			
			execute('always', uid, obj, txt);
			
		});
		
		jax.xhr = xhr;
		
		return jax;
	};
	
	jax.done = function (fn) {
		fns.done[this.id] = fn;
		return this;
	};
	jax.fail = function (fn) {
		fns.fail[this.id] = fn;
		return this;
	};
	jax.always = function (fn) {
		fns.always[this.id] = fn;
		return this;
	};
	jax.callbacks = fns;
	
	return jax;
}());

export default ajax