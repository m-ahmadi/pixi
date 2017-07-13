interface MapConfig {
	container: HTMLElement | JQuery;
	width?: number;
	height?: number;
	bgColor?: number;
}

export default class Map {
	private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
	
    constructor(conf: MapConfig) {
		this.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight,
			{
				backgroundColor: 0xFF0000,
				antialias: true
			}
		);
		document.body.appendChild( this.renderer.view );

    }

}