define(["core/wuk"], function (wuk) {
	let inst = u.extend( newPubSub() );
	
	const DISCOVERY = "#modal_discovery";
	const SNMP_CREDS = "#modal_snmpcreds";
	const SNMP_TIMES = "#modal_snmptimes";
	const d = {
		DEFAULT_START_IP: "192.168.1.1",
		DEFAULT_END_IP: "192.168.1.255",
		DEFAULT_IP:  "192.168.1.1",
		DEFAULT_SUBNET: "255.255.255.0",
		DEFAULT_DISCOVERY_TIMEOUT: 180,
		DEFAULT_SNMP_TIMEOUT: 5,
		DEFAULT_SNMP_RETRIES: 3,
		MIN_DISCOVERY_TIMEOUT: 10,
		MAX_DISCOVERY_TIMEOUT: 600,
		MIN_SNMP_TIMEOUT: 1,
		MAX_SNMP_TIMEOUT: 10,
		MIN_SNMP_RETRIES: 1,
		MAX_SNMP_RETRIES: 10
	};
	const host = window.location.host;
	const substrBeforeLast = u.substrBeforeLast;
	if ( isValidIp(host) ) {
		d.DEFAULT_START_IP = substrBeforeLast(".", host) + ".1"; 
		d.DEFAULT_END_IP = substrBeforeLast(".", host) + ".255";
		d.DEFAULT_IP = d.DEFAULT_START_IP;
	}
	const getEls = u.getEls;
	
	let temp;
	let els1, els2, els3;
	let toSend = {};
	
	function resetData() {
		toSend = {
			action: "discovery",
			range_type: 0,
			start_range: d.DEFAULT_START_IP,
			end_range: d.DEFAULT_END_IP,
			ip: "",
			subnet: "",
			snmp_credentials: [],
			discovery_timeout: d.DEFAULT_DISCOVERY_TIMEOUT,
			snmp_timeout: d.DEFAULT_SNMP_TIMEOUT,
			snmp_retries: d.DEFAULT_SNMP_RETRIES
		};
	}
	function closeModal() {
		wuk.closeModal(DISCOVERY);
	}
	function begin() {
		wuk.openModal(DISCOVERY);
		reset();
	}
	function closeSidebar() {
		let sb = $("#newSide")
		if ( sb.is(":visible") ) {
			sb.toggle("slide");
		}
	}
	function isValidIp(v) {
		var rgx = {
			ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, // regex cookbook
			ip1: /^(([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)$/         // stackoverflow
		};
		
		return rgx.ip.test(v);
	}
	function doValidation(els) {
		let valid = true;
		let startBtn = els1.next;
		els.removeClass("uk-form-success uk-form-danger");
		els.each((i, l) => {
			let el = $(l);
			let res = isValidIp( el.val() );
			if (res) {
				el.addClass(res ? "uk-form-success" : "uk-form-danger");
			} else {
				el.addClass("uk-form-danger");
				valid = false;
			}
		});
		valid ? wuk.enable(startBtn) : wuk.disable(startBtn);
	}
	function discover() {
		// discover( first, second, parseInt(type, 10) );
	}
	
	function reset() {
		resetData();
		els1.radio1.prop("checked", true);
		els1.input1.val( d.DEFAULT_START_IP );
		els1.input2.val( d.DEFAULT_END_IP );
		els2.table.find("tr").remove();
		els2.table.append( temp({text:""}) );
		els3.slider1[0].noUiSlider.set( d.DEFAULT_DISCOVERY_TIMEOUT );
		els3.slider2[0].noUiSlider.set( d.DEFAULT_SNMP_TIMEOUT );
		els3.slider3[0].noUiSlider.set( d.DEFAULT_SNMP_RETRIES );
	}
	function initSliders() {
		noUiSlider.create(els3.slider1[0], {
			start: d.DEFAULT_DISCOVERY_TIMEOUT,
			connect: [true, false],
			range: {
				min: d.MIN_DISCOVERY_TIMEOUT,
				max: d.MAX_DISCOVERY_TIMEOUT
			}
		});
		noUiSlider.create(els3.slider2[0], {
			start: d.DEFAULT_SNMP_TIMEOUT,
			connect: [true, false],
			range: {
				min: d.MIN_SNMP_TIMEOUT,
				max: d.MAX_SNMP_TIMEOUT
			}
		});
		noUiSlider.create(els3.slider3[0], {
			start: d.DEFAULT_SNMP_RETRIES,
			connect: [true, false],
			range: {
				min: d.MIN_SNMP_RETRIES,
				max: d.MAX_SNMP_RETRIES
			}
		});
		
		els3.slider1[0].noUiSlider.on("update", (a, b, c) => {
			els3.input1.val( c[0].toFixed() );
		});
		els3.slider2[0].noUiSlider.on("update", (a, b, c) => {
			els3.input2.val( c[0].toFixed() );
		});
		els3.slider3[0].noUiSlider.on("update", (a, b, c) => {
			els3.input3.val( c[0].toFixed() );
		});
	}
	function init() {
		temp = Handlebars.templates.credrow;
		els1 = getEls(DISCOVERY);
		els2 = getEls(SNMP_CREDS);
		els3 = getEls(SNMP_TIMES);
		
		els1.radio1.prop("checked", true);
		els1.input1.attr("value", d.DEFAULT_START_IP);
		els1.input2.attr("value", d.DEFAULT_END_IP);
		doValidation(els1.inputs);
		
		els1.radios.on("click", () => {
			let rangeType = parseInt(this.value, 10),
				first, second;
				
			first = els1.input1;
			second = els1.input2;
			
			if (rangeType === 0) {
				first.val( d.DEFAULT_START_IP );
				second.val( d.DEFAULT_END_IP );
			} else {
				first.val( d.DEFAULT_IP );
				second.val( d.DEFAULT_SUBNET );
			}
			doValidation(els1.inputs);
		});
		els1.input1.on("keyup", e => {
			doValidation( els1.inputs );
		});
		els1.input2.on("keyup", e => {
			doValidation( els1.inputs );
		});
		els1.next.on("click", () => {
			let first, second, type;
			
			first = els1.input1.val();
			second = els1.input2.val();
			
			first = first ? first.trim() : "";
			second = second ? second.trim() : "";
			
			type = els1.radios.filter(":checked").val();
			type = parseInt(type, 10);
			
			toSend.range_type  = type;
			toSend.start_range = type === 0 ? first  : "";
			toSend.end_range   = type === 0 ? second : "";
			toSend.ip          = type === 1 ? first  : "";
			toSend.subnet      = type === 1 ? second : "";
			
			wuk.openModal(SNMP_CREDS);
			els2.table.find("[data-input]:last").focus();
		});
		els2.addnew.on("click", () => {
			els2.table.append( temp({text:""}) );
			els2.table.find("[data-input]").focus();
		});
		els2.table.on("click", "button[data-delete]", (e) => {
			$(e.target).parent().parent().remove();
			els2.table.find("[data-input]:last").focus();
		});
		els2.prev.on("click", () => {
			toSend.snmp_credentials = [];
			wuk.openModal(DISCOVERY);
		});
		els2.next.on("click", () => {
			toSend.snmp_credentials = [];
			els2.table.find("[data-input]").each((i, j) => {
				toSend.snmp_credentials.push( $(j).val() );
			});
			wuk.openModal(SNMP_TIMES);
		});
		els3.prev.on("click", () => {
			wuk.openModal(SNMP_CREDS);
		});
		els3.input1.on("blur", e => els3.slider1[0].noUiSlider.set(e.target.value));
		els3.input2.on("blur", e => els3.slider2[0].noUiSlider.set(e.target.value));
		els3.input3.on("blur", e => els3.slider3[0].noUiSlider.set(e.target.value));
		els3.submit.on("click", () => {
			toSend.discovery_timeout = parseInt( els3.slider1[0].noUiSlider.get(), 10 ).toFixed();
			toSend.snmp_timeout      = parseInt( els3.slider2[0].noUiSlider.get(), 10 ).toFixed();
			toSend.snmp_retries      = parseInt( els3.slider3[0].noUiSlider.get(), 10 ).toFixed();
			
			inst.emit("submit", toSend);
			wuk.closeModal(SNMP_TIMES);
			reset();
		});
		
		initSliders();
	}
	
	inst.isValidIp = isValidIp;
	inst.begin = begin;
	inst.init = init;
	
	window.discovery = inst;
	return inst;
});