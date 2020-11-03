var index_view = new Vue({
    el: "#app",
    data: {
        awardOpen: false,
        awardList: ""
    },
    methods: {
        kvAni() {
            var vm = this;
            var sec = 0.6;
            var tl = new TimelineMax({delay: 0.6}, );
            tl.from(".spotlight", 1.2, {
                // scale: 0.5,
                y: -1000,
                opacity: 0,
            })
            tl.from(".slogn", sec, {
                y: 50,
                opacity: 0,
            })
            tl.from(".actionbtn", sec, {
                y: 50,
                opacity: 0,
            },"-=0.6")
            tl.from(".postarea", sec, {
                opacity: 0,
            })
            tl.set(".postbd", {
                scale: 0.6,
                top: -40,
                rotation: 3
            }, "+=0.3")
            tl.set(".postbd", {
                scale: 0.7,
                top: -30,
                rotation: -3
            }, "+=0.3")
            tl.set(".postbd", {
                scale: 0.8,
                top: -20,
                rotation: 3
            }, "+=0.3")
            tl.set(".postbd", {
                scale: 0.9,
                top: -10,
                rotation: -3
            }, "+=0.3")
            tl.set(".postbd", {
                scale: 1,
                top: 0,
                rotation: 0
            })
            tl.from(".posthand", sec, {
                opacity: 0
            }, "+=0.3")
            tl.from(".kv .deco", sec, {
                opacity: 0,
            })
            tl.set(".posthand", {
                className: "+=posthand-active"
            })
            tl.set(".kv .more", {
                opacity: 1,
                className: "+=more-active"
            })
            tl.set(".kv .deco1", {
                className: "+=deco-active"
            })
            tl.set(".kv .deco2", {
                className: "+=deco-active"
            }, "+=0.1")
            tl.set(".kv .deco3", {
                className: "+=deco-active"
            }, "+=0.1")
            tl.set(".kv .deco4", {
                className: "+=deco-active"
            }, "+=0.1")
            tl.set(".kv .deco5", {
                className: "+=deco-active"
            }, "+=0.1")
            tl.set(".kv .deco6", {
                className: "+=deco-active"
            }, "+=0.1")
        },
        scrollShow() {
            var vm = this;
            if(!vm.isPc) {
                $(window).scroll(function() {
                    var windowScrollTop = $("html, body").scrollTop() > 0 ? $("html, body").scrollTop() : $(window).scrollTop();
                    if(windowScrollTop > ($(".discount").offset().top)*0.5) {
                        $(".gotop").addClass("gotop-active");
                    } else {
                        $(".gotop").removeClass("gotop-active");
                    }
                    if(windowScrollTop > ($(".showvideo").offset().top)) {
                        // $('#video1').get(0).load();
                        $('#video1').get(0).play()
                    }
                });
            }
        },
        awardFile() {
            var vm = this;
            var requestURL = 'static/json/award.json';
            var request = new XMLHttpRequest();
            request.open('GET', requestURL);
            request.responseType = 'json';
            request.send();
            request.onload = function() {
                vm.awardOpen = request.response.awardOpen;
                vm.awardList = request.response.awardList;
            }
        },
    },
    mounted: function() {
        var vm = this;

        vm.checkPage("index");
        $("body").loadpage("init",{async: false});
        vm.kvAni();
        vm.scrollShow();
        vm.awardFile();

        var indexSlick = new slickUse(".slickbd", 0);
        indexSlick.Start();
        indexSlick.videoPlay();
        $("#showvideo .btn-prev").click(function(){
            indexSlick.Prev();
        });
        $("#showvideo .btn-next").click(function(){
            indexSlick.Next();
        });
    }
})
