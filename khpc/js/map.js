define(["util", "positions"], function (u, sensorsPos) {
	var inst = {},
		p;
		
	// Scope Globals:
	g = {
		renderer: {},
		stage: {},
		main: {},
		ATLAS_PATH: "images/atlas.json",
		PLANT_PATH: "images/plant.png",
		BG_PATH: "images/bg.png",
		AJAX_URL: "http://127.0.0.1:1081/khp/report",
		textures: {},
		sensorList: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
		sensors: {}
	};
	
	
	
	var makeDraggable = (function (el) {
		function start(e) {
			var arr;
			e.stopPropagation();
			this.data = e.data;
			this.alpha = 0.5;
			this.dragging = true;
			this.dragPoint = e.data.getLocalPosition(this.parent);
			this.dragPoint.x -= this.position.x;
			this.dragPoint.y -= this.position.y;
			
			arr = this.parent.children;
			if (arr.length) {
				arr.splice( arr.indexOf(this), 1 );
				arr.push(this);
			}
		}
		function move(e) {
			if (this.dragging) {
				var newPosition = this.data.getLocalPosition(this.parent);
				this.position.x = newPosition.x - this.dragPoint.x;
				this.position.y = newPosition.y - this.dragPoint.y;
			}
		}
		function end() {
			this.alpha = 1;
			this.dragging = false;
			this.data = null;
		}
		function add(el) {
			el.interactive = true;
			el
				.on("mousedown", start)
				.on("touchstart", start)
				.on("mouseup", end)
				.on("mouseupoutside", end)
				.on("touchend", end)
				.on("touchendoutside", end)
				.on("mousemove", move)
				.on("touchmove", move);
		}
		return add;
	}());
	function animate() {
		requestAnimationFrame(animate);
		g.renderer.render(g.stage);
	}
	function mousewheel(e) {
		console.log(e.deltaY);
		zoom(e.pageX, e.pageY, e.deltaY > 0);
	}
	function zoom(x, y, zoomIn) {
		var direction = (zoomIn) ? 1 : -1,
			factor = (1 + direction * 0.1),
			local_pt = new PIXI.Point(),
			point = new PIXI.Point(x, y),
			el = g.stage;
		
		PIXI.interaction.InteractionData.prototype.getLocalPosition(el, local_pt, point);
		
		el.scale.x *= factor;
		el.scale.y *= factor;
		el.pivot = local_pt;
		el.position = point;
	}
	function start() {
		var tile = new PIXI.extras.TilingSprite.fromImage(g.BG_PATH, g.renderer.width / g.renderer.resolution * 1000000, g.renderer.height / g.renderer.resolution *1000000);
		tile.position.x = -1000000;
		tile.position.y = -1000000;
		g.main.addChild(tile);
		
		// var s = new PIXI.Sprite.fromImage( "images/1.png");
		var i;
		var s;
		var x = 0;
		var y = 0;
		for (i=0; i<9; i+=1) {
			s = new PIXI.Sprite( g.textures[i+".png"] );
			s.scale.set(0.5);
			s.x = x;
			s.y = y;
			x+=50;
			y+=50;
			makeDraggable(s);
			g.main.addChild(s);
		}
	}
	function updateSensors(arr) {
		// Object.keys(g.sensors)
		arr.forEach(function (itm, idx) {
			
			var sensor = g.sensors[ itm.sensorId ];
			
			sensor.nameEl.setText(itm.sensorName);
			sensor.valueEl.setText(itm.value);
		});
	}
	function createStuff() {
		var textStyle, c, s,
			Text = PIXI.Text,
			Graphics = PIXI.Graphics,
			TXT_SCALE = 0.2;
			BOX_COLOR = 0x02C4C4,
			SCALE_X = 1.2;
			SCALE_Y = 1.4;
			SPACE_BETWEEN_BOXES = 10,
			DEFAULT_NAME = "n\a",
			DEFAULT_VALUE = "n\a";
			
		
		textStyle = {
			fontFamily: 'Arial',
			fontSize: '100px',
			fill: '#F7EDCA',
			stroke: '#4a1850'
		};
		c = new PIXI.Container();
		s = new PIXI.Sprite( g.textures.plant );
		s.scale.set(0.5);
		c.addChild(s);
		
		Object.keys(sensorsPos).forEach(function (k) {
			var sensor = sensorsPos[k],
				b = new PIXI.Container(),
				r1, r2,
				t1, t2;
			
			t1 = new Text(""+sensor.name, textStyle);
			t1.scale.set( TXT_SCALE );
			
			t2 = new Text(""+sensor.value, textStyle);
			t2.scale.set( TXT_SCALE );
			
			r1 = new Graphics();
			r1.beginFill( BOX_COLOR );
			r1.drawRect(0, 0, t1.width * SCALE_X, t1.height * SCALE_Y);
			r1.endFill();
			
			r2 = new Graphics();
			r2.beginFill( BOX_COLOR );
			r2.drawRect(0, 0, t2.width * SCALE_X, t2.height * SCALE_Y);
			r2.endFill();
			r2.position.x = r1.x + r1.width + SPACE_BETWEEN_BOXES;
			
			t1.position.x += (r1.width - t1.width) /2;
			t1.position.y += (r1.height - t1.height) /2;
			t2.position.x = r2.x + (r2.width - t2.width) /2;
			t2.position.y = r2.y + (r2.height - t2.height) /2;
			
			b.position.set(sensor.x, sensor.y);
			
			b.addChild(r1);
			b.addChild(r2);
			b.addChild(t1);
			b.addChild(t2);
			c.addChild(b);
			
			g.sensors[k] = {
				nameEl: t1,
				valueEl: t2
			};
			inst.text = b;
		});
		

		g.main.addChild(c);
		g.stage.position.set(500, 50);
		
		
		$.ajax({
			url : g.AJAX_URL,
			type : "GET",
			dataType : "json",
			data : {
				num_rows: 1,
				timestamp_start: 1487968298000,
				timestamp_end: 1488056858000,
				table_name: "csv_report",
				sensors: g.sensorList.join(",")
			},
			beforeSend : function () {
				// 
			}
		})
		.done(function (data) {
			var arr = data.rowList;
			updateSensors( arr );
		})
		.fail(function (data) {
			
		});
	}
	function addEvt() {
		$("canvas").on("mousewheel", mousewheel);
		$(window).on("resize", function () {
			g.renderer.resize(window.innerWidth, window.innerHeight);
		});
	}
	function init(div, fn) {
		div = div instanceof jQuery ? div : u.isStr(div) ? $(div) : $(document.body);
		var stage, main, renderer,
			renReso,
			N = 100000,
			ATLAS = g.ATLAS_PATH,
			PLANT = g.PLANT_PATH;
		
		PIXI.utils.skipHello();
		g.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight,
			{
				backgroundColor: 0x4e342e ,// 0xf5eed8, // 0xAB9988, // 0xAB9999,
				antialias: false,
				transparent: false
			}
		);
		g.stage = new PIXI.Container();
		g.main = new PIXI.Container();
		
		renderer = g.renderer;
		stage = g.stage;
		main = g.main;
		renReso = renderer.resolution;
		
		div.append( renderer.view );
		
		main.hitArea = new PIXI.Rectangle( -1000000, -1000000, renderer.width / renReso * 1000000, renderer.height / renReso *1000000 );
	//	stage.interactive = true;
		makeDraggable(main);
		addEvt();
		stage.addChild( main );
		
		// PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
		PIXI.loader.add( PLANT );
		PIXI.loader.add( ATLAS );
		PIXI.loader.load(function () {
			g.textures = PIXI.loader.resources[ATLAS].textures;
			g.textures["plant"] = PIXI.loader.resources[PLANT].texture;
			if ( u.isFn(fn) ) {
				fn();
			}
		//	start();
			createStuff();
		});
		requestAnimationFrame( animate );
		renderer.render( stage );
		
		
	}
	
	inst.init = init;
	inst.g = g;
	window.map = inst;
	
	return inst;
});

/* $.support.cors = true;

	$.ajaxSetup({
		crossDomain: true
	}); */