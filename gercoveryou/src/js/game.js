var game_view = new Vue({
    el: "#app",
    data: {
        gameBlock: 0,
        gameSel: 0,
        gameLink: "",
        gtmdata: "",
        gameSlide: 0
    },
    methods: {
        introAni() {
            var vm = this;
            var sec = 0.6;
            var tl = new TimelineMax({delay: 0.6, 
                onComplete: function() {
                    setTimeout(function(){
                        vm.gameBlock = 1;
                        setTimeout(function(){
                            var gameSlick = new slickUse(".gameslick" ,vm.gameSlide);
                            gameSlick.Start();
                            $(".gamearea .btn-prev").click(function(){
                                gameSlick.Prev();
                            });
                            $(".gamearea .btn-next").click(function(){
                                gameSlick.Next();
                            });
                        }, 50)
                    }, 2000)
                }
            });
            tl.from(".intro .word", 0.9, {
                y: 100,
                opacity: 0,
            })
            tl.from(".intro .word p", 0.6, {
                y: 50,
                opacity: 0,
            })
            // tl.to(".intro .word p", 0.6, {
            //     y: -100,
            //     opacity: 0,
            // }, "+=2.4")
        },
        selgame(game) {
            var vm = this;
            vm.eventOpen("toplay");
            if(game == 1) {
                vm.gameLink = "https://instagram.com/ar/2667678300175161/";
                vm.gtmdata = "挑戰頁_第一招_立即挑戰";
            }
            if(game == 2) {
                vm.gameLink = "https://instagram.com/ar/1342910316098878/";
                vm.gtmdata = "挑戰頁_第二招_立即挑戰";
            }
            if(game == 3) {
                vm.gameLink = "https://instagram.com/ar/551610642194908/";
                vm.gtmdata = "挑戰頁_第三招_立即挑戰";
            }
        },
    },
    mounted: function() {
        var vm = this;
        vm.checkPage();
        $("body").loadpage("init",{async: false});
        
        document.querySelector(".nav").style = "display: none";
        document.querySelector(".footer").style = "display: none";
        document.querySelector(".gotop").style = "display: none";

        // var gamecun = Math.floor($(".gameblock").length / 2);
        var gamecun = 3;
        if(findGetParameter('game') !== null) {
            if(findGetParameter('game') < gamecun+1 && findGetParameter('game') > 0) {
                vm.gameSlide = findGetParameter('game')-1;
            } else {
                vm.gameSlide = 0
            }
        }
        // console.log(findGetParameter('game'))

        vm.introAni();
        // vm.gameSlick();
    }
})
