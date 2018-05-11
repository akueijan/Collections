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
                $('body').toggleClass('_freeze');
            });

            dAllLink.click(function() {
                dObj.removeClass('nav--active')
                $('body').removeClass('_freeze');
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

$(document).ready(function(){
    console.log('document.ready');
});

var app = new Vue({
    el: '#app',
    data: {
        openRule: false,
        openPop: false,
        pupTicket: false,
        pupOops: false,
        loading: false,
    },
    props: {
    },
    watch: {
        // openPop: function(val, oldVal) {
        //     if (val) {
        //         alert("open")
        //         $('body').addClass('_freeze');
        //         // $('.popup--ticket').removeClass('isHidden');
        //     } else {
        //         alert("close")
        //         $('body').removeClass('_freeze');
        //     }
        // }
    },
    computed: {
    },
    methods: {
    },
    created: function () {
    },
    mounted: function () {
        console.log("app mounted");
        //=====kv動畫=====//
        var photo = $(".kv__img--products");
        var beans = $(".kv__img--beans");
        var kvbtn = $(".kv__btn");
        var tl1 = new TimelineMax({ delay:1});
        var tl2 = new TimelineMax({ delay:5, repeat:-1, repeatDelay:1,});
        var sec = 1;
        tl1
            .to(photo, sec/2, { opacity: 1,})
            .to(beans, sec/2, { opacity: 1,},"+=0.5")
            .to(kvbtn, sec/2, { opacity: 1,});
        tl2
            .to(kvbtn, sec/2, { rotation:2})
            .to(kvbtn, sec/2, { rotation:-2})
            .to(kvbtn, sec/2, { rotation:1})
            .to(kvbtn, sec/2, { rotation:-1})
            .to(kvbtn, sec/2, { rotation:0});
        $(".gotop").click(function(){
            $("html,body").animate({ scrollTop: 0 }, 1000);
        });
        $(".kvbtn--more").click(function(){
            $("html,body").animate({ scrollTop: 1050 }, 1000);
        });
        $(".databtn--more").click(function(){
            $("html,body").animate({ scrollTop: 950 }, 1000);
        });
    }
});



//=====btn gotop scroll======//
$(document).ready(function(){
    //=====輪播圖=====//
    $(".mySlick").slick({
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        initialSlide: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 1000,
        dots: true,
        centerMode: true,
        variableWidth: true,
        initialSlide: 0,
    });
});
