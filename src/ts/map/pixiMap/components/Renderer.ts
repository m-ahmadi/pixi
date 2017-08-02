interface RendererConfig {
	container: HTMLElement;
	width?: number;
	height?: number;
	bgColor?: number;
}

export default class Renderer {
	private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
	public container: HTMLElement;
	public stage: PIXI.Container;
	
    constructor(conf: RendererConfig) {
		this.container = conf.container;
		this.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight,
			{
				backgroundColor: 0xf6e495, // 0xAB9988,
				antialias: true
			}
		);
		this.stage = new PIXI.Container();

		let ren = this.renderer;
		let stage = this.stage;
		

		stage.interactive = true;
		stage.hitArea = new PIXI.Rectangle(
			-100000,
			-100000,
			ren.width / ren.resolution * 100000,
			ren.height / ren.resolution *100000
		);

		this.container.appendChild(this.renderer.view);
	}
	public render(): void {
		this.renderer.render(this.stage);
	}
}