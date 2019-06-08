var NEWS = {
	id:null,
	path:'img/news/',
	imgArray:[],
	title:''	
}


NEWS.init = function(){
	$(window).resize(function() {
  		NEWS.doResize();
	})
	NEWS.addActions();
	//load first news
	$('#news-list .news-preview').eq(0).trigger('click');
}

NEWS.addActions = function(){
	$('.news-preview').on('click', function(e){
		e.preventDefault();
		NEWS.getNews($(this).attr('data-id'));
	});	
}

NEWS.getNews = function(id){
	NEWS.id = id;
	NEWS.imgArray = [];
	$.ajax({
 		type:"get",
 		dataType:"json",
 		url:"ajax_news_item.php",
 		data:{
     		id:id
 		},
 		async:true,
 		success:function(json){
 			NEWS.imgArray = json.items;
 			NEWS.writeNewsItem(json);
 		},
 		error:function(e){
     		//console.log("error: " + e);
 		}
 	})
}

NEWS.writeNewsItem = function(json){
	if(PO.currentPage=='news'){
		PO.startSpinner();
	}
	NEWS.title = json.title;
	$('#news-item .news-date').html(json.date);
	$('#news-item .news-title').html(json.title.toUpperCase());
	$('#news-item .news-text').html(json.text);
	
	if(json.attachment != ''){
		if(json.attachment_text != ''){
			$('#news-item .download-attach').html(json.attachment_text);
		}else{
			$('#news-item .download-attach').html($('#news-item .download-attach').attr('data-text'));
		}
		$('#news-item .download-attach').attr('href', json.attachment);
		$('#news-item .download-attach').show();
		PO.reinitScrollPane();
	}else{
		$('#news-item .download-attach').hide();
	}
	NEWS.writeGalleryPreview();
	
}

NEWS.writeGalleryPreview = function(){
	if(NEWS.imgArray.length == 0){
		$('#news-gallery').empty();
		$('#news-item .gallery').hide();
		NEWS.doResize();
		PO.stopSpinner();
		return;
	}
	if(NEWS.imgArray.length <= 5){
		NEWS.writeGalleryOnPage();
		return;
	}
	$('#news-item .gallery').show();
	
	$('#news-gallery').empty();
	for(i=0; i<NEWS.imgArray.length; i++){
		var img = new Image();
		var src = NEWS.path + 'thumb/' + NEWS.imgArray[i];
		$(img).load(function(){
			var s = $(this).attr('src');
			var imgWrapper = $('<div class="preview" data-index="' + $(this).attr('data-id') + '"></div>');
			$(imgWrapper)
	    		.hide()
	    		.css({'background-image':'url(' + s + ')'})
	    		.appendTo($('#news-gallery'))
	    		.fadeTo(1500, 0.4, function(){
	    			PO.reinitScrollPane();
		   			$(this).on('mouseenter', function(){
			   			$(this).fadeTo(300, 1);
		   			})
		   			$(this).on('mouseleave', function(){
			   			$(this).fadeTo(300, 0.4);
		   			})
		   			$(this).on('click', function(){
			   			var arr = NEWS.imgArray.slice();
			   			LBOX.openLightBox(arr, NEWS.path + 'zoom/', NEWS.title, $(this).attr('data-index'), '');
			   			
			   			
		   			})
		   			PO.stopSpinner();
		   			
		   			
		   		});
		})
		.attr('data-id', i)
		.attr('src', src);
	}
	
	
}

NEWS.writeGalleryOnPage = function(){
	$('#news-item .gallery').show();
	
	$('#news-gallery').empty();
	for(i=0; i<NEWS.imgArray.length; i++){
		var img = new Image();
		var src = NEWS.path + 'zoom/' + NEWS.imgArray[i];
		$(img).load(function(){
			if($(this).attr('data-id')==NEWS.id){
				
				$(this).appendTo($('#news-gallery')).fadeTo(500,1, function(){
					PO.reinitScrollPane();
				});
				if($(this)[0].naturalWidth > 0){	
					$(this).css({'maxWidth':$(this)[0].naturalWidth})
				}
			}
			PO.stopSpinner();
		})
		.attr('data-id', NEWS.id)
		.hide()
		.addClass('news-img')
		.attr('src', src);
	}
	
}

NEWS.doResize = function(){
	var wH = window.innerHeight ? window.innerHeight :$(window).height();
	var wW = window.innerWidth ? window.innerWidth : $(window).width();
	if(wW <=568){
		$('#news-list').css({'height':wH-$('#news-list').offset().top});
		$('#news-item').css({'height':wH-$('#news-item').offset().top});
	}else{
		$('#news-list').css({'height':wH-$('#news-list').offset().top - 50});
		$('#news-item').css({'height':wH-$('#news-item').offset().top - 50});
	}
	
}

