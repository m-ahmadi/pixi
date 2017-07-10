function getEls(root, obj) {
	let o = {};
	$(`${root} [data-el]`).each((i, domEl) => {
		let jEl = $(domEl);
		o[ jEl.data("el") ] = jEl; 
	});
	$(`${root} [data-els]`).each((i, domEl) => {
		let jEl = $(domEl);
		let k = jEl.data("els");
		if (!o[k]) {
			o[k] = $(`${root} [data-els="${k}"]`);
		}
	});
	if (obj) {
		obj = o;
	} else {
		return o;
	}
}