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

var gossipPostMaxLength = 500;
var gossipPostWarningLength = 50;

function showError(msj){
	alert(msj);
}

//Ajax post for a comment
$(document).on("click", ".post_comment_button", function () {
	var form = $(this).closest("form");
	var jqxhr = $.post("/comments", form.serialize(),
		function(data) {
			console.log(data);
			$(form).find("input[type=text], textarea").val("");
			$(form).closest(".gossip").find(".comment:last").after(data.html);
			$(form).closest(".gossip").find(".comment:last").slideDown().find("abbr.timeago").timeago();
		}, "json")
		.error(function() {
			showError("Something went wrong!" + "\nResponse: " + jqxhr.responseText + "\nStatus: " + jqxhr.statusText);
		}
	);

});



//Ajax post for a like
$(document).on("click", ".gossip-like-btn", function () {
	var self = this;
	var gossipPost = $(this).closest(".gossip-post");
	var gossipId = $(gossipPost).data('id');
	var likeCount = $(self).data('count');

	var jqxhr = $.post("/likes", { "like[gossip_id]": gossipId }, //form.serialize(),
		function(data) {
			console.log(data);
			if (data == 1) {
				$(self).find('a').html("Unlike");
			} else {
				$(self).find('a').html("Like");
			}
			likeCount = likeCount + data;
			$(self).find('p').html(likeCount + " people");
			$(self).data('count', likeCount);

		}, "json")
		.error(function() {
			showError("Something went wrong!" + "\nResponse: " + jqxhr.responseText + "\nStatus: " + jqxhr.statusText);
		});

});


	//Ajax post for a gossip vote (true/fake)
$(document).on("click", ".gossip-vote-btn", function () {
	var self = this;
	var other = $(this).siblings('.gossip-vote-btn');
	var gossipPost = $(self).closest(".gossip-post");
	var gossipId = $(gossipPost).data('id');
	var voteCount = $(self).data('count');
	var value = $(self).data('value');

	var jqxhr = $.post("/gossip_votes", {
			"gossip_vote[gossip_id]": gossipId,
			"gossip_vote[value]": value
		},
		function(data) {
			if (data == 1) { //click on True or Fake, both buttons unchecked
				voteCount++;
				$(other).addClass('disabled');
				$(self).addClass('enabled');
			} else if (data == 0) {  //click on T/F, other one was checked
				voteCount++;
				var voteCountOther = $(other).data('count') -1;
				$(other).removeClass('enabled').addClass('disabled');
				$(self).addClass('enabled');
				$(other).find('p').html(voteCountOther);
				$(other).data('count', voteCountOther);
			} else if (data == -1) {		//click on T/F, this button was checked
				voteCount--;
				$(other).removeClass('disabled');
				$(self).removeClass('enabled');
			}
			$(self).data('count', voteCount);
			$(self).find('p').html(voteCount);

		}, "json")
		.error(function() {
			showError("Something went wrong!" + "\nResponse: " + jqxhr.responseText + "\nStatus: " + jqxhr.statusText);
		});

});

$(document).ready(function() {

	toggleMenu();

	$("abbr.timeago").timeago();

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
		var textLen = $("#gossip_content").val().length;
		if (textLen == 0 || textLen >= gossipPostMaxLength){
			return;
		}
		var jqxhr = $.post("/gossips", form.serialize(),
			function(data) {
				console.log(data);
				$(form).find("input[type=text], textarea").val("");
				$(form).slideUp();
				$(".gossip-post:first").before(data.html);
				$(".gossip-post:first").slideDown().find("abbr.timeago").timeago();

			}, "json")
			.error(function() {
				showError("Something went wrong!" + "\nResponse: " + jqxhr.responseText + "\nStatus: " + jqxhr.statusText);
			}
		);
	});


	//Initialize dropdown
	if (typeof currentCircleId === 'undefined') {
    // variable is undefined
	} else {
		$("#gossip_circle_id").val(currentCircleId);
		var selectedItem = $('#dropdwn_gossip_circle li[data-id="' + currentCircleId + '"]');
		selectedItem.addClass("active");
		var currentCircleName = $(selectedItem).children().html();
		$("#gossip_circle_info").html("Posting in " + currentCircleName );
	}

	// Circle dropdown item click
	$("#dropdwn_gossip_circle li[data-id]").click(function() {
		var circleId = $(this).data('id');
		var circleName = $(this).children().html();

		$("#gossip_circle_id").val(circleId);
		$("#gossip_circle_info").html("Posting in " + circleName );

		$(this).siblings().removeClass("active");
		$(this).addClass("active");
	});







});

