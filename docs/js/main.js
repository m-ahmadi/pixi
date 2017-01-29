var t;

var a = (function () {

var title, titleTxt,
	defaultPage = 'dependencies',
	defaultCat = 'getting-started';

function getHtml(folder, str) {
	var two = str.charAt(0) + str.charAt(1),
		filename, valid;
	
	if (two === '#!') {
		filename = str.substr(2),
		valid = true;
	} else {
		return;
	}
	
	$.ajax({
		url : 'html/'+folder+'/'+filename + '.htm',
		type : 'GET',
		dataType : 'html',
	})
	.done(function ( data, textStatus, jqXHR ) {
		$('#contents').html(data);
		Prism.highlightAll();
		if ( !sessionStorage[filename] ) {
			sessionStorage[filename] = data;
		}
		
		history.pushState(filename, undefined, "#!"+filename);
		title.text(titleTxt+' | '+folder+' | '+filename);
		
	})
	.fail(function ( data, textStatus, jqXHR ) {
		
	});
}
function adjustHeight() {
	var sidebar = $('#sidebar');
	sidebar.css({ height: window.innerHeight });
}
function findCat(el) {
	var catEl = el.parent().parent().parent().children().first(),
		cat = catEl.text().trim().toLowerCase().split(' ').join('-');
	
	return cat;
}

return {
	get title() { return title },
	set title(v) { title = v; },
	get titleTxt() { return titleTxt },
	set titleTxt(v) { titleTxt = v; },
	get defaultPage() { return defaultPage },
	set defaultPage(v) { defaultPage = v; },
	get defaultCat() { return defaultCat },
	set defaultCat(v) { defaultCat = v; },
	getHtml: getHtml,
	adjustHeight: adjustHeight,
	findCat: findCat
};

}());


$(function () {
	"use strict";
	var url, cat;
	sessionStorage.clear();
	a.title = $('title');
	a.titleTxt = a.title.text();
	
	// $(window).on("popstate", function (e) {
		// console.log(e);
	// });
	a.adjustHeight()
	$( window ).resize(function () {
		a.adjustHeight()
	});
	window.onpopstate = function(e) {
		var contents = sessionStorage[e.state];
		if (contents) {
			$('#contents').html(contents);
		}
		Prism.highlightAll();
	};
	
	url = window.location.href.split('/');
	url = url[url.length-1];
	cat = a.findCat( $('#sidebar [href="'+url+'"]') );
	if (url === '') {
		a.getHtml(a.defaultCat, '#!'+a.defaultPage);
	} else {
		a.getHtml(cat, url);
	}
	
	
	
	$('#sidebar a').on('click', function (e) {
		e.preventDefault();
		var $this = $(this);
		$this.attr('href') === '#home' ? location.replace('/pixi/docs/') : undefined;
		if (e.which !== 1) { return; }
		
		
		
		var href = $this.attr('href'),
			parent = $this.parent(),
			parTag = parent.prop('tagName').toLowerCase,
			parpar = parent.parent(),
			category = a.findCat($this),
			okey = true;
		
		$('#sidebar li a').removeClass('uk-text-primary');
		$this.addClass('uk-text-primary');
		$('#sidebar li').removeClass('uk-active');
		if (parTag === 'li') {
			parent.addClass('uk-active');
		}
		if ( parent.hasClass('uk-parent') &&
				parent.hasClass('uk-open') )  {
			okey = false;
		}
		
		
		if (okey) {
			if ( !parpar.hasClass('uk-nav-sub') ) {
				category = '';
			}
			a.getHtml(category, href);
		}
	});
	
	$('#contents').on('click', 'a.ctn-link', function (e) {
		e.preventDefault();
		var $this = $(this),
			href = $this.attr('href'),
			tarEl;
		
		$('#sidebar li a').removeClass('uk-text-primary');
		$('#sidebar a[href="'+href+'"]').addClass('uk-text-primary');
		a.getHtml(a.findCat( $('#sidebar [href="'+href+'"]') ), href);

		// tarEl = $('#sidebar a[href="#!inheritance"]').parent().parent().find('a[href="'+href+'"]');
		// t.trigger($.Event('click', {which: 1, keyCode: 1}));
	});
});