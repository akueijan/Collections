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
                toggleMenu()
            });

            dAllLink.click(function() {
                dObj.toggleClass('nav--active');
                toggleMenu()
            });

            $(".btn__note").click(function() {
                $('html,body').addClass('_freeze');
            });

            $(".note__close").click(function() {
                $('html,body').removeClass('_freeze');
            });

        }
        function toggleMenu() {
            $('html,body').toggleClass('_freeze');
            $('.l-main').toggleClass('l-main--active');
        }
        // initialize every element
        this.each(function() {
            init($(this));
        });
        return this;
    };
    // start
    $(function() {
        $("#nav").menu();
    });
})(jQuery);

var fbhtml_url="http://www.yahoo.com.tw"; //fb分享的網址

var app = new Vue({
    el: '#app',
    data: {
        popup: false,
        note: false,
    },
    props: {
    },
    watch: {
    },
    computed: {
    },
    methods: {
        sakura: function() {
            var fa = false;
  
            //more layers and css blur will cause performance drop
            var layer2 = new Layer(16, 6);
            setInterval(layer2.addIcon, 400);

            var layer1 = new Layer(32, 4);
            setInterval(layer1.addIcon, 800);

            function Layer(str, speed){
                this.addIcon = function(){
                    var random_icon = icons[Math.floor(Math.random()*icons.length)];
                    var $random_x = Math.floor((Math.random() * 600) + 1);
                
                    var str= '<div class=hana></div>'
                    var $icon = $(str).appendTo("#sakura");

                    //initial position
                    TweenLite.to($icon, 0, {x: $random_x, color: "#2222ff", y: -80});

                    //main animation
                    TweenLite.to($icon, speed, {color: "#ff00ff", y: 800, x: $random_x + (Math.random() * 400), opacity: 0, ease:Linear.easeNone, onComplete: deleteIcon, onCompleteParams: ["{self}"]});

                    //rotate animation
                    var rotation_speed = (Math.random() + 10);
                    TweenMax.to($icon, rotation_speed, {rotation: 390, ease:Linear.easeNone, repeat: -1});
                };

                var deleteIcon = function(obj){
                    obj.target.remove();
                    obj.remove;
                };

                var icons = [];
            }
        },

        startAni: function() {
            var sec = 0.3;
            var tl = new TimelineMax({ 
                repeatDelay:0,
                
                onStart: function() {
                    TweenMax.set($('#ripple'),{opacity:1})
                },
                onComplete: function() {
  
                },
            });
            tl.to(".kv__item", sec*3, { opacity: 1 })
                .to(".kv__hand--1", sec*3, { y: -281 })
                .to(".kv__hand--2", sec/8, { opacity:1 })
                .to(".kv__hand--1", sec/8, { opacity:0 })
                .to(".kv__hand--3", sec/8, { opacity:1 })
                .to(".kv__hand--2", sec/8, { opacity:0 })
                .to(".kv__hand--4", sec/8, { opacity:1 })
                .to(".kv__hand--3", sec/8, { opacity:0 })
                .to(".kv__hand--5", sec/8, { opacity:1 })
                .to(".kv__hand--4", sec/8, { opacity:0 })
                .to(".kv__hand--6", sec/8, { opacity:1 })
                .to(".kv__hand--5", sec/8, { opacity:0 })
                .to(".kv__hand--7", sec/8, { opacity:1 })
                .to(".kv__hand--6", sec/8, { opacity:0 })
                .to(".kv__hand--8", sec/8, { opacity:1 })
                .to(".kv__hand--7", sec/8, { opacity:0 })
                .to(".kv__blood", sec*6, { opacity: 0.8, scale: 1, transformOrigin:"center center"})
                .to(".kv__hand--8", sec*3, { opacity:0, display:"none" },"-=0.9")
                .to(".kv__blood", sec, {css:{zIndex:1}})
        },

        fixAni: function() {
            $(window).scroll(function() {
                var windowScrollTop = $("body").scrollTop()>0?$("body").scrollTop():$("html, body").scrollTop();
                var tl = new TimelineMax();
                var sec = 0.3;
                if(windowScrollTop > $(".step__hd").offset().top-200 && windowScrollTop < $(".step__ft").offset().top+100) {
                    tl.to(".step__other", sec*3, { right: 0 })
                } else {
                    tl.to(".step__other", sec*1, { right: -$(".step__other").width() })
                }
            });
        },

        fixSakura: function() {
            $(window).scroll(function() {
                var windowScrollTop = $("body").scrollTop()>0?$("body").scrollTop():$("html, body").scrollTop();
                var tl = new TimelineMax();
                var sec = 0.3;
                if(windowScrollTop > $(".step__hd").offset().top-200 && windowScrollTop < $(".step__ft").offset().top+100 ) {
                    tl.to("#sakura", sec*3, { opacity: 1 })
                } else {
                    tl.to("#sakura", sec*1, { opacity: 0 })
                }
            });
        },

        noteOpen: function() {
            var vm = this;
            vm.note = true;
        },

        noteClose: function() {
            var vm = this;
            vm.note = false;
        },

        fbShare: function() {
            window.open('http://www.facebook.com/sharer/sharer.php?u='+fbhtml_url);
        },

    },
    created: function () {

    },
    mounted: function () {
        console.log("app mounted");
        var vm = this;


        //kv動畫
        function initRipple() {
 
            //Settings - params for WaterRippleEffect
            var settings = {
                image: './images/rippie.png',//背景图片
                rippleRadius: 50,//radius of the ripple
                width: 350,//width
                height: 350,//height
                delay: 300,//if auto param === true. 1 === 1 second delay for animation
                auto: true//if auto param === true, animation starts on it´s own
            };
           
            //------------------------------------------------------------------------
            
            //standalone
            //初始化
            var waterRippleEffect = new WaterRippleEffect( document.getElementById( 'ripple' ), settings );
        
        }
        
        if($("#ripple").length > 0) {
            initRipple();
        };

        setTimeout(function(){
            vm.startAni();
        },300);

        $(".kv__more").click(function(){
            $("html,body").animate({
                scrollTop: $(".step__title--title1").offset().top-50
            }, 1000);
        });

        if($("#sakura").length > 0) {
            vm.sakura();
        };

        vm.fixAni();
        vm.fixSakura();

    }
});



