var HOME = {
	imgArray:[],
	currIndex:0,
	path:'img/home/gallery/',
	numImages:0,
	interv:null,
	timeout:4000,
	active:true
}
HOME.init = function(){
	HOME.imgArray = ["home_01.jpg"];
	HOME.currIndex=0;
	HOME.numImages=HOME.imgArray.length;
	HOME.addActions();
}
HOME.addActions = function(){
}
HOME.startGallery = function(){
	HOME.active = true;
	HOME.loadImage();
}
HOME.stopGallery = function(){
	HOME.active = false;
	window.clearTimeout(HOME.interv);
}
HOME.loadImage = function(){	
	if(!HOME.active){
		return;
	}
	var img = new Image();
	var imgWrapper = $('<div class="img-wrapper"></div>');
	var src = HOME.path + HOME.imgArray[HOME.currIndex];	
	$(img).load(function(){
		$(imgWrapper)
    		.hide()
    		.css({'background-image':'url(' + src + ')'})
    		.appendTo($('#home-gallery'))
    		.fadeTo(1500, 1, function(){
	   			//$('#img_wrapper').find('.img-wrapper').not(':last').remove();
	   			$(this).siblings().remove();
	   		});
    	HOME.currIndex < HOME.numImages-1?HOME.currIndex++:HOME.currIndex=0;;
    	HOME.interv = window.setTimeout("HOME.loadImage()", HOME.timeout);
	})
	.attr('src', src);
}