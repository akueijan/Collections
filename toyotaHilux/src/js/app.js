const
    production = $("#appjs").data("mode") === false,
    friendo_url = $("#appjs").data("site");

const device = deviceCheck();

Vue.config.devtools = !production;
Vue.config.debug = !production;
Vue.config.silent = production;


// Vue.config.devtools = false;
// Vue.config.debug = false;
// Vue.config.silent = true;

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
            projectStatus: null, // null 3
            errorMsg: "",
            envMode: production ? "Started" : "Testing",
            mainToken:"",
            reCaptcha: "",
            isPc: false,
            popup: false,
            popPage: "", // save fail warning correct error poploading done
            alertPopup: false,
            alertPage: "", // alert oops
            eventPopup: false,
            loading: false,
            loadPage: "", // formloading poploading
            warning: 0,
            savecheck: {
                q1: 0,
                q2: 0,
                q3: 0
            },
            gameAns: {
                txt: "",
                keyword: ""
            },
        }
    },
    computed: {
    },
    watch: {
        errorMsg: function (val) {
            $('body').toggleClass('_freeze');
        }
    },
    methods: {
        gtmEvent: function (gtmData) {
            // console.log("gtm:", gtmData);
            dataLayer.push({'event': gtmData});
        },
        gaEvent(Label,Action) {
            // console.log(Label)
            ga('send', {
                hitType: 'event',
                eventCategory: "202007_HILUXMC",
                eventAction: Action,
                eventLabel: Label
            });
        },
        gtagEvent(Label,gtagData) {
            gtag('event',gtagData,{
                'event_category': '202007_HILUXMC',
                'event_label': Label
            })
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
                url: `${friendo_url}token`,
                headers: {
                    "webToken": "Y7LpsA6d5VDRjqeWB1F6cA=="
                },
                method: "POST",
                // dataType: "json"
            }).done(function (res) {
                // console.log(res);
                vm.mainToken = res.token;
                vm.startDate = res.startDate;
                vm.endDate = res.endDate;
                vm.projectStatus = res.projectStatus;
            });
        },
        grecaptcha: function (page) {
            var vm = this;
            return new Promise(function (resolve, reject) {
                grecaptcha.execute('6LfXybAZAAAAAAIVaOzEtaP-N1m_Zh3tX7ftaIxp', {
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
        popClose(mode) {
            var vm = this;

            vm.eventPopup = false;
            if (mode != 'fb') {
                vm.popup = false;
                vm.popPage = ""
            }
            vm.alertPopup = false;
            vm.alertPage = "";
        },
        eventOpen() {
            var vm = this;

            vm.eventPopup = true;
        },
        checkBrower(page) {
            var vm = this;
            var u = navigator.userAgent;
            var ua = navigator.userAgent.toLowerCase();
            var isLineApp = u.indexOf("Line") > -1; // Line 內建瀏覽器
            var isFbApp = u.indexOf("FBAV") > -1; // FB App 內建瀏覽器
            
            if(isLineApp) {
                // window.open("https://www.toyota.com.tw/event/202007_HILUXMC/index.html?openExternalBrowser=1")
                if (window.location.href.indexOf('?') == -1) {
                    window.location.href += '?openExternalBrowser=1';
                } else {
                    window.location.href += '&openExternalBrowser=1';
                }
            }
            // console.log(window.innerWidth );
            // console.log(navigator.userAgent);
            // if(!navigator.userAgent.match('Instagram')) {
            //     if(window.innerWidth > 768) {
            //         vm.isPc = true
            //         document.querySelector("body").style = "overflow: hidden"
            //         if(page !== "index") {
            //             window.location = "index.html"
            //         }
            //     }
            // }
            if(window.innerWidth > 1000) {
                vm.isPc = true;
                document.querySelector("body").style = "overflow: hidden"
                if(page !== "index") {
                    window.location = "index.html"
                }
            } else {
                vm.isPc = false;
            }
        },
    },
    mounted: function () {
        var vm = this;

    }
})
