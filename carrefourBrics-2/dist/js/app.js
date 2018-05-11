var md = new MobileDetect(window.navigator.userAgent);
var isMobile = md.phone() != null || md.tablet() != null  || window.innerWidth <= 640;


//          fb line chrome safari etc
//AndroidOS -  -    v      -      - 
//iOS       v  v    -      v      -
var fBBrowser = /FBAV/i.test(navigator.userAgent);
var lineBrowser = navigator.userAgent.toLowerCase().indexOf('line')>-1;
var androidChrome = !lineBrowser && (md.os() == "AndroidOS" && navigator.userAgent.toLowerCase().indexOf('chrome')>-1);
var iosSafari = !lineBrowser && (md.os() == "iOS" && navigator.userAgent.toLowerCase().indexOf('safari')>-1 && navigator.userAgent.toLowerCase().indexOf('crios')==-1);
alert(androidChrome+','+iosSafari )
if(fBBrowser){
    //fb app瀏覽器
    if (md.os() == "AndroidOS") {
    }
    if (md.os() == "iOS") {
    }
}
else if(!iosSafari&&!androidChrome){
    if (md.os() == "AndroidOS") {
    }
    if (md.os() == "iOS") {
    }
}
else {

}


if ((/FBAV/i.test(navigator.userAgent) || (navigator.userAgent.toLowerCase().indexOf('line') != -1 && md.os() == "AndroidOS"))) {
    if (md.os() == "AndroidOS") {
        $('.js_androidAlert').show();
    }
    if (md.os() == "iOS") {
        $('.js_iosAlert').show();
    }
}
else if ((md.os() == "AndroidOS" || md.os() == "iOS") && navigator.userAgent.toLowerCase().indexOf('line') == -1) {
    if (md.os() == "AndroidOS") {
        $('.js_androidOtherAlert').show();
    }
    if (md.os() == "iOS") {
        $('.js_iosOtherAlert').show();
    }
}

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

$("img.lazy").lazyload({
    effect : "fadeIn"
});

// side start
var articleArr = []
var dArticle = $('.info article');

for (var i = 0;i<dArticle.length; i++) {
    var tmpTop = $(dArticle[i]).offset().top;
    articleArr.push(tmpTop);
}
// side end

Vue.mixin({
    data: function () {
        return {
            initText: 'hello world! Vue Start'
        }
    },
    mounted: function () {
    }
});

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

var app = new Vue({
    el: '#app',
    data: {
        optSection: false,
        openVotes: false,
        openVideo: false,
        openPopup: false
    },
    props: {
    },
    watch: {
        openPopup : function(){
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
                window.player.stopVideo();
            }
        }
    },
    computed: {
       
    },
    methods: {
        scrollTo: function(ta){
            $(ta).animatescroll({
                padding: 80,
                easing: 'easeOutCubic'
            });
        },
        initAccordion: function(){
            $('.accordion__item').mouseover(function(event) {
                /* Act on the event */
                $('.accordion__item').removeClass('active')
                $(this).addClass('active')
            });
        },
        ctrlVideo: function(){
            var vm = this;
            if(vm.openVideo) {
                vm.openVideo = false;
                vm.openPopup = false;
                window.player.stopVideo();
            }
            else {
                vm.openVideo = true;
                vm.openPopup = true;
                window.player.playVideo();
            }
        },
        ctrlVotes: function(){
            var vm = this;
            
            if(vm.openVotes) {
                vm.openVotes = false;
                vm.openPopup = false;
            }
            else {
                vm.openVotes = true;
                vm.openPopup = true;
            }
        },
        locationDetect: function(){
            var vm = this;
            var didScroll;

            $(window).scroll(function(event){
                didScroll = true;
            });

            setInterval(function() {
                if (didScroll) {
                    vm.hasScrolled();
                    // vm.sideStatus();
                    didScroll = false;
                }
            }, 500);
        },
        hasScrolled: function(){
            var vm = this;
            var scrollTop = $(window).scrollTop();
            var innerHigh = window.innerHeight;
            
            if(innerHigh-scrollTop>0){
                $('.nav').addClass('isOnFirst')
                TweenMax.set($('.nav'),{
                    yPercent: -100,
                    opacity: 0,
                });
                $('.side').fadeOut('slow/400/fast');
            }
            else {
                $('.nav').removeClass('isOnFirst')
                TweenMax.to($('.nav'),0.3,{
                    yPercent: 0,
                    opacity: 1
                });
                $('.side').fadeIn('slow/400/fast');
            }
        },
        sceneDetect: function(){
            var vm = this;
            console.log('change');
            var articles = $('.info article');
            var sideBtns = $('.side .side__btn');
            var articleH = articles.height();
            // init controller
            var controller = new ScrollMagic.Controller();
            // build scenes
            for( var i = 1;i<8;i++) {
                var taClass = '.side__btn.btn'+i;
                new ScrollMagic.Scene({
                        triggerElement: "#article"+i, 
                        duration: articleH
                    })
                    .setClassToggle(taClass, "action") // add class toggle
                    .addTo(controller);
            }
        }
    },
    created: function () {
    },
    mounted: function () {

        var vm = this;

        // KV效果------------------------------------------------
        vm.initAccordion();

        // YT流程------------------------------------------------
        window.onYouTubeIframeAPIReady = function() {
            window.player = new YT.Player('player', {
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
        }
        // 4. The API will call this function when the video player is ready.
        window.onPlayerReady = function(event) {
            // event.target.playVideo();
        }
        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        var done = false;
        function onPlayerStateChange(event) {
        }

        function stopVideo() {
            player.stopVideo();
        }


        // pc才會觸發------------------------------------------------
        if(!isMobile) {
            vm.locationDetect();
            vm.hasScrolled();
            vm.sceneDetect();

            var rtime;
            var timeout = false;
            var delta = 500;

            var resizeend = function() {
                if (new Date() - rtime < delta) {
                    setTimeout(resizeend, delta);
                } else {
                    timeout = false;
                    vm.sceneDetect();
                }               
            };

            $(window).resize(function(event) {
                rtime = new Date();
                if (timeout === false) {
                    timeout = true;
                    setTimeout(resizeend, delta);
                }
            });
        }
    }
});


$(document).ready(function(){
    
});
