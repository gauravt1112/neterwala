var PRODUCT = {
	id:null,
	collection:'',
	collectionID:null,
	url:'',
	json:null,
	name:'',
	currImg:0,
	numImg:0,
	isFirstImg:true,
	isAnimating:false,
	spinTimeout:null,
	infoOpen:false
}


PRODUCT.init = function(){
	$(window).resize(function() {
  		PRODUCT.doResize();
	})
	PRODUCT.getQuickMenu();
	PRODUCT.addActions();
}

PRODUCT.reset = function(){
	PRODUCT.currImg = 0;
	PRODUCT.isFirstImg = true;
	PRODUCT.closeQuickMenu();
	$('#product-info').hide();
	//$('#product-gallery').empty();
}

PRODUCT.addActions = function(){

	/*** image info ***/
	$('#product-info-opener').on('click', function(){
		PRODUCT.infoOpen = true;
		var wW = $(window).width();
		var pos = $('#prod-menu-opener').offset().left + $('#prod-menu-opener').width();
		if(wW-pos < 250){
			pos = wW/2;
		}
		if(wW-pos > 300){
			pos = wW-300;
		}
		if(wW <= 568){
			pos = 0;
		}
		$('#product-info').stop().css({'left':wW, 'width':wW-pos}).show().animate({'left':pos}, 600, 'easeOutQuart');
		$(this).stop().animate({'right':-100}, 200, function(){
			$(this).hide();
		});
		$('#prod-img-nav').hide();
	})
	$('#product-info-closer').on('click', function(){
		PRODUCT.infoOpen = false;
		var wW = $(window).width();
		$('#product-info').stop().animate({'left':wW}, 600, 'easeOutQuart', function(){
			$(this).hide();
			
		});
		$('#product-info-opener').stop().css({'right':-100}).show().animate({'right':0}, 200, 'easeOutQuart');
		if(PRODUCT.numImg > 1){
			$('#prod-img-nav').show();		
		}
	})
	
	/*** image navigation ***/
	$('#prod-img-nav .next').on('click', function(){
		if($(this).hasClass('disabled') || PRODUCT.isAnimating){
			return;
		}
		PRODUCT.galleryNav(PRODUCT.currImg+1);
	})
	$('#prod-img-nav .prev').on('click', function(){
		if($(this).hasClass('disabled') || PRODUCT.isAnimating){
			return;
		}
		PRODUCT.galleryNav(PRODUCT.currImg-1);
	})
	
	$('#prod-img-nav .next').on('mouseenter', function(){
		if($(this).hasClass('disabled')){
			return;
		}
		$(this).attr('src', 'img/develop/next-roll.png');
	})
	$('#prod-img-nav .next').on('mouseleave', function(){
		$(this).attr('src', 'img/develop/next.png');
	})
	$('#prod-img-nav .prev').on('mouseenter', function(){
		if($(this).hasClass('disabled')){
			return;
		}
		$(this).attr('src', 'img/develop/prev-roll.png');
	})
	$('#prod-img-nav .prev').on('mouseleave', function(){
		$(this).attr('src', 'img/develop/prev.png');
	});
	
	 $('#product-gallery')
        .mousewheel(function(event, delta, deltaX, deltaY) {
            if (delta > 0){
	           $('#prod-img-nav .prev').trigger('click');
            } else {
	            $('#prod-img-nav .next').trigger('click');
            }
    });
    $("#product-gallery").touchwipe({
	     wipeUp: function() { 
	     	$('#prod-img-nav .prev').trigger('click');
	     },
	     wipeDown: function() { 
	     	$('#prod-img-nav .next').trigger('click');
	     },
	     min_move_x: 20,
	     min_move_y: 20,
	     preventDefaultEvents: true
	});

	
	/**** QUICK MENU ***/
	$('#prod-menu-opener').on('click', function(){
		PRODUCT.openQuickMenu();
	})
	$('#prod-menu-closer').on('click', function(){
		PRODUCT.closeQuickMenu();
	})
	
}


PRODUCT.openQuickMenu = function(){	
	
	var wW = $(window).width();
	$('#prod-menu').css({'bottom':-180}).show().animate({'bottom':0}, 600, 'easeOutQuart', function(){
	
	});
	$('#prod-menu .main-nav').css({'bottom':0});
	$('#product-info-opener').stop().animate({'right':-100}, 600, 'easeOutQuart');
	$('#product-info').stop().animate({'left':wW}, 600, 'easeOutQuart', function(){
			$(this).hide();
	})
	$('#prod-img-nav').hide();
	$('#prod-img-counter').hide();
	$('#prod-menu-opener').stop().animate({'bottom':-100},  600, 'easeOutQuart');
	$(window).trigger('resize');
}
PRODUCT.closeQuickMenu = function(){
	var wW = $(window).width();
	$('#prod-menu').animate({'bottom':-180}, 600, 'easeOutQuart', function(){
		$(this).hide();
	})
	$('#product-info-opener').stop().css({'right':-100}).show().animate({'right':0}, 600, 'easeOutQuart');
	$('#prod-img-nav').show();
	if(wW > 568){
		$('#prod-img-counter').show();
	}
	$('#prod-menu-opener').stop().animate({'bottom':0},  600, 'easeOutQuart');
}
PRODUCT.getQuickMenu = function(){
	$.ajax({
 		type:"get",
 		dataType:"json",
 		url:"ajax_prodotti_menu.php",
 		data:{
     		id:1
 		},
 		async:true,
 		success:function(json){
 			//types
 			var typeBlock = $('<div class="link-block type"></div>');
 			var type="";
 			for(i=0; i<json.items.length; i++){
	 			if(type!=json.items[i].type_url){
	 				if(type!=''){
		 				$(typeBlock).append('<span> / </span>');
	 				}
		 			type=json.items[i].type_url;
		 			$(typeBlock).append('<a href="" data-id="' + json.items[i].type_id + '">' + json.items[i].type_name.toUpperCase() + '</a>');
	 			}
 			}
 			$('#night-quick-menu').append($(typeBlock));
 			
 			//subtypes
 			var subTypeBlock = $('<div class="link-block subtype" data-type-id=""></div>');
 			var subType="";
 			for(i=0; i<json.items.length; i++){
 				if(subType!=json.items[i].subtype_name){
	 				if(subType!='' && json.items[i].subtype_name != null){
		 				$(subTypeBlock).append('<span> / </span>');
	 				}
	 				
	 				if(json.items[i].subtype_name!=null){
		 				subType=json.items[i].subtype_name;
		 				$(subTypeBlock).append('<a href="" data-id="' + json.items[i].subtype_id + '">' + subType.toUpperCase() + '</a>');
		 				$(subTypeBlock).attr('data-type-id', json.items[i].type_id);
		 			}
	 			}
 			}
 			$('#night-quick-menu').append($(subTypeBlock));
 			
 			//products
 			var prodBlock='';
 			type="";
 			subType="";
 			var url='';
 			var newBlock = false;
 			for(i=0; i<json.items.length; i++){
 				newBlock = false;
	 			if(type!=json.items[i].type_url){
	 				type=json.items[i].type_url;
	 				newBlock = true;
	 			}
	 			if(subType!=json.items[i].subtype_name && json.items[i].subtype_name!=null){
		 			subType=json.items[i].subtype_name;
		 			newBlock = true;
	 			}
	 			if(newBlock){
		 			$('#night-quick-menu').append($(prodBlock));
		 			prodBlock = $('<div class="link-block prod" data-type-id="' + json.items[i].type_id + '" data-subtype-id="' + json.items[i].subtype_id + '"></div>');
	 			}
	 			//url = "/collection/emotional-night/" + json.items[i].type_url + '/' + json.items[i].url;
	 			url = "/collection/emotional-night/" + json.items[i].url;
	 			if(!newBlock){
		 			$(prodBlock).append(' / ');
	 			}
	 			$(prodBlock).append('<a href="' + url + '" data-url="' + json.items[i].url + '">' + json.items[i].name + '</a>');
 			}
 			$('#night-quick-menu').append($(prodBlock));
 			$('#night-quick-menu .prod a').address();
 			
 			//add actions and hide relevant blocks
 			$('#night-quick-menu .subtype').hide();
 			$('#night-quick-menu .prod').hide();
 			$('#night-quick-menu .type a').on('click', function(e){
	 			e.preventDefault();
	 			$(this).removeClass('off').siblings().addClass('off');
	 			var found = false;
	 			var id = $(this).attr('data-id');
	 			$('#night-quick-menu .subtype').hide()
	 			$('#night-quick-menu .prod').hide()
	 			$('#night-quick-menu .subtype').each(function(){
	 				if($(this).attr('data-type-id') == id){
			 			$(this).fadeTo(300, 1);
			 			found=true;
		 			}
	 			})
	 			if(!found){
		 			$('#night-quick-menu .prod').each(function(){
		 				if($(this).attr('data-type-id') == id){
				 			$(this).fadeTo(300, 1);
				 			found=true;
			 			}
		 			})
	 			}
 			});
 			
 			$('#night-quick-menu .subtype a').on('click', function(e){
	 			e.preventDefault();
	 			$(this).removeClass('off').siblings().addClass('off');
	 			var id = $(this).attr('data-id');
	 			$('#night-quick-menu .prod').hide()
	 			
 				$('#night-quick-menu .prod').each(function(){
	 				if($(this).attr('data-subtype-id') == id){
			 			$(this).fadeTo(300, 1);
		 			}
	 			})
	 			
 			});
 			
			PRODUCT.highlightQuickMenu();
 			
 		},
 		error:function(e){
     		//console.log("error: " + e);
 		}
 	})
}

PRODUCT.highlightQuickMenu = function(){
	var typeID = null;
	var subTypeID = null;
	$('.link-block.subtype').hide();
	$('#night-quick-menu .link-block.prod').hide();
	$('.link-block.prod a').each(function(){
		$(this).removeClass('selected');
		if(PRODUCT.url == $(this).attr('data-url')){
			$(this).addClass('selected');
			$(this).parent().show();
			typeID = $(this).parent().attr('data-type-id');
			subTypeID = $(this).parent().attr('data-subtype-id');
		}
	})
	$('.link-block.type a').each(function(){
		$(this).removeClass('selected');
		$(this).removeClass('off');
		if(typeID == $(this).attr('data-id')){
			$(this).addClass('selected').removeClass('off');
		}
	})
	$('.link-block.subtype a').each(function(){
		$(this).removeClass('selected');
		$(this).removeClass('off');
		if(subTypeID == $(this).attr('data-id')){
			$(this).parent().show();
			$(this).addClass('selected').removeClass('off');
		}
	})
}

PRODUCT.getProduct = function(productURL, collID){
	var wW = window.innerWidth ? window.innerWidth : $(window).width();		
	
	PRODUCT.reset();
	PRODUCT.url = productURL;
	PRODUCT.collectionID = collID;
	$.ajax({
 		type:"get",
 		dataType:"json",
 		url:"ajax_prodotto.php",
 		data:{
     		url:productURL
 		},
 		async:true,
 		success:function(json){
 			PRODUCT.json = json;
 			PRODUCT.name = json.items[0].name;
 			PRODUCT.id = json.items[0].id;
 			PRODUCT.numImg = json.items.length;
 			PRODUCT.numImg == 1?$('#prod-img-nav').hide():$('#prod-img-nav').show();
 			$('#product-name h1').text(PRODUCT.name);
 			COLLECTION.nav('product');
 			PRODUCT.galleryNav(0);
 			
 			
 		},
 		error:function(e){
     		//console.log("error: " + e);
 		}
 	})
 	PRODUCT.highlightQuickMenu();
	
}


PRODUCT.galleryNav = function(index){
	if(PRODUCT.isAnimating){
		return;
	}
	PRODUCT.startSpinner();
	PRODUCT.isAnimating = true;
	var wH = window.innerHeight ? window.innerHeight :$(window).height();
	var wW = window.innerWidth ? window.innerWidth :$(window).width();
	var imgPath = 'img/prodotti/location/';
	var targH = wH;
	if(wW <= 568){
		targH -= 80;
		imgPath = 'img/prodotti/location/mobile/';
	}
	if(index == PRODUCT.numImg-1){
		$('#prod-img-nav .next').addClass('disabled');
	}else{
		$('#prod-img-nav .next').removeClass('disabled');
	}
	if(index==0){
		$('#prod-img-nav .prev').addClass('disabled');
	}else{
		$('#prod-img-nav .prev').removeClass('disabled');
	}
	var dir = index-PRODUCT.currImg;
	
	PRODUCT.currImg = index;
	var img = new Image();
	var holderDiv = $('<div></div>');
	$(holderDiv).hide()
		.appendTo($('#product-gallery'));
		
	$(img).load(function(){
		$('#prod-img-counter').html((PRODUCT.currImg+1) + ' / ' + PRODUCT.numImg);
		PRODUCT.resizeImg($(this));
		PRODUCT.stopSpinner();
		if(PRODUCT.isFirstImg){
			$(this).parent().fadeTo(1000, 1, function(){
				$(this).siblings().remove();
				PRODUCT.isAnimating = false;
			});
			PRODUCT.isFirstImg = false;
		}else{
			$(this).parent().css({'top':targH*dir}).show();
			$('#product-gallery div').eq(0).animate({'top':-targH*dir}, 1000, 'easeOutQuart');
			$(this).parent().animate({'top':0}, 1000, 'easeOutQuart', function(){
				$(this).siblings().remove();
				PRODUCT.isAnimating = false;
				
			});
			
		}
		
		PRODUCT.writeGalleryInfo();
		
	}).attr('src', imgPath + PRODUCT.json.items[PRODUCT.currImg].id + '_' + PRODUCT.json.items[PRODUCT.currImg].img_id + '.jpg')
	.appendTo(holderDiv);
}

PRODUCT.writeGalleryInfo = function(){
	$('#product-text').empty().scrollTop(0).html(PRODUCT.json.items[PRODUCT.currImg].img_text);
	$('#product-info-opener h2').empty().html(PRODUCT.json.items[PRODUCT.currImg].name + ' /');
	$('#product-info-closer h2').empty().html(PRODUCT.json.items[PRODUCT.currImg].name + ' /');
}

PRODUCT.startSpinner = function(){
	$("#product-loader").show();
	PRODUCT.spinTimeout = setTimeout("PRODUCT.spinLoader()", 100);
}

PRODUCT.stopSpinner = function(){
	PRODUCT.spinTimeout = clearTimeout(PRODUCT.spinTimeout);
	$("#product-loader").hide();
}


PRODUCT.spinLoader = function(){
	var bgPos = $('#product-loader').css('background-position');
	var posArray = bgPos.split('px');
	var pos = parseInt(posArray[1]);
	var newBgPos = pos-40;
	if(newBgPos < -400){
		newBgPos = 0;
	}
	$('#product-loader').css({'background-position': '0px ' + newBgPos+'px'});
	PRODUCT.spinTimeout = setTimeout("PRODUCT.spinLoader()", 100);
}

PRODUCT.doResize = function(){
	var wH = window.innerHeight ? window.innerHeight :$(window).height();
	var wW = window.innerWidth ? window.innerWidth : $(window).width();
	
	if(wW < 568){
		var w = wW-33;
		$('#product-gallery').css({'width':w, 'height':wH-80});
		$('#product-gallery div').css({'width':w, 'height':w*.66});
		$('#prod-img-nav').css({'height':wH-60});
	}else{
		$('#product-gallery').css({'width':'100%', 'height':'100%'});
		$('#product-gallery div').css({'width':'100%', 'height':'100%'});
		$('#prod-img-nav').css({'height':'auto'});
	}
	
	$('#product-gallery img').each(function(){
		PRODUCT.resizeImg($(this));
	})
	$('#product-info').css({'height':wH-80});
	$('#product-info-opener').css({'height':wH-80});
	$('#product-text').css({'height':wH-129});
	
	if(PRODUCT.infoOpen){
		var pos = wW;
		if(wW-pos < 250){
			pos = wW/2;
		}
		if(wW-pos > 300){
			pos = wW-300;
		}
		if(wW < 568){
			pos = 0;
		}
		$('#product-info').css({'left':pos,'width':wW-pos});
	}
	
	
}

PRODUCT.resizeImg = function(elem){
	var wH = window.innerHeight ? window.innerHeight : $(window).height();		
	var wW = window.innerWidth ? window.innerWidth : $(window).width();		
	var imgWidth = 1500;				// original dimensions of img
	var imgHeight = 1000;
	var minHeight = 100;			// min display dimensions
	var minWidth = 100;	
	var targetHeight = wH;
	var targetWidth = wW
	var winH = targetHeight;
	
	if(wW < 568){
		targetWidth = wW - 33;
		targetHeight = wH - 80;
	}
	
	var ratio = 0;
	var targetImgHeight;
	var targetImgWidth;
		
	// make sure it fits the minimum
	if(targetHeight < minHeight){
		targetHeight = minHeight;	
	}
	if(targetWidth < minWidth){
		targetWidth = minWidth;
	}
		
	
	if((targetHeight > targetWidth)){		// height commands
		ratio = imgWidth/imgHeight;					
		targetImgHeight = targetHeight;
		targetImgWidth = targetImgHeight*ratio;
	}else{
		ratio = imgHeight/imgWidth;
		targetImgWidth = targetWidth;
		targetImgHeight = targetImgWidth*ratio;
		if(targetImgHeight <  winH){
			ratio = imgWidth/imgHeight;
			targetImgHeight = winH;
			targetImgWidth = targetImgHeight*ratio;
		}
	}
	
	var imgMarginTop = -(targetImgHeight - targetHeight)/2
	var imgMarginLeft = -(targetImgWidth - targetWidth)/2;
	elem.css({'height' : targetImgHeight, 'width' : targetImgWidth, 'marginTop' : imgMarginTop, 'marginLeft' : imgMarginLeft}); };
