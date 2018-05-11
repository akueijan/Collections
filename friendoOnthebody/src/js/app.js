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
    }
});


//=====kv動畫=====//
var photo = $(".kv__img--peo1");
var prodimg1 = $(".kv__img--1");
var prodimg2 = $(".kv__img--2");
var light = $(".kv__btnarea--light");
var tl1 = new TimelineMax();
var tl2 = new TimelineMax({ delay: 2, repeatDelay:0, repeat:-1, yoyo:false});
var tl3 = new TimelineMax({ repeat:-1, yoyo: true});
var sec = 1;
tl1
    .to(photo, sec, { opacity: 1, left: 0, });
tl2
    .to(prodimg1, sec, { opacity: 1, right: -10,})
    .to(prodimg1, sec, { opacity: 0, right: -50,}, "+=3")
    .to(prodimg2, sec, { opacity: 1, right: -10,})
    .to(prodimg2, sec, { opacity: 0, right: -50,}, "+=3");
tl3
    .to(light, sec, { opacity: 1 });

//=====btn gotop scroll======//
$(document).ready(function(){
    $(".gotop").click(function(){
        $("html,body").animate({ scrollTop: 0 }, 1000);
    });
    $(".kv__btn--more").click(function(){
        $("html,body").animate({ scrollTop: 1100 }, 1000);
        $(this).fadeOut(1000);
    });
    $(window).scroll(function() {
        var scrollVal = $(this).scrollTop();
        if(scrollVal > 900) {
            $(".kv__btn--more").fadeOut(1000);
        } else {

        }
    });
});
