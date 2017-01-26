define(['wpix', 'util'], function (wpix, u) {
	var activeBox,
		cbX = {
			min: 0,
			max: 0
		},
		cbY = {
			min: 0,
			max: 0
		};
	
	function create(v, pos) {
		removeAll();
		var div = u.getCommentsInside('#bubble_template')[0].nodeValue.trim(),
			left, top;
			
		
		div = $(div);
		
		div.find('.bbl-content').html(v);
		$('#popups').append(div);
		
		if (pos) {
			div.css({
				left: 0,
				top: 0
			});
			left = (pos.x - 40)  + wpix.mainContainer.position.x + 'px';
			top = (pos.y - (div.height() + 40)) + wpix.mainContainer.position.y + 'px';
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
		
		if ( !el.hasClass('no-display') ) {
			el.addClass('no-display');
		}
	}
	function showActive() {
		var el = activeOne();
		
		if ( el.hasClass('no-display') ) {
			el.removeClass('no-display');
		}
	}
	function removeAll() {
		$('#popups').empty();
	}
	
	return {
		get activeBox() { return activeOne(); },
		removeAll: removeAll,
		create: create,
		hideActive: hideActive,
		showActive: showActive
	};

	
});