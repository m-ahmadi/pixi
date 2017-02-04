define(['util'], function (u) {
	var inst = {},
		tmpl = {},
		get = u.getFirstCommentInside;
	
	function compileAll() {
		$('#templates > *').each(function (i, el) {
			var id = el.id,
				key = id.split('_')[0],
				src = get('#'+id);
			tmpl[key] = Handlebars.compile(src);
		});
	}
	
	Object.defineProperties(inst, {
		"tmpl": {
			get: function () { return tmpl; }
		}
	});
	inst.compileAll = compileAll;
	window.whb = inst;
	return inst;
});