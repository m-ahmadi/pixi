import {u, newPubSub} from "global-vars";

import conf from "core/config";
import Renderer from "./Renderer";
import Layer from "./Layer";
import MNode from "./Node";
import Line from "./Line";

const inst: any = {};

interface Node {
	id: number;
	name: string;
	x: number;
	y: number;
	links: number[] | boolean;
	type: number;
	management_ip: string;
	manufacturer: string;
	mode: string;
	open_ports: number[];
	serial: string;
	last_seen: number;
	last_update: number;
}
interface Link {
	id: number;
	src: number;
	dest: number;
}
interface Nodes {
	[key: string]: Node;
}
interface Links {
	[key: string]: Link;
}
interface MapData {
	type: string;
	append: boolean;
	nodes: Nodes;
	links: Links;
}

PIXI.utils.skipHello();


inst.init = () => {
	PIXI.loader.add( "images/n/atlas64.json" );
	PIXI.loader.load(function () {
		// p.textures = PIXI.loader.resources["images/atlas-0.json"].textures;
		p.textures = PIXI.loader.resources["images/n/atlas64.json"].textures;
		if ( u.isFn(callback) ) {
			callback(renW, renH);
		}
	});
	requestAnimationFrame( animate );
	this.renderer.render( mainContainer );
}

export default inst;