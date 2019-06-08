var COLLECTION = {
	id:null,
	collection:'',
	type:'',
	counter:0,
	section:'collections'
}


COLLECTION.init = function(){
	$(window).resize(function() {
  		COLLECTION.doResize();
	})
	COLLECTION.addActions();
	COLLECTION.reset();
	//set backgrounds of #coll section
	var rand_night = Math.floor(Math.random()*12)+1;
	var rand_day = Math.floor(Math.random()*12)+1;
	$('#emotional-night .bg').hide()
		.css({'background-image':'url(img/backgrounds/night/night_' + rand_night + '.jpg)'})
		.fadeTo(1000, 1);
	$('#emotional-day .bg').hide()
		.css({'background-image':'url(img/backgrounds/day/day_' + rand_day + '.jpg)'})
		.fadeTo(1000, 1);
}

COLLECTION.addActions = function(){
	$('.coll-menu a').on('click', function(){
		$('.coll-type-menu a').removeClass('selected');
	});
	$('.coll-menu .emotional-back').on('click', function(e){
		e.preventDefault();
		if(COLLECTION.id==1){
			$('.coll-menu .emotional-night').trigger('click');
		}else{
			$('.coll-menu .emotional-day').trigger('click');
		}
	})
}

COLLECTION.reset = function(){
	var wW = $(window).width();
	
	
	$('#coll').css({'left':0});
	$('#type').css({'left':wW});
	$('#product-name').css({'left':wW*2});
	$('#product').css({'left':wW*3});
	
	COLLECTION.section='collections';
	
}

COLLECTION.nav = function(whereTo){
	COLLECTION.section = whereTo;
	var wW = $(window).width();
	switch(whereTo){
		case "collections":
			$('#coll').animate({'left':0}, 600, 'easeOutQuart');
			$('#type').animate({'left':wW}, 600, 'easeOutQuart');
			$('#product-name').animate({'left':wW*2}, 600, 'easeOutQuart');
			$('#product').animate({'left':wW*3}, 600, 'easeOutQuart');
			if(wW > 568){
				PO.animNav('in');
			}
			break;
		case "type":
		case "finishings":
		case "internal-finishings":
		case "accessories":
			$('#coll').animate({'left':-wW}, 600, 'easeOutQuart');
			$('#type').animate({'left':0}, 600, 'easeOutQuart');
			$('#product-name').animate({'left':wW}, 600, 'easeOutQuart');
			$('#product').animate({'left':wW*2}, 600, 'easeOutQuart');
			if(wW > 568){
				PO.animNav('in');
			}
			break;
		case "product":
			$('#coll').animate({'left':-wW*2}, 600, 'easeOutQuart');
			$('#type').animate({'left':-wW}, 600, 'easeOutQuart');
			$('#product-name').animate({'left':0}, 600, 'easeOutQuart', function(){
				$('#coll').delay(500).animate({'left':-wW*3}, 600, 'easeOutQuart');
				$('#type').delay(500).animate({'left':-wW*2}, 600, 'easeOutQuart');
				$('#product-name').delay(500).animate({'left':-wW}, 600, 'easeOutQuart');
				$('#product').delay(500).animate({'left':0}, 600, 'easeOutQuart');
			});
			$('#product').animate({'left':wW}, 600, 'easeOutQuart');
			PO.animNav('out');
			break;
	}
}

/*** navigate to the emotional day / emotional night page ***/
COLLECTION.showChoice = function(){
	COLLECTION.nav('collections');
}

COLLECTION.setCollection = function(id){
	COLLECTION.id = id;
	if(COLLECTION.id==1){
		COLLECTION.collection = "emotional-night";
		$('.coll-type-menu.emotional-night').show();
		$('.coll-type-menu.emotional-day').hide();
	}else{
		COLLECTION.collection = "emotional-day";
		$('.coll-type-menu.emotional-night').hide();
		$('.coll-type-menu.emotional-day').show();
	}
	$('.coll-menu a').each(function(){
		if($(this).hasClass(COLLECTION.collection)){
			$(this).addClass('selected');
		}else{
			$(this).removeClass('selected');
		}
	});
}

/*** navigate to a chosen collection ***/
COLLECTION.getType = function(collection, type){
	var wW = $(window).width();
	PO.startSpinner();
	if(type!='' && type!=undefined){
		COLLECTION.type = type;
	}else{
		COLLECTION.type='';
	}

	switch(type){
		case 'accessories':
			COLLECTION.getAccessories();
			break;
		case 'finishings':
			COLLECTION.getFinishings();
			break;
		case 'internal-finishings':
			COLLECTION.getInternalFinishings();
			break;
		default:
			if(collection=='emotional-night' && type==''){
				//COLLECTION.type='wardrobes';				// default, first collection
			}
			COLLECTION.getTypeList();
			COLLECTION.getProductList();
	}
	
	$('.coll-type-menu.' + COLLECTION.collection + ' a').each(function(){
		if($(this).attr('data-id') == COLLECTION.type){
			$(this).addClass('selected').siblings().removeClass('selected');
		}
	})
}

COLLECTION.checkSubScroll = function(){
	var currSection='';
	$('.product-spacer').each(function(){
		if($(this).offset().top <=100){
			currSection = $(this).attr('id');
		}
		
	});
	//current section
	$('#product-submenu a').each(function(){
		if($(this).attr('data-target')=='#'+currSection){
			$(this).addClass('selected').siblings().removeClass('selected');
		}	
	})
}

/*** get filters ***/
COLLECTION.getTypeList = function(){
	var wW = $(window).width();
	var paramList = {id:COLLECTION.id};
	$.ajax({
 		type:"get",
 		dataType:"json",
 		url:"ajax_tipologie.php",
 		data:paramList,
 		async:true,
 		success:function(json){
 			
 			if(json.items.length == 0){
	 			$('#product-submenu a').fadeTo(300, 0, function(){
		 			$('#product-submenu').empty();
	 			});
	 			$('#product-scroll-wrapper').off('scroll', COLLECTION.checkSubScroll);
 			}else{
 				$('#product-submenu').empty();
 				$('#product-scroll-wrapper').on('scroll', COLLECTION.checkSubScroll);
	 			for(i=0; i<json.items.length; i++){
	 				var url = 'collection/' + COLLECTION.collection + '/' + json.items[i].url;
	 				//var button = $('<a href="' + url + '">' + json.items[i].name.toUpperCase() + '</a>');
	 				var button = $('<a href="#" data-target="#block-' + json.items[i].url + '">' + json.items[i].name.toUpperCase() + '</a>');
	 				$(button).css({'opacity':0});
	 				if(i==0){
		 				button.addClass('selected');
	 				}
	 				$('#product-submenu').append(button);
	 			}
	 			//$('#product-submenu a').address();
	 			$('#product-submenu a').on('click', function(e){
		 			e.preventDefault();
		 			$('#product-scroll-wrapper').scrollTo($(this).attr('data-target'), 400, {'easing':'easeOutQuart'});
		 		});
	 			$('#product-submenu').show();
	 			$('#product-submenu a').fadeTo(300, 1, function(){	
	 				COLLECTION.doResize();
	 			});
	 			COLLECTION.doResize();
 			}
 			
 			
 		},
 		error:function(e){
     		//console.log("error reading types: " + e);
 		}
 	})
}

/*** get list of products and preview images ***/
COLLECTION.getProductList = function(){
	COLLECTION.showHideBack(false);
	var paramList = {id:COLLECTION.id};
	if(COLLECTION.type != undefined && COLLECTION.type != ''){
		paramList.type = COLLECTION.type;
	}
	$.ajax({
 		type:"get",
 		dataType:"json",
 		url:"ajax_prodotti.php",
 		data:paramList,
 		async:true,
 		success:function(json){
 			COLLECTION.createPreviews(json)
 		},
 		error:function(e){
     		//console.log("error: " + e);
 		}
 	})
	
}

/*** create the previews ***/
COLLECTION.createPreviews = function(json){
	PO.stopSpinner();
	$('#product-previews').empty();
	var className="";
	var subtype_name = "";
	var totImages = json.items.length;
	var numImagesLoaded = 0;
	var type='';
	var counter=0;
	for(i=0; i<json.items.length; i++){
		if(type!=json.items[i].type_name){
			//start a new block
			counter=0;
			type = json.items[i].type_name;		
			var showType='';
			if(type!=null){
				showType =  type.toUpperCase();
			}
		
			//var header = '<h2>' + type.toLowerCase() + '</h2>';
			$('<div class="product-spacer" id="block-' + json.items[i].type_url + '">' + showType + '</div>').hide().appendTo($('#product-previews'));
		}else{
			counter++;
		}
		if(counter%2==0){
			className="prod left";
		}else{
			className="prod right";
		}
		if(COLLECTION.collection==1){
			className+=' night';
		}else{
			className+=' day';
		}
		
		if(json.items[i].subtype_name != subtype_name && json.items[i].subtype_name!="" && json.items[i].subtype_name!=null){
			subtype_name = json.items[i].subtype_name;
			var header = '<h3>' + subtype_name.toLowerCase() + '</h3>';
			$(header).hide().appendTo($('#product-previews'));
		}
		var url = 'collection/' + COLLECTION.collection + '/' + json.items[i].url;
		/*if(COLLECTION.id==1){
			url = 'collection/' + COLLECTION.collection + '/' + json.items[i].type_url + '/' + json.items[i].url;
		}*/
		var prod = $('<a href="' + url + '" class="' + className + '" data-id="' + json.items[i].id + '"><img src="img/prodotti/menu/' + json.items[i].id + '.jpg"><span>' + json.items[i].name + '</span></a>');
		
		$(prod).hide().appendTo($('#product-previews'))
		var img = new Image();
		$(img).load(function(){
			numImagesLoaded++;
			if(numImagesLoaded==totImages){
				COLLECTION.fadeInPreviews();
			}
			
		}).attr('src', 'img/prodotti/menu/' + json.items[i].id + '.jpg')
		
	}
	
	$('#product-previews a').address();
	$('#product-previews').append('<br style="clear:both"><br><br><br>');
	COLLECTION.nav('type');
	COLLECTION.doResize();
}

COLLECTION.fadeInPreviews = function(){
	var d = 200;
	$('#product-previews h3').each(function(){
		$(this).fadeTo(800, 1);
	})
	$('#product-previews .product-spacer').each(function(){
		$(this).fadeTo(800, 1);
	})
	$('#product-previews a').each(function(){
		$(this).delay(d).fadeTo(800, 1);
		d+=200;
	})
	
}

COLLECTION.showHideBack = function(show){
	if(show){
		$('.coll-menu .emotional-back').show();
		$('.coll-menu .emotional-day').hide();
		$('.coll-menu .emotional-night').hide();
	}else{
		$('.coll-menu .emotional-back').hide();
		$('.coll-menu .emotional-day').show();
		$('.coll-menu .emotional-night').show();
	}
}

COLLECTION.getFinishings = function(){
	COLLECTION.showHideBack(true);
	COLLECTION.type = 'finishings';
	var paramList = {id:COLLECTION.id};
	$('#product-submenu').hide();
	COLLECTION.nav('finishings');
	
	
	$.ajax({
 		type:"get",
 		dataType:"json",
 		url:"ajax_finiture.php",
 		data:paramList,
 		async:true,
 		success:function(json){
 			COLLECTION.showFinishings(json);
 		},
 		error:function(e){
     		//console.log("error: " + e);
 		}
 	})
}


COLLECTION.showFinishings = function(json){
	PO.stopSpinner();
	$('#product-previews').empty();//.append('<div class="product-spacer"></div>');
	var section_name = '';
	var wrapperBlock =  $('<div class="fin-block-wrapper"></div>');
	$('#product-previews').append(wrapperBlock);
	var holderBlock = $('<div class="fin-block-holder"></div>');
	for(i=0; i<json.items.length; i++){
		if(section_name != json.items[i].finitura_name){
			if(section_name!=''){
				$(wrapperBlock).append(holderBlock);
			}
			section_name = json.items[i].finitura_name;
			
			holderBlock = $('<div class="fin-block-holder"></div>');
			$(holderBlock).append('<h3>' + section_name.toLowerCase() + '</h3>');
		}
		var block = $('<div class="fin-block"></div>');
		$(block).append('<img src="img/prodotti/finiture/' + json.items[i].finitura_id + '_' + json.items[i].photo_id + '.png">' + json.items[i].photo_testo)
			.css({'opacity':0})
			.delay((20*i)+1000)
			.fadeTo(300,1);
		$(holderBlock).append(block);
	}
	$(wrapperBlock).append(holderBlock);
	COLLECTION.doResize();
}

COLLECTION.getInternalFinishings = function(){
	//var wW = $(window).width();
	COLLECTION.showHideBack(true);
	var paramList = {id:COLLECTION.id};
	$('#product-submenu').hide();
	
	COLLECTION.nav('internal-finishings');
	
	
	$.ajax({
 		type:"get",
 		dataType:"json",
 		url:"ajax_finiture_interne.php",
 		data:paramList,
 		async:true,
 		success:function(json){
 			
 			COLLECTION.showInternalFinishings(json);
 		},
 		error:function(e){
     		//console.log("error: " + e);
 		}
 	})
}

COLLECTION.showInternalFinishings = function(json){
	$('#product-previews').empty();//.append('<div class="product-spacer"></div>');
	var finitura_name = '';
	var holderBlock = $('<div id="int-fin-block-holder"></div>');
	COLLECTION.counter = 0;
	for(i=0; i<json.items.length; i++){
		var block = $('<div class="int-fin-block"></div>');
		$(block).append('<img src="img/prodotti/finiture_interne/' + json.items[i].finitura_id + '_' + json.items[i].photo_id + '.jpg"><div class="int-fin-text">' + json.items[i].photo_testo + '</div>')
			.hide();
		$(holderBlock).append(block);
	}
	
	//load the first image
	var firstImg = new Image();
	$(firstImg).load(function(){
		$('.int-fin-block').each(function(){
			$(this).fadeTo(1000,1);
		});
		COLLECTION.doResize();
		PO.stopSpinner();
	}).attr('src', 'img/prodotti/finiture_interne/' + json.items[0].finitura_id + '_' + json.items[0].photo_id + '.jpg')
	
	$('#product-previews').append(holderBlock);
	
	
	COLLECTION.doResize();
}

COLLECTION.getAccessories = function(){
	COLLECTION.showHideBack(true);
	var paramList = {id:COLLECTION.id};
	$('#product-submenu').hide();
	
	COLLECTION.nav('accessories');
	
	$.ajax({
 		type:"get",
 		dataType:"json",
 		url:"ajax_accessories.php",
 		data:paramList,
 		async:true,
 		success:function(json){
 			COLLECTION.showAccessories(json);
 		},
 		error:function(e){
     		//console.log("error: " + e);
 		}
 	})
}

COLLECTION.showAccessories = function(json){
	setTimeout("PO.stopSpinner();", 1500);
	var wW = $(window).width();
	$('#product-previews').empty();//.append('<div class="product-spacer"></div>');
	var section_name = '';
	var holderBlock = $('<div class="accessory-block-holder"></div>');
	for(i=0; i<json.items.length; i++){
		if(section_name != json.items[i].accessorio_name){
			if(section_name!=''){
				$('#product-previews').append(holderBlock);
			}
			section_name = json.items[i].accessorio_name;
			$('#product-previews').append('<h3>' + section_name.toLowerCase() + '</h3>');
			holderBlock = $('<div class="accessory-block-holder"></div>');
		}
		var block = $('<div class="accessory-block"></div>');
		$(block).append('<img src="img/prodotti/accessori/' + json.items[i].accessorio_id + '_' + json.items[i].photo_id + '.jpg"><span>' + json.items[i].photo_testo + '</span>')
			.css({'opacity':0})
			.delay((20*i)+1000)
			.fadeTo(300,1);
		$(holderBlock).append(block);
	}
	$('#product-previews').append(holderBlock);
	
	COLLECTION.doResize();
}

COLLECTION.showProduct = function(productURL){
	PRODUCT.getProduct(productURL, COLLECTION.id);
	if(COLLECTION.collection=='emotional-day'){
		$('#product-name').addClass('day');
		$('#product').addClass('day');
	}else{
		$('#product-name').removeClass('day');
		$('#product').removeClass('day');
	}
	
}

COLLECTION.doResize = function(){
	var wH = window.innerHeight ? window.innerHeight :$(window).height();
	var wW = window.innerWidth ? window.innerWidth : $(window).width();
	
	$('#product-scroll-wrapper').css({'height':wH-$('#product-scroll-wrapper').offset().top});
	//*** snap to the section ***/
	switch(COLLECTION.section){
		case "collections":
			$('#coll').css({'left':0});
			$('#type').css({'left':wW});
			$('#product-name').css({'left':wW*2});
			$('#product').css({'left':wW*3});
			break;
		case "type":
		case "finishings":
		case "internal-finishings":
		case "accessories":
			$('#coll').css({'left':-wW});
			$('#type').css({'left':0});
			$('#product-name').css({'left':wW});
			$('#product').css({'left':wW*2});
			break;
		case "product":
			$('#coll').css({'left':-wW*3});
			$('#type').css({'left':-wW*2});
			$('#product-name').css({'left':-wW});
			$('#product').css({'left':0});
			break;
	}
	
	/*** type-specific resizing ***/
	switch(COLLECTION.type){
		case 'internal-finishings':
			if(wW > 568){
				var t;
				var int_fin_ratio = 900/600;
				var int_fin_inv_ratio = 600/900;
				
				//84%
				var int_fin_targH = wH - 220;
				var int_fin_targW = int_fin_targH*int_fin_ratio;
				//check it's not too wide
				var holderWidth = $('#int-fin-block-holder').width();
				var max = holderWidth - 300;
				if(wW <= 640){
					max = holderWidth - 150;
				}
				if(int_fin_targW > max){
					int_fin_targW = max;
					int_fin_targH = int_fin_targW * int_fin_inv_ratio
				}
				
				$('.int-fin-block img').each(function(){
					$(this).css({'height':int_fin_targH, 'width':int_fin_targW});
					//$(this).parent().find('.int-fin-text').css({'left':$(this).position().left + $(this).width() + 20});
				})
				
				$('.int-fin-block').each(function(){
					$(this).css({'width':$(this).find('img').width()+160});
				})
				
				
				//$('#int-fin-block-holder').stop().scrollTo($('.int-fin-block').eq(COLLECTION.counter));
				
			}else{
				$('.int-fin-block img').css({'width':'60%', 'height':'auto'});
				$('.int-fin-block').css({'width':'100%'});
			}
			
			break;
		case 'finishings':
			if(wW > 320){
				$('.fin-block-holder').css({'width':Math.floor($('.fin-block-wrapper').width()/190)*190});
			}else{
				$('.fin-block-holder').css({'width':'100%'});
			}
			
				break;
		case 'accessories':
			var maxHeight = 280;
			var acc_targH = wH/2 - 50;
			if(acc_targH > maxHeight){
				acc_targH = maxHeight;
			}
			$('.accessory-block img').each(function(){
				$(this).css({'height':acc_targH, 'width':'auto'});
			})
			
	}
	
	if(wW > 568){
		$('#product-submenu').css({'marginLeft':-$('#product-submenu').width()/2});

	}else{
		$('#product-submenu').css({'marginLeft':0});
	}
	
}
