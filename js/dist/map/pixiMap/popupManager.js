define(['./wpix', 'core/util', 'core/whb'], function (wpix, u, whb) {
	var activeBox,
	    cbX = {
		min: 0,
		max: 0
	},
	    cbY = {
		min: 0,
		max: 0
	};
	wpix.on("zoom", function (e) {

		var pos = e.pos,
		    el = activeOne(),
		    d = el.data();

		if (el) {
			el.css({
				/* left: (orgPos.x - 40)  + pos.x + 'px',
    top: (orgPos.y - (el.height() + 40)) + pos.y + 'px' */
			});
		}
	});
	function create(data, pos) {
		removeAll();
		var div = whb.tmpl.bubble(data),
		    left,
		    top;

		div = $(div);
		$('#popups').append(div);

		if (pos) {
			div.css({
				left: 0,
				top: 0
			});
			left = pos.x - 40 + wpix.mainContainer.position.x + 'px';
			top = pos.y - (div.height() + 40) + wpix.mainContainer.position.y + 'px';

			div.data({
				left: left,
				top: top
			});

			div.css({
				left: left,
				top: top
			});
		}

		// console.log(div.css('top'), div.css('left'));
	}
	function activeOne() {
		return $('#popups > .bubble');
	}
	function hideActive() {
		var el = activeOne();
		if (!el.hasClass('no-display')) {
			el.addClass('no-display');
		}
	}
	function showActive() {
		var el = activeOne();
		if (el.hasClass('no-display')) {
			el.removeClass('no-display');
		}
	}
	function removeAll() {
		$('#popups').empty();
	}

	return {
		get activeBox() {
			return activeOne();
		},
		removeAll: removeAll,
		create: create,
		hideActive: hideActive,
		showActive: showActive
	};
});
//# sourceMappingURL=popupManager.js.map