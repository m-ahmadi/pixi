import conf from "core/config";
import Renderer from "../Renderer";
import Layer from "../Layer";
import Node from "../Node";
import Line from "../Line";

const inst = u.extend( newPubSub() );
const ATLAS_PATH = "images/n/atlas64.json";
let textures: PIXI.loaders.TextureDictionary | undefined;
let renderer: Renderer;

function animate(): void {
	requestAnimationFrame(animate);
	renderer.render();
}

inst.init = () => {
	PIXI.utils.skipHello();
	renderer = new Renderer({
		container: <HTMLElement>document.getElementById("map_container")
	});
	PIXI.loader.add( conf.ROOT+ ATLAS_PATH );
	PIXI.loader.load(cb => {
		textures = PIXI.loader.resources[ATLAS_PATH].textures;
		if ( u.isFn(cb) ) cb();
	});

	requestAnimationFrame(animate);
};

inst.draw = () => {

};
inst.clear = () => {
	
};

export default inst;