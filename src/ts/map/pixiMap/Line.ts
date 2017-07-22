import "./global-interfaces";

interface LineConfig {
	start: Point;
	end: Point;
	width: number;
	color: number | 0x000000;
	alpha: number | 1;
}
interface SpriteLineProps extends Point {
	width: number;
	height: number;
	rotation: number;
}
const Sprite = PIXI.Sprite;
const defaultPoint: Point = {
	x: 0,
	y: 0
};

function createElement(): PIXI.Sprite {
	let line = new Sprite();
	line.interactive = true;
	line.buttonMode = true;
	return line;
}
function calcProps(start: Point, end: Point): SpriteLineProps {
	let r: any = {}; // result
	let sX: number = start.x;
	let	sY: number = start.y;
	let	eX: number = end.x;
	let	eY: number = end.y;

	let	pow = Math.pow;
	let	sqrt = Math.sqrt;
	let	atan = Math.atan;
	let	abs = Math.abs;
	let	PI = Math.PI;

	let dx: number = abs(eX-sX);
	let dy: number = abs(eY-sY);

	r.height = 1;
	if (sY === eY) { // horizontal
		if (sX < eX) {
			r.x = sX;
			r.y = sY;
			r.width = eX-sX;
		} else if (eX < sX) {
			r.x = eX;
			r.y = eY;
			r.width = sX-eX;
		}
	} else if (sX === eX) { // vertical
		if (sY < eY) {
			r.x = sX;
			r.y = sY;
			r.height = eY-sY;
		} else if (eY < sY) {
			r.x = eX;
			r.y = eY;
			r.height = sY-eY;
		}
	} else {
		r.x = sX;
		r.y = sY;
		if (sX < eX && eY > sY) { // to bott right
			r.width = sqrt( pow(dy, 2) + pow(dx, 2) );
			r.rotation = atan(dy / dx);
		} else if (sX < eX && eY < sY) { // to top right
			r.width = sqrt( pow(dy, 2) + pow(dx, 2) );
			r.rotation = -atan(dy / dx);;
		} else if (sX > eX && eY > sY) { // to bott left
			r.width = sqrt( pow(dy, 2) + pow(dx, 2) );
			r.rotation = PI-atan(dy / dx);;
		} else if (sX > eX && eY < sY) { // to top left
			r.width = sqrt( pow(dy, 2) + pow(dx, 2) );
			r.rotation = PI+atan(dy / dx);;
		}
	}

	return r;
}
function setProps(el: PIXI.Sprite, props: SpriteLineProps): PIXI.Sprite {
	el.x = props.x;
	el.y = props.y;
	el.width = props.width;
	el.height = props.height;

	return el;
}

export default class Line {
	private start: Point;
	private end: Point;
	private width: number;
	private color: number;
	private alpha: number;
	private el: PIXI.Sprite;

	constructor(conf: LineConfig) {
		this.start = conf.start || defaultPoint;
		this.end   = conf.end   || defaultPoint;
		this.width = conf.width || 2;
		this.color = conf.color || 0x000000;
		this.alpha = conf.alpha || 1;

		this.el = createElement();
	}

	private toggleDirties() {
		/* let dirty = this.el.dirty;
		let f = this.el.clearDirty;
		this.el.clearDirty = f ? 0 : 1; */
	}
	
}