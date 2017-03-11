define([], function () {
	var inst = {};

	function init() {
		var sidebar = $('#newSide'),
		    windowHeight = window.innerHeight;

		sidebar.height(windowHeight);
		// $('#newSide').toggle('slide');
		$(window).on('resize', function () {
			sidebar.height(windowHeight);
		});
		$('#sidebar_btn').on('click', function () {
			this.closed = this.closed ? false : true;
			var sb = $('#newSide');

			if (!sb.is(':animated')) {
				sb.toggle('slide');
			}

			// if (this.closed) {
			// sb.toggleClass('uk-animation-slide-left');
			// sb.toggleClass('no-display');
			// } else {
			// sb.addClass('uk-animation-reverse');

			// }
		});
	}

	inst.init = init;

	return inst;
});
//# sourceMappingURL=sidebar.js.map