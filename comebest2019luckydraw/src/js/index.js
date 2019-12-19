var index = new Vue({
    el: "#app",
    data: {
        notebox: false,
    },
    methods: {
        note_toggle() {
            var vm = this;
            $(".note-title").toggleClass("active");
            vm.notebox = !vm.notebox;
        },
        commalert() {
            var vm = this;
            vm.popup = true;
            vm.popuppage = "commingsoon"
        },
        kv_Ani() {
            var vm = this;
            var sec = 0.3
            var tl = new TimelineMax({delay:1});
            tl.from(".animatearea", sec, {
                opacity: 0,
            })
            // .to(".animatearea", sec, {
            //     scale: 1.05
            // })
            // .to(".animatearea", sec, {
            //     scale: 1
            // })
            .from(".leftpd, .woman", sec*2, {
                opacity: 0,
                xPercent: 20
            })
            .from(".rightpd, .man", sec*2, {
                opacity: 0,
                xPercent: -20
            },"-=0.6")
            .from(".knot", sec*2, {
                opacity: 0,
            },"-=0.6")
            .from(".kv .actionbtn", sec*2, {
                opacity: 0,
            },"-=0.3")
            .from(".kv .sign", sec*2, {
                opacity: 0,
            },"-=0.3")
            .set(".kv .light", {
                className: "+=repscale"
            })
            .set(".kv .man, .kv .woman", {
                className: "+=reprote"
            })
            .set(".randomcloud1", {
                className: "+=cloud0"
            },"-=0.3")
            .set(".randomcloud2", {
                className: "+=cloud1"
            },"-=0.3")
            .set(".randomcloud3", {
                className: "+=cloud2"
            },"-=0.3")
            .set(".randomcloud4", {
                className: "+=cloud3"
            },"-=0.3")
            .set(".randomcloud5", {
                className: "+=cloud4"
            },"-=0.3")
            .set(".sign", {
                className: "+=signshake"
            },"+=0.3")
        },
        // creatCloud() {
        //     var vm = this;
        //     var cloudArr = [];
        //     for(var i=0; i<5; i++){
        //         var cloudimg = $('<img src="../images/cloud-5.png" class="randomcloud">');
        //         // var cloudimg = $('<img src="../images/cloud-5.png" class="randomcloud cloudimg'+i+'">');
        //         cloudArr.push(cloudimg)
        //     }
        //     cloudArr.appendTo(".cloudarea");
        // },
        // random() {
        //     setTimeout(function(){
        //         for(var i=0; i<$(".randomcloud").length; i++) {
        //             var posx = Math.random()* (80-10) + 10
        //             var posy = Math.random()* (80-20) + 20
        //             $(".randomcloud").addClass('cloud'+(i));
        //         }
        //     },2000)
        // },
        hashLink() {
            var vm = this;
            if (window.location.hash) {
                window.scrollTo(0, 0);
                setTimeout(function () {
                    window.scrollTo(0, 0);
                }, 1);
            }
            $(document).on('click', '.nav-menu a[href*="#"]', function (event) {
                var url = $.attr(this, 'href')
                var hash = url.substring(url.indexOf('#')); 
                $('html, body').animate({ scrollTop: $(hash).offset().top }, 500);
                location.hash = "";
            });
        },
        tonewEvent() {
            var vm = this; 
            var r = confirm("本活動已結束，立即前往康貝特人生不斷電馬拉松活動抽現金99,999元、PS4等好禮");
            if(r == true) {
                window.location.href = "https://lihi1.cc/Z4HgF";
            } else {
                // alert("你選擇取消前往新活動");
            }
        }
    },
    mounted: function () {
        $("body").loadpage('init', { async: false });
        // $("body").loadpage('close');
        var vm = this;
        vm.tonewEvent();
        vm.hashLink();
        vm.kv_Ani();
        vm.fixbtn();
        $('.cloudarea').scrollingParallax({
            // enableHorizontal : true,
            staticSpeed : .5,
            // loopIt : true,
            staticScrollLimit : false,
            // bgHeight: '200%',
            disableIE6 : true
        });
        $('.l-bling').scrollingParallax({
            // enableHorizontal : true,
            staticSpeed : .25,
            loopIt : true,
            staticScrollLimit : false,
            // bgHeight: '200%',
            disableIE6 : true
        });
        $('.r-bling').scrollingParallax({
            staticSpeed : 0.75,
            loopIt : true,
            staticScrollLimit : false,
            // bgHeight: '200%',
            disableIE6 : true
        });
        // vm.creatCloud();
        // vm.random();
    }
});