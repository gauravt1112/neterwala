var CONTRACT = {
}
CONTRACT.init = function(){
	$(window).resize(function() {
  		CONTRACT.doResize();
	})
	CONTRACT.addActions();
	$('#contract-nav .contract1').addClass('selected');
}
CONTRACT.addActions = function(){
	$('#contract-nav div').on('click', function(){
		$('#contract-pane').scrollTo($('#' + $(this).attr('data-id')), 500, 'easeOutQuart');
		// alert(1);
	})
	$('#contract-pane').on('scroll', function(){
		var currButton = '';
		$('.contract-block').each(function(){
			if($(this).position().top < 1){
				currButton = $('#contract-nav .' + $(this).attr('id'));
			}
		});
		if(!$(currButton).hasClass('selected')){
			$(currButton).addClass('selected').siblings().removeClass('selected');
		}
	});
}
CONTRACT.doResize = function(){
	var wH = window.innerHeight ? window.innerHeight :$(window).height();
	var wW = window.innerWidth ? window.innerWidth : $(window).width();
	//if(wW <=568){
	$('#contract-pane').css({'height':wH-$('#contract-pane').offset().top});
}