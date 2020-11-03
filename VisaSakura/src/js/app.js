const
    production = $("#appjs").data("mode") === "false",
    friendo_url = $("#appjs").data("site");

const device = deviceCheck();

Vue.config.devtools = !production;
Vue.config.debug = !production;
Vue.config.silent = production;

var md = new MobileDetect(window.navigator.userAgent);
var isMobile = md.phone() != null || md.tablet() != null || window.innerWidth <= 768;
var iPhone = md.is('iPhone');
var Android = md.is('AndroidOS');

var tag = document.createElement('script');

$(function () {
    console.log("v1.0");
    console.log(device);
    $(".nav").menu();
});


function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName)
                result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function checkCookie(parameterName) {
    var result = null,
        tmp = [];
    var cookie = document.cookie;
    cookie.split(";")
        .forEach(function (item) {
            if (item.charAt(0) == " ") {
                item = item.substring(1);
            }
            tmp = item.split("=");
            if (tmp[0] === parameterName)
                result = tmp[1];
        })
    return result;
}
function deviceCheck() {
    var device = {};
    var md = new MobileDetect(window.navigator.userAgent);
    if (md.match(/android/i)) {
        device.os = "android";
        device.version = md.version("android");
    } else if (md.match(/(iphone|ipad|ipod);?/i)) {
        device.os = "ios";
        device.version = md.version("iOS");
    } else {
        device.os = "pc";
        device.version = md.version("Chrome");
    }
    return device;
}

Vue.mixin({
    data: function () {
        return {
            status: "",
            startDate: "",
            endDate: "",
            projectStatus: null,
            errorMsg: "",
            envMode: production ? "Started" : "Testing",
            loading: false,
            mainToken: "",
            transPage: false,
            popup: false,
            poPage: "", //loading suc lottery yourlink ticket nodata friend note result
            awarditem: false,
            playon: false,
            lotcun: false,
            winaward: false,
            getAward: "",
            shareLink: "",
            reCaptcha: "",
            ballColor: [
                "./images/ball-b.png",
                "./images/ball-g.png",
                "./images/ball-r.png",
            ],
            lotBall: "",
            fbData: {
                fbName: "",
                fbtoken: "",
                fbId: "",
                fbPic: "",
            },
            userlottery: {
                invited: 0,
                total: 0,
                used: 0,
                available: 0,
            },
            isNew: true,
            fbLink: "",
            awardUrl: "",
            loseWordarr: [
                "殘念...確認過眼神<br/>你不是中獎的人...",
                "哎呀...沒中<br/>莫非是水逆又來!?<br/>快向春神許願再抽一次~",
                "Hen遺憾..這次沒中獎<br/>根據研究顯示多邀請朋友賞櫻<br/>就有更多抽獎機會~",
                "不可能~~滷蛋都沒這麼魯過<br/>再抽一次試試看~",
                "你知道嗎? 每60秒就有1分鐘過去<br/>每抽一次就有人中獎有人沒中<br/>再抽一次試試唄?"
            ],
            loseWord: ""
        }
    },
    computed: {
    },
    watch: {
        errorMsg: function (val) {
            $('body').toggleClass('_freeze');
        },
        popup: function (val) {
            var _val = val;
            if(_val == true) {
                $('body').addClass('_freeze');
            } else {
                $('body').removeClass('_freeze');
            }
        }
    },
    methods: {
        gaEvant: function (gtmData) {
            dataLayer.push({'event': gtmData});
            console.log("ga:", gtmData);
        },
        server_busy: function () {
            var vm = this;
            vm.errorMsg = "系統忙碌中，請稍後在試!";
            vm.loading = false;
            vm.errorCou = 6;
        },
        setCookie: function (cname, cvalue, time) {
            var d = new Date();
            d.setTime(d.getTime() + (time * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";";
        },
        logger: function (level, content, tag) {
            if (production) {
                // level : ['ERROR' => 0, DEBUG' => 1, 'WARNING' => 2, 'INFO' => 3, 'ALL' => 4]
                var level_info = ['ERROR', 'DEBUG', 'WARNING', 'INFO', 'ALL'];
                _LTracker.push({
                    'level': level_info[level],
                    'content': JSON.stringify(content),
                    'path': window.location.href,
                    'tag': tag || null,
                    'device': device,
                    'timestamp': Date.now()
                });
            }
        },
        checkOnline: function () {
            if (!navigator.onLine) {
                alert("Internet 連線已斷開，請確認您的網路狀態。");
                // window.location.reload();
            }
        },
        scrollTo: function (e) {
            var vm = this;
            $("html,body").animate({
                scrollTop: $(e).offset().top - vm.navHeight
            }, 500);
        },
        getToken: function() {
            var vm = this;
            return $.ajax({
                // url: "https://carrefour2019cny.azurewebsites.net/api/auth/login?projectId=61",
                url: `${friendo_url}auth/login?campaignId=78`,
                headers: {
                    "webtoken": "9bwWRN4gbFWRyIPfRgPbFtiVPRIuon3jSZ7QfOPEVXo="
                },
                method: "GET",
                dataType: "json"
            }).done(function (res) {
                vm.mainToken = res.token;
                vm.startDate = res.startDate;
                vm.endDate = res.endDate;
                vm.projectStatus = res.projectStatus;
            });
        },
        grecaptcha: function (page) {
            var vm = this;
            return new Promise(function (resolve, reject) {
                grecaptcha.execute('6Ldcxt8UAAAAAE7pAW_QhpvYaP3QB2hLsHaFStaA', {
                    action: page
                }).then(function (token) {
                    vm.reCaptcha = token;
                    resolve()
                }, function () {
                    alert('Google驗證失敗，請再次嘗試\n如無法排除此問題，建議重新整理此頁面');
                    reject()
                });
            });
        },
        popClose() {
            var vm = this;
            vm.popup = false;
            vm.poPage = "";
        },

        noteOpen() {
            var vm = this;
            vm.popup = true;
            vm.poPage = "note";
        },

        lottery() {
            var vm = this;
            vm.playon = true;
            var i = Math.floor(Math.random()*vm.ballColor.length);
            vm.lotBall = vm.ballColor[i];
            var tl = new TimelineMax({
                // delay: 0.9,
                onComplete: () => {
                    vm.getToken().then(function(){
                        vm.raffleOff();
                        // vm.playon = false;
                    })
                }
            })
            tl.set(".ball", {
                x: 10,
                y: -10,
            })
            tl.set(".handle", {
                rotation: 90
            })
            tl.set(".handle", {
                rotation: 180
            },"+=0.3")
            tl.set(".handle", {
                rotation: 270
            },"+=0.3")
            tl.set(".handle", {
                rotation: 360
            },"+=0.3")
            tl.to(".ball",0.6,{
                x: 30,
                y: 90,
            })
            tl.to(".ball",0.2,{
                x: 30,
                y: 85,
            })
            tl.to(".ball",0.2,{
                x: 40,
                y: 90,
            })
            tl.to(".ball",0.6,{
                x: 60,
                y: 90,
                rotation: 45
            })
        },

        userGift() {
            var vm = this;
            vm.popup = true;
            vm.poPage = "loading"
            FB.login(function(res){
                // console.log(res);
                if (res.status === 'connected') {
                    vm.fbData.fbtoken = res.authResponse.accessToken;
                    vm.fbData.fbId = res.authResponse.userID;
                    FB.api('/me','GET',{"fields":"id,name,picture"},
                        function(apires) {
                            vm.fbData.fbName = apires.name;
                            vm.fbData.fbPic = 'http://graph.facebook.com/'+ apires.id +'/picture?width=140&height=140';
                        }
                    );
                    setTimeout(function(){
                        vm.getToken().then(function(){
                            var post_data = new FormData();
                            post_data.append("fbToken",vm.fbData.fbtoken);
                            post_data.append("inviter",vm.inviter);
                            return $.ajax({
                                url: `${friendo_url}VISASakuraMatsuri/login`,
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
                                // console.log("navLogin",res);
                                if(res.code === 200) {
                                    vm.isInvited = res.data.isInvited;
                                    vm.inviter = res.data.memberCode;
                                    vm.isNew = res.data.isNew;
                                    vm.fbLink = res.data.sharingUrl;
                                    if(vm.isNew) {
                                        vm.popup = true;
                                        vm.poPage = "nodata"
                                    } else {
                                        vm.getWinningRecord();
                                    }
                                }
                            });
                        })
                    },50)
                }
            })
        },

        userRecord() {
            var vm = this;
            vm.popup = true;
            vm.poPage = "loading"
            FB.login(function(res){
                // console.log(res);
                if (res.status === 'connected') {
                    vm.fbData.fbtoken = res.authResponse.accessToken;
                    vm.fbData.fbId = res.authResponse.userID;
                    FB.api('/me','GET',{"fields":"id,name,picture"},
                        function(apires) {
                            vm.fbData.fbName = apires.name;
                            vm.fbData.fbPic = 'http://graph.facebook.com/'+ apires.id +'/picture?width=140&height=140';
                        }
                    );
                    setTimeout(function(){
                        vm.getToken().then(function(){
                            var post_data = new FormData();
                            post_data.append("fbToken",vm.fbData.fbtoken);
                            post_data.append("inviter",vm.inviter);
                            return $.ajax({
                                url: `${friendo_url}VISASakuraMatsuri/login`,
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
                                // console.log("navLogin",res);
                                if(res.code === 200) {
                                    vm.isInvited = res.data.isInvited;
                                    vm.inviter = res.data.memberCode;
                                    vm.isNew = res.data.isNew;
                                    vm.fbLink = res.data.sharingUrl;
                                    if(vm.isNew) {
                                        vm.popup = true;
                                        vm.poPage = "nodata"
                                    } else {
                                        vm.getRecord();
                                    }
                                }
                            });
                        })
                    },50)
                }
            })
        },

        fbLogin() {
            var vm = this;
            vm.popup = true;
            vm.poPage = "loading"
            FB.login(function(res){
                // console.log(res);
                if (res.status === 'connected') {
                    vm.fbData.fbtoken = res.authResponse.accessToken;
                    vm.fbData.fbId = res.authResponse.userID;
                    vm.getToken().then(function(){
                        vm.userLogin();
                    })
                    // window.location.href = "./game.html";
                }
            })
        },

        gameRecord() {
            var vm = this;
            vm.getToken().then(function() {
                vm.getRecord();
            })
        },

        getWinRec() {
            var vm = this;
            vm.getToken().then(function(){
                vm.getWinningRecord();
            })
        },

        invfriend() {
            var vm = this;
            vm.poPage = "yourlink";
        },

        fbShare() {
            var vm = this;
            var time = Date.now();
            var fbhtml_url= vm.fbLink;
            window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url+'?v'+time+'&hashtag=%23Visa線上賞櫻團');return false;
        },

        tofbShare() {
            var vm = this;
            vm.fbShare();
            vm.poPage = "suc";
        },

        tolineShare() {
            var vm = this;
            var sUrl = encodeURIComponent(`${vm.fbLink}`)
            window.open(`http://line.naver.jp/R/msg/text/?全台最夯的線上賞櫻團開團啦!%0D%0A今年讓我們一起在Visa線上賞櫻%0D%0A還有機會抽到最高百元超商購物金～!%0D%0A${sUrl}`, "_blank");
            vm.poPage = "suc";
        },

        checkBrowse() {
            var vm = this;
        },

        //===API===//
        userLogin() {
            var vm = this;
            var post_data = new FormData();
            post_data.append("fbToken",vm.fbData.fbtoken);
            post_data.append("inviter",vm.inviter);
            return $.ajax({
                url: `${friendo_url}VISASakuraMatsuri/login`,
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
                // console.log("userLogin",res);
                if(res.code === 200) {
                    vm.isInvited = res.data.isInvited;
                    vm.inviter = res.data.memberCode;
                    vm.isNew = res.data.isNew;
                    vm.fbLink = res.data.sharingUrl;
                    window.location.href = "./game.html";
                }
            });
        },

        getWinningRecord() {
            var vm = this;
            vm.popup = true;
            vm.poPage = "loading";
            var post_data = new FormData();
            post_data.append("fbToken",vm.fbData.fbtoken);
            return $.ajax({
                url: `${friendo_url}VISASakuraMatsuri/winningRecord`,
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
                // console.log("getWinningRecord",res);
                vm.popup = true;
                vm.poPage = "ticket";
                if(res === undefined) {
                    vm.awarditem = false;
                } else {
                    if(res.code === 200) {
                        vm.awarditem = true;
                        vm.awardUrl = res.data.awards[0].url;
                    }
                }
            });
        },

        getRecord() {
            var vm = this;
            vm.popup = true;
            vm.poPage = "loading";
            var post_data = new FormData();
            post_data.append("fbToken",vm.fbData.fbtoken);
            return $.ajax({
                url: `${friendo_url}VISASakuraMatsuri/record`,
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
                // console.log("getRecord",res);
                if(res.code === 200) {
                    vm.userlottery.invited = res.data.invited;
                    vm.userlottery.total = res.data.total;
                    vm.userlottery.used = res.data.used;
                    vm.userlottery.available = res.data.available;
                    vm.popup = true;
                    vm.poPage = "lottery";
                    if(vm.userlottery.available === 0) {
                        vm.lotcun = false;
                    }
                    else {
                        vm.lotcun = true;
                    }
                }
            });
        },

        raffleOff() {
            var vm = this;
            var post_data = new FormData();
            post_data.append("fbToken",vm.fbData.fbtoken);
            return $.ajax({
                url: `${friendo_url}VISASakuraMatsuri/raffleOff`,
                headers: {
                    "Authorization": "Bearer "+ vm.mainToken,
                },
                data: post_data,
                method: "POST",
                // dataType: "json",
                processData: false,
                contentType: false,
            }).done(function (res) {
                // console.log("raffleOff",res);
                vm.poPage = "result"
                if(res.data.result === "78coupon0") {
                    vm.playon = false;
                    vm.winaward = false;
                    var i = Math.floor(Math.random()*vm.loseWordarr.length);
                    vm.loseWord = vm.loseWordarr[i];
                } 
                if(res.data.result === "78coupon25") {
                    vm.playon = false;
                    vm.winaward = true;
                    vm.getAward = "超商購物金25元"
                }
                if(res.data.result === "78coupon50") {
                    vm.playon = false;
                    vm.winaward = true;
                    vm.getAward = "超商購物金50元"
                }
                if(res.data.result === "78coupon100") {
                    vm.playon = false;
                    vm.winaward = true;
                    vm.getAward = "超商購物金100元"
                }
            });
        },
    },
    mounted: function () {
        var vm = this; 

    }
})
