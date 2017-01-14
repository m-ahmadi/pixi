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

$(function () {
	var url, findCat;
	
	title = $('title');
	titleTxt = title.text();
	
	// $(window).on("popstate", function (e) {
		// console.log(e);
	// });
	adjustHeight()
	$( window ).resize(function () {
		adjustHeight()
	});
	window.onpopstate = function(e) {
		var contents = sessionStorage[e.state];
		if (contents) {
			$('#contents').html(contents);
		}
	};
	
	url = window.location.href.split('/');
	url = url[url.length-1];
	findCat = $('#sidebar [href="'+url+'"]').parent() .parent().parent().children().first().text().trim().toLowerCase().split(' ').join('-');
	if (url === '') {
		getHtml(defaultCat, '#!'+defaultPage);
	} else {
		console.log(url);
		getHtml(
			findCat,
			url
		);
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
			categoryEl = parent.parent().parent().children().first(),
			category = categoryEl.text().trim().toLowerCase().split(' ').join('-'),
			okey = true;
			
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
			console.log(category);
			getHtml(category, href);
		}
	});
	
	$('.ctn-link').on('click', function (e) {
		e.preventDefault();
		var href = $this.attr('href');
		getHtml(href);
	});
	
	
});