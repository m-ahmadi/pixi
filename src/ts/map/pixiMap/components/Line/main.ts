import calcProps from "./util/calcProps";
import setProps from "./util/setProps";

const defaultPoint: Point = {x: 0, y: 0};

let colors: ColorTexture;

function createTexture(color: number): void {
	let hexStr = "#" + color.toString(16);
	if ( colors[hexStr] ) return;
	let g = new PIXI.Graphics();
	g.beginFill(color, 1);
	g.drawRect(0, 0, 1, 1);
	g.endFill();
	colors[hexStr] = g.generateCanvasTexture();
}

function createSprite(): PIXI.Sprite {
	let line = new PIXI.Sprite();
	line.interactive = true;
	line.buttonMode = true;
	return line;
}

export default class Line {
	private start: Point;
	private end: Point;
	private thickness: number;
	private color: number;
	private alpha: number;
	private el: PIXI.Sprite;

	constructor(conf: LineConfig) {
		this.start     = conf.start     || defaultPoint;
		this.end       = conf.end       || defaultPoint;
		this.thickness = conf.thickness || 2;
		this.color     = conf.color     || 0x000000;
		this.alpha     = conf.alpha     || 1;

		this.el = createSprite();
	}
	private draw() {
		let props = calcProps(this.start, this.end);
		setProps(this.el, props);
	}
	private toggleDirties() {
		/* let dirty = this.el.dirty;
		let f = this.el.clearDirty;
		this.el.clearDirty = f ? 0 : 1; */
	}
}