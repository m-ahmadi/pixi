define(['wpix', 'whb', 'util'], function (wpix, whb, u) {
	var inst = {},
		tmpl = whb.tmpl;
	
	// tmpl.ctxnode tmpl.ctxlink
	function get(type) {
		var div;
		if (type === 'default' || !type) {
			div = tmpl.ctxempty();
		} else if (type === 'node') {
			div = tmpl.ctxnode();
		} else if (type === 'link') {
			div = tmpl.ctxlink();
		}
		div = $(div);
		return div;
	}
	function show(pos, type) {
		pos = pos ? pos : {x: 0, y: 0};
		
		var div = get(type);
		
		div.css({
			left: pos.x,
			top: pos.y
		});
		
		$('#contextmenu').html(div);
	}
	function clear() {
		$('#contextmenu').empty();
	}
	function addEvents() {
		
	}
	
	inst.show = show;
	inst.clear = clear;
	inst.addEvents = addEvents;
	
	window.ctx = inst;
	return inst;
});