!function(){var t=Handlebars.template,n=Handlebars.templates=Handlebars.templates||{};n["@"]=t({compiler:[7,">= 4.0.0"],main:function(t,n,a,l,e){return"//"},useData:!0}),n.credrow=t({compiler:[7,">= 4.0.0"],main:function(t,n,a,l,e){var r;return'<tr>\r\n\t<td><input class="uk-input" type="text" value="'+t.escapeExpression((r=null!=(r=a.text||(null!=n?n.text:n))?r:a.helperMissing,"function"==typeof r?r.call(null!=n?n:{},{name:"text",hash:{},data:e}):r))+'" placeholder="Type here..."/ data-input></td>\r\n\t<td><button class="uk-button uk-button-danger uk-button-small" type="button" data-delete>Delete</button></td>\r\n</tr>'},useData:!0}),n.ctxempty=t({compiler:[7,">= 4.0.0"],main:function(t,n,a,l,e){return'<div class="ctxmenu_wrap">\r\n\t<ul class="uk-list">\r\n\t\t<li><a href="#modal_traceroute" uk-toggle><span uk-icon="icon: bolt; ratio: 0.8;"></span> Traceroute</a></li>\r\n\t\t<li><a href="#modal_discovery" uk-toggle><span uk-icon="icon: server; ratio: 0.8;"></span> Discovery</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: cog; ratio: 0.8;"></span> Settings</a></li>\r\n\t</ul>\r\n</div>'},useData:!0}),n.ctxlink=t({compiler:[7,">= 4.0.0"],main:function(t,n,a,l,e){return'<div class="ctxmenu_wrap" style="left: 500px">\r\n\t<ul class="uk-list">\r\n\t\t<li><a class=""><span uk-icon="icon: push; ratio: 0.8;"></span> Highlight Source</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: pull; ratio: 0.8;"></span> Highlight Destination</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: close; ratio: 0.8;"></span> Clear All Highlights</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: info; ratio: 0.8;"></span> Info</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: calendar; ratio: 0.8;"></span> Properties</a></li>\r\n\t</ul>\r\n</div>'},useData:!0}),n.ctxnode=t({compiler:[7,">= 4.0.0"],main:function(t,n,a,l,e){return'<div class="ctxmenu_wrap" style="left: 200px">\r\n\t<ul class="uk-list">\r\n\t\t<li><a class=""><span uk-icon="icon: social; ratio: 0.8;"></span> Highlight Links</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: thumbnails; ratio: 0.8;"></span> Highlight Nodes</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: world; ratio: 0.8;"></span> Highlight Nodes and Links</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: close; ratio: 0.8;"></span> Clear All Highlights</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: info; ratio: 0.8;"></span> Info</a></li>\r\n\t\t<li><a class=""><span uk-icon="icon: calendar; ratio: 0.8;"></span> Properties</a></li>\r\n\t</ul>\r\n</div>'},useData:!0}),n.nodepopup=t({compiler:[7,">= 4.0.0"],main:function(t,n,a,l,e){var r,i=null!=n?n:{},s=a.helperMissing,o="function",u=t.escapeExpression;return'<table class="uk-table">\r\n\t<tr>\r\n\t\t<th>Node Name:</th>\r\n\t\t<td>'+u((r=null!=(r=a.name||(null!=n?n.name:n))?r:s,typeof r===o?r.call(i,{name:"name",hash:{},data:e}):r))+"</td>\r\n\t</tr>\r\n\t<tr>\t\r\n\t\t<th>Node Id:</th>\r\n\t\t<td>"+u((r=null!=(r=a.id||(null!=n?n.id:n))?r:s,typeof r===o?r.call(i,{name:"id",hash:{},data:e}):r))+"</td>\r\n\t</tr>\r\n\t<tr>\t\r\n\t\t<th>IP Management:</th>\r\n\t\t<td>"+u((r=null!=(r=a.ipManagement||(null!=n?n.ipManagement:n))?r:s,typeof r===o?r.call(i,{name:"ipManagement",hash:{},data:e}):r))+"</td>\r\n\t</tr>\r\n\t<tr>\t\r\n\t\t<th>Last Seen:</th>\r\n\t\t<td>"+u((r=null!=(r=a.lastSeen||(null!=n?n.lastSeen:n))?r:s,typeof r===o?r.call(i,{name:"lastSeen",hash:{},data:e}):r))+"</td>\r\n\t</tr>\r\n\t<tr>\t\r\n\t\t<th>Serial:</th>\r\n\t\t<td>"+u((r=null!=(r=a.serial||(null!=n?n.serial:n))?r:s,typeof r===o?r.call(i,{name:"serial",hash:{},data:e}):r))+"</td>\r\n\t</tr>\r\n\t<tr>\t\r\n\t\t<th>Manufacturer:</th>\r\n\t\t<td>"+u((r=null!=(r=a.manufacturer||(null!=n?n.manufacturer:n))?r:s,typeof r===o?r.call(i,{name:"manufacturer",hash:{},data:e}):r))+"</td>\r\n\t</tr>\r\n\t<tr>\t\r\n\t\t<th>Model:</th>\r\n\t\t<td>"+u((r=null!=(r=a.model||(null!=n?n.model:n))?r:s,typeof r===o?r.call(i,{name:"model",hash:{},data:e}):r))+"</td>\r\n\t</tr>\r\n</table>"},useData:!0}),n["reza - Copy"]=t({compiler:[7,">= 4.0.0"],main:function(t,n,a,l,e){var r;return"<tr>\r\n\t<td>"+t.escapeExpression((r=null!=(r=a.text||(null!=n?n.text:n))?r:a.helperMissing,"function"==typeof r?r.call(null!=n?n:{},{name:"text",hash:{},data:e}):r))+'</td>\r\n\t<td><button class="uk-button uk-button-danger uk-button-small" type="button">Delete</td> aa\r\n</tr>'},useData:!0}),n.reza=t({compiler:[7,">= 4.0.0"],main:function(t,n,a,l,e){var r;return"<tr>\r\n\t<td>"+t.escapeExpression((r=null!=(r=a.text||(null!=n?n.text:n))?r:a.helperMissing,"function"==typeof r?r.call(null!=n?n:{},{name:"text",hash:{},data:e}):r))+'</td>\r\n\t<td><button class="uk-button uk-button-danger uk-button-small" type="button">Delete</td>\r\n</tr>'},useData:!0})}();