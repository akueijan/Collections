var game_view = new Vue({
    el: "#app",
    data: {
        game: {},
        loading: false,
        // score: 0,
        // popup: "",
        invoToken: "",
        gToken: "",
        fbData: {
            fbtoken: "",
            fbId: "",
            fbName: "",
            fbPic: "",
            mb_id: "",
        },
        gamePage: "fblogin",
        ticket: "",
        gcode: 0,
        top100Arr: [],
        person: {
            id: 0,
            img: "",
            name: "",
            score: 0,
        },
        mobile: "",
        agree: false,
        // userType: "",
        fbslink: "",
        // showkeyword: "",
        start_date: "",
        mode_status: "",
    },
    methods: {
        // fbRegister() {
        //     var vm = this;
        //     return new Promise(function(resolve){
        //         vm.GameToken().then(function(){
        //             vm.register();
        //         });
        //         resolve();
        //     })
        // },
        // fbGetstatus() {
        //     var vm = this;
        //     return new Promise(function(resolve){
        //         vm.GameToken().then(function(){
        //             vm.getstatus();
        //         });
        //         resolve();
        //     })
        // },
        fblogin() {
            var vm = this;
            FB.login(function(res){
                // console.log(res);
                if (res.status === 'connected') {
                    vm.fbData.fbtoken = res.authResponse.accessToken;
                    vm.fbData.fbId = res.authResponse.userID;
                    FB.api('/me','GET',{"fields":"id,name,picture"},
                        function(apires) {
                            console.log(apires);
                            vm.person.name = apires.name;
                            vm.person.img = 'http://graph.facebook.com/'+ apires.id +'/picture?width=140&height=140';
                            vm.popup = true;
                            vm.popPage = "gameload";
                            vm.gamePage = "game";
                            initGame(res);
                        }
                    );
                    // vm.fbRegister();
                    // vm.fbRegister().then(function(){
                    //     vm.fbGetstatus();
                    // });
                }
                // initGame(res);
            })
        },
        fbRegister() {
            var vm = this;
            vm.GameToken().then(function(){
                vm.register();
            });
        },
        sendFb() {
            var vm = this;
            vm.GameToken().then(function(){
                vm.fbshare();
            });
        },
        getTop100() {
            var vm = this;
            vm.GameToken().then(function(){
                vm.top100().then(function() {
                    //===取得個人成績===//
                    for(var i = 0; i < vm.top100Arr.length; i++) {
                        // console.log("i",i)
                        if(vm.top100Arr[i].is_me) {
                            vm.person.id = vm.top100Arr[i].seq;
                            vm.person.img = vm.top100Arr[i].pic_url;
                            vm.person.name = vm.top100Arr[i].fb_name;
                            vm.person.score = vm.top100Arr[i].score;
                            if(vm.top100Arr[i].seq > 100) {
                                vm.person.id = "未進榜";
                            }
                        }
                    }
                });
            });
        },
        gameagain() {
            window.location = "./game.html";
        },
        lottery() {
            var vm = this;
            if(!vm.loading) {
                vm.loading = true;
                var mobile_rule = /^09[0-9]{8}$/;
                if(vm.mobile =="" || !vm.mobile.match(mobile_rule)) {
                    alert("請輸入手機正確格式");
                    vm.loading = false;
                    return
                }
                if(!vm.agree) {
                    alert("請勾選我已詳閱");
                    vm.loading = false;
                    return
                }
                vm.popup = true;
                vm.popPage = "lotterySuc";
                vm.loading = false;
                // vm.InvoiceToken().then(function(){
                //     vm.savephone().then(function(res){
                //         if(!res.success) {
                //             alert(res.responseMessage);
                //             vm.loading = false;
                //         } else {
                //             // alert(res.responseMessage);
                //             vm.popup = true;
                //             vm.popPage = "lotterySuc";
                //             vm.loading = false;
                //         }
                //     });
                // })
            }
        },
        fbLink() {
            var vm = this;
            vm.sendFb();
            var fbhtml_url= vm.fbslink; //網址
            // var fbhtml_url= vm.shareUrl; //圖
            vm.gamePage = "lottery";
            var isIE=window.ActiveXObject || "ActiveXObject" in window;
            if(isIE) {
                window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url);return false;
            } else {
                window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url+'&hashtag=%23'+'PowerBOMB人生不斷電馬拉松');return false;
            }
        }
    },
    computed: {
        
    },
    watch: {
        // gamePage: function() {
        //     if(this.gamePage=="grade") {
        //         this.getTop100();
        //     }
        // }
    },
    mounted: function () {
        var vm = this;
        // if(new Date() > new Date("2019/11/21 00:00:00")) {
        //     alert("活動已結束 感謝您的參與");
        //     window.location = "./index.html";
        // };
        // vm.getTop100();
        // vm.popup = true;
        // vm.popPage = "gameload";
        // vm.navOpen();
        setTimeout(function(){
            vm.getIe();
        },1000);
        $(".nav").hide();
        $(".footer").hide();
        // vm.fbRegister();
        // window.fbAsyncInit = function () {
        //     FB.init({
        //         appId: '2114580888842549',
        //         status:true,
        //         cookie: true,
        //         xfbml: false,
        //         version: 'v3.2'
        //     });
        //     console.log(FB);
        //     FB.getLoginStatus(function (response) {
        //         console.log(response);
        //     })
        // }
        window.fbAsyncInit = function () {
            FB.init({
                appId: '2114580888842549',
                status:true,
                cookie: true,
                xfbml: false,
                version: 'v5.0'
            });
        };
        // if (!window.location.href.match(/(localhost)|(192.168.40)|(192.168.60)/i)) {
        //     window.fbAsyncInit = function () {
        //         FB.init({
        //             appId: '2114580888842549',
        //             status:true,
        //             cookie: true,
        //             xfbml: false,
        //             version: 'v3.2'
        //         });
        //         FB.getLoginStatus(function (response) {
        //             if (response.status === 'connected') {
        //                 vm.fbData.fbtoken = response.authResponse.accessToken;
        //                 vm.fbData.fbId = response.authResponse.userID;
        //                 // vm.fbRegister();
        //                 // vm.fbRegister().then(function(){
        //                 //     vm.fbGetstatus();
        //                 //     // vm.fbGetstatus().then(function(){
        //                 //     //     // console.log(vm.fbData.mb_id);
        //                 //     //     // initGame(vm.fbData.mb_id);
        //                 //     //     vm.game = new Game({
        //                 //     //         memberData: vm.fbData.mb_id
        //                 //     //     });
        //                 //     // });
        //                 // });
        //             } else {
        //                 console.log('fb notconnected')
        //                 // FB.login(function(res){
        //                 //     console.log(res);
        //                 //     if (res.status === 'connected') {
        //                 //         vm.fbData.fbtoken = res.authResponse.accessToken;
        //                 //         vm.fbData.fbId = res.authResponse.userID;
        //                 //         vm.fbRegister();
        //                 //         // vm.fbRegister().then(function(){
        //                 //         //     vm.fbGetstatus();
        //                 //         // });
        //                 //     }
        //                 //     // initGame(res);
        //                 // })
        //             }
        //         });
        //     };
        // } else {
        //     window.fbAsyncInit = function () {
        //         FB.init({
        //             appId: '2114580888842549',
        //             cookie: true,
        //             xfbml: false,
        //             version: 'v3.2'
        //         });
        //     };
        //     vm.fbRegister();
        // }
        // initGame("f1b730fd-7f51-4555-923b-a4fa6de0d6c6");
        // vm.game = new Game({
        //     memberData: vm.fbData.mb_id
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

function initGame(mb_id) {
    // console.log(mb_id);
    game_view.game = new Game({
        memberData: mb_id
    });
}