define(["./util"], function (u) {
	var inst = {},
	    modals = {};

	function getModal(str) {
		return UIkit.modal(str);
	}

	function disable(el) {
		if (!el.is(":disabled")) {
			el.attr("disabled", "");
		}
	}
	function enable(el) {
		if (!el.is(":enabled")) {
			el.removeAttr("disabled");
		}
	}
	function closeModal(s) {
		var m = getModal(s);
		if (m.isActive()) {
			m.hide();
		}
	}
	function openModal(s) {
		var m = getModal(s);
		if (!m.isActive()) {
			m.show();
		}
	}
	function modalState(state, id) {
		if (state === true) {
			modals[id] = true;
		} else if (!state) {
			modals[id] = false;
		}
	}
	function isAnyModalActive() {
		var result = false;
		Object.keys(modals).forEach(function (k) {
			if (modals[k] === true) {
				result = true;
			}
		});
		return result;
		// return u.isEmptyObj(modals) ? false : true;
	}
	var note = function () {
		var icons = {
			INFO: '<i class="fa  fa-info-circle           fa-lg"  aria-hidden="true"></i>',
			SUCCESS: '<i class="fa  fa-check-circle          fa-lg"  aria-hidden="true"></i>',
			WARNING: '<i class="fa  fa-exclamation           fa-lg"  aria-hidden="true"></i>',
			ERROR: '<i class="fa  fa-exclamation-triangle  fa-lg"  aria-hidden="true"></i>',
			PROCESS: '<i class="fa  fa-refresh               fa-lg   fa-fw fa-spin"></i>'
		};
		function make(o) {
			var v;

			v = UIkit.notification(o);

			return v;
		}
		function create(type, msg, timeout, pos) {
			var icon,
			    status,
			    res,
			    defaultMsg = "NO_MESSAGE_WAS_SPECIFIED";

			if (type === "info") {
				// no such thing in uk3 but it works
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
				status = "info" || "primary";
			}

			res = make({
				message: icon + " " + (msg || defaultMsg),
				status: status,
				timeout: u.isNum(timeout) ? timeout : 1000,
				pos: pos || "bottom-right"
			});

			return res;
		}
		function info(msg, timeout, pos) {
			return create("info", msg, timeout, pos);
		}
		function success(msg, timeout, pos) {
			return create("success", msg, timeout, pos);
		}
		function warning(msg, timeout, pos) {
			return create("warning", msg, timeout, pos);
		}
		function error(msg, timeout, pos) {
			return create("error", msg, timeout, pos);
		}
		function process(msg, timeout, pos) {
			return create("process", msg, timeout, pos);
		}
		return {
			info: info,
			success: success,
			warning: warning,
			error: error,
			process: process
		};
	}();
	function init() {
		$(document).on("keydown", function (e) {
			if (e.keyCode === 27) {
				if (!isAnyModalActive()) {
					var sb = $("#newSide");
					if (!sb.is(":animated")) {
						sb.toggle("slide");
					}
				}
			}
		});
		/* $("a[href^="#modal_"]").on("click", function (e) {
  	modalState(true, e.target.hash.substr(1));
  }); */
		$("div[id^='modal_']").on("beforeshow", function (e) {
			modalState(true, e.target.id);
		});
		$("div[id^='modal_']").on("hide", function (e) {
			modalState(false, e.target.id);
		});
	}

	inst.note = note;
	inst.disable = disable;
	inst.enable = enable;
	inst.getModal = getModal;
	inst.closeModal = closeModal;
	inst.openModal = openModal;
	inst.isAnyModalActive = isAnyModalActive;
	inst.modalState = modalState;
	inst.init = init;

	window.mmm = modals;
	window.wuk = inst;
	return inst;
});
//# sourceMappingURL=wuk.js.map