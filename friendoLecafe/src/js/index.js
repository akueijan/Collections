const index_view = new Vue({
    el: "#app",
    data: {
        note_box: false,
    },    
    methods: {
        YT_init: function () {
            var player;
            function onYouTubeIframeAPIReady() {
                player = new YT.Player('player', {
                    height: '100%',
                    width: '100%',
                    videoId: '',
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
                        eventCategory: '影片播放',
                        eventAction: 'playYT',
                        eventLabel: '影片播放'
                    })
                    ytHasPlay = true;
                }

                if (event.data == 2) { //data = 2為影片暫停
                    ga('send', {
                        hitType: 'event',
                        eventCategory: '影片播放',
                        eventAction: 'playYT',
                        eventLabel: '影片暫停'
                    })
                    clearInterval(detectorYT);
                }
                if (event.data == 0) {  //data = 0為影片結束
                    clearInterval(detectorYT);
                    ga('send', {
                        hitType: 'event',
                        eventCategory: '影片播放',
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
        },
        initializeClock: function (endtime) {
            function padLeft(str, len) {
                str = '' + str;
                if (str.length >= len) {
                    return str;
                } else {
                    return padLeft("0" + str, len);
                }
            }
            var timeinterval = setInterval(function () {
                var t = Date.parse(endtime) - Date.parse(new Date());
                var seconds = Math.floor((t / 1000) % 60);
                var minutes = Math.floor((t / 1000 / 60) % 60);
                var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
                var days = Math.floor(t / (1000 * 60 * 60 * 24));
                var t = {
                    'total': t,
                    'days': padLeft(days, 2),
                    'hours': padLeft(hours, 2),
                    'minutes': padLeft(minutes, 2),
                    'seconds': padLeft(seconds,2)
                };
                document.querySelector(".days > .value").innerText = t.days;
                document.querySelector(".hours > .value").innerText = t.hours;
                document.querySelector(".minutes > .value").innerText = t.minutes;
                document.querySelector(".seconds > .value").innerText = t.seconds;
                if (t.total <= 0) {
                    clearInterval(timeinterval);
                }
            }, 1000);
        },
        kvAni: function() {
            let sec = 0.3;
            let tl = new TimelineMax({ repeatDelay:0 });
            tl.to(".kv__slogan", sec*2, { opacity: 1})
                .to(".kv__title", sec*2, { opacity: 1})
                .to(".kv__items", sec*2, { opacity: 1})
                .to(".kv__btn", sec*2, { opacity: 1})
        },
        scrollMore: function() {
            $("html,body").animate({
                scrollTop: $(".info__title").offset().top-150
            }, 1000);
        },
        indexSet: function () {
            let vm = this;
            vm.kvAni();
            $(".note__title").click(function () {
                $(this).toggleClass("note__title--isOpen");
            });
        }
    },
    mounted: function () {
        // this.initializeClock("2018/3/28 12:00:00");
        let vm = this;
        $("body").loadpage('init', { async: true });
            if (findGetParameter("memberID")) {
                vm.getAccessToken(findGetParameter("memberID")).then(function (data) {
                    vm.indexSet();
                    $("body").loadpage('close');
                })
            } else {
                vm.indexSet();
                $("body").loadpage('close');
            }
    },
});