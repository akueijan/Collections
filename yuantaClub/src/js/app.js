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

$(document).ready(function(){
    console.log('document.ready');
});

var lists = [
    { "text": "請選擇也可以為model設定value>selected", "value": ""}
];

for (var i = 0; i <3; i++) {
    lists.push(
        { 
            "text": (i).toString(), 
            "value": (i).toString() 
        }
    )
}

Vue.mixin({
    data: function () {
        return {
            initText: 'hello world! Vue Start'
        }
    },
    mounted: function () {
        console.log("init mixins");
    }
});

var app = new Vue({
    el: '#app',
    data: {
    },
    props: {
    },
    watch: {
    },
    computed: {
    },
    methods: {
        drawAni: function() {
            var dLottery = $('#lottery');
            var dCover = dLottery.find('.cover');
            var dLightBg = dLottery.find('.lightBg');
            var dPeo1First = dLottery.find('.peo1-first');
            var dPeo1Fail = dLottery.find('.peo1-fail');
            var dPeo1Win = dLottery.find('.peo1-win');
            var dPeo2 = dLottery.find('.peo2');
            var dWinText = dLottery.find('.winText');
            var dFailText = dLottery.find('.failText');
            var dWinPic = dLottery.find('.winPic');
            var dFailPic = dLottery.find('.failPic');
            var dBtnsIsFirst = dLottery.find('.btn-area.isFirst');
            var dBtnsIsPlayed = dLottery.find('.btn-area.isPlayed');
            var result = Math.floor(Math.random() * (1 - 0 + 1)) + 0;  
            var beat = 0.5;

            var tl = new TimelineMax({
                paused: true,
                onStart: function(){
                    dBtnsIsFirst.hide();
                },
                onComplete: function(){
                    dBtnsIsPlayed.fadeIn();
                }
            });

            var tlWin = new TimelineMax({
                paused: true,
            });

            var tlFail = new TimelineMax({
                paused: true,
            });

            tl.to(dCover,beat,{
                    opacity:0,
                    y:-200
                }
            )
            
            //依據取回結果撥放不同動畫
            console.log(result)
            if(result) {
                console.log('中獎')
                tl.add(tlWin.play());
            } else {
                console.log('沒中獎')
                tl.add(tlFail.play());
            }

            tlWin.to(dWinText,beat/2,{
                        opacity:1,
                    }
                ).to(dWinPic,beat/2,{
                        opacity:1,
                    }
                ).to(dLightBg,beat/2,{
                        opacity:1,
                    }
                ).set(dPeo1First,{
                        opacity:0,
                    }
                ).set(dPeo1Win,{
                        opacity:1,
                    }
                )

            tlFail.to(dFailText,beat/2,{
                        opacity:1,
                    }
                ).to(dFailPic,beat/2,{
                        opacity:1,
                    }
                ).set(dPeo1First,{
                        opacity:0,
                    }
                ).set(dPeo1Fail,{
                        opacity:1,
                    }
                )

            tl.play();
        },
        resetLottery: function(playAgain){
            var vm = this;
            var dLottery = $('#lottery');
            var dCover = dLottery.find('.cover');
            var dLightBg = dLottery.find('.lightBg');
            var dPeo1First = dLottery.find('.peo1-first');
            var dPeo1Fail = dLottery.find('.peo1-fail');
            var dPeo1Win = dLottery.find('.peo1-win');
            var dPeo2 = dLottery.find('.peo2');
            var dWinText = dLottery.find('.winText');
            var dFailText = dLottery.find('.failText');
            var dWinPic = dLottery.find('.winPic');
            var dFailPic = dLottery.find('.failPic');
            var dBtnsIsFirst = dLottery.find('.btn-area.isFirst');
            var dBtnsIsPlayed = dLottery.find('.btn-area.isPlayed');
            var showObjArrs = [
                dPeo1First,
            ];
            var hideObjArrs = [
                dPeo1Win,
                dPeo1Fail,
                dWinText,
                dFailText,
                dWinPic,
                dFailPic,
                dLightBg,
            ];

            if(playAgain){
                dBtnsIsPlayed.hide();
            } else {
                dBtnsIsFirst.show();
                dBtnsIsPlayed.hide();
            }
            

            TweenMax.set(dCover,{
                opacity: 1,
                y: 0
            })

            showObjArrs.forEach(function(el,index) {
                TweenMax.set($(el),{opacity:1});
            });

            hideObjArrs.forEach(function(el,index) {
                TweenMax.set($(el),{opacity:0});
            });
        },
        playAgain: function() {
            var vm = this;
            vm.resetLottery(true);
            setTimeout(function(){
                vm.drawAni();
            },300)
        },
        draw: function(result) {
            var vm = this;
            vm.drawAni(result);
        }
    },
    created: function () {
    },
    mounted: function () {
        var vm = this;

        console.log("app mounted");
    }
});

//=======AnimateScroll========//
$('.kvmore').click(function () {
    $('.videoarea').animatescroll ({ scrollSpeed:1000, easing:'easeInSine', padding:80 });
});
/*============ 動畫 ============*/
// var tl = new TimelineMax({ repeatDelay:0 });
// var sec = 1;
//     tl.to(".kvbglight", sec, { opacity: 1, })
//     tl.to(".kvpeo-2", sec, { opacity: 1, xPercent:-160 })
//     tl.to(".kvpeo-1", sec, { opacity: 1, xPercent:150 }, "-=1")
//     tl.to(".kvframe", sec, { opacity: 1, })
//     tl.to(".kv-title", 0.5, { opacity: 1, })
//     tl.to(".kv-btn", 0.5, { opacity: 1, })
//     tl.to(".kv-item1", 0.5, { ease: Back.easeOut.config(1), opacity: 1, yPercent: -55 })
//     tl.to(".kv-item2", 0.5, { ease: Back.easeOut.config(1), opacity: 1, yPercent: -50 })
//     tl.to(".kv-item3", 0.5, { ease: Back.easeOut.config(1), opacity: 1, yPercent: -45 })
//     tl.to(".kvmore", 0.5, { opacity: 1, });

//=====mobile=====//
// var tl2 = new TimelineMax({ repeatDelay:0 });
// var sec = 1;
//     tl2.to(".kvbglight", sec, { opacity: 1 })
//     tl2.to(".kvframe", sec, { opacity: 1 })
//     tl2.to(".kv-title", 0.5, { opacity: 1, })
//     tl2.to(".kv-btn", 0.5, { opacity: 1, })
//     tl2.to(".kv-item2", 0.5, { ease: Back.easeOut.config(1), opacity: 1, yPercent: -10 })
//     tl2.to(".kv-item1", 0.5, { ease: Back.easeOut.config(1), opacity: 1, yPercent: -10 })
//     tl2.to(".kv-item3", 0.5, { ease: Back.easeOut.config(1), opacity: 1, yPercent: -10 })
//     tl2.to(".kvpeo-2", sec, {opacity: 1})
//     tl2.to(".kvpeo-1", sec, {opacity: 1}, "-=1")

//===pc===//
if($(window).width() > 640) {
    var tl = new TimelineMax({ repeatDelay:0 });
    var sec = 1;
    
    tl.to(".kvbglight", sec/2, {opacity: 1,})
    .add('light')
    .to(".kvpeo-2", sec/2, {
        opacity: 1, 
        xPercent:-160 
    },'light')
    .to(".kvpeo-1", sec/2, {
        opacity: 1,
        xPercent:150 
    },"light")
    .to(".kvframe", sec, { opacity: 1, })
    .to(".kv-title", sec/4, { opacity: 1, })
    .to(".kv-btn", sec/4, { opacity: 1, })
    .to(".kv-item1", 0.25, {
        ease: Back.easeOut.config(1), 
        opacity: 1, 
        yPercent: -55
    })
    .to(".kv-item2", 0.25, {
        ease: Back.easeOut.config(1), 
        opacity: 1, 
        yPercent: -50 })
    .to(".kv-item3", 0.25, { 
        ease: Back.easeOut.config(1),
        opacity: 1, 
        yPercent: -45 
    })
    .to(".kvmore", 0.5, {
        opacity: 1,
    });
        // tl.to(".kvword-1", 0.5, { opacity: 1 })
        // tl.to(".kvword-2", 0.5, { opacity: 1 });

    var tl2 = new TimelineMax({ repeat:-1, repeatDelay:3, yoyo:true, delay:7, });
        tl2.fromTo(".kvword-1", 1, { opacity: 0 }, { opacity: 1 })
        tl2.fromTo(".kvword-2", 1, { opacity: 0 }, { opacity: 1 })

} 
//===mobile===//
else {
    var tlmb1 = new TimelineMax({ repeatDelay:0 });
    var sec = 1;
        tlmb1.to(".kvbglight", sec, { opacity: 1 })
        tlmb1.to(".kvframe", sec, { opacity: 1 })
        tlmb1.to(".kv-title", 0.5, { opacity: 1, })
        tlmb1.to(".kv-btn", 0.5, { opacity: 1, })
        tlmb1.to(".kv-item2", 0.5, { ease: Back.easeOut.config(1), opacity: 1, yPercent: -10 })
        tlmb1.to(".kv-item1", 0.5, { ease: Back.easeOut.config(1), opacity: 1, yPercent: -10 })
        tlmb1.to(".kv-item3", 0.5, { ease: Back.easeOut.config(1), opacity: 1, yPercent: -10 })
        tlmb1.to(".kvpeo-2", sec, {opacity: 1})
        tlmb1.to(".kvpeo-1", sec, {opacity: 1}, "-=1")
        // tlmb1.to(".kvword-1", 0.5, { opacity: 1, });
        // tlmb1.to(".kvword-2", 0.5, { opacity: 1, });

    var tlmb2 = new TimelineMax({ repeat:-1, repeatDelay:3, yoyo:true, delay:7, });
        tlmb2.fromTo(".kvword-1", 1, { opacity: 0 }, { opacity: 1 })
        tlmb2.fromTo(".kvword-2", 1, { opacity: 0 }, { opacity: 1 })
}
/*=========== 動畫end ===========*/
