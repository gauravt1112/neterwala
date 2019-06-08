var COMMERCIAL = {
	imgArray:[],
	currIndex:0,
	path:'img/',
	numImages:0,
	interv:null,
	timeout:6000,
	active:true
}
COMMERCIAL.init = function(){
	COMMERCIAL.imgArray = ["commercial/1.jpg", "commercial/2.jpg"];
	COMMERCIAL.currIndex=0;
	COMMERCIAL.numImages=COMMERCIAL.imgArray.length;
	COMMERCIAL.addActions();
}

COMMERCIAL.addActions = function(){
		
}

COMMERCIAL.startGallery = function(){
	COMMERCIAL.active = true;
	COMMERCIAL.loadImage();
}

COMMERCIAL.stopGallery = function(){
	COMMERCIAL.active = false;
	window.clearTimeout(COMMERCIAL.interv);
}

COMMERCIAL.loadImage = function(){	
	if(!COMMERCIAL.active){
		return;
	}
	var img = new Image();
	var imgWrapper = $('<div class="img-wrapper"></div>');
	var src = COMMERCIAL.path + COMMERCIAL.imgArray[COMMERCIAL.currIndex];
	
	$(img).load(function(){
		$(imgWrapper)
    		.hide()
    		.css({'background-image':'url(' + src + ')'})
    		.appendTo($('#commercial-gallery'))
    		.fadeTo(1500, 1, function(){
	   			//$('#img_wrapper').find('.img-wrapper').not(':last').remove();
	   			$(this).siblings().remove();
	   		});
    	COMMERCIAL.currIndex < COMMERCIAL.numImages-1?COMMERCIAL.currIndex++:COMMERCIAL.currIndex=0;
    	COMMERCIAL.interv = window.setTimeout("COMMERCIAL.loadImage()", COMMERCIAL.timeout);
	})
	.attr('src', src);
}