interface RendererConfig {
	container: HTMLElement | JQuery;
	topLayer: PIXI.Container;
	width?: number;
	height?: number;
	bgColor?: number;
}

export default class Renderer {
	private container: HTMLElement | JQuery;
	private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
	private topLayer: PIXI.Container;
	
    constructor(conf: RendererConfig) {
		this.container = <HTMLElement>conf.container;
		this.topLayer = conf.topLayer;
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