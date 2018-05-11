const products_view = new Vue({
    el: "#app",
    data: {
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
    },
    mounted: function () {
        let vm = this;
        $("body").loadpage('init');
    },
});