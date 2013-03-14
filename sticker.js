(function(){
	//document ready
	$(function() {

		var fraction = 6; //fraction of the window that needs to be scrolled to jump to the next sticker
		var scrollspeed = 400; //the duration of the animation
		var $w = $(window);
		//Alle gültigen Anker als array sichern
		var $sticker = $('.sticker');
		var stickerCount = $sticker.length;
		if(stickerCount !== 0) scrollanimation();

		function scrollanimation(){

			var $body = $('html,body');
			var startNumber = 0;
			var ids = Array();
			//puch all the ids of the stickers to an array 
			$sticker.each(function(){ ids.push(this.id); });
			var anker = window.location.hash.replace('#','');
			var $ankerPos = $.inArray(anker,ids);
			//if the anker is a known id jup to that sticker if not jump to the first one
			$ankerPos == -1 ? jumpTo(startNumber) : jumpTo($ankerPos);

			$w.bind('scrollstop',function(){
				var distance = $w.scrollTop() - $($sticker[startNumber]).offset().top;
				var windowHeight = $w.height(); //window hight is in here so we get correct results even after resizing th window
				var tollerance = windowHeight / fraction;
				var pages = Math.floor(Math.abs(distance) / (windowHeight + tollerance))+1;
				if(distance > tollerance){
					//scroll down
					if (pages >= (stickerCount - startNumber)) pages = stickerCount - 1 - startNumber;
					jumpTo(startNumber+pages);
				}
				else if(distance < 0 - tollerance){
					//scroll up
					if (pages >= startNumber) pages = startNumber;
					jumpTo(startNumber-pages);
				}
				//two pixel tolerance for errors in css rendering
				else if((distance < tollerance && distance > 2) || (distance > 0 - tollerance && distance < -2)){
					//stay where you are
					jumpTo(startNumber);
				}
			});
			//jump up or down based on arrow keys
			$w.bind('keyup',function(e){
				if(e.keyCode == "38"){
					jumpTo(startNumber-1);
				}else if(e.keyCode == "40"){
					jumpTo(startNumber+1);
				}
			});

			//animates jump to sticker i and sets hash
			function jumpTo(i){
				var $Target = $($sticker[i]);
				var scrollZiel = $Target.offset().top;
				$body.stop(true, false); //stop all animations (clear que, dont jump to end)
				$body.animate({scrollTop: scrollZiel}, scrollspeed, function() {
					startNumber = i;
					window.location.hash = $Target.attr('id');
				});
			}

		}
	});

	var special = jQuery.event.special,
        uid1 = 'D' + (+new Date()),
        uid2 = 'D' + (+new Date() + 1);

    special.scrollstop = {
        latency: 300,
        setup: function() {

            var timer,
                    handler = function(evt) {

                    var _self = this,
                        _args = arguments;

                    if (timer) {
                        clearTimeout(timer);
                    }

                    timer = setTimeout( function(){

                        timer = null;
                        evt.type = 'scrollstop';
                        jQuery.event.handle.apply(_self, _args);

                    }, special.scrollstop.latency);

                };

            jQuery(this).bind('scroll', handler).data(uid2, handler);

        },
        teardown: function() {
            jQuery(this).unbind( 'scroll', jQuery(this).data(uid2) );
        }
    };

})();