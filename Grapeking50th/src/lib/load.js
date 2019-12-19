; (function ($) {
	$.fn.loadpage = function (action, opts) {
		action = action ? action : "init";
		var progressValue = 0;
		var loadHtml = [
			'<div class="mdLoading">',
			'    <div class="loadingBox">',
			'		 <div class="anibg"></div>',
			'        <img class="line2" src="images/loading-pic.gif">',
			'        <div class="progressBar">',
			'        </div>',
			'        <div class="progress js-bar" style="width:0"></div>',
			'    </div>',
			'</div>'
		].join('');
		var dLoad,dCount,dBar,dAnibg,dBox;
		var config = $.extend({
			async:false
		}, opts);
		
		function init(obj) {
			$(loadHtml).appendTo('body');
			dLoad = obj.find('.mdLoading');
			dBox = dLoad.find('.loadingBox');
			dCount = dLoad.find('.js-count');
			dBar = dBox.find('.js-bar');
			dAnibg = dLoad.find('.anibg');
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
						if(isMobile) {
							if(procValue >= 68) {
								dBar.css({
									'width': '67%'
								});
							} else {
								dBar.css({
									'width': (procValue-4) + '%'
								});
							}
						} else {
							dBar.css({
								'width': (procValue-4) + '%'
							});
						}
						// dAnibg.css({
						// 	'transform':'translateY('+(100-procValue)+'%)'
						// 	// 'transform':'translateY(0%)'
						// });
						// dBox.addClass("loadingBox-active");
						// dBox.css({
						// 	'transform':'translate(-50%,'+(-50+procValue)+'%)'
						// 	// 'transform':'translateY(0%)'
						// });
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
			dBox = dLoad.find('.loadingBox');
			// dAnibg = dLoad.find('.anibg');
			// dCount.text('100%');
			// dBar.css({
			// 	'width':'100%'
			// });
			// dAnibg.addClass("anibg-active");
			// dBox.addClass("loadingBox-active");

			TweenMax.fromTo(dLoad, 0.5, { opacity: 1 }, {
				delay: .8,
				opacity: 0, ease: Power4.easeOut, onComplete: function () {
					dLoad.remove();
				}
			});
		}
	}
})(jQuery);