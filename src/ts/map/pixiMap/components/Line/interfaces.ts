interface LineConfig {
	start: Point;
	end: Point;
	thickness: number;
	color: number | 0x000000;
	alpha: number | 1;
}
interface SpriteLineProps extends Point {
	width: number;
	height: number;
	rotation: number;
}
interface ColorTexture {
	[key: string]: PIXI.Texture;
}