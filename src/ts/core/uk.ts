let inst: any = {};
let modals: any = {};

const DISPLAY = "no-display";

function getModal(str: string) {
	return UIkit.modal(str);
}

function disable(el: JQuery) {
	if ( !el.is(":disabled") ) {
		el.attr("disabled", "");
	}
}
function enable(el: JQuery) {
	if ( !el.is(":enabled") ) {
		el.removeAttr("disabled");
	}
}
function closeModal(s: string) {
	let m = getModal(s);
	if ( m.isToggled() ) {
		m.hide();
	}
}
function openModal(s: string) {
	let m = getModal(s);
	if ( !m.isToggled() ) {
		m.show();
	}
}
function modalState(state: boolean, id: string) {
	if (state === true) {
		modals[id] = true;
	} else if (!state) {
		modals[id] = false;
	}
}
function isAnyModalActive() {
	let res = false;
	Object.keys(modals).forEach(k => {
		if ( modals[k] === true ) res = true;
	});
	return res;
}
let note = (function () {
	const DEFAULT_MSG = "NO_MESSAGE_WAS_SPECIFIED";
	const icons = {
		INFO:    '<i class="fa  fa-info-circle           fa-lg"  aria-hidden="true"></i>',
		SUCCESS: '<i class="fa  fa-check-circle          fa-lg"  aria-hidden="true"></i>',
		WARNING: '<i class="fa  fa-exclamation           fa-lg"  aria-hidden="true"></i>',
		ERROR:   '<i class="fa  fa-exclamation-triangle  fa-lg"  aria-hidden="true"></i>',
		PROCESS: '<i class="fa  fa-refresh               fa-lg   fa-fw fa-spin"></i>',
	};
	function make(o: any) {
		var v;
		
		v = UIkit.notification(o);
		
		return v;
	}
	function create(type: string, msg: string, timeout: number, pos: string) {
		var icon, status, res;
		
		if (type === "info") { // no such thing in uk3 but it works
			icon = icons.INFO;
			status = "info" || "primary";
		} else if (type === "success") {
			icon = icons.SUCCESS;
			status = "success";
		} else if (type === "warning") {
			icon = icons.WARNING;
			status = "warning";
		} else if (type === "error") {
			icon = icons.ERROR;
			status = "danger";
		} else if (type === "process") {
			icon = icons.PROCESS;
			timeout = 0;
			status = "info" || "primary";
		}
		
		res = make({
			message:  icon +" "+ (msg || DEFAULT_MSG),
			status:   status,
			timeout:  u.isNum(timeout) ? timeout : 1000,
			pos:      pos || "top-right"
		});
		
		return res;
	}
	function info(msg: string, timeout: number, pos: string) {
		return create("info", msg, timeout, pos);
	}
	function success(msg: string, timeout: number, pos: string) {
		return create("success", msg, timeout, pos);
	}
	function warning(msg: string, timeout: number, pos: string) {
		return create("warning", msg, timeout, pos);
	}
	function error(msg: string, timeout: number, pos: string) {
		return create("error", msg, timeout, pos);
	}
	function process(msg: string, timeout: number, pos: string) {
		return create("process", msg, timeout, pos);
	}
	return {
		info: info,
		success: success,
		warning: warning,
		error: error,
		process: process
	};
}());

inst.toggleDisplay = ($el: JQuery) => {
	$el.hasClass(DISPLAY) ? $el.removeClass(DISPLAY): $el.addClass(DISPLAY);
};
inst.show = ($el: JQuery) => {
	$el.hasClass(DISPLAY) ? $el.removeClass(DISPLAY) : undefined;
};
inst.hide = ($el: JQuery) => {
	!$el.hasClass(DISPLAY) ? $el.addClass(DISPLAY) : undefined;
};
inst.note = note;
inst.disable = disable;
inst.enable = enable;
inst.closeModal = closeModal;
inst.openModal = openModal;
inst.isAnyModalActive = isAnyModalActive;
inst.init = () => {
	$("div[id^='modal_']").on("beforeshow", e => {
		modalState(true, e.target.id);
	});
	$("div[id^='modal_']").on("hide", e => {
		modalState(false, e.target.id);
	});
};

declare var window: any;
window.uk = inst;

export default inst