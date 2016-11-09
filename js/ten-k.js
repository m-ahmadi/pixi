//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// arz va ertefa monitoretoon ro bas dasti bezanin to line 10 va 11
var nodes = 10000,   // kole noda
	width = 1920,    // arz safe
	height = 950,    // ertefa safe
	nodeSize = 0.04, // andaze noda
	imgPath = 'images/computer.png'; // web server bas deliver kone
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

var renderer = PIXI.autoDetectRenderer(width, height, {
	backgroundColor: 0x1099bb
});
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
var texture = PIXI.Texture.fromImage('images/computer.png');



for (var i = 0; i < nodes; i+=1) {
	createBunny(Math.floor(Math.random() * 1920) , Math.floor(Math.random() * 950));
}

function createBunny(x, y) {
    var bunny = new PIXI.Sprite(texture);

    bunny.interactive = true;
    bunny.buttonMode = true;
    bunny.anchor.set(0.5);
    bunny.scale.set(nodeSize);

    bunny
		.on('mousedown', onDragStart)
		.on('touchstart', onDragStart)

		.on('mouseup', onDragEnd)
		.on('mouseupoutside', onDragEnd)
		.on('touchend', onDragEnd)
		.on('touchendoutside', onDragEnd)
		
		.on('mousemove', onDragMove)
		.on('touchmove', onDragMove);

	bunny.position.x = x;
	bunny.position.y = y;

	stage.addChild(bunny);
}

requestAnimationFrame( animate );

function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}
function onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}
function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
		var newPosition = this.data.getLocalPosition(this.parent);
		this.position.x = newPosition.x;
		this.position.y = newPosition.y;
    }
}