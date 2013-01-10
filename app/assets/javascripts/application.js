// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require_tree .

$.ajaxSetup({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
  }
}); 

menuDelay = 500;
function toggleMenu() {
	var width = $("#side-menu").width();
	var margin = parseInt ( $("#side-menu").css('margin-left').replace('px', '') );
	var diff = -margin - width + 30;
	var delay = 400;
	
	if (diff < 0){ delay = 300; }
	$("#side-menu").delay(menuDelay).animate({ 'margin-left': diff }, delay);
	menuDelay = 0;
}


$(document).ready(function() {
	toggleMenu();

	$(".toggle-radio input").each(function() {
		var value = $(this).val();
		$(this).siblings('[data-value="' + value + '"]').addClass("active");
	});

	$(".toggle-radio .btn").click(function() {
		$(this).siblings('.active').removeClass('active');
		$(this).addClass('active');
		var value = $(this).data('value');
		$(this).siblings('input').val(value);
	});


	$("#gossip_content").charCount({
	    allowed: 500,		
	    warning: 50,
	    counterText: 'Characters left: ',
	    disableId: 'button_post_gossip'
	});	

	$(".toggle-slide").click(function() {
		var toggleId = '#' + $(this).data('toggleid');
		var toggleObj = $(toggleId);
		if ( toggleObj.css("display") == "none" ) {
			toggleObj.slideDown();
		} else {
			toggleObj.slideUp();
		}

	});

	$("#button_post_gossip").click(function () {
		var form = $(this).closest("form");
		$.post("/gossips", form.serialize(),
			function(data) {
				console.log(data);
				$(form).find("input[type=text], textarea").val("");
			}, "json");
	});





});

