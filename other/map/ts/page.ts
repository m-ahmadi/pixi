import * as px from "./map/index";



export function beforeReady() {

}
export function onReady() {
	let container = document.getElementById("map");
	let map = new px.Map({
		container: container
	});
}