const index_view = new Vue({
    el: "#index",
    data: {
        videoOpen: false,
        noteOpen: false,
        slider_inx: {
            section1: 0
        }
    },
    
    methods: {
        ga_click: ga_init,
        sliderOneChange(index) {
            this.slider_inx.section1 = index;
        },
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
    },
    mounted: function () {
        $(".notes__title").click(function () {
            $(this).toggleClass("notes__title--isOpen");
        });
        $(".btn-back").click(function () {
            $("html,body").animate({ scrollTop: 0 }, 1000);
        });
        let custom = CustomEase.create("custom", "M0,0 C0.035,0 0.228,0.238 0.326,0.452 0.392,0.606 0.499,0.999 0.5,1 0.5,0.999 0.627,0.918 0.708,0.918 0.759,0.918 0.838,0.985 0.852,0.998 0.896,0.96 0.939,0.984 0.954,0.984 0.969,0.984 1,1 1,1");
        var kv = new TimelineMax({ paused: true});
        kv.add(TweenMax.fromTo('.kv-sportlight', 0.3, { opacity: 1 }, { opacity: 0.9, repeat: 3, ease: SteppedEase.config(12), yoyo: true }))
            .add(TweenMax.fromTo('.kv-sportlight', 0.7, { opacity:0.9}, {
                opacity: 0,  ease: Power4.easeOut, onComplete: function () {
                    $(".kv-sportlight").hide();
                }
            }, "-=.2"))
            .add([
                TweenMax.fromTo('.kv-prods .p1', 1, {top:"-100vh"}, { top: "72.4%", ease: custom }),
                TweenMax.fromTo('.kv-prods .p3', 1.2, { top: "-100vh" }, { top: "77.6%", ease: custom }),
                TweenMax.fromTo('.kv-prods .p2', 1.4, { top: "-100vh" }, { top: "92.1%", ease: custom }),
                TweenMax.fromTo('.kv-prods .p4', 1.6, { top: "-100vh" }, { top: "86.3%", ease: custom }),
                TweenMax.fromTo('.kv-prods .p5', 1.8, { top: "-100vh" }, { top: "76.2%", ease: custom }),
                TweenMax.from('.kv-happyboy', 0.8, { opacity: 0, delay: 1 })
            ])
            .add(TweenMax.from(".kv-chatbubble", 0.6, { opacity: 0 }))
            .add([
                TweenMax.from(".kv-title", 0.6, { opacity: 0, y: "50px" }),
                TweenMax.from(".kv-btn", 0.6, { opacity: 0, y: "50px" }), "-=.2"
            ], "-=.2");
        $("body").loadpage().then((data) => {
            kv.play();
            this.YT_init();
        })
    },
    components: {
        'carousel-3d': Carousel3d.Carousel3d,
        'slide': Carousel3d.Slide
    },
});