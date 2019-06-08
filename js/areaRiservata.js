var AREA_RIS = {
	
}


AREA_RIS.init = function(){
	AREA_RIS.addActions();
	$(window).resize(function() {
  		AREA_RIS.doResize();
	})
}



AREA_RIS.addActions = function(){
	var wW = window.innerWidth ? window.innerWidth : $(window).width(); 
	$('.mobile-area-opener').on('click', function(e){
		e.preventDefault();
		$('#area-riservata').fadeTo(800, 1);
		$('#areaMenuOpener').removeClass('selected');
		AREA_RIS.checkLogin();
		if(wW <= 568){
			PO.animNav('out');
		}
	})
	
	$('#logout').on('click', function(e){
		e.preventDefault();
		AREA_RIS.doLogout();
	})
	
	$('#areaMenuOpener').on('click', function(){
		$('#area-riservata').fadeTo(800, 1);
		$('#areaOptions').slideUp();
		$('#areaMenuOpener').removeClass('selected');
		AREA_RIS.checkLogin();
	})


	$('#area-riservata .register').on('click', function(e){
		e.preventDefault();
		AREA_RIS.showSection('#register');
		AREA_RIS.hideSection('#login');
	});
	$('#area-riservata .login').on('click', function(e){
		e.preventDefault();
		AREA_RIS.checkLogin();
		AREA_RIS.hideSection('#register');
	});
	$('.area-riservata-closer').on('click', function(){
		$('#area-riservata').fadeTo(800, 0, function(){
			$(this).hide();
			$('#login').hide();
			$('#register').hide();
			$('#listini').hide();
			$('#form-feedback').hide();
		});
	});
	$('.area-riservata-closer').on('mouseenter', function(){
		$(this).attr('src', 'img/lightbox/close-roll.png');
	});
	$('.area-riservata-closer').on('mouseleave', function(){
		$(this).attr('src', 'img/lightbox/close.png');
	});
	
	$('#accedi').on('click', function(e){
		e.preventDefault();
		AREA_RIS.sendLogin();
	})
	$('#send_registration').on('click', function(e){
		e.preventDefault();
		AREA_RIS.checkRegistrationForm();
	})
}
 
AREA_RIS.showSection = function(section, delay){
	if(delay==undefined){
		$(section).fadeTo(800, 1);
	}else{
		$(section).delay(delay).fadeTo(800, 1);
	}
	AREA_RIS.doResize();
} 

AREA_RIS.hideSection = function(section){
	$(section).fadeTo(800, 0, function(){
		$(this).hide();
	});
}

AREA_RIS.doLogout = function(){
	PO.startSpinner();
	$.ajax({
 		type:"get",
 		dataType:"html",
 		url:"ajax_logout.php",
 		async:true,
 		success:function(html){
 			PO.stopSpinner();
 			AREA_RIS.hideSection('#listini');
 			AREA_RIS.showSection('#login'); 			
 		},
 		error:function(e){
     		//console.log("error: " + e);
 		}
 	})
}

AREA_RIS.checkLogin = function(){
	//$('#login').fadeTo(800, 1);
	PO.startSpinner();
	$.ajax({
 		type:"get",
 		dataType:"html",
 		url:"ajax_area_ris.php",
 		async:true,
 		success:function(html){
 			PO.stopSpinner();
 			if($.trim(html)=='NO'){
 				AREA_RIS.showSection('#login');
 			}else{
	 			$('#listini .area-content').html(html);
	 			AREA_RIS.showSection('#listini');
 			}
 		},
 		error:function(e){
     		//console.log("error: " + e);
 		}
 	})
} 

AREA_RIS.sendLogin = function(){
	PO.startSpinner();
	$('#login .error').hide();
	if($('#login_password').val()==''){
		$('#login .error').show();
		return;
	}
	var paramList = {password:$('#login_password').val()};	
	$.ajax({
 		type:"post",
 		dataType:"html",
 		data:paramList,
 		url:"ajax_area_ris.php",
 		async:true,
 		success:function(html){
 			$('#login_password').val('');
 			PO.stopSpinner();
 			if($.trim(html)=='NO'){
 				AREA_RIS.showSection('#login');
 			}else{
 				if($.trim(html)=='ERROR'){
 					AREA_RIS.showSection('#login');
 					$('#login .error').html('Wrong password').show();
 				}else{
	 				$('#listini .area-content').html(html);
	 				AREA_RIS.showSection('#listini');
	 				AREA_RIS.hideSection('#login');
 				}
	 			
 			}
 		},
 		error:function(e){
     		//console.log("error: " + e);
 		}
 	})
}

AREA_RIS.checkRegistrationForm = function(){
	$('#register .error').hide();
	var ok = true;
	$('#register .required').each(function(){
		if($(this).val().length < 1){
			$(this).addClass('field_error');
			ok = false;
		}else{
			$(this).removeClass('field_error');
		}
	})
	if($("input[name='register_profession']:checked").val() == '' || $("input[name='register_profession']:checked").val() == undefined){
		$('#register_profession').addClass('field_error');
		ok = false;
	}else{
		$('#register_profession').removeClass('field_error');
	}
	if(!AREA_RIS.validateEmail($('#register_email'))){
		$('#register_email').addClass('field_error');
		ok = false;
	}
	if(ok){
		AREA_RIS.sendForm();
	}else{
		$('#register').scrollTo(0, 400);
		return false;
	}
	
}
 
AREA_RIS.sendForm = function(){
	var formData = $('#register-form').serialize();
	var url = 'email_registration.php';
	$.post( url, formData,
      function( data ) {
      	  if(data=='out=true'){
      	  	switch(PO.lang){
	      	  	case 'it':
	      	  		$('#form-feedback .area-content').html('Grazie mille per la sua gentile richiesta!<br><br> La registrazione è avvenuta correttamente. Provvederemo al più presto a inviarle la password di accesso alla nostra area riservata.');
	      	  		break;
	      	  	case 'fr':	
	      	  		$('#form-feedback .area-content').html('Merci beaucoup pour votre gentille demande! <br><br>L’enregistrement a réussie avec succès. Nous vous ferons parvenir aussitôt que possible le mot de passe pour accéder à notre  zone réservée.');
	      	  		break;
	      	  	case 'de':	
	      	  		$('#form-feedback .area-content').html('Vielen Dank für deine nette Anfrage!<br><br>Die Aufzeichnung war erfolgreich. Wir werd en Ihnen das Password für unseren reservierten Bereich sobald als möglich senden.');
	      	  		break;
	      	  	default:	
	      	  		$('#form-feedback .area-content').html('Many thanks for your kind request!<br><br>The registration has been successful. We will send you the password for our restricted area as soon as possible.');
	      	  		break;
      	  	}
      	  	
	      }else{
	      	$('#form-feedback .area-content').html('An error has occurred!<br><br>Please try again later.');
	      }
	      AREA_RIS.hideSection('#register');
      	  AREA_RIS.showSection('#form-feedback');
      }
    );
    
}

AREA_RIS.validateEmail = function(targ){
	var err = "";
	if(!($(targ).val().match(/^([a-zA-Z0-9_\.\-]{2,})+\@(([a-zA-Z0-9\-]{2,})+\.)+([a-zA-Z]{2,4})$/))){
		return false;
	}
	return true;
};

AREA_RIS.doResize = function(){
	var wH = window.innerHeight ? window.innerHeight :$(window).height();
	var wW = window.innerWidth ? window.innerWidth : $(window).width();
	
	$('#register').css({'height':'auto'});
	if($('#register').height() > wH - 100){
		$('#register').css({'height':wH - 100});
	}
	$('#register').css({'margin-top':-($('#register').height()/2)});
	
	$('#listini').css({'height':'auto'});
	if($('#listini').height() > wH - 100){
		$('#listini').css({'height':wH - 100});
	}
	$('#listini').css({'margin-top':-($('#listini').height()/2)});
}

	
	

