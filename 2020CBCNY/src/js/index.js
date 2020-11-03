var index_view = new Vue({
    el: "#app",
    data: {
        
    },
    methods: {
        kvAni() {
            var vm = this;
            var sec = 0.3;
            var tl = new TimelineMax({delay: 1.2});
            tl.from(".content", sec, {
                opacity: 0,
            })
            tl.from(".slogn", sec, {
                opacity: 0,
                x: -150
            })
            tl.from(".slogntxt", sec, {
                opacity: 0,
                x: -150,
            })
            tl.from(".btnarea", sec, {
                opacity: 0,
                x: -150,
            }, "-=0.2")
            tl.from(".kv_peo", sec, {
                opacity: 0,
                x: 150
            })
            // tl.from(".kvbtns", sec, {
            //     opacity: 0,
            // },"-=0.3")
        },

        scrollShow() {
            var vm = this;
            $(window).scroll(function() {
                var windowScrollTop = $("html, body").scrollTop() > 0 ? $("html, body").scrollTop() : $(window).scrollTop();
                if(windowScrollTop > $(".inv_event").offset().top-$(".inv_event").height()/2) {
                    $(".inv_event").addClass("page-active");
                }
                if(windowScrollTop > $(".product").offset().top-$(".product").height()/2) {
                    $(".product").addClass("page-active");
                }
                if(windowScrollTop > $(".gameread").offset().top-$(".gameread").height()/2) {
                    $(".gameread").addClass("page-active");
                }
                if(windowScrollTop > $(".readme").offset().top-$(".readme").height()/3) {
                    $(".readme").addClass("page-active");
                }
            });
        }
    },
    mounted: function() {
        var vm = this;
        // vm.getIe();
        $("body").loadpage("init",{async : false});
        // $("body").loadpage("close");
        vm.getIe();
        vm.checkBrowser();
        vm.kvAni();
        vm.scrollShow();
    }
})
