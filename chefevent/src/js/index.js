var index_view = new Vue({
    el: "#app",
    data: {
        events: false
    },
    methods: {
        kv_Ani() {
            var vm = this;
            var sec = 0.6;
            var tl = new TimelineMax({
                delay: 1.2,
                onComplete: () => {
                    vm.repeatHand();
                }
            });
            tl.from(".sloganarea", sec, {
                opacity: 0,
                y: 50,
            })
            tl.from(".kv .btnarea", sec, {
                opacity: 0,
                y: 50,
            },"-=0.6")
            tl.from(".car", sec, {
                opacity: 0,
                x: -500,
            })
            tl.from(".richartarea", sec, {
                opacity: 0,
            })
            tl.set(".aniblock", {
                css: {className: '+=ani-active'}
            })
        },
        repeatHand() {
            var vm = this;
            var sec = 0.6;
            var tl = new TimelineMax({
                repeat: -1,
                // repeatDelay: 3
            });
            tl.to(".kv .hand", sec/2, {
                rotation: 0,
                // opacity: 1
            })
            tl.to(".kv .shine", sec, {
                opacity: 1
            })
            // tl.to(".shine", 0.2, {
            //     opacity: 0
            // })
            // tl.to(".shine", 0.2, {
            //     opacity: 1
            // })
            tl.set(".kv .shine", {
                opacity: 0
            },"+=1.2")
            tl.to(".kv .hand", sec, {
                rotation: 15,
                // opacity: 1
            })
        },
        scrollShow() {
            var vm = this;
            
            $(window).scroll(function() {
                var windowScrollTop = $('html, body').scrollTop() > 0? $('html, body').scrollTop() : $(window).scrollTop()
                if(windowScrollTop > $('.member').offset().top) {
                    $('.fixed-btn').addClass('btnactive')
                } else {
                    $('.fixed-btn').removeClass('btnactive')
                }

                if(windowScrollTop > $('.member').offset().top - $('.member .block1').height()) {
                    $('.member .block1, .member h2').addClass('blockactive')
                }
    
                if(windowScrollTop > $('.member .block1').offset().top) {
                    $('.member .block2').addClass('blockactive');
                    $('.member .block3').addClass('blockactive')
                }
    
                // if(windowScrollTop > $('.member .block2').offset().top) {
                    
                // }
    
                if(windowScrollTop > $('.member .block3').offset().top) {
                    $('.gifts .block1, .gifts > .content, .gifts h2').addClass('blockactive');
                    setTimeout(function() {
                        $('.gifts .block1 .aniarea').addClass('aniactive')
                    },600)
                }
    
                if(windowScrollTop > $('.gifts .block1').offset().top) {
                    $('.gifts .block2').addClass('blockactive');
                    setTimeout(function() {
                        $('.gifts .block2 .aniarea').addClass('aniactive')
                    },600)
                }
    
                if(windowScrollTop > $('.gifts .block2').offset().top) {
                    $('.gifts .block3').addClass('blockactive');
                    setTimeout(function() {
                        $('.gifts .block3 .aniarea').addClass('aniactive')
                    },600)
                }
    
                if(windowScrollTop > $('.gifts .block3').offset().top) {
                    $('.gifts .entertain').addClass('blockactive');
                    $('.gifts .anibox').addClass('enteractive');
                    setTimeout(function() {
                        $('.gifts .coins').addClass('coinsactive');
                        setTimeout(function() {
                            $('.gifts .point').addClass('pointactive'); 
                        }, 300)
                    }, 600)
                }

                if(windowScrollTop > $('.gifts .entertain').offset().top) {
                    $('.classroom h2').addClass('h2active')
                }

                if(windowScrollTop > $('.classroom h2').offset().top - $('.classroom h2').height()) {
                    $('.classroom .word1').addClass('blockactive')
                }

                if(windowScrollTop > $('.classroom .word1').offset().top - $('.classroom .word1').height()) {
                    $('.classroom .word2').addClass('blockactive')
                }

                if(windowScrollTop > $('.classroom .word2').offset().top - $('.classroom .word2').height()) {
                    $('.classroom .word3').addClass('blockactive')
                }

                if(windowScrollTop > $('.classroom .word3').offset().top - $('.classroom .word3').height()) {
                    $('.classroom .word4').addClass('blockactive')
                }

                if(windowScrollTop > $('.classroom .word4').offset().top - $('.classroom .word4').height()) {
                    $('.classroom .wordtab').addClass('blockactive')
                }

                if(windowScrollTop > $('.classroom .wordtab').offset().top - $('.classroom .word4').height()/2) {
                    $('.classroom .icons').addClass('blockactive');
                    $('.events').addClass('eventsactive')
                }

                // if(windowScrollTop > $('.classroom .wordtab').offset().top) {
                //     $('.events').addClass('eventsactive')
                // } else {
                //     $('.events').removeClass('eventsactive')
                // }
            })
        },
        outLink(str) {
            var vm = this;

            var utmlink;
            var oldlink
            switch(str) {
                case "new_oa":
                    utmlink = "&second_source=richart&second_medium=click&second_campaign=chefevent_202006&second_content=new_oa";
                    oldlink = "&utm_source=richart&utm_medium=click&utm_campaign=chefevent_202006&utm_content=new_oa"
                    break;
                case "scroll_oa":
                    utmlink = "&second_source=richart&second_medium=click&second_campaign=chefevent_202006&second_content=scroll_oa";
                    oldlink = "&utm_source=richart&utm_medium=click&utm_campaign=chefevent_202006&utm_content=scroll_oa";
                    break;
                case "menu_new":
                    utmlink = "&second_source=eventsite&second_medium=click&second_campaign=chefevent_202006&second_content=menu_new";
                    oldlink = "&utm_source=eventsite&utm_medium=click&utm_campaign=chefevent_202006&utm_content=menu_new";
                    break;
                default:
                    break;
            }
            vm.searhUtm();
            setTimeout(function(){
                if(vm.utm == "") {
                    window.open("https://richart.tw/TSDIB_RichartWeb/RC07/RC070400?sn=202000071" + oldlink);
                } else {
                    window.open("https://richart.tw/TSDIB_RichartWeb/RC07/RC070400?sn=202000071" + vm.utm + utmlink);
                }
            },100)
        }
    },
    created: function() {
        var vm = this;
        $("body").loadpage("init", {async: false});
    },
    mounted: function() {
        var vm = this;

        vm.kv_Ani();
        vm.scrollShow();
        // vm.checkBrower("index");
        // if(!vm.isPc) {
        //     vm.scrollShow();
        // };


        // $(".tomember").click(function() {
        //     freecoins_cv ({"app": "FREECOINS_19570"}); 
        // })
    }
})
