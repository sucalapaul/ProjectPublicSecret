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
		});

});

//Ajax for joining a circle
$(document).on("click", ".join-circle-btn", function () {
	var from = "circles";
	var self = this;
	var circlePost = $(this).closest(".circle-post");
	var circleId = $(circlePost).data('id');
	if(typeof circleId != 'undefined')
		var peopleCount = $(self).data('count');
	else {
		circleId = $(self).data('id');
		from = "gossip"
	}
	var jqxhr = $.post("/circles/join", { "circle[circle_id]": circleId },
		function(data) {
			console.log(data);
			if (data == 1) {
				$(self).html("<span class=\"joined\"><i class=\"icon-ok\"></i> Joined</span> <span class=\"leave\"><i class=\"icon-remove\"></i> Leave Circle </span>");
				$(self).addClass("joined-circle");
				$(self).removeClass("join-circle");
			} else {
				$(self).html("<i class=\"icon-plus\"></i> Join Circle");
				$(self).removeClass("joined-circle");
				$(self).addClass("join-circle");

			}
			if (from === "circles"){
				peopleCount = peopleCount + data;
				$(self).parent().find('p').html(peopleCount);
				$(self).data('count', peopleCount);
			}

		}, "json")
		.error(function() {
			showError("Something went wrong!" + "\nResponse: " + jqxhr.responseText + "\nStatus: " + jqxhr.statusText);
		});

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
			$(self).find('p').html(likeCount);
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
				$(self).removeClass('disabled').addClass('enabled');
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

$(document).on("click", ".toggle-privacy", function () {
	var self = this;
	var $info = $(self).siblings('#gossip_private_info');
	var $avatar = $(self).siblings('.avatar-mini').children(); //span   in   span.avatar-mini

	// toggle latch
	if ( $(self).hasClass('public') ) {
		$(self).removeClass('public').addClass('private');
		$(self).next('input').val("1");
		$info.text( $info.data('private') );
		$avatar.hide();
	} else {
		$(self).removeClass('private').addClass('public');
		$(self).next('input').val("0");
		$info.text( $info.data('public') );
		$avatar.show();
	}

});

//Ajax for my circles
function my_circles() {

	//no cleaning anymore :D
	//$('#mycircles_container').empty();
	//$('#mycircles_resource').children().clone().appendTo('#mycircles_container');//.attr('id', '');

	if ( ! document.getElementById('mycircles_container')) {
		return;
	}

	var jqxhr = $.post("/circles/mycircles",
		function(data) {			
			$('#mycircles_container').html(data.html);
			// var circleData = data;
			// var directives = {
			//   	muie: {
			// 	    "data-id": function(params) {
			// 	      return this.id;
			// 	    }
			// 	  },
			// 	cityname: {
			// 		html: function(params) {
			// 			return this.city.name;
			// 		}
			// 	},
			// 	joined: {
			// 		html: function(params) {
			// 			if (params.value) {
			// 				return '<a style="margin-top:10px;" data-count="' + this.people_count + '" class="joined-circle join-circle-btn pull-right btnx btnx-blue"><span class="joined"><i class="icon-ok"></i> Joined</span> <span class="leave"><i class="icon-remove"></i> Leave Circle </span></a>';
			// 			} else {
			// 				return '<a style="margin-top:10px;" data-count="' + this.people_count + '" class="join-circle join-circle-btn pull-right btnx btnx-blue"><i class="icon-plus"></i> Join Circle </a>';
			// 			}
			// 		}
			// 	}
			// };
			// $('#mycircles_container').render(circleData, directives);
			// $('#mycircles_container').find('.circle-post').removeAttr('style');
		}, "json")
		.error(function() {
			showError("Something went wrong!" + "\nResponse: " + jqxhr.responseText + "\nStatus: " + jqxhr.statusText);
		});
}

//Ajax for searching a circle
function search_circle() {
	if ($('#search_city_box').val() == ''){
		$('#error').show("fast");
		return false;
	}
	else
		$('#error').hide("fast");
	var form = $(this).closest("form");
	var jqxhr = $.post("/circles/search", {"city[latitude]": city_latitude, "city[longitude]": city_longitude},
		function(data) {
			var circleData = data;
			var directives = {
			  	muie: {
				    "data-id": function(params) {
				      return this.id;
				    }
				  },
				cityname: {
					html: function(params) {
						return this.city.name;
					}
				},
				joined: {
					html: function(params) {
						if (params.value) {
							return '<a style="margin-top:10px;" data-count="' + this.people_count + '" class="joined-circle join-circle-btn pull-right btnx btnx-blue"><span class="joined"><i class="icon-ok"></i> Joined</span> <span class="leave"><i class="icon-remove"></i> Leave Circle </span></a>';
						} else {
							return '<a style="margin-top:10px;" data-count="' + this.people_count + '" class="join-circle join-circle-btn pull-right btnx btnx-blue"><i class="icon-plus"></i> Join Circle </a>';
						}
					}
				}
			};
			$('#circles_container').render(circleData, directives);
			$('.circle-post').removeAttr('style');
		}, "json")
		.error(function() {
			showError("Something went wrong!" + "\nResponse: " + jqxhr.responseText + "\nStatus: " + jqxhr.statusText);
		});
}


var city_latitude = 0;
var city_longitude = 0;

$(document).ready(function() {

	//flash messeges
	$(".alert-notice").delay(2500).slideUp();

	//toggleMenu();
	my_circles();
	$("abbr.timeago").timeago();

	//gspit.parallaxScroller = $.parallaxScroller();
	//gspit.parallaxScroller.scroller.initialize();

	  //$(function () {
	    gspit.ui.init();
	    //0 < $("#js-market-picker").length && gspit.marketpicker.init();
	    var a = $("body");
	    a.hasClass("page-homepage") && gspit.home.init();
	    //(a.hasClass("page-download-mac") || a.hasClass("page-download-windows")) && gspit.download.init();
	    //a.hasClass("page-download-redirect") && gspit.download.redirectToDownloadPage();
	    //gspit.analytics.init()
	  //}());

	//Circles -> Navigation Tabs

	// $('.nav-tabs li').click(function () {
	// 	$(this).siblings().removeClass('active');
	// 	$(this).addClass('active');
	// 	$('.nav-tab-page').addClass('hidden');
	// 	$( '#' + $(this).data('id') ).removeClass('hidden');
	// });

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
		$('html, body').animate({ scrollTop: 0 }, 'slow');
	});

	//Autocomplete tags
	$( '#circle_tag_list' ).tokenInput("/likes.json", {
	    crossDomain: false,
	    hintText: "Insert a tag",
	    theme: "facebook"
	  });

	//Ajax post for a gossip
	$("#button_post_gossip").click(function () {
		var form = $(this).closest("form");
		var textLen = $("#gossip_content").val().length;
		var gossipCircleId = $("#gossip_circle_id").val(); //value chosen from dropdown
		if (textLen == 0 || textLen >= gossipPostMaxLength){
			return;
		}
		if ( gossipCircleId.length == 0 ) {
			showError("Please choose a circle where to post");
			return;
		}
		var jqxhr = $.post("/gossips", form.serialize(),
			function(data) {
				console.log(data);
				// redirect to circle where was this gossip posted
				if (typeof currentCircleId === 'undefined' || currentCircleId != gossipCircleId ) {
					window.location.href = "/circles/" + gossipCircleId;
				}

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

	//Ajax post for following a user
	$(".follow-user-btn").click( function () {
		var self = this;
		var followedId = $(self).data('id') || "";
		var followedFbId =  $(self).closest('[data_fb_id]').attr('data_fb_id') || "";

		var jqxhr = $.post("/users/follow", { "user[followed_id]": followedId, "user[followed_fb_id]": followedFbId },
			function(data) {
				console.log(data);
				if (data == 1) {
					$(self).html("Unfollow");
				} else if (data == 0) {
					showError("WTF?! that user is not in our database!");
				} else {
					$(self).html("Follow");
				}
				$("#follower-count").html(parseInt($("#follower-count").html()) + data);

			}, "json")
			.error(function() {
				showError("Something went wrong!" + "\nResponse: " + jqxhr.responseText + "\nStatus: " + jqxhr.statusText);
			});

	});

	Transparency.matcher = function(element, key) {
		return element.getAttribute('data-bind') == key;
	};

	//Autocomplete for search_city_box
	if (document.getElementById('map_canvas')) {
		var mapOptions = {
		      center: new google.maps.LatLng(-33.8688, 151.2195),
		      zoom: 13,
		      mapTypeId: google.maps.MapTypeId.ROADMAP
		    };

		var map2 = new google.maps.Map(document.getElementById('map_canvas'),
		      mapOptions);

		var input = document.getElementById('search_city_box');
		var autocomplete = new google.maps.places.Autocomplete(input);

		autocomplete.bindTo('bounds', map2);

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
		    var place = autocomplete.getPlace();
		    if (!place.geometry) {
		      // Inform the user that the place was not found and return.
		      $('#geocode-error').text('This address cannot be found.').fadeIn('fast');
		      return;
		    }

		    city_name = place.address_components[0].long_name;
		    city_longitude = place.geometry.location.$a;
		    city_latitude = place.geometry.location.Za;
		  });
	}
});
