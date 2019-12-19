var game_view = new Vue({
    el: "#app",
    data: {
        // game: {},
        total: 0,
        items: [
            {
                name: "晶透雪亮飲",
                score: 10,
                img: "./images/prd-10.png",
                gtmData: "遊戲_晶透雪亮飲",
            },
            {
                name: "田七瑪卡王精華飲",
                score: 20,
                img: "./images/prd-20.png",
                gtmData: "遊戲_田七瑪卡王精華飲",
            },
            {
                name: "人蔘蜆PLUS B群",
                score: 30,
                img: "./images/prd-30.png",
                gtmData: "遊戲_人蔘蜆PLUS B群",
            },
            {
                name: "易得纖",
                score: 40,
                img: "./images/prd-40.png",
                gtmData: "遊戲_易得纖",
            },
            {
                name: "孅益薑黃",
                score: 50,
                img: "./images/prd-50.png",
                gtmData: "遊戲_孅益薑黃",
            },
            {
                name: "益菌王",
                score: 60,
                img: "./images/prd-60.png",
                gtmData: "遊戲_益菌王",
            },
            {
                name: "優視金盞花葉黃素",
                score: 70,
                img: "./images/prd-70.png",
                gtmData: "遊戲_優視金盞花葉黃素",
            },
            {
                name: "認證樟芝王",
                score: 80,
                img: "./images/prd-80.png",
                gtmData: "遊戲_認證樟芝王",
            },
            {
                name: "認證靈芝王",
                score: 90,
                img: "./images/prd-90.png",
                gtmData: "遊戲_認證靈芝王",
            },
            {
                name: "勇健王",
                score: 100,
                img: "./images/prd-100.png",
                gtmData: "遊戲_勇健王",
            },
        ],
        ranItem: [],
        showQ: [],
        resPic: "",
        agree: false,
    },
    methods: {
        // randomQ: function(){
        //     var vm = this;
        //     vm.ranItem = vm.items.sort(function(){
        //         return 0.5 - Math.random();
        //     })
        // },
        cunScore: function(el) {
            var vm = this;
            // console.log(el.currentTarget.getAttribute("value")); //當前事件發生元素; el.target==當前點擊元素
            // var pp = el.target.getElementsByTagName("p");
            // console.log(el.target.getAttribute("value"));
            vm.total += Number(el.currentTarget.getAttribute("value"));
            // pp.style.opacity = '1';
            el.currentTarget.removeAttribute("value"); //只點一次功能
            el.currentTarget.classList.add("poactive")
            // el.currentTarget.style.opacity = '0';
            // el.currentTarget.style.transition = '2s';
        },
        timecun: function() {
            var vm = this;
            var diff  = 20; //20000
            var msecs;
            var secs;
            function showTimer() {
                diff-=1;
                // msecs = Math.floor( diff / 10 );
                // secs = Math.floor( diff / 1000 );
                $('#time').html(diff+' 秒');
                if(diff <= 0) {
                    clearInterval(ST);
                    vm.gameRes();
                }
            }
            var ST = setInterval(function(){showTimer()}, 1000);
        },
        gameStart: function() {
            var vm = this;
            var endP = $(".gamebody").width() - $(".gameshow").width();
            vm.popup = false;
            vm.popPage = "";
            vm.gameStep = "";
            setTimeout(function() {
                vm.timecun();
                $(".gamebody").css(
                    "transform", "translateX(-" + endP + "px)",
                    // "transition", "3s"
                );
            },1000)
            // FB.login(function(res){
            //     if (res.status === 'connected') {
            //         vm.fbData.token = res.authResponse.accessToken;
            //         vm.fbData.fb_id = res.authResponse.userID;
            //         vm.popup = false;
            //         vm.popPage = "";
            //         vm.gameStep = "";
            //         setTimeout(function() {
            //             vm.timecun();
            //             $(".gamebody").css(
            //                 "transform", "translateX(-" + endP + "px)",
            //                 // "transition", "3s"
            //             );
            //         },1000)
            //     }
            // })
        },
        gameRes: function() {
            var vm = this;
            vm.popup = true;
            vm.popPage = "gamePop";
            vm.gameStep = "result";
            if(window.innerWidth < 768) {
                if(vm.total >= 0) {
                    vm.resPic = "./images/mb-res60.png";
                }
                if(vm.total >= 400) {
                    vm.resPic = "./images/mb-res45.png";
                }
                if(vm.total >= 600) {
                    vm.resPic = "./images/mb-res30.png";
                }
                if(vm.total >= 800) {
                    vm.resPic = "./images/mb-res18.png";
                }
            } else {
                if(vm.total >= 0) {
                    vm.resPic = "./images/res60.png";
                }
                if(vm.total >= 400) {
                    vm.resPic = "./images/res45.png";
                }
                if(vm.total >= 600) {
                    vm.resPic = "./images/res30.png";
                }
                if(vm.total >= 800) {
                    vm.resPic = "./images/res18.png";
                }
            }
        },
        playAgain() {
            window.location = "./game.html"
        },
        toLottery() {
            var vm = this;
            vm.navfbshare();
            vm.getToken().then(function() {
                vm.register().then(function(){
                    vm.getStatus().then(function(){
                        vm.playTicket();
                        if(vm.fbData.fbPhone == "" || vm.fbData.fbPhone == null) {
                            vm.fbshare().then(function(){
                                vm.gameStep = "lottery";
                            })
                        } else {
                            vm.gameStep = "success";
                        }
                    })
                })
            })
            // vm.loading = true;
        },
        sendPhone() {
            var vm = this;
            if(!vm.loading) {
                vm.loading = true;
                var mobile_rule = /^09[0-9]{8}$/;
                if(vm.user.phone =="" || !vm.user.phone.match(mobile_rule)) {
                    alert("請輸入手機正確格式");
                    vm.loading = false;
                    return
                }
                if(!vm.agree) {
                    alert("請勾選我已詳閱");
                    vm.loading = false;
                    return
                }
                vm.getToken().then(function(){
                    vm.savePhone().then(function(res){
                        if(!res.success) {
                            alert(res.responseMessage);
                            vm.loading = false;
                        } else {
                            // vm.fbshare();
                            vm.gameStep = "success";
                            vm.loading = false;
                        }
                    });
                })
            }
        },
        scLottery() {
            var vm = this;
            vm.navfbshare();
            vm.gameStep = "success";
            // if(vm.fbData.fbPhone == "" || vm.fbData.fbPhone == null) {
            //     vm.fbshare().then(function(){
            //         vm.gameStep = "lottery";
            //     })
            // } else {
            //     vm.gameStep = "success";
            // }
        },
        scPhone() {
            var vm = this;
            if(!vm.loading) {
                vm.loading = true;
                var mobile_rule = /^09[0-9]{8}$/;
                if(vm.user.phone =="" || !vm.user.phone.match(mobile_rule)) {
                    alert("請輸入手機正確格式");
                    vm.loading = false;
                    return
                }
                if(!vm.agree) {
                    alert("請勾選我已詳閱");
                    vm.loading = false;
                    return
                }
                vm.gameStep = "success";
                vm.loading = false;
            }
        }
    },
    created: function() {
    },
    mounted: function() {
        var vm = this;
        vm.popup = true;
        vm.popPage = "gamePop";
        vm.gameStep = "start"; //start result lottery success
        // vm.randomQ();
        // vm.Logo = "./images/logo-game.png";
        $(".nav").hide();
        for(var i = 0; i < 18; i++) {
            vm.showQ.push(vm.items[Math.floor(Math.random()*vm.items.length)]);
        };

        window.fbAsyncInit = function () {
            FB.init({
                appId: '431893260759072',
                status:true,
                cookie: true,
                xfbml: false,
                version: 'v3.2'
            });
        };
        // vm.timecun();
        //設定遊戲寛高
        // var gameH = $(window).height() - $('.nav').height();
        // var cunn = $(".gameshow").width() / $(".gameshow").height();
        // $(".gameshow").css('height', gameH);
        // $(".gameshow").css('width', gameH*cunn);
        // vm.timecun();
        //設定遊戲畫面最右方定位
        // var endP = $(".gamebody").width() - $(".gameshow").width();
        // $(".gamebody").click(function(){
        //     $(".gamebody").css(
        //         "transform", "translateX(-" + endP + "px)",
        //         // "transition", "3s"
        //     );
        // });
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
})
