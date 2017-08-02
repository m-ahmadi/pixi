interface NodeConfig {
	texture: PIXI.Texture;
	text: string;
	pos: Point;
}

function createText(content: string, pos: Point): PIXI.Text {
	let el = new PIXI.Text(content, {
		fontFamily: "Arial",
		fontSize: "40px",
		fill: "black"
	});
	el.interactive = true;
	el.buttonMode = true;
	el.anchor.set(0.5);
	el.scale.set(0.5);
	el.position.set(pos.x, pos.y);
	return el;
}
function createSprite(texture: PIXI.Texture, pos: Point): PIXI.Sprite {
	let el = new PIXI.Sprite(texture);
	el.interactive = true;
	el.buttonMode = true;
	el.anchor.set(0.5);
	el.scale.set(0.1);
	el.position.set(pos.x, pos.y);
	return el;
}
function createBox(): PIXI.Container {
	var el = new PIXI.Container();
	el.interactive = true;
	el.buttonMode = true;
	return el;
}

export default class Node {
/*
	these props will become private later,
	since required functionality will become more clear
	and it will move to the methods instead.
*/
	public text: PIXI.Text;
	public sprite: PIXI.Sprite;
	public box: PIXI.Container;
	constructor(conf: NodeConfig) {
		const pos = conf.pos;
		this.text = createText(conf.text, pos);
		this.sprite = createSprite(conf.texture, pos);
		this.box = createBox();
		this.box.addChild(this.text);
		this.box.addChild(this.sprite);
	}
}