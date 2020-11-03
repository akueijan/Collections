var carowner_view = new Vue({
    el: "#app",
    data: {
        page: "carowner"
    },
    methods: {
        openAni() {
            var vm = this;

            var sec = 0.3;
            var tl = new TimelineMax({delay: 1.2, 
                onComplete: () => {
                    $(".carowner").css("overflow-x","auto");
                    // document.querySelector('.carowner').scrollLeft += 750;
                    $(".carowner").animate({
                        scrollLeft: 750
                    }, 900);
                    setTimeout(function(){
                        $(".btn-totry").css("opacity","1")
                    }, 1200)
                    // document.getElementById("carowner").addEventListener("wheel", myFunction);
                    // document.getElementById("carowner").addEventListener("touchmove", myFunction, false);
                    // var i = 0;
                    // function stopTheScroll(){
                    //     $('body').removeClass('stop-scrolling');
                    // }        
                    // function myFunction(e){
                    //     console.log(e)
                    // //prevent body scrolling
                    //     // $('body').addClass('stop-scrolling');

                    //     //Check if the position is greater/less than the 
                    //     //width of your content and prevent the scroll from accumulating.
                    //     if(i < 750){
                    //         i = 750;
                    //         return;
                    //     }                
                    //     else if( i > 2750){
                    //         i = 2750;
                    //         return;
                    //     }                
                        
                    //     //Scroll by w.e speed you want.
                    //     e.wheelDelta > 0?i -= 50: i += 50;            
                    //     $( "#carowner" ).scrollLeft(i);
                    // }
                }
            });
            tl.from(".carowner .car", sec*3, {
                // opacity: 0,
                x: -350
            })
            tl.to(".carowner .bg", sec*10, {
                // opacity: 0,
                x: -1924
            },"-=0.2")
            tl.from(".carowner .title", sec, {
                opacity: 0,
                // x: 50
            })
            tl.from(".carowner .more", sec, {
                opacity: 0,
            })
        },

        scrollW_ga() {
            var vm = this;

            var ga25 = false;
            var ga50 = false;
            var ga75 = false;
            var ga100 = false;

            $(".carowner").scroll(function(){
                var scrollW = $(".carowner").scrollLeft();
                var boxWidth = $(".ownerbox").width();
                // console.log(scrollW);
                if(scrollW > boxWidth*0.25) {
                    if(!ga25) {
                        vm.gaEvent("車主證言_25%","scroll")
                        // vm.gtmEvent("車主證言_25%")
                        ga25 = true;
                    }
                }
                if(scrollW > boxWidth*0.5) {
                    if(!ga50) {
                        vm.gaEvent("車主證言_50%","scroll");
                        // vm.gtmEvent("車主證言_50%");
                        ga50 = true;
                    }
                }
                if(scrollW > boxWidth*0.75) {
                    if(!ga75) {
                        vm.gaEvent("車主證言_75%","scroll");
                        // vm.gtmEvent("車主證言_75%");
                        ga75 = true;
                    }
                }
                if(scrollW >= boxWidth) {
                    if(!ga100) {
                        vm.gaEvent("車主證言_100%","scroll");
                        // vm.gtmEvent("車主證言_100%");
                        ga100 = true;
                    }
                }
            })
        },

        checkFb() {
            var vm = this;
            var u = navigator.userAgent;
            var ua = navigator.userAgent.toLowerCase();
            var isFbApp = u.indexOf("FB") > -1; // FB App 內建瀏覽器
            if(isFbApp) {
                var body = document.querySelector("body");
                body.classList.add("fbweb");
            }
        },
    },
    created: function() {
        var vm = this;

        $("body").loadpage("init", {async: false});
    },
    mounted: function() {
        var vm = this;

        // $("body").loadpage("init", {async: false});
        vm.checkBrower("");
        vm.openAni();
        vm.checkFb();

        vm.scrollW_ga();
    }
})