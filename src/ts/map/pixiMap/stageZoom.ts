export default function zoom(x: number, y: number, zoomIn: boolean, el: PIXI.DisplayObject) {
	const Point = PIXI.Point;
	const direction = zoomIn ? 1 : -1;
	const factor = (1 + direction * 0.1);
	const local_pt = new Point();
	const point = new Point(x, y);
	
	PIXI.interaction.InteractionData.prototype.getLocalPosition(el, local_pt, point);
	
	el.scale.x *= factor;
	el.scale.y *= factor;
	el.pivot = local_pt;
	el.position = point;
}