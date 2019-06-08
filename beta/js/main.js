$(document).ready(function(){

  $("#about-nav a").click(function(){
    rel = $(this).attr("rel");
    if ($(this).hasClass("active")) {
      return false;
    }
    $("#about-nav a").removeClass('active');
    $(this).addClass('active');
    $(".hidden").fadeOut(400);
    $("#"+rel).delay(400).fadeIn(400);
  });
  
  $("#about-nav-mobile").change(function(){
    rel = $("#about-nav-mobile option:selected").attr("rel");
    if ($("#about-nav-mobile option:selected").hasClass("active")) {
      return false;
    }
    $("#about-nav-mobile option").removeClass('active');
    $("#about-nav-mobile option:selected").addClass('active');
    $(".hidden").fadeOut(400);
    $("#"+rel).delay(400).fadeIn(400);
  });
  
    $("#contactus-nav a").click(function(){
    rel = $(this).attr("rel");
    if ($(this).hasClass("active2")) {
      return false;
    }
    $("#contactus-nav a").removeClass('active2');
    $(this).addClass('active2');
    $(".hidden2").fadeOut(400);
    $("#"+rel).delay(400).fadeIn(400);
  });
  
    $("#contactus-nav-mobile").change(function(){
    rel = $("#contactus-nav-mobile option:selected").attr("rel");
    if ($("#contactus-nav-mobile option:selected").hasClass("active2")) {
      return false;
    }
    $("#contactus-nav-mobile option").removeClass('active2');
    $("#contactus-nav-mobile option:selected").addClass('active2');
    $(".hidden2").fadeOut(400);
    $("#"+rel).delay(400).fadeIn(400);
  });
  
  	$(".group1").colorbox({rel:'group1', width:"90%", height:"90%"});
  	$(".group2").colorbox({rel:'group2', width:"90%", height:"90%"});
  	$(".group3").colorbox({rel:'group3', width:"90%", height:"90%"});
  
});
