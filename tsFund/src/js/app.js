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
                $('body').toggleClass('_freeze'); //點擊menu btn後 body狀態改為鎖定
            });

            dAllLink.click(function() {
                dObj.removeClass('active');
                dObj.removeClass('nav--active'); //點擊menu後 把選單收回
                $('body').removeClass('_freeze'); //點擊menu後 body狀態改回正常
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
});

var md = new MobileDetect(window.navigator.userAgent);
var isMobile = md.phone() != null || md.tablet() != null || window.innerWidth <= 640;

var app = new Vue({
    el: '#app',
    data: {
        popup: false,
        noticepopup: false,
    },
    props: {
    },
    watch: {
    },
    computed: {
    },
    methods: {
        startAni: function() {
            var sec = 1;
            if(!isMobile) {
                var tl = new TimelineMax({ repeatDelay:0 });
                tl.to(".kv__book", sec/2, { opacity: 1 })
                    .to(".kv__slogn", sec/2, { opacity:1, yPercent: -30 })
                    .to(".kv__peo1", sec/2, { opacity:1, xPercent: -80 }, +"1")
                    .to(".kv__peo2", sec/2, { opacity:1, xPercent: 80 }, +"1")
            } 
            else {
                var tlmb = new TimelineMax({ repeatDelay:0 });
                tlmb.to(".kv__book", sec/2, { opacity: 1 })
                .to(".kv__slogn", sec/2, { opacity:1, yPercent: -20 })
                .to(".kv__peo1", sec/2, { opacity:1, xPercent: -20 }, +"1")
                .to(".kv__peo2", sec/2, { opacity:1, xPercent: 20 }, +"1.5")
            }
        },
        goTop: function() {
            $(window).scroll(function() {
                var windowScrollTop = $("body").scrollTop()>0?$("body").scrollTop():$("html, body").scrollTop();
                var tl = new TimelineMax();
                var sec = 1;
                var topWidth = $('.goTop').width();
                if(windowScrollTop > $(".kv").height()-50) {
                    tl.to(".goTop", sec/2, { right: 0 });
                }
                else {
                    tl.to(".goTop", sec/2, { right: - topWidth });
                }
            });
        },
        goTop_mb: function() {
            $(window).scroll(function() {
                var tl = new TimelineMax();
                var sec = 1;
                var topHeight = $('.goTop').height();
                var windowScrollTop = $("body").scrollTop()>0?$("body").scrollTop():$("html, body").scrollTop();
                if(windowScrollTop > $(".kv").height()-50 && windowScrollTop < $("#sec7").offset().top-500) {
                    tl.to(".goTop", sec/2, { bottom: 0 });
                }
                else {
                    tl.to(".goTop", sec/2, { bottom: - topHeight });
                }
            });
        },
        secondAni: function() {
            var tl = new TimelineMax();
            var sec = 1;
            var sec2_2_offsettop = $("#sec2-2").offset().top;
            var sec2_3_offsettop = $("#sec2-3").offset().top;
            var sec3_offsettop = $("#sec3").offset().top;
            var sec4_offsettop = $("#sec4").offset().top;
            var sec5_offsettop = $("#sec5").offset().top;
            var sec6_offsettop = $("#sec6").offset().top;
            var sec7_offsettop = $("#sec7").offset().top;
            $(window).scroll(function() {
                var windowScrollTop = $("body").scrollTop()>0?$("body").scrollTop():$("html, body").scrollTop();
                if(windowScrollTop > $(".kv").height()-150) {
                    tl.to(".bd-pic--1", sec/2, { opacity: 1, xPercent: -5 }, 0)
                    .to(".bd-txt--1", sec/2, { opacity: 1, xPercent: 5 }, 0);
                }
                
                if(windowScrollTop > sec2_2_offsettop-450) {
                    TweenMax.to(".bd-pic--2", sec/2, { opacity: 1, xPercent: 5 })
                    TweenMax.to(".bd-txt--2", sec/2, { opacity: 1, xPercent: -5 });
                }
                
                if(windowScrollTop > sec2_3_offsettop-450) {
                    TweenMax.to(".bd-pic--3", sec/2, { opacity: 1, xPercent: -5 })
                    TweenMax.to(".bd-txt--3", sec/2, { opacity: 1, xPercent: 5 });
                }

                if(windowScrollTop > sec3_offsettop-500) {
                    TweenMax.to("#sec3", sec/2, { opacity: 1});
                }

                if(windowScrollTop > sec4_offsettop-900) {
                    TweenMax.to("#sec4", sec/2, { opacity: 1});
                }

                if(windowScrollTop > sec5_offsettop-500) {
                    TweenMax.to("#sec5", sec/2, { opacity: 1});
                }

                if(windowScrollTop > sec6_offsettop-500) {
                    TweenMax.to("#sec6", sec/2, { opacity: 1});
                }

                if(windowScrollTop > sec7_offsettop-500) {
                    TweenMax.to("#sec7", sec/2, { opacity: 1});
                }
            });
        },
        secondAni_mb: function() {
            var tl = new TimelineMax();
            var sec = 1;
            var sec2_2_offsettop = $("#sec2-2").offset().top;
            var sec2_3_offsettop = $("#sec2-3").offset().top;
            var sec3_offsettop = $("#sec3").offset().top;
            var sec4_offsettop = $("#sec4").offset().top;
            var sec5_offsettop = $("#sec5").offset().top;
            var sec6_offsettop = $("#sec6").offset().top;
            var sec7_offsettop = $("#sec7").offset().top;
            $(window).scroll(function() {
                var windowScrollTop = $("body").scrollTop()>0?$("body").scrollTop():$("html, body").scrollTop();
                if(windowScrollTop > $(".kv").height()-150) {
                    tl.to(".bd-pic--1", sec/2, { opacity: 1,  }, 0)
                    .to(".bd-txt--1", sec/2, { opacity: 1,  }, 0);
                }
                
                if(windowScrollTop > sec2_2_offsettop-450) {
                    TweenMax.to(".bd-pic--2", sec/2, { opacity: 1, })
                    TweenMax.to(".bd-txt--2", sec/2, { opacity: 1, });
                }
                
                if(windowScrollTop > sec2_3_offsettop-450) {
                    TweenMax.to(".bd-pic--3", sec/2, { opacity: 1, })
                    TweenMax.to(".bd-txt--3", sec/2, { opacity: 1, });
                }

                if(windowScrollTop > sec3_offsettop-500) {
                    TweenMax.to("#sec3", sec/2, { opacity: 1});
                }

                if(windowScrollTop > sec4_offsettop-900) {
                    TweenMax.to("#sec4", sec/2, { opacity: 1});
                }

                if(windowScrollTop > sec5_offsettop-500) {
                    TweenMax.to("#sec5", sec/2, { opacity: 1});
                }

                if(windowScrollTop > sec6_offsettop-500) {
                    TweenMax.to("#sec6", sec/2, { opacity: 1});
                }

                if(windowScrollTop > sec7_offsettop-500) {
                    TweenMax.to("#sec7", sec/2, { opacity: 1});
                }
            });
        },
        scrollTo: function(e) {
            var vm = this;
            $("html,body").animate({ 
                scrollTop: $(e).offset().top
            }, 1000);
        },
        popupOpen: function() {
            var vm = this;
            vm.popup = true;
            $('body').toggleClass('_freeze');
        },
        closePopup: function() {
            var vm = this;
            vm.popup = false;
            $('body').removeClass('_freeze');
        },
        noticepopupOpen: function() {
            var vm = this;
            vm.noticepopup = true;
            $('body').toggleClass('_freeze');
        },
        noticeclosePopup: function() {
            var vm = this;
            vm.noticepopup = false;
            $('body').removeClass('_freeze');
        },
        gaEvent: function(eventCategory,eventLabel) {
            var device = isMobile ? " Mobile" : " PC";
            ga('send', {
                hitType: 'event',
                eventCategory: eventCategory,
                eventAction: 'click',
                eventLabel: eventLabel + device
            });
            ga('clientTracker.send', {
                hitType: 'event',
                eventCategory: eventCategory,
                eventAction: 'click',
                eventLabel: eventLabel + device
            });
        },
        fb: function(event, comment) {
            var device = isMobile ? " Mobile" : " PC";
            var comment2 = comment + device;
            fbq('trackCustom', event, { custom_param: comment2 });
        }
    },
    created: function () {
    },
    mounted: function () {
        var vm = this;

        setTimeout(function(){
            vm.startAni();
        },1000);
        
        $(".kv__other").click(function() {
            $("html,body").animate({ 
                scrollTop: $("#sec4").offset().top-50
            }, 1000);
        });
        //=====pc版=====//
        if(!isMobile) {
            
            //=====kv__more 下滑=====//
            $(".kv__more").click(function() {
                $("html,body").animate({ 
                    scrollTop: $("#sec2 > h2").offset().top-50
                }, 1000);
            });
            vm.goTop();
            vm.secondAni();
        } 
        
        //=====手機版=====//
        else {
            $(".kv__more").click(function() {
                $("html,body").animate({ 
                    scrollTop: $("#sec2").offset().top
                }, 1000);
            });
            vm.secondAni_mb();
            vm.goTop_mb();
        }
    }
});

