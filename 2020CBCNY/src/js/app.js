const
    production = $("#appjs").data("mode") === "false",
    friendo_url = $("#appjs").data("site");

const device = deviceCheck();

Vue.config.devtools = !production;
Vue.config.debug = !production;
Vue.config.silent = production;

var md = new MobileDetect(window.navigator.userAgent);
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
        });
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
            // start_date: "",
            error_msg: "",
            // mode: production ? "Started" : "Testing",
            start_date: "2020-01-29T00:00:00",
            // mode: "",
            loading: false,
            navHeight: "",
            // StartDate: ""
            gToken: "",
            popup: false,
            poPage: "", // testfail testsuc
            popweek: 0,
            isMobile: false,
            scrollto: 0,
            index_alert: false,
            failBro: false,
        };
    },
    computed: {
        // openCome: function () {
        //     return !(this.mode == "Testing" || start_date <= 0);
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

        //=====api=====//
        getStatus: function () {
            var vm = this;
            return $.ajax({
                url: `${friendo_url}Comebest2020CNY/status`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                method: "GET",
            }).done(function(res){
                console.log("status:",res);
            });
        },
        
        getToken: function() {
            var vm = this;
            return $.ajax({
                url: `${friendo_url}auth/login?projectId=76`,
                headers: {
                    "WebToken": "MYEqBbjINY4sLb4FLCgSOQ=="
                },
                method: "GET",
                dataType: "json"
            }).done(function(res){
                console.log(res);
                vm.gToken = res.token;
            });
        },

        scrollTo: function (e) {
            var vm = this;
            $("html,body").animate({
                scrollTop: $(e).offset().top - $(".nav").height()
            }, 500);
        },

        grecaptcha: function(page) {
            var vm = this;
            // console.log('in') 
            return new Promise(function (resolve, reject) {
                grecaptcha.execute('6LcXlcsUAAAAAHUExoVPHjVTzvO2TkvW-6WS92iv', { action: page }).then(function (token) {
                    vm.reCaptcha = token;
                    resolve()
                }, function () { 
                    alert('Google驗證失敗，請再次嘗試\n如無法排除此問題，建議重新整理此頁面');
                    reject()
                });
            });
        },

        getIe: function() {
            var vm = this;
            var getExplorer = (function() {
                var explorer = window.navigator.userAgent,
                compare = function(s) { return (explorer.indexOf(s) >= 0); },
                ie11 = (function() { return ("ActiveXObject" in window) })();
                if (compare("MSIE") || ie11) { return 'ie'; }
                else if (compare("Firefox") && !ie11) { return 'Firefox'; }
                else if (compare("Chrome") && !ie11) { return 'Chrome'; }
                else if (compare("Opera") && !ie11) { return 'Opera'; }
                else if (compare("Safari") && !ie11) { return 'Safari'; }
            })();
            if (getExplorer == 'ie') {
                vm.failBro = true;
                vm.index_alert = true;
                // alert('目前瀏覽器為舊版 IE，建議使用Chrome瀏覽器，獲得最佳遊戲體驗！');
            }
        },

        checkBrowser() {
            var vm = this;
            var device = {};
            // var md = new MobileDetect(window.navigator.userAgent);
            var u = navigator.userAgent;
            var isLineApp = u.indexOf("Line") > -1; // LINE App 內建瀏覽器
            var isFbApp = u.indexOf("FBAV") > -1; // FB App 內建瀏覽器
            var IosFbApp = u.indexOf("FBAN") > -1; // FB App 內建瀏覽器
            // if(md.match(/android/i)) {
                
            // }
            // console.log('user',u);
            if(isFbApp || isLineApp || IosFbApp) {
                vm.failBro = true;
                vm.index_alert = true;
            }
        },

        fbshare() {
            var vm = this;
            // var fbhtml_url = friendo_url + "/sentra2019/index?id=" + vm.faceId; //網址
            // var fbhtml_url= vm.shareUrl; //圖
            // window.open('https://www.facebook.com/sharer/sharer.php?u=' + fbhtml_url,'_blank');
            window.open('https://www.facebook.com/sharer/sharer.php?u=https://campaign.friendo.com.tw/2020CBCNY/index.html'+'&hashtag=%23'+'好運鼠來寶有能量就是帥','_blank');
            return false;
            // var isIE=window.ActiveXObject || "ActiveXObject" in window;
            // if(isIE) {
            //     window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url);return false;
            // } else {
            //     window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url+'&hashtag=%23'+vm.shareTitle);return false;
            // }
        },

        lineshare() {
            var vm = this;
            var sUrl = encodeURIComponent(`https://campaign.friendo.com.tw/2020CBCNY/index.html?openExternalBrowser=1`)
            window.open(`http://line.naver.jp/R/msg/text/?購買康貝特、PowerBOMB、康貝特200P、黃金康貝特即可參加登錄發票抽獎，最大獎十萬元黃金鼠！週週再抽現金8,888、威秀電影票、LINE POINTS等多項好禮！${sUrl}`, "_blank");
        },

        popClose() {
            var vm = this;
            vm.popup = false;
            vm.poPage = "";
            $('body').removeClass('_freeze');
            $("html,body").scrollTop(vm.scrollto);
        },

        indexlink() {
            var vm = this;
            $("#nav-prods").click(function(){
                window.location.href = "./index.html#prods";
            });
            $("#nav-readme").click(function(){
                window.location.href = "./index.html#readme";
            });
        },

        timeOver() {
            alert("活動已結束 感謝您的參與");
        }
    },
    components: {
        comingsoon: comingsoon
    },
    mounted: function () {
        var vm = this;
        
    }
});


Vue.component('comingsoon', {
    template: "#comingsoon",
    props: ['startDate', 'comMode'],
    // props: {
    //     startDate: String,
    //     comMode: String,
    // },
    data: function () {
        return {
            comingsoon: false,
            date: {
                total: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            }
        };
    },
    // methods: {
    //     upSD: function(SD) {
    //         vm.start_date = SD;
    //     },
    //     upCM: function(CM) {
    //         vm.mode = CM;
    //     },
    // },
    // watch: {
    //     startDate: function(value) {
    //         vm.upSD(value);
    //     },
    //     comMode: function(value) {
    //         vm.upCM(value);
    //     }
    // },
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
        // vm.mode = "Testing";
        // vm.start_date = "2100/08/09 12:09:10";
        vm.getToken().then(function(res){
            vm.getStatus().then(function(res){
                if(res.data.game_status == 1) {
                    vm.comingsoon = true;
                    vm.start_date = res.data.startdate;
                    // vm.start_date = "2020-01-17T15:30:00";
                    $("body").addClass("_freeze");
                }
                if(res.data.game_status == 2) {
                    vm.comingsoon = false;
                    clearInterval(timeinterval);
                } 
                if(res.data.game_status == 3) {
                    alert("活動已結束，感謝您的參與");
                    clearInterval(timeinterval);
                }
            })
        })
        var timeinterval = setInterval(function () {
            var t = Date.parse(new Date(vm.start_date)) - Date.parse(new Date());
            var seconds = Math.floor((t / 1000) % 60);
            var minutes = Math.floor((t / 1000 / 60) % 60);
            var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            if(t < 0) {
                vm.comingsoon = false;
                $("body").removeClass("_freeze");
                clearInterval(timeinterval);
                // location.reload();
            } else {
                vm.date = {
                    'total': t,
                    'days': padLeft(days, 2),
                    'hours': padLeft(hours, 2),
                    'minutes': padLeft(minutes, 2),
                    'seconds': padLeft(seconds, 2)
                };
            }
            // if (vm.date.total <= 0 || vm.mode == "Testing") {
            //     clearInterval(timeinterval);
            //     vm.comingsoon = false;
            // } else {
            //     vm.comingsoon = true;
            // }
        }, 1000);
        // clearInterval(timeinterval);
        // });
    },
});
