define(["require", "exports", "./map/index"], function (require, exports, px) {
    "use strict";
    exports.__esModule = true;
    function beforeReady() {
    }
    exports.beforeReady = beforeReady;
    function onReady() {
        var container = document.getElementById("map");
        var map = new px.Map({
            container: container
        });
    }
    exports.onReady = onReady;
});
