define(['wpix', 'wuk', 'discovery', 'traceroute'], function (wpix, wuk, discovery, traceroute) {
	
	function doValidation(inputEl) {
		var el = inputEl,
			val = el.val(),
			res = false,
			startBtn = $('#discovery_start');
		
		res = discovery.isValidIp(val);
		
		inputEl.removeClass('uk-form-success uk-form-danger');
		if (res) {
			el.addClass('uk-form-success');
			wuk.enable( startBtn );
		} else {
			el.addClass('uk-form-danger');
			wuk.disable( startBtn );
		}
	}
	function onReady(fn) {
		typeof fn === 'function' ? fn() : undefined;
		
		$('#newSide').css({height: window.innerHeight});
		$('#newSide').toggle('slide');
		doValidation( $('#disc_left_input') );
		doValidation( $('#disc_right_input') );
		$('#clear').on('click', function (e) {
			e.preventDefault();
			
			// wpix.clear('lineContainer', true);
			// wpix.clear('nodeContainer');
			
			wpix.clearContainer('viewport');
		});
		$('#sidebar_btn').on('click', function () {
			this.closed = this.closed ? false : true;
			var sb = $('#newSide');
			
			
			if (  !sb.is(':animated')  ) {
				sb.toggle('slide');
			}
			
			// if (this.closed) {
				// sb.toggleClass('uk-animation-slide-left');
				// sb.toggleClass('no-display');
			// } else {
				// sb.addClass('uk-animation-reverse');
				
			// }
		});
		$('#traceroute_scan').on('click', function (e) {
			var txtarea, checkbox, txt, arr;
			
			e.preventDefault();
			
			txtarea = $('#txtarea_thing');
			checkbox = $('input[type="checkbox"][name="secure"]').is(':checked');
			
			txt = txtarea.val().trim();
			if (txt) {
				arr = txt.split("\n");
				//console.log(arr, checkbox);
				
				traceroute.trace(arr, checkbox);
			}
			$('#abort').removeAttr('disabled');
		});
		$('#abort').on('click', function (e) {
			e.preventDefault();
			traceroute.abort();
		});
		$('#discovery_start').on('click', function () {
			var first, second, type;
			
			first = $('input[type="text"][name="first-input"]').val();
			second = $('input[type="text"][name="second-input"]').val();
			
			first = first ? first.trim() : '';
			second = second ? second.trim() : '';
			
			type = $('#modal-discovery input[type="radio"][name="radio1"]:checked').val();
			discovery.discover( first, second, parseInt(type, 10) );
			
		});
		$('.j-discovery-radios').on('click', function () {
			var val = parseInt(this.value, 10),
				first, second;
				
			first = $('input[type="text"][name="first-input"]');
			second = $('input[type="text"][name="second-input"]');
			
			if (!val) {
				first.val('192.168.1.1');
				second.val('192.168.1.255');
			} else {
				first.val('192.168.1.1');
				second.val('255.255.255.0');
			}
			doValidation( $('#disc_left_input') );
			doValidation( $('#disc_right_input') );
		});
		$('#disc_left_input').on('keyup', function () {
			doValidation( $(this) );
		});
		$('#disc_right_input').on('keyup', function () {
			doValidation( $(this) );
		});
		$('#popups').on('click', '.j-popup-close', function (e) {
			e.preventDefault();
			$(this).parent().remove();
		});
	}
	
	return {
		onReady: onReady
		
	}
	
});

//var background = new PIXI.Container();
//var tink = new Tink(PIXI, renderer.view);

// var tween = new TWEEN.Tween( graphics.position );
// tween.to( {x: 500}, 1000);
// tween.start();