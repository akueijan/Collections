var index_view = new Vue({
    el: "#app",
    data: {
        inviter: "",
        // memberId: "",
        invName: "",
        isInvited: false,
    },
    methods: {
        kv_ani() {
            var vm = this;
            var tl = new TimelineMax({delay: 0.6,})
            tl.from(".sakuratree", 0.6, {
                opacity: 0,
            })
            tl.from(".deco1", 0.6, {
                opacity: 0
            },"-=0.6")
            tl.from(".deco2", 0.6, {
                opacity: 0
            },"-=0.6")
            tl.from("#tranarea", 0.6, {
                opacity: 0
            })
            tl.from(".kv_slogn", 0.6, {
                opacity: 0
            })
            tl.from(".kv_acbtn", 0.6, {
                opacity: 0,
                y: 50
            })
            tl.from(".kv_txt", 0.6, {
                opacity: 0
            },"-=0.3")
        },

        getInv() {
            var vm = this;
            vm.getToken().then(function(){
                vm.getName();
            })
        },

        //===API===//
        getName() {
            var vm = this;
            var post_data = new FormData();
            post_data.append("memberCode",vm.inviter);
            return $.ajax({
                url: `${friendo_url}VISASakuraMatsuri/name`,
                headers: {
                    "Authorization": "Bearer "+ vm.mainToken,
                },
                data: post_data,
                method: "POST",
                // method: "GET",
                // dataType: "json",
                processData: false,
                contentType: false,
            }).done(function (res) {
                // console.log("getName",res);
                // window.location.href = "./game.html";
                vm.invName = res.data.name;
                vm.popup = true;
                vm.poPage = "friend";
            });
        },

    },
    created: function() {
        var vm = this;
        vm.inviter = findGetParameter("code");
    },
    mounted: function() {
        var vm = this;
        if (!isMobile) {
            var code = (findGetParameter("code")) ? "?code=" + findGetParameter("code") : "";
            window.location = "./index_pc.html" + code;
        }
        // $("body").loadpage("init",{async : true});
        $("body").loadpage("init",{async : false});
        sakuraBg(1000,0.3);
        vm.kv_ani();
        // vm.sakuraBg();
        if(!vm.inviter == "" || !vm.inviter == null) {
            vm.getInv();
        }


        // fb sdk引用
        window.fbAsyncInit = function () {
            FB.init({
                appId: '619022558645664',
                status:true,
                cookie: true,
                xfbml: false,
                version: 'v6.0'
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
