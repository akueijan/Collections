var app = new Vue({
    el: "#app",
    i18n,
    data: function () {
        return {
            t2: this.$t('index.title'),
            list_block1: true,
            list_block2: false,
            block1List:0,
            block2List:0,
            block1_pic:0,
            block2_pic:0,
            area_default: 0,
            area_block1: false,
            area_block2: false,
            popupVideo: false,
        }
    },
    methods:{
        bl_click:function(inx,event){
            $(event.target).parents("li").addClass("list--active");
            $(event.target).parents("li").siblings().removeClass("list--active");
            var vm = this;
            vm.area_default = 3;
            vm.area_block1 = true;
            vm.area_block2 = false;
            vm.block1List = inx;
            vm.block1_pic = inx;
        },
        bl2_click:function(inx,event){
            $(event.target).parents("li").addClass("list--active");
            $(event.target).parents("li").siblings().removeClass("list--active");
            var vm = this;
            vm.area_default = 3;
            vm.area_block1 = false;
            vm.area_block2 = true;
            vm.block2List = inx;
            vm.block2_pic = inx;
        },
        areaDefault_Open:function() {
            var vm = this;
            vm.area_default = 0;
            vm.list_block1 = true;
            vm.list_block2 = false;
            vm.area_block1 = true;
            vm.area_block2 = false;
        },
        areaB2_Open:function() {
            var vm = this;
            vm.area_default = 1;
            vm.list_block1 = false;
            vm.list_block2 = true;
            vm.area_block1 = false;
            vm.area_block2 = true;
        },
        kv_Ani: function() {
            var sec = 0.3;
            var tl = new TimelineMax({delay: 0.3});
            tl.from(".kv_pic", sec*2, {
                opacity: 0
            })
            tl.from(".kv_plane", sec*3, {
                scale: 0,
                top: -20
            })
            tl.from(".kv_slogn", sec*2, {
                opacity: 0,
            })
        },
        popupVideo_close: function() {
            var vm = this;
            vm.popupVideo = false;
            if(player.stopVideo){
                player.stopVideo();
            }
            $("body").removeClass("_freeze");
        },
        popupVideo_open: function() {
            var vm = this;
            vm.popupVideo = true;
            if(player.stopVideo){
                player.stopVideo();
            }
            $("body").addClass("_freeze");
        },
        setCookie: function(cname,cvalue,exdays) {
            var d = new Date();
            d.setTime(d.getTime()+(exdays*24*60*60*1000));
            var expires = "expires="+d.toGMTString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        },
        // gaEvent2: function(eventCategory,eventLabel) {
        //     // var device = isMobile ? " Mobile" : " PC";
        //     ga('send', {
        //         // hitType: 'event',
        //         eventCategory: eventCategory,
        //         eventAction: 'click',
        //         eventLabel: eventLabel,
        //     });
        //     // gtag('clientTracker.send', {
        //     //     hitType: 'event',
        //     //     eventCategory: eventCategory,
        //     //     eventAction: 'click',
        //     //     eventLabel: eventLabel,
        //     // });
        // },
        gaEvent2: function(eventCategory,eventLabel) {
            ga('send', {
                hitType: 'event',
                eventCategory: eventCategory,
                eventLabel: eventLabel,
            });
        },
    },
    mounted: function() {
        $("body").loadpage('init', { async: true });
        // $(window).on('beforeunload', function() {
        //     $(window).scrollTop(0);
        // });
        $("body").loadpage('close');
        // location.hash = "/kv";

        var vm = this;

        vm.kv_Ani();

        //判斷是否第一次進來//
        if(document.cookie.match("video")) {
            vm.popupVideo = false;
        } else {
            vm.setCookie("video","isWatch?","1");
            vm.popupVideo = true;
        }

        $(".abouteva .list_area li").click(function() {
            $(this).find(".list_box").slideToggle(300);
            $(this).siblings().find(".list_box").hide();
        });
        
        $(".classinfo .btnarea .btn1").click(function() {
            $(".classinfo .btnarea .btn").removeClass("btn--active");
            $(".classinfo .btnarea .btn1").addClass("btn--active");
            $(".class_show .block1 li, .class_show .block2 li").removeClass("list--active");
        });

        $(".classinfo .btnarea .btn2").click(function() {
            $(".classinfo .btnarea .btn").removeClass("btn--active");
            $(".classinfo .btnarea .btn2").addClass("btn--active");
            $(".class_show .block1 li, .class_show .block2 li").removeClass("list--active");
            // $(".class_show .block2 li").first().addClass("list--active");
        });
        
        $(".ctrol-nav").navscroll({
            sec:600,
            url_hash:false,
            head_hight:0
        });

        var windowWidth = $(window).width();
        if(windowWidth > 768) {
            $(window).scroll(function() {
                if($("html, body").scrollTop() > $(".abouteva").offset().top-100) {
                    $(".float-menu").fadeIn();
                } 
                if($("html, body").scrollTop() < $(".abouteva").offset().top-100) {
                    $(".float-menu").fadeOut();
                }
                if($("html, body").scrollTop() > $(".feature").offset().top-200) {
                    $(".featurearea ul").addClass("list--active");
                }
                if($(window).scrollTop() > $(".feature").offset().top-300){
                    $(".featurearea ul").addClass("list--active");
                }
            });
        } else {
            $(window).scroll(function() {
                if($(window).scrollTop() > $(".feature").offset().top-300){
                    $(".featurearea ul").addClass("list--active");
                }
                if($(window).scrollTop() > $(".abouteva").offset().top-100) {
                    $(".mb-float-menu").addClass("mb-float-menu-active");
                } 
                if($(window).scrollTop() < $(".abouteva").offset().top-100) {
                    $(".mb-float-menu").removeClass("mb-float-menu-active");
                }
            });

            $(".list-sp").click(function() {
                $("html,body").animate({
                    scrollTop: $(".class_content").offset().top,
                }, 0);
            });

            // $(".block1 > li, .block2 > li").click(function() {
            //     $("body").toggleClass("_freeze");
            // });

            // $(".btn-close").click(function() {
                
            // })
        };
        
        $(".front .bottom").click(function() {
            $(this).parents(".front").parents("li").addClass("featurelist--active");
        });

        $(".back .bottom").click(function() {
            $(this).parents(".back").parents("li").removeClass("featurelist--active");
        });

        $(".nav-btn").click(function() {
            $("nav").toggleClass("nav-active");
        });

        $(".nav-menu li").click(function() {
            $("nav").removeClass("nav-active");
        });

        if (vm.popupVideo) {
            $("body").addClass("_freeze");
        } else {
            $("body").removeClass("_freeze");
        };

        $(".kv_more").click(function() {
            $("html,body").animate({
                scrollTop: $(".abouteva").offset().top,
            }, 600);
        });

        //===ga set===//
        var aboutCun = false;
        var featureCun = false;
        var classinfoCun = false;
        $(window).scroll(function() {
            if($(window).scrollTop() > $(".abouteva").offset().top && $(window).scrollTop() < $(".feature").offset().top && aboutCun==false) {
                vm.gaEvent2('捲軸','About EVA');
                aboutCun = true;
            }
            if($(window).scrollTop() > $(".feature").offset().top && $(window).scrollTop() < $(".classinfo").offset().top && featureCun==false) {
                vm.gaEvent2('捲軸','Feature');
                featureCun = true;
            }
            if($(window).scrollTop() > $(".classinfo").offset().top && classinfoCun==false) {
                vm.gaEvent2('捲軸','Classinfo');
                classinfoCun = true;
            }
        });

        //===hash show===//
        $(window).scroll(function() {
            if($(window).scrollTop() < $(".abouteva").offset().top) {
                location.hash = "/kv";
                ga('set', 'page', '/kv');
                ga('send','pageview');
            }
            if($(window).scrollTop() > $(".abouteva").offset().top && $(window).scrollTop() < $(".feature").offset().top) {
                location.hash = "/abouteva";
                ga('set', 'page', '/abouteva');
                ga('send','pageview');
            }
            if($(window).scrollTop() > $(".feature").offset().top && $(window).scrollTop() < $(".classinfo").offset().top) {
                location.hash = "/feature";
                ga('set', 'page', '/feature');
                ga('send','pageview');
            }
            if($(window).scrollTop() > $(".classinfo").offset().top) {
                location.hash = "/classinfo";
                ga('set', 'page', '/classinfo');
                ga('send','pageview');
            } 
        });
    }
});


var player;
function onYouTubeIframeAPIReady() {
    // 該div的id為player
    player = new YT.Player('player', {
        width: '100%',
        height: '100%',
        videoId: '3uTDVrEPe4k',
        playerVars: {'rel': 0},//開關推薦影片
        events: {
            // 'onReady': onPlayerReady,
            // 'onStateChange': onPlayerStateChange
        }
    });
    // player2 = new YT.Player('player2', {
    //     width: '100%',
    //     height: '100%',
    //     videoId: 'UR5hbW4MNNE',
    //     playerVars: {'rel': 0},
    //     events: {
    //         // 'onReady': onPlayerReady,
    //         // 'onStateChange': onPlayerStateChange
    //     }
    // });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
