import {u, newPubSub} from "global-vars";
const inst = u.extend( newPubSub() );
const ROOT = "#header";
const c = {
	DEFAULT: " ", // amber lighten-5
	SELECTED: " purple lighten-5 "
};
let els: any;

function init() {
	els = u.getEls(ROOT);
	els.menu.on("click", () => {
		inst.emit("menu_clicked");
	});
	els.map.on("click", () => {
		inst.emit("map_clicked");
	});
	els.members.on("click", () => {
		inst.emit("members_clicked");
	});
	els.navitems.on("click", (e: Event) => {
		els.navitems.removeClass(c.DEFAULT + c.SELECTED);
		let others = els.navitems.not(e.target);
		others.addClass(c.DEFAULT);
		$(e.target).addClass(c.SELECTED);
	});
}

inst.init = init;

export default inst