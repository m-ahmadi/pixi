function getEls(root, obj) {
	var o = {};
	$(root + " [data-el]").each(function (i, domEl) {
		var jEl = $(domEl);
		o[jEl.data("el")] = jEl;
	});
	$(root + " [data-els]").each(function (i, domEl) {
		var jEl = $(domEl);
		var k = jEl.data("els");
		if (!o[k]) {
			o[k] = $(root + " [data-els=\"" + k + "\"]");
		}
	});
	if (obj) {
		obj = o;
	} else {
		return o;
	}
}
//# sourceMappingURL=module.js.map