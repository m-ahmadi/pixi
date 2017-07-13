interface MapConfig {
	container: HTMLElement | JQuery;
	width?: number;
	height?: number;
	bgColor?: number;
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

}