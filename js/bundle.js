(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var util_1 = require("./util");
var PubSub = (function () {
    function PubSub() {
        this.subscribe = function (evt, fn, par) {
            var events, add = function (str) {
                if (typeof this.subscribers[str] === 'undefined') {
                    this.subscribers[str] = [];
                }
                this.subscribers[str].push({
                    fn: fn,
                    par: par
                });
            };
            if (typeof evt === 'string') {
                if (evt.indexOf(' ') === -1) {
                    add(evt);
                }
                else {
                    events = evt.split(' ');
                    events.forEach(function (el) {
                        add(el);
                    });
                }
            }
            else if (util_1.default.isObj(evt)) {
                Object.keys(evt).forEach(function (i) {
                    if (typeof this.subscribers[i] === 'undefined') {
                        this.subscribers[i] = [];
                    }
                    if (typeof evt[i] === 'function') {
                        this.subscribers[i].push({
                            fn: evt[i],
                            par: undefined
                        });
                    }
                    else if (util_1.default.isObj(evt[i])) {
                        this.subscribers[i].push({
                            fn: evt[i].fn,
                            par: evt[i].par
                        });
                    }
                });
            }
        };
        this.subscribers = {};
    }
    PubSub.prototype.publish = function (evtName, evtData) {
        if (typeof this.subscribers[evtName] !== 'undefined') {
            this.subscribers[evtName].forEach(function (i) {
                i.fn(evtData, i.par);
            });
        }
    };
    PubSub.prototype.getSubscribers = function () {
        return this.subscribers;
    };
    PubSub.prototype.on = function (evt, fn, par) {
        this.subscribe(evt, fn, par);
    };
    PubSub.prototype.emit = function (evtName, evtData) {
        this.publish(evtName, evtData);
    };
    return PubSub;
}());
Object.defineProperty(exports, "__esModule", { value: true });
/*function newPubSub() {
    "use strict";
    if ( this instanceof newPubSub ) { throw new Error('newPubSub() was called with new'); }
    
    var subscribers = {},
        inst: any = {};
    
    inst.getSubscribers = function () {
        return subscribers;
    };
    
    inst.subscribe = function (evt, fn, par) {
        var events,
            add = function (str) {
                if ( typeof subscribers[str] === 'undefined' ) {
                    subscribers[str] = [];
                }
                subscribers[str].push({
                    fn: fn,
                    par: par
                });
            };
        
        if (typeof evt === 'string') {
            if ( evt.indexOf(' ') === -1 ) {
                add(evt);
            } else {
                events = evt.split(' ');
                events.forEach(function (el) {
                    add(el);
                });
            }
        } else if ( util.isObj(evt) ) {
            Object.keys(evt).forEach(function (i) {
                if (typeof subscribers[i] === 'undefined') {
                    subscribers[i] = [];
                }
                if ( typeof evt[i] === 'function' ) {
                    subscribers[i].push({
                        fn: evt[i],
                        par: undefined
                    });
                } else if ( util.isObj(evt[i]) ) {
                    subscribers[i].push({
                        fn: evt[i].fn,
                        par: evt[i].par
                    });
                }
            });
        }
    };
    
    inst.publish = function (evtName, evtData) {
        if (typeof subscribers[evtName] !== 'undefined') {
            subscribers[evtName].forEach(function (i) {
                i.fn(evtData, i.par);
            });
        }
    };
    
    inst.on = function (evt, fn, par) { // alias
        this.subscribe(evt, fn, par);
    };
    
    inst.emit = function (evtName, evtData) { // alias
        this.publish(evtName, evtData);
    };
    
    return inst;
};

export default newPubSub*/
exports.default = PubSub;

},{"./util":9}],2:[function(require,module,exports){
"use strict";
$.support.cors = true;
$.ajaxSetup({
    crossDomain: true
});
var ajax = {};
ajax = (function () {
    var fns = {}, counter = 0, xhr, jax;
    fns.done = {};
    fns.fail = {};
    fns.always = {};
    function u() {
        return 'a' + (counter += 1);
    }
    function execute(type, uid, a, b, c) {
        var o = fns[type], f = o[uid];
        if (typeof f === 'function') {
            f(a, b, c);
        }
    }
    jax = function (o) {
        o = o ? o : {};
        var uid = u();
        var cnf = {};
        jax.id = uid;
        cnf.url = o.url || 'http://localhost:3000',
            cnf.type = o.type || 'GET',
            cnf.dataType = o.dataType || 'json',
            cnf.data = o.data,
            cnf.beforeSend = o.beforeSend,
            cnf.id = uid;
        xhr = $.ajax(cnf)
            .done(function (data, txt, obj) {
            if (this.id === jax.id) {
                execute('done', uid, data, txt, obj);
            }
            ;
        })
            .fail(function (obj, txt, err) {
            execute('fail', uid, obj, txt, err);
        })
            .always(function (obj, txt) {
            execute('always', uid, obj, txt);
        });
        jax.xhr = xhr;
        return jax;
    };
    jax.done = function (fn) {
        fns.done[this.id] = fn;
        return this;
    };
    jax.fail = function (fn) {
        fns.fail[this.id] = fn;
        return this;
    };
    jax.always = function (fn) {
        fns.always[this.id] = fn;
        return this;
    };
    jax.callbacks = fns;
    return jax;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ajax;

},{}],3:[function(require,module,exports){
"use strict";
var util_1 = require("./util");
var PubSub_1 = require("./PubSub");
var wpix_1 = require("./wpix");
var tpl_1 = require("./tpl");
var mediator_1 = require("./mediator");
var wani_1 = require("./wani");
var navigation_1 = require("./navigation");
var traceroute_1 = require("./traceroute");
var page_1 = require("./page");
window.util = util_1.default;
window.PubSub = PubSub_1.default;
window.wpix = wpix_1.default;
window.wani = wani_1.default;
window.tpl = tpl_1.default;
window.navigation = navigation_1.default;
window.traceroute = traceroute_1.default;
window.mediator = mediator_1.default;
page_1.default.onReady(mediator_1.default.init);

},{"./PubSub":1,"./mediator":4,"./navigation":5,"./page":6,"./tpl":7,"./traceroute":8,"./util":9,"./wani":10,"./wpix":11}],4:[function(require,module,exports){
"use strict";
var util_1 = require("../util");
var wpix_1 = require("../wpix");
var tpl_1 = require("../tpl");
var navigation_1 = require("../navigation");
var ajax_1 = require("../ajax");
var mediator = (function () {
    var inst = {}, p = {};
    p.GLOBAL_BOUNDS = {
        X_1: -10000,
        X_2: 10000,
        Y_1: -6000,
        Y_2: 6000
    };
    p.data = {}; // unreversed for ajax data
    p.bounds = {}; // reversed to ease bound calculations
    p.width = 0;
    p.height = 0;
    p.counters = {
        xLeft: 0,
        xRight: 0,
        yUp: 0,
        yDown: 0
    };
    p.ajax;
    function loadData(container) {
        container = container ? container : "viewport";
        var abort = p.ajax ? p.ajax.xhr.abort : undefined;
        if (abort) {
            abort();
        }
        p.ajax = ajax_1.default({
            data: p.data
        })
            .done(function (data) {
            wpix_1.default.clearContainer(container || "viewport");
            tpl_1.default.draw(data, container || "viewport", p.bounds);
        });
    }
    function wpixCallback(width, height) {
        var w = width, h = height, hW = w / 2, hH = h / 2, b = p.bounds, d = p.data;
        p.width = w;
        p.height = h;
        // p.data.x1 = -hW;
        // p.data.x2 = w + hW;
        // p.data.y1 = -hH;
        // p.data.y2 = h + hH;
        d.x1 = 0;
        d.x2 = w;
        d.y1 = 0;
        d.y2 = h;
        // p.bounds.x1 = hW;
        // p.bounds.x2 = -hW;
        // p.bounds.y1 = hH;
        // p.bounds.y2 = -hH;
        b.xL = hW;
        b.xR = -hW;
        b.yU = hH;
        b.yD = -hH;
        console.log(p.bounds);
        console.log(p.data);
        ajax_1.default({
            data: p.data
        })
            .done(function (data) {
            console.log(data);
            window.t = data;
            tpl_1.default.draw(data, "viewport");
        });
    }
    function panCallback(pos) {
        var x = Math.floor(pos.x), y = Math.floor(pos.y), b = p.bounds, d = p.data, w = p.width, h = p.height, hW = w / 2, hH = h / 2, c = p.counters, odd = util_1.default.isNumOdd, cnt;
        /*
        if (x >= b.xL) { // x1 512   x 0 1 2 3 4 5 6 7 8 9 (going left)
            c.xLeft += 1;
        
            
            
            b.xL += hW;
            b.xR += hW;
            
            d.x1 -= hW;
            d.x2 -= hW;
            
            console.log("salam");
            
            
            if ( odd(c.xLeft) ) { //
                
                console.log("first");
                cnt = "xSec1";
            } else if ( !odd(c.xLeft) ) {
                
                console.log("second");
                cnt = "xSec2";
            }
            console.log(b);
            console.log(d);
            
            loadData(cnt);
        }
        
        if (x <= b.xR) { // x2 -512 x -1 -2 -3 -4 -5 -6 -7 (going right)
            
            console.log("chetori");
            b.xL -= hW;
            b.xR -= hW;
            
            d.x1 += hW;
            d.x2 += hW;
            
            console.log(b);
            console.log(d);
            loadData();
        }
        */
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        if (x >= b.xL) {
            b.xL += hW;
            b.xR += hW;
            d.x1 -= hW;
            d.x2 -= hW;
            console.log("salam");
            console.log(b);
            console.log(d);
            loadData();
        }
        if (x <= b.xR) {
            console.log("chetori");
            b.xL -= hW;
            b.xR -= hW;
            d.x1 += hW;
            d.x2 += hW;
            console.log(b);
            console.log(d);
            loadData();
        }
        if (y >= b.yU) {
            b.yU += hH;
            b.yD += hH;
            d.y1 -= hH;
            d.y2 -= hH;
            console.log(b);
            console.log(d);
            loadData();
        }
        if (y <= b.yD) {
            b.yU -= hH;
            b.yD -= hH;
            d.y1 += hH;
            d.y2 += hH;
            console.log(b);
            console.log(d);
            loadData();
        }
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        /*
        if (x >= b.x1) { // x1 512   x 0 1 2 3 4 5 6 7 8 9 (going left)
            console.log("salam");
            b.x1 += hW;
            b.x2 -= hW;
            d.x1 -= hW;
            d.x2 -= hW;
            console.log(b);
            console.log(d);
            loadData();
        }
        
        if (x <= b.x2) { // x2 -512 x -1 -2 -3 -4 -5 -6 -7 (going right)
            console.log("chetori");
            b.x1 -= hW;
            b.x2 += hW;
            d.x1 += hW;
            d.x2 += hW;
            console.log(b);
            console.log(d);
            loadData();
        }
        
        if (y >= b.y1) { // y1 175   y1 10 20 30 (going up)
            console.log("here");
            b.y1 += hH;
            b.y2 += hH;
            d.y1 -= hH;
            d.y2 += hH;
            console.log(b);
            console.log(d);
            loadData();
        }
        
        if (y <= b.y2) { // y2 -175  y2 -10 -20 -30 (going down)
            console.log("kitty");
            b.y1 -= hH;
            b.y2 -= hH;
            d.y1 += hH;
            d.y2 += hH;
            console.log(b);
            console.log(d);
            loadData();
        }
        */
        // console.log(Math.floor(x), Math.floor(y)); 
    }
    function zoomCallback(d) {
        var pos = d.pos, x = pos.x, y = pos.y, b = p.bounds, xL = b.xL, xR = b.xR, yU = b.yU, yD = b.yD, w = p.width, h = p.height, hW = w / 2, hH = h / 2;
        // incX = aX > bX ? aX-bX : bX > aX ? bX-aX : undefined;
        // incY = aY > bY ? aY-bY : bY > aY ? bY-aY : undefined;
        // debugger;
        if (x >= xL) {
            b.xL = x + hW;
            b.xR = x - hW;
            console.log(b);
        }
        if (x <= xR) {
        }
        if (y >= yU) {
        }
        if (y <= yD) {
        }
        console.log(d.zoomIn);
        console.log(x, y);
    }
    function addCustomEvents() {
        wpix_1.default.on("pan", panCallback);
        wpix_1.default.on("zoom", zoomCallback);
        navigation_1.default.on("zoom", function () {
            console.log("zoom");
            wpix_1.default.zoom();
        });
        navigation_1.default.on("pan", function () {
            wpix_1.default.pan.pan(1, 1);
        });
    }
    function init() {
        wpix_1.default.init(wpixCallback, p.GLOBAL_BOUNDS);
        //core.init();
        //navigation.init();
        // addCustomEvents();
    }
    inst.data = p.data;
    inst.bounds = p.bounds;
    inst.init = init;
    return inst;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mediator;

},{"../ajax":2,"../navigation":5,"../tpl":7,"../util":9,"../wpix":11}],5:[function(require,module,exports){
"use strict";
var wpix_1 = require("../wpix");
var PubSub_1 = require("../PubSub");
var util_1 = require("../util");
var navigation = (function () {
    var inst = util_1.default.extend(new PubSub_1.default()), p = {};
    function init() {
        var nav, panel, rect, dot;
        p.panel = new wpix_1.default.Graphics();
        p.panelWidth = 400;
        p.panelHeight = 200;
        p.panelOffset = 100;
        panel = p.panel;
        panel.interactive = true;
        panel.beginFill(0xE3E3E3);
        panel.lineStyle(0);
        panel.drawRect(0, 0, p.panelWidth, p.panelHeight);
        panel.endFill();
        //panel.position.set( panelPos.x, panelPos.y ); 
        p.rect = new wpix_1.default.Graphics();
        p.rectWidth = wpix_1.default.renderer.width / 10;
        p.rectHeight = wpix_1.default.renderer.height / 3;
        rect = p.rect;
        rect.interactive = true;
        rect.buttonMode = true;
        rect.beginFill(0x2196F3, 1);
        rect.lineStyle(0);
        rect.drawRect(0, 0, 150, 150);
        rect.endFill();
        rect.alpha = 0.5;
        rect.TPL_nav = "box";
        p.dot = new wpix_1.default.Graphics();
        p.dotWH = 6;
        p.dotHalf = p.dotWH / 2;
        p.dotPos = {
            get x() { return (rect.x + rect.width) - p.dotHalf; },
            get y() { return (rect.y + rect.height) - p.dotHalf; }
        };
        dot = p.dot;
        dot.interactive = true;
        dot.buttonMode = true;
        dot.beginFill(0x0000FF, 1);
        dot.lineStyle(0);
        dot.drawRect(0, 0, p.dotWH, p.dotWH);
        dot.endFill();
        dot.position.set(p.dotPos.x, p.dotPos.y);
        dot.TPL_nav = "dot";
        p.nav = new wpix_1.default.Container();
        p.navPos = new wpix_1.default.Point(wpix_1.default.renderer.width - (p.panelWidth + p.panelOffset), 50);
        nav = p.nav;
        nav.position.set(p.navPos.x, p.navPos.y);
        nav.addChild(panel);
        nav.addChild(rect);
        nav.addChild(dot);
        addDragDrop(panel, "panel");
        addDragDrop(rect, "rect");
        addDragDrop(dot, "dot");
        wpix_1.default.addChild("stage", nav);
    }
    function addDragDrop(el, name) {
        if (name === "rect") {
            el
                .on("mousedown", rectDown)
                .on("touchstart", rectDown)
                .on("mouseup", rectUp)
                .on("mouseupoutside", rectUp)
                .on("touchend", rectUp)
                .on("touchendoutside", rectUp)
                .on("mousemove", rectMove)
                .on("touchmove", rectMove);
        }
        else if (name === "dot") {
            el
                .on("mousedown", dotDown)
                .on("touchstart", dotDown)
                .on("mouseup", dotUp)
                .on("mouseupoutside", dotUp)
                .on("touchend", dotUp)
                .on("touchendoutside", dotUp)
                .on("mousemove", dotMove)
                .on("touchmove", dotMove);
        }
    }
    function addCustomPos(el) {
        el.left = el.position.x;
        el.right = el.position.x + el.width;
        el.top = el.position.y;
        el.bott = el.position.y + el.height;
    }
    function panelDown(e) {
        //e.stopPropagation();
    }
    function panelUp() {
    }
    function panelMove() {
    }
    function rectDown(e) {
        this.data = e.data;
        this.dragging = true;
        this.dragPoint = e.data.getLocalPosition(this.parent);
        this.dragPoint.x -= this.position.x;
        this.dragPoint.y -= this.position.y;
    }
    function dotDown() {
        this.mouseIsDown = true;
    }
    function rectUp() {
        this.dragging = false;
        this.data = null;
    }
    function dotUp() {
        this.mouseIsDown = false;
    }
    function rectMove() {
        this.defaultCursor = "move";
        if (this.dragging) {
            var panel = p.panel, rect = p.rect, dot = p.dot, dotPos = p.dotPos, dotHalf = p.dotHalf, newPosition = this.data.getLocalPosition(this.parent), newX = newPosition.x - this.dragPoint.x, newY = newPosition.y - this.dragPoint.y, dotNewX = newX + (rect.width - dotHalf), dotNewY = newY + (rect.height - dotHalf);
            var min = 0, maxX = panel.width - rect.width, maxY = panel.height - rect.height, rectNewPos = new wpix_1.default.Point(), dotNewPos = new wpix_1.default.Point();
            if (newX > min && newX <= maxX) {
                rectNewPos.x = newX;
            }
            else if (newX < min) {
                rectNewPos.x = min;
            }
            else if (newX > maxX) {
                rectNewPos.x = maxX;
            }
            if (newY > min && newY <= maxY) {
                rectNewPos.y = newY;
            }
            else if (newY < min) {
                rectNewPos.y = min;
            }
            else if (newY > maxY) {
                rectNewPos.y = maxY;
            }
            dotNewPos.x = (newX > min && newX <= maxX) ? dotNewX : dotPos.x;
            dotNewPos.y = (newY > min && newY <= maxY) ? dotNewY : dotPos.y;
            rect.position.x = rectNewPos.x;
            rect.position.y = rectNewPos.y;
            dot.position.x = dotNewPos.x;
            dot.position.y = dotNewPos.y;
            inst.publish("pan");
        }
    }
    function dotMove(e) {
        this.defaultCursor = "nwse-resize";
        if (this.mouseIsDown) {
            var currentCursor = e.data.getLocalPosition(this.parent), resizeX = (currentCursor.x - this.x), resizeY = (currentCursor.y - this.y), halfX = resizeX / 2, halfY = resizeY / 2, panel = p.panel, rect = p.rect, dot = p.dot;
            rect.defaultCursor = "nwse-resize";
            addCustomPos(rect);
            addCustomPos(panel);
            var min = 0, nextRight = rect.width + resizeX, nextLeft = rect.position.x - halfX, nextBott = rect.height + resizeX, nextTop = rect.position.y - halfX, reachedRight = !(nextRight <= panel.right), reachedLeft = !(nextLeft > min), reachedBott = !(nextBott <= panel.bott), reachedTop = !(nextTop > min);
            if (!reachedRight && !reachedLeft) {
                rect.width += resizeX;
                rect.position.x -= halfX;
                dot.position.x += halfX;
            }
            else if (!reachedRight && reachedLeft) {
                rect.width += resizeX;
                dot.position.x += resizeX;
            }
            if (!reachedBott && !reachedTop) {
                rect.height += resizeX;
                rect.position.y -= halfX;
                dot.position.y += halfX;
            }
            else if (!reachedBott && reachedTop) {
                rect.height += resizeX;
                dot.position.y += resizeX;
            }
            inst.publish("zoom");
        }
    }
    inst.init = init;
    return inst;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = navigation;

},{"../PubSub":1,"../util":9,"../wpix":11}],6:[function(require,module,exports){
"use strict";
var wpix_1 = require("../wpix");
var traceroute_1 = require("../traceroute");
var util_1 = require("../util");
var u = util_1.default;
function onReady(callback) {
    if (u.isFn(callback)) {
        callback();
    }
    //var background = new wpix.Container();
    //var tink = new Tink(wpix, renderer.view);
    // var tween = new TWEEN.Tween( graphics.position );
    // tween.to( {x: 500}, 1000);
    // tween.start();
    $('#select_all').on('click', function (e) {
        e.preventDefault();
        var chks = $('input[type="checkbox"]');
        if (chks.length > 0) {
            chks.prop({ checked: true });
        }
    });
    $('#clear').on('click', function (e) {
        e.preventDefault();
        //a.wpix.clear('lineContainer', true);
        //a.wpix.clear('nodeContainer');
        wpix_1.default.clearContainer('viewport');
    });
    $('#sidebar').on('show.uk.offcanvas', function () {
        wpix_1.default.disableZoom(true);
    });
    $('#sidebar').on('hide.uk.offcanvas', function () {
        wpix_1.default.disableZoom(false);
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
            traceroute_1.default.trace(arr, checkbox);
        }
        $('#abort').removeAttr('disabled');
    });
    $('#abort').on('click', function (e) {
        e.preventDefault();
        traceroute_1.default.abort();
    });
}
var page = {};
page.onReady = onReady;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = page;

},{"../traceroute":8,"../util":9,"../wpix":11}],7:[function(require,module,exports){
"use strict";
var wpix_1 = require("../wpix");
var wani_1 = require("../wani");
var util_1 = require("../util");
var tpl = (function () {
    var p = {};
    p.nodes = {};
    p.links = {};
    p.idCounter = 0;
    p.types = [
        "tv-screen", "macintosh", "imac-blue", "smart-tv", "imac-red",
        "imac-grey", "monitor", "ipad", "iphone", "macbook",
        "computer", "gamepad", "playstation", "hard-drive",
        "smartphone", "smartwatch", "video-card", "xbox"
    ];
    function createNode(o, container, coefficient) {
        o = o ? o : {};
        var node, type, name, id, thisLinks, x, y, boxSpriteText;
        function setThings() {
            type = o.type || 0;
            id = o.id || "tpl_node_" + (p.idCounter += 1);
            //	name      = o.name  || "Node "+(p.idCounter+=1);
            name = o.name || o.management_ip || "Node " + (p.idCounter += 1);
            x = o.x;
            y = o.y;
            thisLinks = o.links || false;
        }
        function createBox() {
            boxSpriteText = wpix_1.default.createBoxSpriteText({
                x: coefficient ? x * coefficient.x : x,
                y: coefficient ? y * coefficient.y : y,
                imgName: p.types[type],
                spriteScale: 0.1,
                spriteTint: type,
                textContent: name,
                boxAlpha: 0,
                onmouseup: function () {
                },
                onmouseupParam: undefined
            });
        }
        function addTplnodeCustomPositionGetters() {
            var b = boxSpriteText;
            function midX() {
                return b.x + (b.width / 2);
            }
            function midY() {
                return b.y + (b.height / 2);
            }
            Object.defineProperties(node, {
                "top": {
                    get: function () { return b.y; }
                },
                "bott": {
                    get: function () { return b.y + b.height; }
                },
                "left": {
                    get: function () { return b.x; }
                },
                "right": {
                    get: function () { return b.x + b.width; }
                },
                //--------------------------------------------------------
                "topLeft": { get: function () { return wpix_1.default.coPoint(this.left, this.top); } },
                "topRight": { get: function () { return wpix_1.default.coPoint(this.right, this.top); } },
                "bottLeft": { get: function () { return wpix_1.default.coPoint(this.left, this.bott); } },
                "bottRight": { get: function () { return wpix_1.default.coPoint(this.right, this.bott); } },
                "topMid": { get: function () { return wpix_1.default.coPoint(midX(), this.top); } },
                "bottMid": { get: function () { return wpix_1.default.coPoint(midX(), this.bott); } },
                "leftMid": { get: function () { return wpix_1.default.coPoint(this.left, midY()); } },
                "rightMid": { get: function () { return wpix_1.default.coPoint(this.right, midY()); } },
                "center": { get: function () { return wpix_1.default.coPoint(midX(), midY()); } }
            });
        }
        function createTplNode() {
            node = {};
            node.id = id;
            node.name = name;
            node.links = thisLinks;
            node.wpixEl = boxSpriteText;
            addTplnodeCustomPositionGetters();
        }
        function bringToFront(arr, el) {
            arr.splice(arr.indexOf(el), 1);
            arr.push(el);
        }
        function addHandler() {
            boxSpriteText.setOnmousedown([p.links], function (tplLinks) {
                bringToFront(
                //                nodeContainer
                wpix_1.default.viewport.children[1].children, boxSpriteText);
                node.links.forEach(function (linkId) {
                    var link = tplLinks[linkId];
                    if (link) {
                        link.wpixEl.clear();
                    }
                });
            });
            boxSpriteText.setOnmouseup([node, p.links, p.nodes], function (node, tplLinks, tplNodes) {
                var nodeId = node.id;
                node.links.forEach(function (linkId) {
                    var link = tplLinks[linkId], start, end;
                    if (link) {
                        if (link.src === nodeId) {
                            start = node.center;
                        }
                        if (link.dest === nodeId) {
                            end = node.center;
                        }
                        link.wpixEl.changePoints(start, end);
                    }
                });
            });
        }
        setThings();
        createBox();
        createTplNode();
        addHandler();
        p.nodes[id] = node;
        wpix_1.default.addChild(container, "nodeContainer", node.wpixEl);
        wani_1.default.fadeIn(node.wpixEl);
    }
    var createLink = (function () {
        var path = {}, toggle = false;
        function create(start, end, srcId, destId, linkId, status, container) {
            var link, wpixEl, nth, curveLevel, srcdest, destsrc;
            srcdest = srcId + destId;
            destsrc = destId + srcId;
            link = {};
            if (!path[srcdest] && !path[destsrc]) {
                path[srcdest] = 1;
            }
            else if (path[srcdest]) {
                path[srcdest] += 1;
            }
            else if (path[destsrc]) {
                path[destsrc] += 1;
            }
            nth = path[srcdest] || path[destsrc];
            curveLevel = (nth - 1) * 2;
            if (nth === 1) {
                wpixEl = wpix_1.default.create2pointLine({
                    start: start,
                    end: end,
                    color: 0xCCAA00 * status,
                    alpha: 0
                });
            }
            else if (nth > 1) {
                wpixEl = wpix_1.default.create3pointLine({
                    start: start,
                    end: end,
                    color: 0xCCAA00 * status,
                    curveLevel: curveLevel,
                    curveSide: toggle ? false : true
                });
            }
            var setOndown = wpixEl.setOnmousedown;
            if (util_1.default.isFn(setOndown)) {
                setOndown(undefined, function () {
                    //                     lineContainer
                    var arr = wpix_1.default.viewport.children[0].children, el = wpixEl;
                    arr.splice(arr.indexOf(el), 1);
                    arr.push(el);
                });
            }
            link.wpixEl = wpixEl;
            link.id = linkId;
            link.src = srcId;
            link.dest = destId;
            p.links[linkId] = link;
            wpix_1.default.addChild(container, "lineContainer", link.wpixEl);
            // animate(link.wpixEl);
            wani_1.default.fadeIn(wpixEl);
        }
        return create;
    }());
    function checkNode(node, container) {
        createNode(node, container);
    }
    function checkLink(link, container, bounds) {
        /*
        var src = link.src,
            dest = link.dest,
            b = bounds ? bounds : {},
            x1 = b.x1,
            x2 = b.x2,
            y1 = b.y1,
            y2 = b.y2,
            start, end,
            srcOut = false,
            destOut = false,
            nodes = p.nodes;
        
        if ( src.x > x1 &&
                src.x < x2 &&
                src.y > y1 &&
                src.y < y2 ) {
            start = nodes[src.id].center;
        } else {
            srcOut = true;
        }
        
        if ( dest.x > x1 &&
                dest.x < x2 &&
                dest.y > y1 &&
                dest.y < y2 ) {
            end = nodes[dest.id].center;
        } else {
            destOut = true;
        }
        
        if (srcOut) {
            start = calc();
        } else if (destOut) {
            end = calc();
        }
        */
        // createLink(start, end, src.id, dest.id, link.id, container);
        var srcId, destId, srcNode, destNode, linkId, isObj = util_1.default.isObj, isStr = util_1.default.isStr;
        if (link.src) {
            if (isObj(link.src)) {
                srcId = link.src.id;
            }
            else if (isStr(link.src)) {
                srcId = link.src;
            }
        }
        else if (link.source_id) {
            srcId = link.source_id;
        }
        if (link.dest) {
            if (isObj(link.dest)) {
                destId = link.dest.id;
            }
            else if (isStr(link.dest)) {
                destId = link.dest;
            }
        }
        else if (link.destination_id) {
            destId = link.destination_id;
        }
        //debugger;
        srcNode = p.nodes[srcId];
        destNode = p.nodes[destId];
        //debugger;
        createLink(srcNode.center, destNode.center, srcId, destId, link.id, link.status, container);
    }
    function drawNodes(nodes, c, coefficient) {
        Object.keys(nodes).forEach(function (k) {
            // checkNode( nodes[k], c );
            createNode(nodes[k], c, coefficient);
        });
    }
    function drawLinks(links, c, b) {
        Object.keys(links).forEach(function (k) {
            checkLink(links[k], c, b);
        });
    }
    function draw(data, container, bounds, coefficient) {
        container = container ? container : "viewport";
        bounds = bounds ? bounds : {};
        coefficient = coefficient ? coefficient : false;
        p.nodes = {};
        p.links = {};
        drawNodes(data.nodes, container, coefficient);
        drawLinks(data.links, container, bounds);
    }
    return {
        get nodes() { return p.nodes; },
        get links() { return p.links; },
        checkLink: checkLink,
        draw: draw
    };
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = tpl;

},{"../util":9,"../wani":10,"../wpix":11}],8:[function(require,module,exports){
"use strict";
var util_1 = require("../util");
var wpix_1 = require("../wpix");
var tpl_1 = require("../tpl");
var u = util_1.default;
var baseRoot;
var traceroute = (function () {
    var ws = {}, path = 'ws://' + baseRoot + '/network/icmp/traceroute', // window.location.host
    openCallback, coefficient = {}, nodes = {}, links = {}, msgCounter = 0, noteMsgs = {}, scanBtn = {};
    // var v = prompt('change the address if you want:', path);
    // if (v) { path = v;}
    function filter(data) {
        var newLinks = data.links, newNodes = data.nodes, diffNodes = {}, diffLinks = {};
        Object.keys(newNodes).forEach(function (k) {
            if (!nodes[k]) {
                nodes[k] = newNodes[k];
                diffNodes[k] = newNodes[k];
            }
        });
        Object.keys(newLinks).forEach(function (k) {
            if (!links[k]) {
                links[k] = newLinks[k];
                diffLinks[k] = newLinks[k];
            }
        });
        return {
            links: diffLinks,
            nodes: diffNodes
        };
    }
    function createSock(opt) {
        if (opt) {
            path += '?portscanner=true';
        }
        ws = new WebSocket(path);
        console.log(ws);
    }
    function abort() {
        if (!u.isEmptyObj(ws)) {
            ws.close(4999);
        }
    }
    function addHandlers(cb) {
        openCallback = cb;
        ws.onopen = onopen;
        ws.onmessage = onmessage;
        ws.onerror = onerror;
        ws.onclose = onclose;
    }
    function onopen(e) {
        var cb = openCallback;
        console.log("Connection open...");
        // ws.send("Hello WebSocket!");
        if (u.isFn(cb)) {
            cb();
        }
    }
    function onmessage(e) {
        msgCounter += 1;
        if (msgCounter === 1) {
            noteMsgs.init.close();
            wpix_1.default.clearContainer("viewport");
            wpix_1.default.mainContainer.x = wpix_1.default.renderer.width / 2;
            wpix_1.default.mainContainer.y = wpix_1.default.renderer.height / 2;
            UIkit.offcanvas.hide(false);
            noteMsgs.processing = UIkit.notify({
                message: '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i> در حال دریافت اطلاعات...',
                status: 'info',
                timeout: 0,
                pos: 'bottom-right'
            });
        }
        if (u.isStr(e.data)) {
            console.log("String message received\n");
            noteMsgs.newData = UIkit.notify({
                message: '<i class="fa fa-check-circle" aria-hidden="true"></i> دریافت اطلاعات جدید.',
                status: 'success',
                timeout: 1000,
                pos: 'bottom-right'
            });
            var data = JSON.parse(e.data);
            console.log(data);
            data = filter(data);
            var nodesLen = Object.keys(data.nodes).length;
            var linksLen = Object.keys(data.links).length;
            console.log(nodesLen, linksLen);
            coefficient = {
                x: wpix_1.default.renderer.width / (300 + 80),
                y: wpix_1.default.renderer.height / (300 + 80),
            };
            // console.log(coefficient);
            tpl_1.default.draw(data, "viewport", undefined, coefficient);
        }
        else {
            console.log("Other message received\n", e.data);
        }
    }
    function onerror(e) {
        console.log("WebSocket Error: ", e);
        noteMsgs.init.close();
        // noteMsgs.processing.close();
        noteMsgs.error = UIkit.notify({
            message: '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> خطا در برقراری ارتباط!',
            status: 'danger',
            timeout: 2000,
            pos: 'bottom-right'
        });
    }
    function onclose(e) {
        console.log("Connection closed", e);
        scanBtn.removeAttr('disabled');
        // noteMsgs.processing.close();
        noteMsgs.init.close();
        noteMsgs.close = UIkit.notify({
            message: '<i class="fa fa-info" aria-hidden="true"></i> پایان دریافت.',
            status: 'info',
            timeout: 2000,
            pos: 'bottom-right'
        });
    }
    function trace(arr, opt) {
        noteMsgs.init = UIkit.notify({
            message: '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i> در حال بررسی...',
            status: 'info',
            timeout: 0,
            pos: 'top-center'
        });
        scanBtn = $('#scan');
        scanBtn.attr('disabled', '');
        createSock(opt);
        addHandlers(function () {
            ws.send(JSON.stringify(arr));
        });
    }
    return {
        abort: abort,
        trace: trace
    };
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = traceroute;

},{"../tpl":7,"../util":9,"../wpix":11}],9:[function(require,module,exports){
"use strict";
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() { }
        F.prototype = o;
        return new F();
    };
}
if (typeof Object.keys !== 'function') {
    Object.keys = function (o) {
        var keys = [], k;
        for (k in o) {
            if (o.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}
var util = (function () {
    function isObj(v) {
        return (v &&
            typeof v === 'object' &&
            typeof v !== null &&
            Object.prototype.toString.call(v) === '[object Object]') ? true : false;
    }
    function isArr(v) {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(v);
        }
        else {
            return (v &&
                typeof v === 'object' &&
                typeof v.length === 'number' &&
                typeof v.splice === 'function' &&
                !v.propertyIsEnumerable('length') &&
                Object.prototype.toString.call(v) === '[object Array]') ? true : false;
        }
    }
    function getArgs(a) {
        var args = new Array(a.length), i;
        for (i = 0; i < args.length; i += 1) {
            args[i] = a[i];
        }
        return args;
    }
    function moveArrItem(a, f, t) {
        a.splice(t, 0, a.splice(f, 1)[0]);
    }
    function isInt(n) {
        return isNum(n) && n % 1 === 0;
    }
    function negateNum(n) {
        return isNum(n) ? Math.abs(n) * -1 : undefined;
    }
    function positNum(n) {
        return isNum(n) ? Math.abs(n) : undefined;
    }
    function reverseNumSign(n) {
        if (isNum(n)) {
            if (n > 0) {
                return negateNum(n);
            }
            else if (n < 0) {
                return positNum(n);
            }
        }
    }
    function isNumOdd(n) {
        return isNum(n) && (n % 2) ? true : false;
    }
    function randInt(min, max) {
        min = min ? Math.ceil(min) : 0;
        max = max ? Math.floor(max) : 2;
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function randFloat(min, max) {
        min = min ? min : 0;
        max = max ? max : 1;
        return Math.random() * (max - min) + min;
    }
    function toDecimalPlace(n, p) {
        return isNum(n) ? parseFloat(n.toFixed(p)) : undefined;
    }
    function isEmptyObj(o) {
        var k;
        if (isObj(o)) {
            if (typeof Object.getOwnPropertyNames === 'function') {
                return Object.getOwnPropertyNames(o).length === 0; // ES5
            }
            else {
                for (k in o) {
                    if (o.hasOwnProperty(k)) {
                        return false;
                    }
                }
                return true;
            }
        }
    }
    function isFn(v) {
        return typeof v === 'function';
    }
    function isStr(v) {
        return typeof v === 'string';
    }
    function isNum(v) {
        return typeof v === 'number';
    }
    function isBool(v) {
        return typeof v === 'boolean';
    }
    function isUndef(v) {
        return typeof v === 'undefined';
    }
    function isEmptyStr(v) {
        return typeof v === 'string' && v.length === 0;
    }
    function objLength(o) {
        if (isObj(o)) {
            return Object.keys(o).length;
        }
    }
    function extend() {
        var args = Array.prototype.slice.call(arguments), len = args.length, arr = [], objects = [], first, last, result;
        if (len === 1) {
            first = args[0];
            if (isArr(first) && first.length > 1) {
                last = first.pop();
                objects = first;
            }
            else if (isObj(first)) {
                result = Object.create(first);
            }
        }
        else if (len === 2) {
            first = args[0];
            last = args[len - 1];
            if (isObj(first)) {
                result = Object.create(first);
            }
        }
        else if (len > 2) {
            last = args.pop();
            objects = args;
        }
        if (objects.length !== 0) {
            arr.push({});
            objects.forEach(function (el, i) {
                if (isObj(el)) {
                    Object.keys(el).forEach(function (k) {
                        arr[i][k] = el[k];
                    });
                    arr.push(Object.create(arr[i]));
                }
            });
            result = arr[arr.length - 1];
        }
        if (last && isObj(last)) {
            Object.keys(last).forEach(function (key) {
                result[key] = last[key];
            });
        }
        return result;
    }
    return {
        isObj: isObj,
        isArr: isArr,
        getArgs: getArgs,
        moveArrItem: moveArrItem,
        isInt: isInt,
        negateNum: negateNum,
        positNum: positNum,
        reverseNumSign: reverseNumSign,
        isNumOdd: isNumOdd,
        randInt: randInt,
        randFloat: randFloat,
        toDecimalPlace: toDecimalPlace,
        isEmptyObj: isEmptyObj,
        isFn: isFn,
        isStr: isStr,
        isNum: isNum,
        isBool: isBool,
        isUndef: isUndef,
        isEmptyStr: isEmptyStr,
        objLength: objLength,
        extend: extend
    };
}());
var u = util;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = util;

},{}],10:[function(require,module,exports){
"use strict";
var ani = (function () {
    function fade(inOut, pixiEl, o) {
        o = o ? o : {};
        TweenLite.to(pixiEl, o.dur || 0.5, {
            alpha: inOut ? 1 : 0,
            yoyo: true,
            ease: Linear.easeInOut,
            onComplete: o.done,
            onCompleteParams: o.donePar,
            onCompleteScope: o.doneCtx
        });
    }
    function fadeIn(pixiEl, o) {
        fade(true, pixiEl, o);
    }
    function fadeOut(pixiEl, o) {
        fade(false, pixiEl, o);
    }
    /*
    TweenLite.to(box.scale, 0.3, {
        x: 1,
        y: 1,
        yoyo: true,
        ease: Linear.easeInOut,
        onComplete: o.done,
        onCompleteParams: o.doneParams,
        onCompleteScope: o.doneCtx
    });
    */
    return {
        fadeIn: fadeIn,
        fadeOut: fadeOut
    };
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ani;

},{}],11:[function(require,module,exports){
"use strict";
var util_1 = require("../util");
var PubSub_1 = require("../PubSub");
var u = util_1.default;
var renderer;
var wpix = (function () {
    var inst = util_1.default.extend(new PubSub_1.default()), p = {};
    p.renderer = {};
    p.stage = {};
    p.mainContainer = {};
    p.viewport = {};
    p.xSec1 = {};
    p.xSec2 = {};
    p.ySec1 = {};
    p.ySec2 = {};
    p.textures = {};
    p.zoomDisabled = false;
    function init(callback, panBounds, background) {
        var renderer, renW, renH, renReso, stage, mainContainer;
        pan.setBounds(panBounds);
        PIXI.utils.skipHello();
        p.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
            backgroundColor: background || 0xAB9988,
            antialias: true,
        });
        p.stage = new PIXI.Container();
        p.mainContainer = new PIXI.Container();
        renderer = p.renderer;
        renW = renderer.width;
        renH = renderer.height;
        renReso = renderer.resolution;
        stage = p.stage;
        mainContainer = p.mainContainer;
        // document.body.appendChild( p.renderer.view );
        $("#contents").append(renderer.view);
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        //p.stage.buttonMode = true;
        mainContainer.interactive = true;
        mainContainer.hitArea = new PIXI.Rectangle(-100000, -100000, renW / renReso * 100000, renH / renReso * 100000);
        pan.add(mainContainer);
        $(document).on("mousewheel", function (e) {
            var zoomIn, mcPos, prevPos;
            // e.deltaX, e.deltaY, e.deltaFactor
            // zoom(e.pageX, e.pageY, e.deltaY > 0);
            // zoom(e);
            if (!p.zoomDisabled) {
                zoomIn = e.deltaY > 0,
                    mcPos = p.mainContainer.position,
                    prevPos = { x: mcPos.x, y: mcPos.y };
                zoom(e.pageX, e.pageY, zoomIn);
                inst.publish("zoom", {
                    zoomIn: zoomIn,
                    pos: mcPos
                });
            }
        });
        createContainers();
        stage.addChild(mainContainer);
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        requestAnimationFrame(animate);
        renderer.render(mainContainer);
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        /* var basePath = "images/raw/edited/",
        images = [
            "computer", "gamepad", "hard-drive", "imac-blue",
            "imac-grey", "imac-red", "ipad", "iphone", "macbook",
            "macintosh", "monitor", "playstation", "smartphone",
            "smart-tv", "smartwatch", "tv-screen", "video-card", "xbox"
        ];
        images.forEach(function (i) {
            var imgTrans = basePath+i+"-trans.png",
                imgFill = basePath+i+"-fill.png";
            PIXI.loader.add( imgTrans );
            PIXI.loader.add( imgFill );
        });
        PIXI.loader.load(); */
        PIXI.loader.add("images/computer.png");
        PIXI.loader.add("images/hard.png");
        PIXI.loader.add("images/atlas-0.json");
        PIXI.loader.load(function () {
            p.textures = PIXI.loader.resources["images/atlas-0.json"].textures;
            callback(renW, renH);
        });
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        inst.publish("init");
    }
    function disableZoom(v) {
        p.zoomDisabled = v;
    }
    function createContainers() {
        var viewport, xSec1, xSec2, ySec1, ySec2, main = p.mainContainer;
        viewport = new PIXI.Container();
        xSec1 = new PIXI.Container();
        xSec2 = new PIXI.Container();
        ySec1 = new PIXI.Container();
        ySec2 = new PIXI.Container();
        add(viewport);
        add(xSec1);
        add(xSec2);
        add(ySec1);
        add(ySec2);
        main.addChild(viewport);
        main.addChild(xSec1);
        main.addChild(xSec2);
        main.addChild(ySec1);
        main.addChild(ySec2);
        p.viewport = viewport;
        p.xSec1 = xSec1;
        p.xSec2 = xSec2;
        p.ySec1 = ySec1;
        p.ySec2 = ySec2;
    }
    function add(el) {
        var lineContainer = new PIXI.Container(), nodeContainer = new PIXI.Container();
        el.addChild(lineContainer);
        el.addChild(nodeContainer);
    }
    function clearContainer(k) {
        var r = p[k];
        r.children[0].destroy(true); // lineContainer
        r.children[0].destroy(); // nodeContainer
        add(r);
    }
    function addChild(k, str, child) {
        var i;
        if (str === "lineContainer") {
            i = 0;
        }
        else if (str === "nodeContainer") {
            i = 1;
        }
        p[k].children[i].addChild(child);
    }
    function animate() {
        requestAnimationFrame(animate);
        //tink.update();
        //TWEEN.update();
        p.renderer.render(p.stage);
    }
    function coPoint(x, y) {
        return new PIXI.Point(x, y);
    }
    function zoom(x, y, zoomIn) {
        var direction = (zoomIn) ? 1 : -1, factor = (1 + direction * 0.1), local_pt = new PIXI.Point(), point = new PIXI.Point(x, y), mainContainer = p.mainContainer;
        PIXI.interaction.InteractionData.prototype.getLocalPosition(mainContainer, local_pt, point);
        mainContainer.scale.x *= factor;
        mainContainer.scale.y *= factor;
        mainContainer.pivot = local_pt;
        mainContainer.position = point;
    }
    var pan = (function () {
        var isDragging = false, prevX, prevY, bounds = {};
        function down(e) {
            isDragging = true;
            //downX = e.data.global.x;
            //downY = e.data.global.y;
            var pos = e.data.global;
            prevX = pos.x;
            prevY = pos.y;
            isDragging = true;
        }
        function move(e) {
            if (!isDragging) {
                return;
            }
            var pos = e.data.global, dx = pos.x - prevX, dy = pos.y - prevY, mcX = p.mainContainer.position.x, mcY = p.mainContainer.position.y, bX1 = bounds.x1, bX2 = bounds.x2, bY1 = bounds.y1, bY2 = bounds.y2, negate = util_1.default.negateNum, posit = util_1.default.positNum;
            if (mcX <= bX1 && mcX >= bX2) {
                p.mainContainer.position.x += dx;
            }
            else {
                p.mainContainer.position.x = mcX > 0 ? bX1 : mcX < 0 ? bX2 : undefined;
            }
            if (mcY <= bY1 && mcY >= bY2) {
                p.mainContainer.position.y += dy;
            }
            else {
                p.mainContainer.position.y = mcY > 0 ? bY1 : mcY < 0 ? bY2 : undefined;
            }
            prevX = pos.x;
            prevY = pos.y;
            inst.publish("pan", p.mainContainer.position);
        }
        function up() {
            isDragging = false;
        }
        function pan(x, y) {
            if (x && y) {
                p.mainContainer.position.x += x;
                p.mainContainer.position.y += y;
            }
        }
        function add(el) {
            el
                .on("mousedown", down)
                .on("touchstart", down)
                .on("mouseup", up)
                .on("mouseupoutside", up)
                .on("touchend", up)
                .on("touchendoutside", up)
                .on("mousemove", move)
                .on("touchmove", move);
        }
        function setBounds(o) {
            var posit = util_1.default.positNum, negate = util_1.default.negateNum;
            // changing bound signs for easier calculation later.
            bounds.x1 = posit(o.X_1);
            bounds.x2 = negate(o.X_2);
            bounds.y1 = posit(o.Y_1);
            bounds.y2 = negate(o.Y_2);
        }
        return {
            get: function () { return bounds; },
            setBounds: setBounds,
            pan: pan,
            add: add
        };
    }());
    function create2pointLine(conf) {
        conf = conf ? conf : {};
        var line, start, end, lineWidth, tmpLineWidth, alpha, color, p, onmousedown, onmousedownParam;
        function setThings() {
            start = conf.start || { x: 0, y: 0 };
            end = conf.end || { x: 0, y: 0 };
            lineWidth = conf.lineWidth || 2;
            color = conf.color || 0x000000;
            alpha = conf.alpha;
            alpha = u.isNum(alpha) ? alpha : 1;
            p = calcPoints();
        }
        function setStart(s) {
            if (s) {
                start = s;
            }
        }
        function setEnd(e) {
            if (e) {
                end = e;
            }
        }
        function setLineWidth(w) {
            if (w) {
                lineWidth = w;
            }
        }
        function setColor(c) {
            if (c) {
                color = c;
            }
        }
        function down(e) {
            e.stopPropagation();
            this.alpha = 0.5;
            if (u.isFn(onmousedown)) {
                onmousedown.apply(undefined, onmousedownParam);
            }
        }
        function up() {
            this.alpha = 1;
        }
        function over() {
            tmpLineWidth = lineWidth;
            lineWidth *= 4;
            p = calcPoints();
            line.clear();
            draw();
            toggleDirties();
        }
        function out() {
            lineWidth = tmpLineWidth;
            p = calcPoints();
            line.clear();
            draw();
            toggleDirties();
        }
        function addEvents() {
            line
                .on("mousedown", down)
                .on("touchstart", down)
                .on("mouseup", up)
                .on("mouseupoutside", up)
                .on("touchend", up)
                .on("touchendoutside", up)
                .on("mouseover", over)
                .on("mouseout", out);
        }
        function toggleDirties() {
            var dirty = line.dirty, clearDirty = line.clearDirty;
            dirty = dirty ? false : true;
            clearDirty = clearDirty ? false : true;
        }
        function calcPoints() {
            var half = lineWidth / 2, sLeft = {}, sRight = {}, eRight = {}, eLeft = {}, sX = start.x, sY = start.y, eX = end.x, eY = end.y, results = {};
            if ((sX < eX && sY < eY) ||
                (sX > eX && sY > eY)) {
                sLeft = new PIXI.Point(sX - half, sY + half);
                sRight = new PIXI.Point(sX + half, sY - half);
                eRight = new PIXI.Point(eX + half, eY - half);
                eLeft = new PIXI.Point(eX - half, eY + half);
            }
            else if ((sX > eX && sY < eY) ||
                (sX < eX && sY > eY)) {
                sLeft = new PIXI.Point(sX - half, sY - half);
                sRight = new PIXI.Point(sX + half, sY + half);
                eRight = new PIXI.Point(eX + half, eY + half);
                eLeft = new PIXI.Point(eX - half, eY - half);
            }
            else if (sX === eX &&
                (sY > eY || sY < eY)) {
                sLeft = new PIXI.Point(sX - half, sY);
                sRight = new PIXI.Point(sX + half, sY);
                eRight = new PIXI.Point(eX + half, eY);
                eLeft = new PIXI.Point(eX - half, eY);
            }
            else if (sY === eY &&
                (sX < eX || sX > eX)) {
                sLeft = new PIXI.Point(sX, sY + half);
                sRight = new PIXI.Point(sX, sY - half);
                eRight = new PIXI.Point(eX, eY - half);
                eLeft = new PIXI.Point(eX, eY + half);
            }
            results.sLeft = sLeft;
            results.sRight = sRight;
            results.eRight = eRight;
            results.eLeft = eLeft;
            return results;
        }
        function changeColor(c) {
            setColor(c);
            line.clear();
            draw();
            toggleDirties();
        }
        function changePoints(s, e) {
            setStart(s);
            setEnd(e);
            p = calcPoints();
            line.clear();
            draw();
            toggleDirties();
        }
        function draw() {
            line.beginFill(color);
            line.moveTo(p.sLeft.x, p.sLeft.y);
            line.lineTo(p.sRight.x, p.sRight.y);
            line.lineTo(p.eRight.x, p.eRight.y);
            line.lineTo(p.eLeft.x, p.eLeft.y);
            line.endFill();
        }
        function createElement() {
            var line;
            line = new PIXI.Graphics();
            line.interactive = true;
            line.buttonMode = true;
            line.lineStyle(0);
            return line;
        }
        function create() {
            line = createElement();
            addEvents();
            draw();
        }
        setThings();
        create();
        line.alpha = alpha;
        line.setOnmousedown = function (param, fn) {
            onmousedownParam = param;
            onmousedown = fn;
        };
        line.changePoints = changePoints;
        line.changeColor = changeColor;
        Object.defineProperty(line, "points", {
            get: function () { return { start: start, end: end }; }
        });
        return line;
    }
    function create3pointLine(conf) {
        conf = conf ? conf : {};
        var line, start, end, ctrl, color, width, curveLevel, curveSide;
        function setThings() {
            start = conf.start || { x: 50, y: 50 };
            end = conf.end || { x: 600, y: 200 };
            color = conf.color || 0x000000;
            width = conf.width || 2;
            curveLevel = conf.curveLevel || 0;
            curveSide = conf.curveSide || false; // true top, false down
            ctrl = calcBetween(start, end);
        }
        function setStart(s) {
            if (s) {
                start = s;
            }
        }
        function setEnd(e) {
            if (e) {
                end = e;
            }
        }
        function setWidth(w) {
            if (w) {
                width = w;
            }
        }
        function setColor(c) {
            if (c) {
                color = c;
            }
        }
        function calcBetween(s, e) {
            var sX = s.x, sY = s.y, eX = e.x, eY = e.y, diffX, diffY, hX, hY;
            if (sX > eX) {
                diffX = sX - eX;
                hX = sX - (diffX / 2);
            }
            else if (sX < eX) {
                diffX = eX - sX;
                hX = sX + (diffX / 2);
            }
            else if (sX === eX) {
                hX = sX || eX;
            }
            if (sY > eY) {
                diffY = sY - eY;
                hY = sY - (diffY / 2);
            }
            else if (sY < eY) {
                diffY = eY + sY;
                hY = sY + (diffY / 2);
            }
            else if (sY === eY) {
                hY = sY || eY;
            }
            //debugger;
            return {
                x: hX,
                y: hY
            };
        }
        function changeColor(c) {
            setColor(c);
            line.clear();
            draw();
            toggleDirties();
        }
        function toggleDirties() {
            var dirty = line.dirty, clearDirty = line.clearDirty;
            dirty = (dirty) ? false : true;
            clearDirty = (clearDirty) ? false : true;
        }
        function incCurve() {
            var sX = start.x, sY = start.y, eX = end.x, eY = end.y, incX = 0, incY = 0, unit = 5;
            if ((sX < eX && sY < eY) ||
                (sX > eX && sY > eY)) {
                incX = curveSide ? unit : -unit;
                incY = curveSide ? -unit : unit;
            }
            else if ((sX > eX && sY < eY) ||
                (sX < eX && sY > eY)) {
                incX = curveSide ? -unit : unit;
                incY = curveSide ? -unit : unit;
            }
            else if (sX === eX &&
                (sY > eY || sY < eY)) {
                incX = curveSide ? -unit : unit;
            }
            else if (sY === eY &&
                (sX < eX || sX > eX)) {
                incY = curveSide ? -unit : unit;
            }
            ctrl.x += incX * curveLevel;
            ctrl.y += incY * curveLevel;
        }
        function changePoints(s, e) {
            setStart(s);
            setEnd(e);
            ctrl = calcBetween(start, end);
            line.clear();
            if (curveLevel) {
                incCurve();
            }
            draw();
            toggleDirties();
        }
        function draw() {
            line.lineStyle(width, color, 1);
            line.moveTo(start.x, start.y);
            line.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y);
        }
        function create() {
            line = new PIXI.Graphics();
            line.interactive = true;
            line.buttonMode = true;
        }
        setThings();
        create();
        if (curveLevel) {
            incCurve();
        }
        draw();
        line.changeColor = changeColor;
        line.changePoints = changePoints;
        //p.mainContainer.addChild(line);
        return line;
    }
    function createBoxSpriteText(conf) {
        conf = conf ? conf : {};
        var sprite, text, box, imgFill, imgBasePath, imgName, imgExt, img, spriteImg, spriteScale, spriteTint, textContent, textFont, textSize, textColor, boxX, boxY, boxAlpha, onmouseup, onmouseupParam, onmousedown, onmousedownParam, onmove, onmoveParam;
        function setThings() {
            imgFill = conf.imgFill || false;
            imgBasePath = conf.imgBasePath || "images/raw/edited/"; // images/
            imgName = conf.imgName || "tv-screen"; // tv-screen computer
            imgExt = conf.imgExt || ".png";
            spriteScale = conf.spriteScale || 0.2;
            spriteTint = conf.spriteTint || false;
            textContent = conf.textContent || "no_name";
            textFont = conf.textFont || "Arial";
            textSize = conf.textSize || "16px";
            textColor = conf.textColor || "black";
            boxX = conf.x || 0;
            boxY = conf.y || 0;
            boxAlpha = conf.boxAlpha;
            boxAlpha = u.isNum(boxAlpha) ? boxAlpha : 1;
            //	spriteImg   = conf.spriteImg    || imgBasePath + imgName + (imgFill ? "-fill":"-trans") + imgExt;
            spriteImg = conf.spriteImg || imgName + (imgFill ? "-fill" : "-trans") + imgExt;
        }
        function down(e) {
            e.stopPropagation();
            this.data = e.data;
            this.alpha = 0.5;
            this.dragging = true;
            this.dragPoint = e.data.getLocalPosition(this.parent);
            this.dragPoint.x -= this.position.x;
            this.dragPoint.y -= this.position.y;
            if (u.isFn(onmousedown)) {
                onmousedown.apply(undefined, onmousedownParam);
            }
        }
        function up() {
            this.alpha = 1;
            this.dragging = false;
            this.data = null;
            if (u.isFn(onmouseup)) {
                onmouseup.apply(undefined, onmouseupParam);
            }
        }
        function move() {
            if (this.dragging) {
                var newPosition = this.data.getLocalPosition(this.parent);
                this.position.x = newPosition.x - this.dragPoint.x;
                this.position.y = newPosition.y - this.dragPoint.y;
                if (u.isFn(onmove)) {
                    onmove.apply(undefined, onmoveParam);
                }
            }
        }
        function addEvents(el) {
            el
                .on("mousedown", down)
                .on("touchstart", down)
                .on("mouseup", up)
                .on("mouseupoutside", up)
                .on("touchend", up)
                .on("touchendoutside", up)
                .on("mousemove", move)
                .on("touchmove", move);
        }
        function makeSprite() {
            // sprite = new PIXI.Sprite.fromImage( spriteImg );
            sprite = new PIXI.Sprite(p.textures[spriteImg]);
            sprite.interactive = true;
            sprite.buttonMode = true;
            sprite.anchor.set(0, 0);
            sprite.alpha = 1;
            sprite.scale.set(spriteScale);
            if (spriteTint) {
                sprite.tint = 0xFFCC00 * spriteTint;
            }
        }
        function makeText() {
            text = new PIXI.Text(textContent, {
                fontFamily: textFont,
                fontSize: textSize,
                fill: textColor
            });
            text.interactive = true;
            text.buttonMode = true;
            text.y = sprite.y + sprite.height;
        }
        function makeBox() {
            box = new PIXI.Container();
            // box = new PIXI.particles.ParticleContainer();
            box.interactive = true;
            box.buttonMode = true;
            box.scale.set(1);
            box.alpha = boxAlpha;
            box.position.x = boxX;
            box.position.y = boxY;
            box.hitArea = new PIXI.Rectangle(0, 0, sprite.width, sprite.height);
            addEvents(box);
            box.addChild(sprite);
            box.addChild(text);
        }
        setThings();
        makeSprite();
        makeText();
        makeBox();
        box.setOnmouseup = function (param, fn) {
            onmouseupParam = param;
            onmouseup = fn;
        };
        box.setOnmousedown = function (param, fn) {
            onmousedownParam = param;
            onmousedown = fn;
        };
        box.setOnmove = function (param, fn) {
            onmoveParam = param;
            onmove = fn;
        };
        box.changeTint = function (n) {
            if (n) {
                sprite.tint = n;
            }
        };
        return box;
    }
    Object.defineProperties(inst, {
        "renderer": {
            get: function () { return p.renderer; }
        },
        "stage": {
            get: function () { return p.stage; }
        },
        "mainContainer": {
            get: function () { return p.mainContainer; }
        },
        "viewport": {
            get: function () { return p.viewport; }
        },
        "textures": {
            get: function () { return p.textures; }
        }
    });
    inst.init = init;
    inst.coPoint = coPoint;
    inst.create2pointLine = create2pointLine;
    inst.create3pointLine = create3pointLine;
    inst.createBoxSpriteText = createBoxSpriteText;
    inst.clearContainer = clearContainer;
    inst.addChild = addChild;
    inst.disableZoom = disableZoom;
    return inst;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = wpix;

},{"../PubSub":1,"../util":9}]},{},[3]);
