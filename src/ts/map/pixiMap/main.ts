import conf from "core/config";
import Renderer from "./components/Renderer";
import Layer from "./components/Layer";
import Node from "./components/Node";
import Line from "./components/Line/main";
import zoom from "./stageZoom";

const inst = u.extend( newPubSub() );
const ATLAS_PATH = "images/n/atlas64.json";
let textures: PIXI.loaders.TextureDictionary | undefined;
let renderer: Renderer;
let worker: Worker;

function animate(): void {
	requestAnimationFrame(animate);
	renderer.render();
}
function initWorker(): void {
	worker = new Worker(conf.WRKR+ "pixiMap/main.js");
	worker.onmessage = (e: MessageEvent) => {
		let d = e.data;
		switch (d.action) {
			case "dool":

			break;
		}
	};
}
inst.init = () => {
	initWorker();
	
	PIXI.utils.skipHello();
	renderer = new Renderer({
		container: <HTMLElement>document.getElementById("map_container")
	});
	PIXI.loader.add( conf.ROOT+ ATLAS_PATH );
	PIXI.loader.load(cb => {
		textures = PIXI.loader.resources[ATLAS_PATH].textures;
		if ( u.isFn(cb) ) cb();
	});
	$(renderer.container).on("mousewheel", (e: JQueryMousewheel.JQueryMousewheelEventObject) => {
		zoom(e.pageX, e.pageY, e.deltaY > 0, renderer.topLayer);
	});
	requestAnimationFrame(animate);
};

inst.draw = (data: MapData) => {
	debugger
};
inst.hide = () => {

};
inst.show = () => {

};
inst.clear = () => {
	
};

export default inst;