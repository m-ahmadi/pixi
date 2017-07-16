define([
	"core/uk"
] , (uk) => {
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
			uk.openModal(MODAL);
		});
		els.table.on("click", "button[data-edit]", () => {
			uk.openModal(MODAL);
		});
		els.table.on("click", "button[data-remove]", (e) => {
			$(e.target).parent().parent().remove();
		});
		els2.save.on("click", () => {
			let o = {};
			els2.form.serializeArray().forEach(i => o[i.name] = i.value);
			let f = false;
			Object.keys(o).forEach(i => {
				if (o[i]) {
					f = true;
					return;
				}
			});
			console.log(f);
			els.table.append( temp( f ? o : {name: "mohammad", username: "ahmadi", email:"mohammad.ahmadi1989@yahoo.com"} ) );
		});
	}
	
	
	
	inst.show = () => {
		uk.show(root);
	};
	inst.hide = () => {
		uk.hide(root);
	};
	
	inst.init = init;
	return inst;
});