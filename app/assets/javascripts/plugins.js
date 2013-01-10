/*
 * 	Character Count Plugin - jQuery plugin
 * 	Dynamic character count for text areas and input fields
 *	written by Alen Grakalic	
 *	http://cssglobe.com/post/7161/jquery-plugin-simplest-twitterlike-dynamic-character-count-for-textareas
 *
 *	Copyright (c) 2009 Alen Grakalic (http://cssglobe.com)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
 
(function($) {

	$.fn.charCount = function(options){
	  
		// default configuration properties
		var defaults = {	
			allowed: 140,		
			warning: 25,
			css: 'counter',
			counterElement: 'span',
			cssWarning: 'warning',
			cssExceeded: 'exceeded',
			counterText: '',
			disableId: '',
			cssDisable: 'disabled'
		}; 
			
		var options = $.extend(defaults, options); 
		
		function calculate(obj){
			var count = $(obj).val().length;
			var objCounter = $('#' + $(obj).attr('id') + '_counter' );
			var available = options.allowed - count;
			var objDisable = $('#' + options.disableId);

			if(available <= options.warning && available >= 0){
				objCounter.addClass(options.cssWarning);
			} else {
				objCounter.removeClass(options.cssWarning);
			}
			if(available < 0){
				objCounter.addClass(options.cssExceeded);
			} else {
				objCounter.removeClass(options.cssExceeded);
			}

			if (count == 0 || available < 0){
				objDisable.addClass(options.cssDisable);
			} else {
				objDisable.removeClass(options.cssDisable);
			}
		};
				
		this.each(function() {
			calculate(this);
			$(this).keyup(function(){calculate(this)});
			$(this).change(function(){calculate(this)});
		});
	  
	};

})(jQuery);