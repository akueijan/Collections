var index_view = new Vue({
    el: "#app",
    data: {

    },
    methods: {
        kvAni: function() {
            var sec = 0.3;
            var tl = new TimelineMax({delay: 0.3});
            // tl.to(".hanabox",sec,{opacity: 0,})
            tl.to(".kv",sec,{
                opacity: 1,
            })
            tl.from(".peoarea",sec*2, {
                opacity: 0,
                x: -50
            })
            tl.from(".slogn",sec*2, {
                opacity: 0,
                y: 50
            }, "-=0.3")
            tl.from(".slogntxt",sec*2, {
                opacity: 0,
                y: 50
            }, "-=0.3")
            tl.from(".acbtn", sec*2, {
                opacity: 0,
                y: 50
            }, "-=0.3")
        },
        fbLogin: function() {
            var vm = this;
            FB.login(function(res){
                console.log(res);
                if (res.status === 'connected') {
                    // vm.fbData.fbtoken = res.authResponse.accessToken;
                    // vm.fbData.fbId = res.authResponse.userID;
                    window.location.href = "./game.html";
                }
            })
        }
    },
    mounted: function() {
        var vm = this;
        $("body").loadpage("init",{async : false});
        setTimeout(function(){
            vm.getIe();
        },1000);
        // $("body").loadpage("close");
        setTimeout(function(){
            $(".hana").addClass("hanaactive");
            vm.kvAni();
        },1500);
        // $("body").loadpage("close");
        // $(".footer").hide()

        // fb sdk引用
        window.fbAsyncInit = function () {
            FB.init({
                appId: '2287821511516890',
                status:true,
                cookie: true,
                xfbml: false,
                version: 'v5.0'
            });
        };
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