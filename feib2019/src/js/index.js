var index_view = new Vue({
    el: "#app",
    data: {
        note: false,
    },
    methods: {
    },
    mounted: function() {
        var vm = this;
        vm.pageLoad();
        alert("活動已結束");
        $("#events .l-container>h2,#events .l-container>.content").one('inview', function () {
            $(this).addClass('active');
            $(".eventsbg").addClass("eventsbg-active");
        });
        if(isMobile) {
            $(window).scroll(function() {
               if($(window).scrollTop() > $("#events").offset().top) {
                   $(".floatlink").addClass("floatlink-active")
               } else {
                $(".floatlink").removeClass("floatlink-active")
               }
            })
        };
        $("#notetxt").click(function() {
            // $("html, body").scrollTop($("#notetxt").offset().top);
            $("html,body").animate({
                scrollTop: $("#notetxt").offset().top
            }, 500);
        });
    }
})


