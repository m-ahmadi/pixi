var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function () {
  var t = Handlebars.template,
      n = Handlebars.templates = Handlebars.templates || {};n.credrow = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, l, i) {
      var s;return '<tr>\r\n\t<td><input class="uk-input" type="text" value="' + t.escapeExpression((s = null != (s = a.text || (null != n ? n.text : n)) ? s : a.helperMissing, "function" == typeof s ? s.call(null != n ? n : {}, { name: "text", hash: {}, data: i }) : s)) + '" placeholder="Type here..."/ data-input></td>\r\n\t<td><button class="uk-button uk-button-danger uk-button-small" type="button" data-delete>Delete</button></td>\r\n</tr>';
    }, useData: !0 }), n.ctxempty = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, l, i) {
      return '<div class="ctxmenu_wrap">\r\n\t<ul class="uk-list">\r\n\t\t<li><a href="#modal_traceroute" uk-toggle><span uk-icon="icon: bolt; ratio: 0.8;"></span> Traceroute</a></li>\r\n\t\t<li><a href="#modal_discovery" uk-toggle><span uk-icon="icon: server; ratio: 0.8;"></span> Discovery</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: cog; ratio: 0.8;"></span> Settings</a></li>\r\n\t</ul>\r\n</div>';
    }, useData: !0 }), n.ctxlink = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, l, i) {
      return '<div class="ctxmenu_wrap" style="left: 500px">\r\n\t<ul class="uk-list">\r\n\t\t<li><a class=""><span uk-icon="icon: push; ratio: 0.8;"></span> Highlight Source</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: pull; ratio: 0.8;"></span> Highlight Destination</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: close; ratio: 0.8;"></span> Clear All Highlights</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: info; ratio: 0.8;"></span> Info</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: calendar; ratio: 0.8;"></span> Properties</a></li>\r\n\t</ul>\r\n</div>';
    }, useData: !0 }), n.ctxnode = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, l, i) {
      return '<div class="ctxmenu_wrap" style="left: 200px">\r\n\t<ul class="uk-list">\r\n\t\t<li><a class=""><span uk-icon="icon: social; ratio: 0.8;"></span> Highlight Links</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: thumbnails; ratio: 0.8;"></span> Highlight Nodes</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: world; ratio: 0.8;"></span> Highlight Nodes and Links</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: close; ratio: 0.8;"></span> Clear All Highlights</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: info; ratio: 0.8;"></span> Info</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: calendar; ratio: 0.8;"></span> Properties</a></li>\r\n\t</ul>\r\n</div>';
    }, useData: !0 }), n.nodepopup = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, l, i) {
      var s,
          e = null != n ? n : {},
          r = a.helperMissing,
          o = "function",
          c = t.escapeExpression;return '<table class="uk-table">\r\n\t<tr>\r\n\t\t<th>Node Name</th>\r\n\t\t<th>Node Id</th>\r\n\t</tr>\r\n\t<tr>\r\n\t\t<td>' + c((s = null != (s = a.name || (null != n ? n.name : n)) ? s : r, (typeof s === "undefined" ? "undefined" : _typeof(s)) === o ? s.call(e, { name: "name", hash: {}, data: i }) : s)) + "</td>\r\n\t\t<td>" + c((s = null != (s = a.id || (null != n ? n.id : n)) ? s : r, (typeof s === "undefined" ? "undefined" : _typeof(s)) === o ? s.call(e, { name: "id", hash: {}, data: i }) : s)) + "</td>\r\n\t</tr>\r\n</table>";
    }, useData: !0 }), n.reza = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, l, i) {
      var s;return "<tr>\r\n\t<td>" + t.escapeExpression((s = null != (s = a.text || (null != n ? n.text : n)) ? s : a.helperMissing, "function" == typeof s ? s.call(null != n ? n : {}, { name: "text", hash: {}, data: i }) : s)) + '</td>\r\n\t<td><button class="uk-button uk-button-danger uk-button-small" type="button">Delete</td> aa\r\n</tr>';
    }, useData: !0 });
}();
//# sourceMappingURL=templates.js.map