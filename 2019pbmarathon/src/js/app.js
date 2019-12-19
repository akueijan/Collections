const
    production = ($("#appjs").data("mode") === false),
    friendo_url = $("#appjs").data("site");  

const device = deviceCheck();

Vue.config.devtools = !production;
Vue.config.debug = !production;
Vue.config.silent = production;

var isPc = screen.width > 768;
var md = new MobileDetect(window.navigator.userAgent);
var isMobile = md.phone() != null || md.tablet() != null;

var tag = document.createElement('script');

$(function () {
    console.log("v1.5.2");
    console.log(device);
    // $(".nav").menu();
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
    var browser = md.ua.match(/(line|fb|ig|instagram)/i);
    if (browser) {
        device.browser = browser[1].toLowerCase();
        if (device.browser == 'line') alert('請使用FB APP 或 預設瀏覽器\n開啟本連結，獲得最佳遊戲體驗！')
    } else {
        device.browser = "default";
    }
    return device;
}



Vue.mixin({
    data: function () {
        return {
            status: "",
            start_date: "",
            // end_date: "2019/09/30",
            error_msg: "",
            // mode_status: production ? "Started" : "Testing",
            mode_status: "",
            loading: false,
            popuptop: "",
            navHeight: "",
            rewardShake: true,
            lineHref: '',
            popup: false,
            popPage: "",
            popweek: 0,
            FBmb_id: "",
            reCaptcha: "",
            scrollto: 0,
            gToken: "",
            stateToken: "",
            top100Arr: [],
        }
    },
    computed: {
        // openCome: function () {
        //     return (this.mode_status == "comingsoon" || this.mode_status == "timeover");
        // },
        // openOver: function() {
        //     return (this.mode_status == "Testing" || start_date <= 0);
        // }
    },
    watch: {
        error_msg: function (val) {
            $('body').toggleClass('_freeze');
        },
        popup: function(val) {
            if(val == true) {
                $('body').addClass('_freeze');
                
            } else {
                $('body').removeClass('_freeze');
                
            }
        }
    },
    methods: {
        gaEvant: function (gtmData) {
            dataLayer.push({'event': gtmData});
            // console.log("ga:", gtmData);
        },
        server_busy: function () {
            var vm = this;
            vm.error_msg = "系統忙碌中，請稍後在試!";
            vm.loading = false;
            vm.error_cou = 6;
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
        errorDone: function () {
            this.error_msg = "";
        },
        checkOnline: function () {
            if (!navigator.onLine) {
                alert("Internet 連線已斷開，請確認您的網路狀態。");
                // window.location.reload();
            }
        },
        uptoken: function(newVal) {
            console.log("asfe");
            this.gToken = newVal;
        },
        Arrup: function(Arr) {
            console.log("Arr");
            this.top100Arr = Arr;
        },
        state_Token: function() {
            var vm = this;
            return $.ajax({
                // url: "https://developapi.azurewebsites.net/api/auth/login?projectId=66",
                url: `${friendo_url}auth/login?projectId=66`,
                headers: {
                    "webtoken": "WBqIHc9hTmwyL+g9m0ykfA=="
                },
                method: "GET",
                dataType: "json"
            }).done(function(res){
                // console.log("stateToken:",res);
                vm.stateToken = res.token;
                // vm.gToken = res.token;
                // vm.top100();
            });
        },
        state_check: function () {
            var vm = this;
            var post_data = {
                "mb_id": vm.FBmb_id,
                // "mb_id": "f1b730fd-7f51-4555-923b-a4fa6de0d6c6",
            }
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}comebest/getstatus`,
                headers: {
                    "Authorization": "Bearer "+ vm.stateToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json",
            })
        },
        getAppstate: function() {
            var vm = this;
            vm.state_Token().then(function() {
                vm.state_check();
            })
        },
        scrollTo: function (e) {
            var vm = this;
            // vm.room = null;
            // vm.allPopupClose();
            console.log(321);
            $("html,body").animate({
                scrollTop: $(e).offset().top
            }, 500);
        },
        // popupOpen: function () {
        //     var vm = this;
        //     if (!vm.popuptop || vm.popuptop === 0) {
        //         vm.popuptop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
        //     }
        //     $('body').addClass('_freeze');
        // },
        // popupClose: function () {
        //     var vm = this;
        //     $('body').removeClass('_freeze');
        //     $('html, body').scrollTop(vm.popuptop);
        //     vm.popuptop = 0;
        // },
        popClose: function() {
            var vm = this;
            vm.popup = false;
            vm.popPage = "";
            vm.popweek = 0;
            $('body').removeClass('_freeze');
            $("html,body").scrollTop(vm.scrollto);
        },
        // afterEnter: function () {
        //     var vm = this;
        //     vm.popupOpen();
        // },
        InvoiceToken: function() {
            var vm = this;
            return $.ajax({
                // url: "https://developapi.azurewebsites.net/api/auth/login",
                url: `${friendo_url}auth/login`,
                headers: {
                    "WebToken": "WBqIHc9hTmwyL+g9m0ykfA=="
                },
                method: "GET",
                dataType: "json"
            }).done(function(res) {
                // console.log("InvoToken:",res);
                vm.invoToken = res.token;
            });
        },
        invoiceSave: function() {
            var vm = this;
            var post_data = {
                "cell": vm.mobile,
                "inv_num": vm.inv_num.toUpperCase(),
                "random_number": vm.inv_random,
                "inv_date": vm.inv_date,
                "actToken" : "nczlaBQUCB4hgiPmF8ro7Q==",
                "captcha": vm.reCaptcha
            }
            return $.ajax({
                // url: "https://developapi.azurewebsites.net/api/invoice/savedata",
                url: `${friendo_url}invoice/savedata`,
                headers: {
                    "Authorization": "Bearer "+ vm.invoToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json"
            }).done(function(res){
                // console.log("invores:",res);
            });
        },
        backfillSave: function() {
            var vm = this;
            var post_data = {
                "Code": vm.userid,
                "name": vm.name,
                "address": vm.address,
                "IdcardFront": vm.IdcardFront,
                "IdcardBack": vm.IdcardBack,
                "Bankbook": vm.Bankbook,
                "CertificatePhoto": vm.CertificatePhoto,
                "captcha": vm.reCaptcha
            };
            return $.ajax({
                // url: "https://developapi.azurewebsites.net/api/invoice/savedata",
                url: `${friendo_url}invoice/savedata`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json"
            }).done(function(res){
                console.log("backfill:",res);
            });
        },
        GameToken: function() {
            var vm = this;
            return $.ajax({
                // url: "https://developapi.azurewebsites.net/api/auth/login?projectId=66",
                url: `${friendo_url}auth/login?projectId=66`,
                headers: {
                    "webtoken": "WBqIHc9hTmwyL+g9m0ykfA=="
                },
                method: "GET",
                dataType: "json"
            }).done(function(res){
                // console.log("gtoken:",res);
                vm.gToken = res.token;
            });
        },
        deletetest: function() {
            var vm = this;
            var post_data = {
                "mb_id": "f1b730fd-7f51-4555-923b-a4fa6de0d6c6",
            }
            return $.ajax({
                // url: "https://developapi.azurewebsites.net/api/comebest/deletetest",
                url: `${friendo_url}comebest/deletetest`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json"
            }).done(function(res) {
                // console.log("del:",res);
            })
        },
        //===FB id===//
        register: function() {
            var vm = this;
            if (!window.location.href.match(/(localhost)|(192.168.40)|(192.168.60)/i)){
                var post_data = {
                    "token": vm.fbData.fbtoken,
                    "fb_id": vm.fbData.fbId,
                }
            } else {
                var post_data = {
                    "token": "EAAeDMzq6cTUBAAXuCZAwOfeaj89pZABGGDUgUEyZBB5T1czzAGehstE5urNfOA3Pba7qk2vJ6kjPSWV65RyZBOXjOSTKZBxwzNuuHvmpx7oIeX1M2Ay3uZAzDZBkkw0aZB79kTzfYHl1aMNyN9a4JVz9yRDah9GxidKJZAXqddBiRnS4ZB2qjPQwV1i5ecRtHZAX9gVN0qxXw3G0hvUn6UVYSUm94rYonctBYen8G76GMDoMwZDZD",
                    "fb_id": "2592131487464378",
                }
            }
            return $.ajax({
                // url: "https://developapi.azurewebsites.net/api/comebest/deletetest",
                url: `${friendo_url}comebest/register`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json"
            }).done(function(res) {
                // console.log("register:",res);
                vm.fbData.mb_id = res.data;
                vm.getstatus();
            })
        },
        getstatus: function() {
            var vm = this;
            var post_data = {
                "mb_id": vm.fbData.mb_id,
                // "mb_id": "f1b730fd-7f51-4555-923b-a4fa6de0d6c6",
            }
            return $.ajax({
                // url: "https://developapi.azurewebsites.net/api/comebest/deletetest",
                url: `${friendo_url}comebest/getstatus`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json"
            }).done(function(res) {
                // console.log("getstatus:",res);
                vm.fbData.fbName = res.data.name;
                vm.fbData.fbPic = res.data.pic_url;
                vm.game = new Game({
                    memberData: vm.fbData.mb_id
                });
            })
        },
        fbshare: function() {
            var vm = this;
            var post_data = {
                "mb_id": vm.fbData.mb_id,
                // "mb_id": "f1b730fd-7f51-4555-923b-a4fa6de0d6c6",
            }
            return $.ajax({
                url: `${friendo_url}comebest/fbshare`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json"
            }).done(function(res) {
                // console.log("fbshare:",res);
            })
        },
        savephone: function() {
            var vm = this;
            var post_data = {
                "mb_id": vm.fbData.mb_id,
                // "mb_id": "f1b730fd-7f51-4555-923b-a4fa6de0d6c6",
                "phone": vm.mobile,
            }
            return $.ajax({
                url: `${friendo_url}comebest/savephone`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json"
            }).done(function(res) {
                // console.log("savephone:",res);
            })
        },
        // play: function() {
        //     var vm = this;
        //     var post_data = {
        //         "mb_id": vm.mb_id,
        //         // "mb_id": "f1b730fd-7f51-4555-923b-a4fa6de0d6c6",
        //         "role": "A"
        //     }
        //     return $.ajax({
        //         url: `${friendo_url}comebest/play`,
        //         headers: {
        //             "Authorization": "Bearer "+ vm.gToken,
        //         },
        //         data: post_data,
        //         method: "POST",
        //         dataType: "json"
        //     }).done(function(res) {
        //         console.log("play:",res);
        //         vm.ticket = res.data.ticket;
        //         vm.gcode = res.data.code;
        //     })
        // },
        // record: function() {
        //     var vm = this;
        //     var post_data = {
        //         "mb_id": vm.mb_id,
        //         // "mb_id": "f1b730fd-7f51-4555-923b-a4fa6de0d6c6",
        //         "ticket": vm.ticket,
        //         "code": "-91,12332,0",
        //         "score": "12332",
        //         "timespan": "3"
        //     }
        //     return $.ajax({
        //         url: `${friendo_url}comebest/record`,
        //         headers: {
        //             "Authorization": "Bearer "+ vm.gToken,
        //         },
        //         data: post_data,
        //         method: "POST",
        //         dataType: "json"
        //     }).done(function(res) {
        //         console.log("record:",res);
                
        //     })
        // },
        top100: function() {
            var vm = this;
            var post_data = {
                "mb_id": vm.FBmb_id,
                // "mb_id": "f1b730fd-7f51-4555-923b-a4fa6de0d6c6",
            }
            return $.ajax({
                url: `${friendo_url}comebest/top100`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                    // "Authorization": "Bearer "+ vm.stateToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json"
            }).done(function(res) {
                // console.log("top100:",res);
                vm.top100Arr = res.data;
            })
        },
        getaward: function() {
            var vm = this;
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}comebest/LotteryResult/66`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                method: "GET",
                // dataType: "json",
            }).done(function(res){
                console.log("getaward",res);
            })
        },
        getRecipientinfo: function() {
            var vm = this;
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}comebest/recipientinfo/${vm.userid}`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                method: "GET",
                // dataType: "json",
            }).done(function(res){
                // console.log("recipientinfo",res);
                if(!res.success) {
                    alert("資料已回填或無法查獲此獎項");
                    window.location.href = "./index.html";
                } else {
                    vm.mobile = res.data.mobile;
                    vm.inv_num = res.data.referenceInfo;
                    vm.awarditem = res.data.awardName;
                    vm.type = res.data.referenceType;
                }
            })
        },
        postRecipientinfo: function() {
            var vm = this;
            var post_data = new FormData();
            post_data.append("CampaignId",66)
            post_data.append("Code",vm.userid)
            post_data.append("Name",vm.name)
            post_data.append("Address",vm.address)
            post_data.append("IdcardFront",vm.IdcardFront)
            post_data.append("IdcardBack",vm.IdcardBack)
            post_data.append("Bankbook",vm.Bankbook)
            post_data.append("Certificate",vm.CertificatePhoto)
            post_data.append("reCaptcha",vm.reCaptcha)
            post_data.append("FBId",vm.fbData.fbId)
            // var post_data = {
            //     "CampaignId": 66,
            //     "Code": vm.userid,
            //     "Name": vm.name,
            //     "Address": vm.address,
            //     "IdcardFront": vm.IdcardFront,
            //     "IdcardBack": vm.IdcardBack,
            //     "Bankbook": vm.Bankbook,
            //     "Certificate": vm.CertificatePhoto,
            //     "reCaptcha": vm.reCaptcha
            // };
            return $.ajax({
                url: `${friendo_url}comebest/recipientinfo`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                processData: false,
                contentType: false,
                // dataType: "json"
            }).done(function(res) {
                // console.log("postRecipientinfo:",res);
            })
        },
        navfbshare: function() {
            window.open('https://www.facebook.com/sharer/sharer.php?u='+"https://campaign.friendo.com.tw/2019pbmarathon/index.html"+'&hashtag=%23'+'PowerBOMB人生不斷電馬拉松');return false;
        },
        navlineshare: function() {
            var sUrl = encodeURIComponent(`https://campaign.friendo.com.tw/2019pbmarathon/index.html?openExternalBrowser=1`)
            window.open(`http://line.naver.jp/R/msg/text/?挑戰PowerBOMB人生不斷電馬拉松抽PS4！登錄發票再抽現金99,999、Switch等多項好禮%0D%0A${sUrl}`, "_blank");
        },
        navOpen: function() {
            $(".nav-btn").click(function() {
                $(".nav").toggleClass("active");
                $("body").toggleClass("_freeze");
            })
            $(".nav-item").click(function() {
                $(".nav").removeClass("active");
                $("body").removeClass("_freeze");
            })
        },
        grecaptcha: function(page) {
            var vm = this;
            // console.log('in')
            return new Promise(function (resolve, reject) {
                grecaptcha.execute('6LfUo7MUAAAAAJQAML08ruhPeYZvihLYaVvtuYrJ', { action: page }).then(function (token) {
                    vm.reCaptcha = token;
                    resolve()
                }, function () { 
                    alert('Google驗證失敗，請再次嘗試\n如無法排除此問題，建議重新整理此頁面');
                    reject()
                });
            });
        },
        getIe: function() {
            var getExplorer = (function() {
                var explorer = window.navigator.userAgent,
                compare = function(s) { return (explorer.indexOf(s) >= 0); },
                ie11 = (function() { return ("ActiveXObject" in window) })();
                if (compare("MSIE") || ie11) { return 'ie'; }
                else if (compare("Firefox") && !ie11) { return 'Firefox'; }
                else if (compare("Chrome") && !ie11) { return 'Chrome'; }
                else if (compare("Opera") && !ie11) { return 'Opera'; }
                else if (compare("Safari") && !ie11) { return 'Safari'; }
            })()
            
            if (getExplorer == 'ie') {
                alert('目前瀏覽器為舊版 IE，建議使用Chrome瀏覽器，獲得最佳遊戲體驗！');
            }
        },
        top100Api() {  //for showcase
            var vm = this;
            var xmlhttp = new XMLHttpRequest();
            var url = "./static/top100.json";
            
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var myArr = JSON.parse(this.responseText);
                    console.log(myArr);
                    vm.top100Arr = myArr.data;
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
    },
    components: {
        comingsoon: comingsoon
    },
    watch: {
        // popup: function() {
        //     if(this.popup) {
        //         $("body").addClass("_freeze")
        //     } else {
        //         $("body").removeClass("_freeze")
        //     }
        // }
    },
    mounted: function () {
        var vm = this;
        // vm.navOpen();
        // vm.getAppstate();
        // vm.start_date = "2019/09/25 10:00:00";
        // vm.mode_status = "comingsoon" // started  timeover  comingsoon
        // if(new Date() > new Date("2019/09/25 10:00:00")) {
        //     vm.mode_status = "started"
        // } else {
        //     vm.start_date = "2019/09/25 10:00:00";
        //     vm.mode_status = "comingsoon" 
        // }
    }
});

Vue.component('comingsoon', {
    template: "#comingsoon",
    props: ['start_date', 'mode_status'], //父層的變數傳給子層用，vue在載入時，會先把子層的元件掛載上去，會造成父層的變數資料是沒有值的狀態
    data: function () {
        return {
            comingsoon: false,
            comPage: "",
            start_date: "",
            mode_status: "",
            date: {
                total: 0,
                // etotal: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            }
        }   
    },
    //***用$emit方法把子層回傳給父層
    watch:{
        // stateToken: function(newVal){
        //     this.$emit('updata',newVal);
        // },
        // top100Arr: function(arr) {
        //     this.$emit('topArr',arr);
        //     // console.log("sdfe")
        // }
    },
    mounted: function () {
        var padLeft = function (str, len) {
            str = '' + str;
            if (str.length >= len) {
                return str;
            } else {
                return padLeft("0" + str, len);
            }
        };
        var vm = this;
        // vm.getAppstate();
        // vm.state_check().then(function (res) {
        //     var data = res.Data;
        //     vm.start_date = data.StartDateTime;
        vm.state_Token().then(function() {
            vm.state_check().then(function(res){
                // console.log("state",res);
                if (res.data.game_status === 3) {
                    // alert('活動已結束 感謝您的參與！');
                    // vm.mode_status = "timeover";
                    // vm.getTop100();
                    // window.location = './index.html';
                } 
                if(res.data.game_status === 1) {
                    // alert('活動尚未開始！');
                    vm.mode_status = "comingsoon";
                    vm.start_date = res.data.start_date;
                    // window.location = './index.html';
                } else {
                    vm.mode_status = "started";
                    // vm.top100();
                    // vm.getTop100();
                    // vm.start_date = res.data.start_date;
                }
            });
        });
        var timeinterval = setInterval(function () {
            var st = Date.parse(new Date(vm.start_date)) - Date.parse(new Date());
            // var et = Date.parse(new Date(vm.end_date)) - Date.parse(new Date());
            var seconds = Math.floor((st / 1000) % 60);
            var minutes = Math.floor((st / 1000 / 60) % 60);
            var hours = Math.floor((st / (1000 * 60 * 60)) % 24);
            var days = Math.floor(st / (1000 * 60 * 60 * 24));
            vm.date = {
                'total': st,
                // 'etotal': et,
                'days': padLeft(days, 2),
                'hours': padLeft(hours, 2),
                'minutes': padLeft(minutes, 2),
                'seconds': padLeft(seconds, 2)
            };
            if(vm.mode_status == "started") {
                clearInterval(timeinterval);
                vm.comingsoon = false;
                vm.comPage = "";
                $("body").removeClass("_freeze");
                // vm.comingsoon = true;
            } 
            if(vm.mode_status == "timeover") {
                vm.comingsoon = true;
                // vm.comingsoon = false;
                vm.comPage = "timeover";
                $("body").addClass("_freeze");
            } 
            if(vm.mode_status == "comingsoon") {
                vm.comingsoon = true;
                // vm.comingsoon = false;
                vm.comPage = "comingsoon";
                $("body").addClass("_freeze");
            }
        }, 1000);
        // });
    },
});

Vue.component('timeover', {
    template: "#timeover",
    props: ['StartDate', 'mode_status'], //父層的變數傳給子層用
    data: function() {
        return {
            timeover: true,
        }
    },
    mounted: function() {
        var vm = this;
        vm.timeover = true;
        alert("timeover");
    }
});