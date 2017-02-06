define(['core/ajax', 'core/util'], function (ajax, u) {
	var inst = {},
		jQxhr;
	
	function load(data, done, fail) {
		var abort = jQxhr ? jQxhr.xhr.abort : undefined;
		
		if (abort) {
			abort();
		}
		
		jQxhr = ajax({
			data: data
		})
		.done(function (data) {
			done(data);
		})
		.fail(function () {
			fail();
		});
	}
	
	inst.load = load;
	return inst;
});