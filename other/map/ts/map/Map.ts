interface MapConfig {
	container: HTMLElement | JQuery;
	width?: number;
	height?: number;
	bgColor?: number;
}
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
 
export default class Map {
	private container: HTMLElement | JQuery;
	private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
	
    constructor(conf: MapConfig) {
		this.container = <HTMLElement>conf.container;
		this.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight,
			{
				backgroundColor: 0xFF0000,
				antialias: true
			}
		);
		this.container.appendChild(this.renderer.view);

	}
	public clear() {
		
	}
	public draw() {

	}

}