var PO = {
	webkit:true,
	FF:false,
	OO:false,
	IE:false,
	iDevice:false,
	iPhone:false,
	currentPage:'home',
	currentPagePos:0,
	backgroundPath:'',
	bgImgArray:null,
	numBGImages:0,
	currBGIndex:0,
	bgInterval:null,
	bgTimeout:6000,
	headerVisible:false,
	prodJSON:null,
	prodNum:0,
	snapTimeout:null,
	spinTimeout:null,
	langTimeout:null,
	lang:'en'
}


PO.init = function(){
	PO.getWebkit();
	PO.getiDevice();
	PO.addActions();
	PO.setUpMenu();
	PO.doResize();
 
	HOME.init();
	COMMERCIAL.init();
	RESIDENTIAL.init();
	CONTRACT.init();
	COLLECTION.init();
	PRODUCT.init();
	NEWS.init();
	AREA_RIS.init();
	
	$(window).resize(function() {
  		PO.doResize();
	}).trigger('resize');
	
	
	if(PO.iPhone){
		setTimeout(function () {
		  window.scrollTo(0, 1);
		}, 1500);
	}
	setTimeout('PO.doResize()', 1000);
	
	$('#profile .section-wrapper').on('scroll', function(){
		//console.log("scroll");
		var wH = window.innerHeight?window.innerHeight:$(window).height();
		$('.profile-block').each(function(){
			//console.log($(this).offset().top);
			if($(this).offset().top < 0 && $(this).offset().top > -200){
				var t = $(this).offset().top;
				$(this).css({'opacity':((200+t))/200});
			}
			if($(this).offset().top > 0 && $(this).offset().top < wH-200){
				$(this).css({'opacity':1});
			}
			if($(this).offset().top > wH-200 && $(this).offset().top < wH){
				var t = wH - $(this).offset().top;
				$(this).css({'opacity':(t/200)});
			}
		})
	});
	
}



PO.getWebkit = function(){
	PO.webkit = true;
	PO.FF = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
	PO.OO = /Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent);
	PO.IE = /MSIE[\/\s](\d+\.\d+)/.test(navigator.userAgent);
	
	if (PO.FF || PO.OO || PO.IE) {
		//test for Firefox and OPERA and IE
		PO.webkit = false;
	}
}

PO.getiDevice = function(){
	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
		PO.iDevice = true
	}
	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
		PO.iPhone = true
	}
	
}

PO.addActions = function(){
	 $('.back').on('click', function(e){
		 e.preventDefault();
		 var a = $.address.pathNames();
		 a.pop();
		 $.address.value(a.join('/'));
	  })
	 
	 /*** bind arrow keys for product gallery ***/
	
	 $(document).keydown(function(e){
	 	if(!PO.section=='collection' && COLLECTION.section=='product'){
		 	return;
	 	}
	 	if (e.keyCode == 38 && !PRODUCT.isAnimating) { 
	       $('#prod-img-nav .prev').trigger('click');
	    }
	    if (e.keyCode == 40) { 
	       $('#prod-img-nav .next').trigger('click');
	    }
	});
	
	$('#langChangeOpener').on('click', function(){
		$('#langOptions').slideToggle();
		$(this).toggleClass('selected');
		clearTimeout(PO.langTimeout);
	})
	$('#langOptions a').on('click', function(e){
		e.preventDefault();
		var baseURL = $.address.baseURL();
		var cleanURL = baseURL.split("?")[0];
		var newURL = cleanURL + '?l=' + $(this).attr('data-id') + '#' + $.address.value();
		
		window.location.href = newURL;
		clearTimeout(PO.langTimeout);
	})
	$('#langOptions').on('mouseleave', function(){
		PO.langTimeout = setTimeout(function(){
			$('#langOptions').slideUp();
			$('#langChangeOpener').removeClass('selected');
		}, 3000);
	})
	
	/*** mobile stuff ***/
	$('.mobile-menu-opener').on('click', function(e){
		e.preventDefault();
		PO.animNav('in');
		$('#langOptions').slideUp();
	})
	$('.mobile-menu-closer').on('click', function(e){
		e.preventDefault();
		PO.animNav('out');
	})
	
	$('.mobile-language-opener').on('click', function(e){
		e.preventDefault();
		$('#langOptions').slideToggle();
		PO.animNav('out');
	})
	$('.mobile-language-closer').on('click', function(e){
		e.preventDefault();
		$('#langOptions').slideUp();
		PO.animNav('out');
	})

}
 

		
// set up the main menu
PO.setUpMenu = function(){
	var wW = window.innerWidth ? window.innerWidth : $(window).width();
	// Document title
    var title = document.title;
    var addressInit = false;
        
    // Serialization utility
    var serialize = function(obj, re) {
        var result = [];
        $.each(obj, function(i, val) {
            if ((re && re.test(i)) || !re)
                result.push(i + ': ' + (typeof val == 'object' ? val.join 
                    ? '\'' + val.join(', ') + '\'' : serialize(val) : '\'' + val + '\''));
        });
        return '{' + result.join(', ') + '}';
    };
        
	$.address.init(function(event) {
		
		/*console.log('init: ' + serialize({
            value: $.address.value(), 
            path: $.address.path(),
            pathNames: $.address.pathNames(),
            parameterNames: $.address.parameterNames(),
            queryString: $.address.queryString()
        }));*/
        addressInit = true;
        $('nav a').address();
    }).bind('change', function(event) {
    	if(!addressInit){
	    	return;
    	}
    	var names = $.map(event.pathNames, function(n) {
            return n.substr(0, 1).toUpperCase() + n.substr(1);
        }).concat(event.parameters.id ? event.parameters.id.split('.') : []);
        
        var links = names.slice();
        //highlight menu
        if(names.length > 0){
	        $('.main-nav a').each(function() {
           	 	$(this).toggleClass('selected', $(this).attr('data-id').toLowerCase() == 'menu-' + names[0].toLowerCase());
           	});
           
           	PO.currentPagePos = $('.main-nav ul li a').index($('ul li a.selected')) + 1;
        }
        
        $.address.title([title].concat(names).join(' | '));
        
        var target=null;		// where to scroll to
        
        
        switch(event.pathNames.length){
	        case 1:
	        	target='#' + event.pathNames[0];
	        	if(event.pathNames[0].indexOf('collection')!=-1){
		        	//COLLECTION.showChoice();
		        	COLLECTION.reset();
	        	}
	        	/*if(event.pathNames[0].indexOf('profile')!=-1){
		        	$("#profile").css("-webkit-overflow-scrolling", "auto");
		        	window.setTimeout(function () { $("#profile").css("-webkit-overflow-scrolling", "touch") }, 100);
	        	}*/
	        	break;
	        case 2:
	        	target='#' + event.pathNames[0];
	        	if(event.pathNames[1].indexOf('emotional')!=-1){
	        		if(event.pathNames[1]=='emotional-night'){
		        		COLLECTION.setCollection(1);
	        		}
	        		if(event.pathNames[1]=='emotional-day'){
		        		COLLECTION.setCollection(2);
	        		}
		        	COLLECTION.getType(event.pathNames[1], '');
	        	}
	        	break;
	        case 3:
	        	target='#' + event.pathNames[0];
	        	switch(event.pathNames[1]){
		        	case 'emotional-night':
		        		COLLECTION.setCollection(1);
		        		//COLLECTION.getType(event.pathNames[1], event.pathNames[2]);
		        		switch(event.pathNames[2]){
			        		case 'finishings':
			        			COLLECTION.getType(event.pathNames[1], event.pathNames[2]);
			        			break;
			        		case 'internal-finishings':
			        			COLLECTION.getType(event.pathNames[1], event.pathNames[2]);
			        			break;	
			        		case 'accessories':
			        			COLLECTION.getType(event.pathNames[1], event.pathNames[2]);
			        			break;
			        		default:
			        			COLLECTION.showProduct(event.pathNames[2]);
			        			break;
		        		}
		        		break;
		        	case 'emotional-day':
		        		COLLECTION.setCollection(2);
		        		switch(event.pathNames[2]){
			        		case 'finishings':
			        			COLLECTION.getType(event.pathNames[1], event.pathNames[2]);
			        			break;	
			        		default:
			        			COLLECTION.showProduct(event.pathNames[2]);
			        			break;
		        		}
			        	break;
		        		
	        	}
	        	break;
	        case 4:
	        	target='#' + event.pathNames[0];
	        	if(event.pathNames[1].indexOf('emotional')!=-1){
	        		if(event.pathNames[1]=='emotional-night'){
		        		COLLECTION.setCollection(1);
	        		}
	        		if(event.pathNames[1]=='emotional-day'){
		        		COLLECTION.setCollection(2);
	        		}
		        	COLLECTION.showProduct(event.pathNames[3]);
	        	}
	        	break;
        }
       
       if(wW > 568){
	       if(PO.currentPage == 'collection' && COLLECTION.section=='product' && event.pathNames[0] != 'collection'){
		       PO.animNav('in');
		      
	       } 
       }else{
	       PO.animNav('out');
       }
      
        if(target!=null){
        	PO.currentPage = event.pathNames[0];
	        $('#page-container').scrollTo($(target), 600, {'easing':'easeOutQuart'});
        }else{
	        $('#page-container').scrollTo($('#home'));
        }
        if(target=='#home' || target == null){
	        HOME.startGallery();
	        PO.animLogo('out');
	    }else{
		   	HOME.stopGallery();
		    PO.animLogo('in');
        }
		
		 if(target=='#residential' || target == null){
	        RESIDENTIAL.startGallery();
	       // PO.animLogo('out');
	    }else{
		   //	RESIDENTIAL.stopGallery();
		    //PO.animLogo('in');
        }
       
	    if(target=='#commercial' || target == null){
	        COMMERCIAL.startGallery();
	       // PO.animLogo('out');
	    }else{
		   	//COMMERCIAL.stopGallery();
		    //PO.animLogo('in');
        }
    });
    
    $.address.update();     
		
	$('#widget .button').on('click', function(e){
	  	e.preventDefault();
	  	var target = $(this).attr('href');
		$('#outer-wrapper').scrollTo($(target), 1200, 'easeInOutExpo');
		$(this).addClass('selected').siblings('.selected').removeClass('selected');
  	})
  	
}

PO.animNav = function(dir){
	if(dir=='in'){
		$('#main-nav .main-nav').show().animate({'bottom':0}, 600, 'easeOutQuart');
	}else{
		$('#main-nav .main-nav').animate({'bottom':-$('#main-nav .main-nav').height()}, 600, 'easeOutQuart');
	}
}
PO.animLogo = function(dir){
	if(dir=='in'){
		$('#main-logo').show().animate({'top':20}, 600, 'easeOutQuart');
	}else{
		$('#main-logo').animate({'top':-100}, 600, 'easeOutQuart');
	}
}
PO.startSpinner = function(){
	$("#loader").show();
	PO.spinTimeout = setTimeout("PO.spinLoader()", 100);
}

PO.stopSpinner = function(){
	PO.spinTimeout = clearTimeout(PO.spinTimeout);
	$("#loader").hide();
}


PO.spinLoader = function(){
	var bgPos = $('#loader').css('background-position');
	var posArray = bgPos.split('px');
	var pos = parseInt(posArray[1]);
	var newBgPos = pos-40;
	if(newBgPos < -400){
		newBgPos = 0;
	}
	$('#loader').css({'background-position': '0px ' + newBgPos+'px'});
	PO.spinTimeout = setTimeout("PO.spinLoader()", 100);
}

PO.reinitScrollPane = function(){
	$('.scroll-pane').each(
		function()
		{
			$(this).jScrollPane(
				{
					showArrows: $(this).is('.arrow')
				}
			);
			var api = $(this).data('jsp');
			var throttleTimeout;
			$(window).bind(
				'resize',
				function()
				{
					if ($.browser.msie) {
						// IE fires multiple resize events while you are dragging the browser window which
						// causes it to crash if you try to update the scrollpane on every one. So we need
						// to throttle it to fire a maximum of once every 50 milliseconds...
						if (!throttleTimeout) {
							throttleTimeout = setTimeout(
								function()
								{
									api.reinitialise();
									throttleTimeout = null;
								},
								50
							);
						}
					} else {
						api.reinitialise();
					}
				}
			);
		}
	)
}

PO.doResize = function(){
	var wH = window.innerHeight ? window.innerHeight :$(window).height();
	var wW = window.innerWidth ? window.innerWidth : $(window).width();
	$('.center').each(function(){
		$(this).css({'marginLeft':-$(this).width()/2});
	});
	
	//snap to section
	if(wW <= 568 || PO.iDevice){
		PO.snapTimeout = setTimeout(function(){
			$('#page-container').stop().scrollTo($('#' + PO.currentPage));
		}, 200)
	}
	
	if(!PO.iDevice){
		$('#page-container').scrollLeft(wW*(PO.currentPagePos));	
	}
	//if(wW <= 568){
//		$('#map_canvas').css({'height':wH - $('#map_canvas').offset().top - 20});
//	}else{
//		$('#map_canvas').css({'height':wH - $('#map_canvas').offset().top - 50})
//	}
	
	PO.reinitScrollPane();
	
	
}
