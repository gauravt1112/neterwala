var RESIDENTIAL = {
	imgArray:[],
	currIndex:0,
	path:'img/',
	numImages:0,
	interv:null,
	timeout:6000,
	active:true
}
RESIDENTIAL.init = function(){
	RESIDENTIAL.imgArray = ["residential/1.jpg", "residential/2.jpg"];
	RESIDENTIAL.currIndex=0;
	RESIDENTIAL.numImages=RESIDENTIAL.imgArray.length;
	RESIDENTIAL.addActions();
}
RESIDENTIAL.addActions = function(){
}

RESIDENTIAL.startGallery = function(){
	RESIDENTIAL.active = true;
	RESIDENTIAL.loadImage();
}

RESIDENTIAL.stopGallery = function(){
	RESIDENTIAL.active = false;
	window.clearTimeout(RESIDENTIAL.interv);
}

RESIDENTIAL.loadImage = function(){	
	if(!RESIDENTIAL.active){
		return;
	}
	var img = new Image();
	var imgWrapper = $('<div class="img-wrapper"></div>');
	var src = RESIDENTIAL.path + RESIDENTIAL.imgArray[RESIDENTIAL.currIndex];
	
	$(img).load(function(){
		$(imgWrapper)
    		.hide()
    		.css({'background-image':'url(' + src + ')'})
    		.appendTo($('#residential-gallery'))
    		.fadeTo(1500, 1, function(){
	   			//$('#img_wrapper').find('.img-wrapper').not(':last').remove();
	   			$(this).siblings().remove();
	   		});
    	RESIDENTIAL.currIndex < RESIDENTIAL.numImages-1?RESIDENTIAL.currIndex++:RESIDENTIAL.currIndex=0;;
    	RESIDENTIAL.interv = window.setTimeout("RESIDENTIAL.loadImage()", RESIDENTIAL.timeout);
	})
	.attr('src', src);
}