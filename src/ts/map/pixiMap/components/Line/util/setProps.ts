export default function setProps(el: PIXI.Sprite, props: SpriteLineProps): void {
	el.x = props.x;
	el.y = props.y;
	el.width = props.width;
	el.height = props.height;
}