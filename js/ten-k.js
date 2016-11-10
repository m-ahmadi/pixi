//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// arz va ertefa monitoretoon ro bas dasti bezanin to line 10 va 11
var nodes = 30000,   // kole noda
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
    bunny.anchor.set(0.5, 0.5);
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
/*
	var rect = new PIXI.Graphics();
	rect.interactive = true;
	rect.buttonMode = true;
	rect.beginFill(0x0033CC);
	rect.lineStyle(4, 0xFF0000, 1);
	rect.drawRect(0, 0, 36, 36);
	rect.endFill();
	rect.alpha = 0.5;
	 rect
		.on('mousedown', onDragStart)
		.on('touchstart', onDragStart)

		.on('mouseup', onDragEnd)
		.on('mouseupoutside', onDragEnd)
		.on('touchend', onDragEnd)
		.on('touchendoutside', onDragEnd)
		
		.on('mousemove', onDragMove)
		.on('touchmove', onDragMove);

	rect.position.x = x;
	rect.position.y = y;
	
	stage.addChild(rect);
*/
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


















// var initX,
	// initY,
	// left = false,
	// right = false,
	// up = false,
	// down = false;
// $('canvas')
	// .on('mousedown', function (e) {
		// this.dragit = true;
		// initX = e.pageX;
		// initY = e.pageY
	// })
	// .on('mousemove', function (e) {
		// var x = e.pageX,
			// y = e.pageY;
		
		// if (!this.dragit) { return; }
		
		
		// if (x < initX) { // left
			// right = false;
			// left= true;
		// } else if (x > initX) { // right
			// right = true;
			// left = false;
		// }
		// if (y < initY) { // up
			// down = false;
			// up = true;
		// } else if (y >  initY) { // down
			// up = false;
			// down = true
		// }
		
		// if (left) {
			// stage.x -= 50;
		// }
		// if (right) {
			// stage.x += 50;
		// }
		// if (up) {
			// stage.y -= 50;
		// }
		// if (down) {
			// stage.y += 50;
		// }
	// })
	// .on('mouseup', function () {
		// this.dragit = false;
	// });