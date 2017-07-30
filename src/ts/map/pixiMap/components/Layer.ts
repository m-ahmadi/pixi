interface StageConfig extends Point {
	width: number;
	height: number;
}

export default class Stage {
	private el: PIXI.Container;

	constructor(conf: StageConfig) {
		this.el = new PIXI.Container();
		
		this.el.interactive = true;
		this.el.hitArea = new PIXI.Rectangle( conf.x, conf.x, conf.width, conf.height );
	}
}