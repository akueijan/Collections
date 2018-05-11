var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

(function($) {
    $.fn.menu = function(opts) {
        // default configuration
        var config = $.extend({}, {
            opt1: null
        }, opts);
        // main function
        function init(obj) {
            var dObj = $(obj);
            var dMenulink = dObj.find('.nav-btn');
            var dAllLink = dObj.find('.nav-menu a');

            dMenulink.click(function() {
                dObj.toggleClass('nav--active');
                // $('body').toggleClass('_freeze');
            });

            dAllLink.click(function() {
                dObj.removeClass('active')
            });
        }
        // initialize every element
        this.each(function() {
            init($(this));
        });
        return this;
    };
    // start
    $(function() {
        $(".nav").menu();
    });
})(jQuery);

Vue.mixin({
    data: function () {
        return {
            initText: 'hello world! Vue Start'
        }
    },
    mounted: function () {
    }
});

var playerArr = [];

var app = new Vue({
    el: '#app',
    data: {
        videoPopup: false,
        confirmVotes: false,
        bodyScroll: false,
        players: [false,false],
        curPlayer: 0
    },
    watch: {
        bodyScroll : function(){
            var vm = this;
            if(vm.openPopup==true){
                $('body').attr({
                    style: 'overflow:hidden'
                });
            }
            else {
                $('body').attr({
                    style: ''
                });
            }
        }
    },
    computed: {
    },
    methods: {
        openVideo: function(videoNum){
            var vm = this;
            vm.videoPopup = !vm.videoPopup
            vm.bodyScroll = !vm.bodyScroll;
            vm.curPlayer = videoNum;
            vm.players[videoNum] = true;
            playerArr[videoNum].playVideo();
            var num = videoNum;
            // setTimeout(function(){
            //     playerArr[videoNum].playVideo();
            // },3000)
        },
        closeVideo: function(){
            var vm = this;
            var curPlayer = vm.curPlayer; 
            
            vm.videoPopup = !vm.videoPopup;
            vm.bodyScroll = !vm.bodyScroll;
            vm.players[curPlayer] = false;
            playerArr[curPlayer].stopVideo();
        },
        actionVote: function(){
            var vm = this;
            vm.confirmVotes = !vm.confirmVotes;
            vm.bodyScroll = !vm.bodyScroll
        },
        kvApproach: function(){
            var vm = this;
            var kv = $('.kv');

        }
    },
    created: function () {
    },
    mounted: function () {
        var vm = this;
        var index = $('.index');
        // gotop button
        $('.js-gotop').click(function(){
            $('.l-wrap').animatescroll({
                padding: 0,
                easing: 'easeOutCubic'
            });
        });
        // remove loading mask
        setTimeout(function(){
            TweenMax.to($('#loading'),0.5,{
                alpha:0,
                onComplete:function(){
                    $('#loading').remove();
                    setTimeout(function(){
                        // tl.play(); 
                    },200)
                }
            })
        },1000)

        // YT流程------------------------------------------------
        window.onYouTubeIframeAPIReady = function() {
            window.player1 = new YT.Player('player1', {
                width: '100%',
                height: '100%',
                videoId: 'e-ORhEE9VVg',
                autoplay: 1,
                playerVars: {
                    rel: 0
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });

            window.player2 = new YT.Player('player2', {
                width: '100%',
                height: '100%',
                videoId: 'pb-kc6DWIDI',
                autoplay: 1,
                playerVars: {
                    rel: 0
                },
                events: {
                    'onReady': "",
                    'onStateChange': ""
                }
            });

            playerArr.push(window.player1);
            playerArr.push(window.player2);
        }
        // 4. The API will call this function when the video player is ready.
        window.onPlayerReady = function(event) {
            // alert(
            //     playerArr[0].getPlayerState()
            // )
            // event.target.playVideo();
            // vm.video = true;
            vm.openVideo(0)
                // vm.openVideo(0);
        }
        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        var done = false;
        function onPlayerStateChange(event) {
        }

        function stopVideo() {
      
        }


/*
        //首頁進場
        
        var userAgentStr = navigator.userAgent.toLowerCase() 
        if(userAgentStr.indexOf('msie')!=-1||userAgentStr.indexOf('trident')!=-1) {
            console.log('isIE');
            $('.ani').remove();
        }

        var kv = $('.kv')
        var dWrap = kv.find('.l-container');
        var dP1 = kv.find('.kv__photo-1');
        var dP2 = kv.find('.kv__photo-2');
        var dP3 = kv.find('.kv__photo-3');

        var tl = new TimelineMax({
            paused: true
        });

        tl.from(dWrap,1,{
                opacity:0,
                ease: Power0.easeNone
            })
            .add('mainEnter')
            .from(dP1,0.75,{
                opacity:0,
                x:-50
            },'mainEnter-=0.5')
            .from(dP2,0.75,{
                opacity:0,
                x:50
            },'mainEnter-=0.5')
            .from(dP3,0.5,{
                opacity:0,
                scale: 0,
                transformOrigin: '0 100%',
                ease: Elastic.easeOut.config(1, 1)
            })

        
        // init controller
        var controller1 = new ScrollMagic.Controller();
        var controller2 = new ScrollMagic.Controller();
        var controller3 = new ScrollMagic.Controller();

        var tweenBP1 = TweenMax.from($('.bd__photo-1'),0.5,{
            y:200,
            opacity: 0
        })
        var tweenBP2 = TweenMax.from($('.bd__photo-2'),0.5,{
            y:400,
            opacity: 0
        })
        var tweenBP3 = TweenMax.from($('.bd__photo-3'),0.5,{
            y:300,
            opacity: 0
        })
        // create a scene
        new ScrollMagic.Scene({
                triggerElement: '.blvideo',
                offset: 100        // start this scene after scrolling for 50px
            })
            .setTween(tweenBP1)
            .addTo(controller1); // assign the scene to the controller
        
        new ScrollMagic.Scene({
                triggerElement: '.rank__title',
                offset: 100        // start this scene after scrolling for 50px
            })
            .setTween(tweenBP2)
            .addTo(controller2); // assign the scene to the controller
        
        new ScrollMagic.Scene({
                triggerElement: '.rank__title',
                offset: 100        // start this scene after scrolling for 50px
            })
            .setTween(tweenBP3)
            .addTo(controller3); // assign the scene to the controller
            */
    }

});

$(document).ready(function(){

});
