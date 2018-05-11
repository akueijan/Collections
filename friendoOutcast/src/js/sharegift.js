const share_gift = new Vue({
    el: "#sharegift",
    data: {
        products:{}
    },
    methods: {
        ga_click: ga_init,
        fixed_btn: function() {
            var sec = 0.3;
            $(window).scroll(function() {
                var topHeight = $('.fixed__btnarea').height();
                var windowScrollTop = $("body").scrollTop()>0?$("body").scrollTop():$("html, body").scrollTop();
                if(windowScrollTop > $(".l-wrap").height()-1200) {
                    TweenMax.to(".fixed__btnarea", sec*2, { bottom: (-1*topHeight) });
                }
                else {
                    TweenMax.to(".fixed__btnarea", sec*2, { bottom: 10 });
                }
            });
        },
    },
    mounted: function () { 
        let vm = this;
        $("body").loadpage();
        $.get({
            url: friendo_url + "GetShareProd",
            dataType: 'json',
            success: function(e){
                if (e.result) {
                    vm.products = e.data;
                    vm.fixed_btn();
                }
                else {
                    console.log("error", e.errorMsg);
                }
            }
        });
    }
})