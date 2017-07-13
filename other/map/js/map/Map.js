define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Map = (function () {
        function Map(conf) {
            this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
                backgroundColor: 0xFF0000,
                antialias: true
            });
            document.body.appendChild(this.renderer.view);
        }
        return Map;
    }());
    exports["default"] = Map;
});
