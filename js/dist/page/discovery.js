define(['map/mediator', 'core/wuk'], function (map, wuk) {
	// 'wpix', 'tpl' wpix, tpl
	var inst = {},
	    ws,
	    path = 'ws://' + window.location.host + '/network/discovery',
	    coefficient = {};

	function isValidIp(v) {
		var rgx = {
			ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, // regex cookbook
			ip1: /^(([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)$/ // stackoverflow
		};

		return rgx.ip.test(v);
	}
	function doValidation(inputEl) {
		var el = inputEl,
		    val = el.val(),
		    res = false,
		    startBtn = $('#discovery_next');

		res = isValidIp(val);

		inputEl.removeClass('uk-form-success uk-form-danger');
		if (res) {
			el.addClass('uk-form-success');
			wuk.enable(startBtn);
		} else {
			el.addClass('uk-form-danger');
			wuk.disable(startBtn);
		}
	}
	function closeModal() {
		wuk.closeModal("#modal_discovery");
	}
	function begin() {
		wuk.openModal("#modal_discovery");
	}
	function closeSidebar() {
		var sb = $('#newSide');

		if (sb.is(':visible')) {
			sb.toggle('slide');
		}
	}

	function discover(first, second, opt) {
		var d = {
			StartRange: "",
			EndRange: "",
			IP: "",
			Subnet: ""
		};

		if (!opt) {
			// 0
			d.StartRange = first;
			d.EndRange = second;
		} else {
			// 1
			d.IP = first;
			d.Subnet = second;
		}

		path += opt ? '?type=1' : '?type=0';

		ws = new WebSocket(path);

		ws.onopen = function (e) {
			console.log("Connection open...", e);
			ws.send(JSON.stringify(d));
		};
		ws.onmessage = function (e) {
			var data = e.data;

			closeModal();
			closeSidebar();
			if (typeof e.data === "string") {
				console.log("String message received", e, e.data);

				data = JSON.parse(data);
				coefficient = {
					x: map.width / (300 + 80), // wpix.renderer.width / (300 + 80), // 600 80
					y: map.height / (300 + 80) // wpix.renderer.height / (300 + 80), // 600 80
				};
				//	tpl.draw(data, "viewport", undefined, coefficient);
				map.draw(data, "viewport", undefined, coefficient);
			} else {
				console.log("Other message received", e, e.data);
			}
		};
		ws.onerror = function (e) {
			console.log("WebSocket Error: ", e);
		};
		ws.onclose = function (e) {
			closeModal();
			closeSidebar();
			console.log("Connection closed", e);
		};
	}

	var SL1_DEFAULT = 180;
	var SL2_DEFAULT = 5;
	var SL3_DEFAULT = 3;
	function initSliders() {
		var root = "#modal_timesettings";
		var slider1 = $(root + ' #discovery_timeout_slider')[0];
		var slider2 = $(root + ' #snpm_timout_slider')[0];
		var slider3 = $(root + ' #snpm_retries_slider')[0];
		var input1 = $(root + ' #discovery_timeout_input');
		var input2 = $(root + ' #snpm_timout_input');
		var input3 = $(root + ' #snpm_retries_input');

		noUiSlider.create(slider1, {
			start: 180,
			connect: [true, false],
			range: {
				min: 10,
				max: 600
			}
		});
		noUiSlider.create(slider2, {
			start: 5,
			connect: [true, false],
			range: {
				min: 1,
				max: 10
			}
		});
		noUiSlider.create(slider3, {
			start: 3,
			connect: [true, false],
			range: {
				min: 1,
				max: 10
			}
		});

		slider1.noUiSlider.on("update", function (a, b, c) {
			input1.val(c[0].toFixed());
		});
		slider2.noUiSlider.on("update", function (a, b, c) {
			input2.val(c[0].toFixed());
		});
		slider3.noUiSlider.on("update", function (a, b, c) {
			input3.val(c[0].toFixed());
		});
	}
	function init() {
		doValidation($('#disc_left_input'));
		doValidation($('#disc_right_input'));
		$('#discovery_next').on('click', function () {
			var first, second, type;

			first = $('input[type="text"][name="first-input"]').val();
			second = $('input[type="text"][name="second-input"]').val();

			first = first ? first.trim() : '';
			second = second ? second.trim() : '';

			type = $('#modal-discovery input[type="radio"][name="radio1"]:checked').val();
			discovery.discover(first, second, parseInt(type, 10));
		});
		$('.j-discovery-radios').on('click', function () {
			var val = parseInt(this.value, 10),
			    first,
			    second;

			first = $('input[type="text"][name="first-input"]');
			second = $('input[type="text"][name="second-input"]');

			if (!val) {
				first.val('192.168.1.1');
				second.val('192.168.1.255');
			} else {
				first.val('192.168.1.1');
				second.val('255.255.255.0');
			}
			doValidation($('#disc_left_input'));
			doValidation($('#disc_right_input'));
		});
		$('#disc_left_input').on('keyup', function () {
			doValidation($(this));
		});
		$('#disc_right_input').on('keyup', function () {
			doValidation($(this));
		});

		initSliders();
	}

	inst.isValidIp = isValidIp;
	inst.discover = discover;
	inst.begin = begin;
	inst.init = init;

	return inst;
});
//# sourceMappingURL=discovery.js.map