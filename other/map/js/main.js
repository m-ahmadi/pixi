"use strict";
require.config({
    baseUrl: "js/"
});
require(["./page"], function (page) {
    page.beforeReady();
    $(function () {
        page.onReady();
    });
});
