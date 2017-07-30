interface RendererConfig {
	container: HTMLElement;
	width?: number;
	height?: number;
	bgColor?: number;
}

export default class Renderer {
	private container: HTMLElement;
	private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
	public topLayer: PIXI.Container;
	
    constructor(conf: RendererConfig) {
		this.container = conf.container;
		this.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight,
			{
				backgroundColor: 0xAB9988,
				antialias: true
			}
		);
		this.topLayer = new PIXI.Container();

		let ren = this.renderer;
		let topLayer = this.topLayer;
		

		topLayer.interactive = true;
		topLayer.hitArea = new PIXI.Rectangle(
			-100000,
			-100000,
			ren.width / ren.resolution * 100000,
			ren.height / ren.resolution *100000
		);

		this.container.appendChild(this.renderer.view);
	}
	public render(): void {
		this.renderer.render(this.topLayer);
	}
}