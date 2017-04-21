define([
	"core/util",
	"core/pubsub",
	"core/wuk"
] , (u, newPubSub, wuk) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "#members";
	const MODAL = "#modal_member"
	
	let root, els, els2, temp;
	let data = {};
	
	function init() {
		root = $(ROOT);
		els = u.getEls(ROOT);
		els2 = u.getEls(MODAL);
		temp = Handlebars.templates.memrow;
		const header = parseInt($("#header").css("height"), 10)
		els.wrap.height(window.innerHeight - header);
		
		els.add.on("click", () => {
			wuk.openModal(MODAL);
		});
		els.table.on("click", "button[data-edit]", () => {
			wuk.openModal(MODAL);
		});
		els.table.on("click", "button[data-remove]", (e) => {
			$(e.target).parent().parent().remove();
		});
		els2.save.on("click", () => {
			let o = {};
			els2.form.serializeArray().forEach(i => o[i.name] = i.value);
			els.table.append( temp(o) );
		});
	}
	
	
	
	inst.show = () => {
		wuk.show(root);
	};
	inst.hide = () => {
		wuk.hide(root);
	};
	
	inst.init = init;
	return inst;
});