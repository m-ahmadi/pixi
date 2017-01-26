define([], function () {
	
	function disable(el) {
		if ( !el.is(':disabled') ) {
			el.attr('disabled', '');
		}
	}
	function enable(el) {
		if ( !el.is(':enabled') ) {
			el.removeAttr('disabled');
		}
	}
	function notify(o) {
		var v;
		
		v = UIkit.notification(o);
		
		return v;
	}
	
	return {
		notify: notify,
		disable: disable,
		enable: enable
	};

});