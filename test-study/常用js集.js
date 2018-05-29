//=====ga設定=====//
gaEvent: function(eventCategory,eventLabel,action) {
    action = action ? action : 'click';
    var device = isMobile ? " Mobile" : " PC";
    ga('send', {
        hitType: 'event',
        eventCategory: eventCategory,
        eventAction: action,
        eventLabel: eventLabel + device
    });
},
//=====end=====//


//=====YT影片ga抓取設定=====//
//PS 需在head裡載入script(src='http://www.youtube.com/iframe_api')//
YT_init: function () {
    var firstScriptTag = document.getElementsByTagName('script')[0]
        , player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: '0ExaYm_ElCA',
            playerVars: {
                'rel': 0
            },
            events: {
                'onStateChange': onPlayerStateChange,
            }
        });
    }

    var ytHasPlay = false;
    var ytHasLongPlay = false;
    var detectorYT;
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !ytHasPlay) {
            ga('send', {
                hitType: 'event',
                eventCategory: '邊緣人影片播放',
                eventAction: 'playYT',
                eventLabel: '影片播放'
            })
            ytHasPlay = true;
        }

        if (event.data == 2) { //data = 2為影片暫停
            ga('send', {
                hitType: 'event',
                eventCategory: '邊緣人影片播放',
                eventAction: 'playYT',
                eventLabel: '影片暫停'
            })
            clearInterval(detectorYT);
        }
        if (event.data == 0) {  //data = 0為影片結束
            clearInterval(detectorYT);
            ga('send', {
                hitType: 'event',
                eventCategory: '邊緣人影片播放',
                eventAction: 'playYT',
                eventLabel: '影片結束'
            })
        }
        if (event.data == 1) {
            detectLongPlay();
        }
    }

    function stopVideo() {
        player.stopVideo();
    }

    function detectLongPlay() {
        if (player.getPlayerState() == 1) {
            detectorYT = setInterval(function () {
                let nowtime = Math.floor(player.getCurrentTime());
                if (nowtime % 10 == 0) {
                    ga('send', {
                        hitType: 'event',
                        eventCategory: '邊緣人影片播放',
                        eventAction: 'playYT',
                        eventLabel: '影片播放到' + nowtime + '秒以後'
                    })
                }
            }, 1000)
        }
    }
    onYouTubeIframeAPIReady();
}
//=====end=====//


//=====彈出式btn=====//
fixed_btn: function() {
    var sec = 0.3;
    $(window).scroll(function() {
        var topHeight = $('.fixed__btnarea').height();
        var windowScrollTop = $("body").scrollTop()>0?$("body").scrollTop():$("html, body").scrollTop();
        if(windowScrollTop > $(".l-wrap").height()-1200) {
            TweenMax.to(".fixed__btnarea", sec*2, { bottom: (-1*topHeight) });
        }
        else {
            TweenMax.to(".fixed__btnarea", sec*2, { bottom: 10 });
        }
    });
},
//=====end=====//


//=====scrollMore=====//
scrollMore: function() {
    $("html,body").animate({
        scrollTop: $(".info__title").offset().top-100
    }, 1000);
},
//=====end=====//


//=====ajax sample=====//
SaveInvoice: function () {
    let vm = this;
    return $.ajax({
        url: friendo_url + "SubmitReceipt",
        method: "POST",
        headers: {
            "Token": vm.webToken
        },
        data: {
            "cellphoneId": vm.phone,
            "Username": vm.username,
            "Id": vm.inv_num,
            "IssueDate": vm.inv_date,
            "RandomNumber": vm.random_number,
            "captcha": $("#g-recaptcha-response").val()
        },
        error: function (xhr, status, error) {
            console.log("SubmitInvoice error:", xhr.statusText);
        },
        dataType: "json"
    });
},


ResendSMS: function () {
    let vm = this;
    if (!vm.loading && vm.step == 1) {
        vm.loading = true;
        vm.getAccessToken(vm.phone).then(function (token) {
            $.ajax({
                url: friendo_url + "GetOTP",
                method: "POST",
                headers: {
                        "Token": vm.webToken,
                    "Authorization": token
                },
                data: {
                    "cellphoneId": vm.phone
                },
                error: function (xhr, status, error) {
                    console.log("GetOTP error:", xhr.statusText);
                }
            }).then(function () {
                vm.loading = false;
                alert("已重新送出。");
            })
        })
    }
},
//=====end=====//


//=====各種驗證 sample=====//
post_inv: function () {
    let vm = this;
    if (!vm.loading && vm.step == 0) {
        vm.loading = true;
        let phone_rule = /^09[0-9]{8}$/
        let inv_rule = /^[a-zA-Z]{2}[0-9]{8}$/
        if (vm.username == "") {
            vm.error_msg = "請輸入使用者名稱";
            vm.loading = false;
            return
        }
        if (vm.phone == "" || !vm.phone.match(phone_rule)) {
            vm.error_msg = "請輸入手機正確格式";
            vm.loading = false;
            return
        }
        if (vm.inv_date == "") {
            vm.error_msg = "請選擇發票期別";
            vm.loading = false;
            return
        }
        if (vm.inv_num == "" || !vm.inv_num.match(inv_rule)) {
            vm.error_msg = "請輸入發票正確格式";
            vm.loading = false;
            return
        }
        if (vm.random_number == "") {
            vm.error_msg = "請輸入發票隨機碼";
            vm.loading = false;
            return
        }
        if (vm.check != 1) {
            vm.error_msg = "請勾選同意說明";
            vm.loading = false;
            return
        }
        if ($("#g-recaptcha-response").val() == "") {
            vm.error_msg = "請勾選我不是機器人";
            vm.loading = false;
            return
        }
        if (vm.error_msg == "") {
            //送出資料
            vm.SaveInvoice().then(function (result) {
                if (result.data.ReadyToCheck) {
                    vm.step = 1;
                    vm.loading = false;
                } else {
                    vm.getServey();
                }
            });

        }
    }
}
//=====end=====//


//=====loadpage sample=====//
; (function ($) {
	$.fn.loadpage = function (action, opts) {
		action = action ? action : "init";
		var progressValue = 0;
		var loadHtml = [
			'<div class="mdLoading">',
			'    <div class="loadingBox">',
			'        <img class="line2" src="images/load-pic.png">',
			'        <div class="progressBar">',
			'            <div class="progress js-bar" style="width:0"></div>',
			'        </div>',
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
			return new Promise((resolve, reject) => {
				if (!config.async) {
					var queue = new createjs.LoadQueue();
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
							'width': procValue + '%'
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
				'width':'100%'
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
//=====end=====//