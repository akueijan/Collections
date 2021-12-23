function loadpage(action, opts) {
	action = action ? action : 'init';
	var progressValue = 0;
	var loadHtml = [
		'<div class="mdLoading">',
		'    <div class="loadingBox">',
		// '        <img class="line2" src="images/load-pic.png">',
		'        <div class="progressBar">',
		'            <div class="progress js-bar" style="width:0"></div>',
		// '			 <div class="js-count"></div>',
		'        </div>',
		'    </div>',
		'</div>'
	].join('');
	var dLoad,dCount,dBar;
	var config = {async:false};
	var body = document.querySelector('body');

	function init() {
		body.insertAdjacentHTML('beforeend',loadHtml);
		dLoad = document.querySelector('body .mdLoading');
		dCount = document.querySelector('.mdLoading .js-count');
		dBar = document.querySelector('.mdLoading .js-bar');
		return new Promise(function (resolve, reject){
			if (!config.async) {
				var queue = new createjs.LoadQueue();
				queue.setMaxConnections(200);
				var loadArray = [];

				document.querySelectorAll('img').forEach(function(i) {
					loadArray.push({
						id: i,
						src: i.src
					})
				})
				console.log(loadArray)
				queue.loadManifest(loadArray);

				var handleComplete = function () {
					// $(window).trigger("loadCompleted");
					var winEvent = new Event('loadCompleted');
					// window.addEventListener('loadCompleted',function(){}, false)
					window.dispatchEvent(winEvent);
					// document.querySelector(window).addEventListener('loadCompleted')
					// document.querySelector('.js-wrap').style
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
					if(dCount) {
						dCount.innerHTML = procValue + '%';
					}
					if(dBar) {
						dBar.style.width = procValue + '%';
					}
				});

				queue.on("complete", handleComplete, this);
			}
			else {
				resolve(true);
			}
		});
	}

	if(action == 'init'){
		return init();	
	}
	if (action == 'close') {
		dLoad = document.querySelector('body .mdLoading');
		dCount = document.querySelector('.mdLoading .js-count');
		dBar = document.querySelector('.mdLoading .js-bar');
		if(dCount) {
			dCount.innerHTML = '100%';
		}
		if(dBar) {
			dBar.style.width = '100%';
		}
		TweenMax.fromTo(dLoad, 0.5, { opacity: 1 }, {
			delay: .8,
			opacity: 0, ease: Power4.easeOut, onComplete: function () {
				dLoad.remove();
			}
		});
	}
}