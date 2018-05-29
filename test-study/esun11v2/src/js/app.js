var md = new MobileDetect(window.navigator.userAgent);
var isMobile = md.phone() != null || md.tablet() != null  || window.innerWidth <= 640;

var app = new Vue({
    el: '#app',
    data: {
        pageReady: false,
        ruleContentShow: false
    },
    computed: {
    },
    methods: {
        scrollToTa: function(el){
            var firstChar = el.charAt(0)
            var target;
            switch(firstChar) {
                case ".":
                    target = $('.'+el.slice(1));
                    break;
                case "#":
                    target = $('#'+el.slice(1));
                    break;
            }
            var target1 = $(el);

            $('html,body').animate({
                scrollTop: $(target1).offset().top
            },'slow')
        }
    },
    created: function () {
        this.pageReady= true;
    }
});

$(document).ready(function() {
    var dIndex = $('.index');
    var dInfo = $('.page-info');

    var controller = new ScrollMagic.Controller();

    function lightAni(){
        var dCard = $('.card');
        var dLightPos = dCard.find('.light__pos');
        var dLight = dCard.find('.light');

        var tl = new TimelineMax({
            repeat:-1,
            delay: 0.5,
            repeatDelay: 1,
            pause: true
        });

        tl
            .add(function(){
                if(isMobile) {
                    TweenMax.set(dLight,{scale:1.5})
                }
            })
            .add(
                TweenMax.to(
                    dLightPos,
                    2.5,
                    {
                        xPercent:300,
                        yPercent:450,
                        ease: Power2.easeOut
                    })
            )
    } 
    
    function candle(){
        var tl = new TimelineMax();
        var dFireNormal = $('.fires .fire.is-normal');
        var dFireSmall = $('.fires .fire.is-small');
        tl.add(
            TweenMax.from(dFireNormal, 1.8, {
                css:{'background-position': "5000px"},
                repeat: -1,
                ease: SteppedEase.config(50)
            })
        ,0)
            .add(
            TweenMax.from(dFireSmall, 1.8, {
                css:{'background-position': "3500px"},
                repeat: -1,
                ease: SteppedEase.config(50)
            })
        ,0)
    }

    function indexKv(){
        
        var slideIndex = 0;
        var cards = $('.kv .card');
        var words = $('.kv .card__wording')

        var playSlider= function() {

            var curIndex = slideIndex;
            slideIndex++
            
            if(slideIndex>=2){
                slideIndex=0
            }
            
            var tlTrans = new TimelineMax({
                onComplete: function(){
                    setTimeout(function(){
                        playSlider();
                    },3000)
                }
            });

            tlTrans
                .to($(cards[curIndex]),1,{opacity:0})
                .to($(cards[slideIndex]),1,{opacity:1},"0")
                .to($(words[curIndex]),0.5,{opacity:0},"0")
                .to($(words[slideIndex]),0.5,{opacity:1},"0.5")

        }


        var tlKv = new TimelineMax({
            paused: true,
            onComplete: function(){
                lightAni();
                setTimeout(function(){
                    playSlider();
                },1000)
            }
        });

        tlKv
            .from($('.kv__hd'),1,{
                opacity:0
            })
            .from($('.kv__hd-title'),0.5,{
                opacity:0,
                yPercent:-3
            },'-=0.5')
            .from($(cards[0]),0.5,{
                opacity:0,
                yPercent:-2
            })
            .from($('.card__sign'),0.5,{
                opacity:0,
                yPercent:-3
            },'-=0.1')
            .from($(words[0]),0.5,{
                opacity:0,
                yPercent:-2
            },'-=0.5')

        var scene1 = new ScrollMagic.Scene({
            triggerElement: '#anchor1'
        })
        .setTween() // trigger a TweenMax.to tween
        .addTo(controller);

        setTimeout(function(){
            tlKv.play();
        },300)
    }

    function indexSec2(){
        var tlSec2 = new TimelineMax();
        tlSec2.staggerFromTo($('.index-section2 .gifts .gift'),0.5,
            {
                opacity:0
            },
            {
                opacity:1
            },0.25);
        
        var scene2 = new ScrollMagic.Scene({
            triggerElement: '#anchor2',
            // the scene should last for a scroll distance of 100px
            offset: 0      // start this scene after scrolling for 50px
        })

        .setTween(tlSec2) // trigger a TweenMax.to tween
        .addTo(controller);
    }
    
    function indexSec3(){
        var dSec3 = $('.index-section3')
        var content = dSec3.find($('.contentRow .col'));

        var tlSec3 = new TimelineMax();
        tlSec3.staggerFromTo(content,0.5,{
            opacity:0
        },{
            opacity:1
        },0.25);

        var scene3 = new ScrollMagic.Scene({
            triggerElement: '#anchor3'
        })
        .setTween(tlSec3) // trigger a TweenMax.to tween
        .addTo(controller);
    }

    function indexSec4(){
        var dSec4 = $('.index-section4')
        var decoleft = dSec4.find($('.section4__deco-l'));
        var decoright = dSec4.find($('.section4__deco-r'));

        var dFeedBack = dSec4.find($('.feedback'));

        var tlSec4 = new TimelineMax();

        tlSec4.fromTo(decoleft,0.5,{
                xPercent:-80
            },{
                xPercent: 0
            })
            .fromTo(decoright,0.5,{
                xPercent: 80
            },{
                xPercent: 0
            },0);

        var tweenFeedback = TweenMax.fromTo(dFeedBack,0.5,
                {
                    scale:0,
                    opacity:0,
                    transformOrigin: "left bottom"
                },
                {
                    scale:1,
                    opacity:1,
                    onComplete:function(){
                        dFeedBack.addClass('wobble')
                    }
                });

        var scene4 = new ScrollMagic.Scene({
            triggerElement: '#anchor4',
            duration: 680
        })
        .setTween(tlSec4) // trigger a TweenMax.to tween
        .addTo(controller);
        
        var sceneFeedback = new ScrollMagic.Scene({
            triggerElement: '#anchor4'
        })
        .setTween(tweenFeedback ) // trigger a TweenMax.to tween
        .addTo(controller);
    }

    function info() {
        var tl = new TimelineMax({
            paused:true
        })
        var items = $('.items'); 
        var item = items.find('.item');
        item.push($('.btn__taoboa'))
        
        tl.staggerFromTo(item,0.5,
            {
                opacity:0
            },
            {
                opacity:1
            },0.25);

        setTimeout(function(){
            tl.play();
        },300)
    }

    if(dIndex.length>0) {
        indexKv();
        indexSec2(); 
        indexSec3();          
        indexSec4();
        candle();

        var navItem = $('.nav .nav-menu .nav-item');
        $(navItem[0]).addClass('is-current')
    }

    if(dInfo.length>0) {
        info();
        var navItem = $('.nav .nav-menu .nav-item');
        $(navItem[1]).addClass('is-current')
    }
});

$(document).ready(function() {
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
});
