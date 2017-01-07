/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

$(function () {
	a.mediator.init();
	
	
	
	 
	
});
//var background = new PIXI.Container();
//var tink = new Tink(PIXI, renderer.view);



// var tween = new TWEEN.Tween( graphics.position );
// tween.to( {x: 500}, 1000);
// tween.start();



$('#select_all').on('click', function (e) {
	e.preventDefault();
	var chks = $('input[type="checkbox"]');
	if (chks.length > 0) {
		chks.prop({checked: true});
	}
	
});
$('#add_device').on('click', function (e) {
	var name,
		x, y,
		type,
		links;
		
	e.preventDefault();
	
	name = $('input[type="text"][name="name"]').val();
	id = $('input[type="text"][name="id"]').val();
	x = $('input[type="text"][name="x"]').val();
	y = $('input[type="text"][name="y"]').val();
	type = $('select').find(':selected').val().trim();
	links = [];
	$('input[type="checkbox"]').each(function () {
		var id = this.id;
		if ( $(this).is(':checked')  &&  id ) {
			links.push(id);
		}
	});
	if (type) {
		$('input[type="checkbox"]').prop({checked: false});
		var finished = a.core.createTplNode({
			id: id,
			name: name,
			type: type,
			x: x,
			y: y,
			links: links
		});
		$('#devices').append('<label><input type="checkbox" id="'+finished+'"> '+finished+'</label>');
	}
	
	
});
$('#generate').on('click', function (e) {
	e.preventDefault();
	var nodeCount = $('input[type="text"][name="nodecount"]').val(),
		density = $('input[type="text"][name="density"]').val(),
		linkColor = $('input[type="text"][name="linkcolor"]').val(),
		each = $('input[type="text"][name="each"]').val(),
		fill = $('input[type="checkbox"][name="fill"]').is(':checked');
	
	linkColor = parseInt(linkColor, 16);
	each = parseInt(each, 10);
	
	a.tpl.test(
		nodeCount || 10,
		density || 1,
		linkColor,
		each,
		fill
	);
});

$('#clear').on('click', function (e) {
	e.preventDefault();
	
	//a.pixi.clear('lineContainer', true);
	//a.pixi.clear('nodeContainer');
	
	a.pixi.clearContainer('viewport');
});

$('#sidebar').on('show.uk.offcanvas', function () {
	a.pixi.disableZoom(true);
});
$('#sidebar').on('hide.uk.offcanvas', function () {
	a.pixi.disableZoom(false);
});

$('#scan').on('click', function (e) {
	var txtarea, checkbox, txt, arr;
	
	e.preventDefault();
	
	txtarea = $('#txtarea_thing');
	checkbox = $('input[type="checkbox"][name="secure"]').is(':checked');
	
	txt = txtarea.val().trim();
	if (txt) {
		arr = txt.split("\n");
		//console.log(arr, checkbox);
		
		a.traceroute.trace(arr, checkbox);
	}
	$('#abort').removeAttr('disabled');
});

$('#abort').on('click', function (e) {
	e.preventDefault();
	a.traceroute.abort();
});



/***/ }
/******/ ]);