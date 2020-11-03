; (function ($) {
	$.fn.loadpage = function (action, opts) {
		action = action ? action : "init";
		var progressValue = 0;
		var loadHtml = [
			'<div class="mdLoading">',
			'    <div class="loadingBox">',
			'        <img class="line2" src="images/load-pic.gif">',
			'        <div class="progressBar">',
			'            <img class="step" src="images/load-step.png">',
			'            <img class="stepbg" src="images/load-stepbg.png">',
			'            <div class="progress js-bar"></div>',
			'        </div>',
			'        <img class="loadtxt" src="images/load-txt.png">',
			'    </div>',
			'</div>'
		].join('');
		var dLoad,dCount,dBar;
		var config = $.extend({
			async:false
		}, opts);
		
		function init(obj) {
			$(loadHtml).appendTo('body');
			dLoad = obj.find('.mdLoading');
			dCount = dLoad.find('.js-count');
			dBar = dLoad.find('.js-bar');
			return new Promise(function (resolve, reject){
				if (!config.async) {
					var queue = new createjs.LoadQueue();
					queue.setMaxConnections(200);
					var loadArray = [];
					obj.find("img").each(function (i) {
						loadArray.push({
							id: i,
							src: $(this).attr("src")
						});
					})
					queue.loadManifest(loadArray);

					var handleComplete = function () {

						$(window).trigger("loadCompleted");
						$('.js-wrap').css({ 'visibility': 'visible' });
						TweenMax.fromTo(dLoad, 0.5, { opacity: 1 }, {
							delay: .8,
							opacity: 0, ease: Power4.easeOut, onComplete: function () {
								dLoad.remove();
								resolve(true);
							}
						});
	   
					};

					queue.on("progress", function () {
						var procValue = Math.min(Math.ceil(queue.progress * 100), 100);
						dCount.text(procValue + '%');
						dBar.css({
							// 'transform': procValue + '%'
							// 'transform': 'skewX(-12deg) translateX(' + procValue + '%)'
							'transform': 'skewX(-12deg) translateX(100%)'
						});
					});

					queue.on("complete", handleComplete, this);
				}
				else {
					resolve(true);
				}
			});
		}
		if(action == 'init'){
			return init($(this));	
		}
		if (action == 'close') {
			dLoad = $(this).find('.mdLoading');
			dCount = dLoad.find('.js-count');
			dBar = dLoad.find('.js-bar');
			dCount.text('100%');
			dBar.css({
				'transform': 'skewX(-12deg) translateX(100%)'
			});
			TweenMax.fromTo(dLoad, 0.5, { opacity: 1 }, {
				delay: .8,
				opacity: 0, ease: Power4.easeOut, onComplete: function () {
					dLoad.remove();
				}
			});
		}
	}
})(jQuery);