; (function ($) {
	$.fn.loadpage = function (action, opts) {
		action = action ? action : "init";
		var progressValue = 0;
		var loadHtml = [
			'<div class="mdLoading">',
			'	<div class="loadingBox">',
			'		<div class="loadarea">',
			'			<div class="topbg progressBar">',
			'				<div class="gradual topgrd progress js-bar"></div>',
			'			</div>',
			'			<div class="botbg">',
			'				<div class="gradual botgrd js-bar2"></div>',
			'			</div>',
			'			<img class="line2" src="./images/compass2-te.png">',
			'			<img class="pd" src="./images/compass_pd.png">',
			'		</div>',
			'		<h2 class="js-count">LOADING...</h2>',
			// '       <div class="progressBar">',
			// '           <div class="progress js-bar" style="width:0"></div>',
			// '       </div>',
			'	</div>',
			'</div>'
		].join('');
		var dLoad,dCount,dBar,dBar2;
		var config = $.extend({
			async:false
		}, opts);
		
		function init(obj) {
			$(loadHtml).appendTo('body');
			dLoad = obj.find('.mdLoading');
			dCount = dLoad.find('.js-count');
			dBar = dLoad.find('.js-bar');
			dBar2 = dLoad.find('.js-bar2');
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
						if (window.location.hash) {
							setTimeout(function () {
								$('html, body').animate({ scrollTop: $(window.location.hash).offset().top }, 500);
							}, 1000);
						}
					};

					queue.on("progress", function () {
						var procValue = Math.min(Math.ceil(queue.progress * 100), 100);
						dCount.text(procValue + '%');
						
						dBar.css({
							'transform': 'translateX(-' +(100-procValue) + '%)'
						});
					
						dBar2.css({
							'transform': 'translateX('+ (100-procValue) + '%) rotateY(180deg)'
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
			// dBar.css({
			// 	'transform': 'translateX(0%)'
			// });
			// dBar2.css({
			// 	'transform': 'translateX(0%) rotateY(180deg)'
			// });
			TweenMax.fromTo(dLoad, 0.5, { opacity: 1 }, {
				delay: .8,
				opacity: 0, ease: Power4.easeOut, onComplete: function () {
					dLoad.remove();
				}
			});
		}
	}
})(jQuery);