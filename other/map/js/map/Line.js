define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Sprite = PIXI.Sprite;
    var defaultPoint = {
        x: 0,
        y: 0
    };
    function createElement() {
        var line = new Sprite();
        line.interactive = true;
        line.buttonMode = true;
        line.lineStyle(0);
        return line;
    }
    function calcProps(start, end) {
        var r = {}; // result
        var sX = start.x;
        var sY = start.y;
        var eX = end.x;
        var eY = end.y;
        var pow = Math.pow;
        var sqrt = Math.sqrt;
        var atan = Math.atan;
        var abs = Math.abs;
        var PI = Math.PI;
        var dx = abs(eX - sX);
        var dy = abs(eY - sY);
        r.height = 1;
        if (sY === eY) {
            if (sX < eX) {
                r.x = sX;
                r.y = sY;
                r.width = eX - sX;
            }
            else if (eX < sX) {
                r.x = eX;
                r.y = eY;
                r.width = sX - eX;
            }
        }
        else if (sX === eX) {
            if (sY < eY) {
                r.x = sX;
                r.y = sY;
                r.height = eY - sY;
            }
            else if (eY < sY) {
                r.x = eX;
                r.y = eY;
                r.height = sY - eY;
            }
        }
        else {
            r.x = sX;
            r.y = sY;
            if (sX < eX && eY > sY) {
                r.width = sqrt(pow(dy, 2) + pow(dx, 2));
                r.rotation = atan(dy / dx);
            }
            else if (sX < eX && eY < sY) {
                r.width = sqrt(pow(dy, 2) + pow(dx, 2));
                r.rotation = -atan(dy / dx);
                ;
            }
            else if (sX > eX && eY > sY) {
                r.width = sqrt(pow(dy, 2) + pow(dx, 2));
                r.rotation = PI - atan(dy / dx);
                ;
            }
            else if (sX > eX && eY < sY) {
                r.width = sqrt(pow(dy, 2) + pow(dx, 2));
                r.rotation = PI + atan(dy / dx);
                ;
            }
        }
        return r;
    }
    function setProps(el, props) {
        el.x = props.x;
        el.y = props.y;
        el.width = props.width;
        el.height = props.height;
        return el;
    }
    var Line = (function () {
        function Line(conf) {
            this.start = conf.start || defaultPoint;
            this.end = conf.end || defaultPoint;
            this.width = conf.width || 2;
            this.color = conf.color || 0x000000;
            this.alpha = conf.alpha || 1;
            this.el = createElement();
        }
        Line.prototype.toggleDirties = function () {
            /* let dirty = this.el.dirty;
            let f = this.el.clearDirty;
            this.el.clearDirty = f ? 0 : 1; */
        };
        return Line;
    }());
    exports["default"] = Line;
});
