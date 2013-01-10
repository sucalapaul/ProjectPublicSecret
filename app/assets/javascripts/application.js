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

// Animation for left menu
menuDelay = 500;		// wait before hiding menu for first time
function toggleMenu() {
	var width = $("#side-menu").width();
	var margin = parseInt ( $("#side-menu").css('margin-left').replace('px', '') );
	var diff = -margin - width + 30;
	var delay = 400;	// duration for revealing menu
	
	if (diff < 0){ delay = 300; } 	// duration for hiding menu
	$("#side-menu").delay(menuDelay).animate({ 'margin-left': diff }, delay);
	menuDelay = 0;
}

//Slide up-down toggle
function toggleSlide(id){
	var toggleObj = $('#'+id);
	if ( toggleObj.css("display") == "none" ) {
		toggleObj.slideDown();
	} else {
		toggleObj.slideUp();
	}
}


$(document).ready(function() {

	toggleMenu();

	// toggle Private <-> Me
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

	//Character counter for posting gossip
	$("#gossip_content").charCount({
	    allowed: 500,		
	    warning: 50,
	    counterText: 'Characters left: ',
	    disableId: 'button_post_gossip'
	});	

	//Animation for gossip posting form (on top)
	$(".toggle-slide").click(function() {
		toggleSlide( $(this).data('toggleid') );
	});

	//Ajax post for a gossip
	$("#button_post_gossip").click(function () {
		var form = $(this).closest("form");
		$.post("/gossips", form.serialize(),
			function(data) {
				console.log(data);
				$(form).find("input[type=text], textarea").val("");
				$(form).slideUp();
				$(".gossip-post:first").before("data.html");
			}, "json");
	});


	//Initialize dropdown
	if (typeof currentCircleId === 'undefined') {
    // variable is undefined
	} else {
		$("#gossip_circle_id").val(currentCircleId);
		$('#dropdwn_gossip_circle li[data-id="' + currentCircleId + '"]').addClass("active");
	}

	// Circle dropdown item click
	$("#dropdwn_gossip_circle li[data-id]").click(function() {
		var circleId = $(this).data('id');
		var circleName = $(this).children().html();

		$("#gossip_circle_id").val(circleId);
		$("#gossip_circle_info").html("Posting in " + circleName + " as: ");

		$(this).siblings().removeClass("active");
		$(this).addClass("active");
	});







});

