const
    production = $("#appjs").attr("mode") === "false", 
    friendo_url = $("#appjs").attr("site");

const device = deviceCheck();

Vue.config.devtools = !production;
Vue.config.debug = !production;
Vue.config.silent = !production;

$(function () {
    console.log("v1", device.os, device.version);
    $(".nav").menu();
});

function onYouTubeIframeAPIReady() {
    if($("#index").length>0)
        index_view.YT_init();
}

function findGetParameter(parameterName) {
    let result = null,
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
    let result = null,
        tmp = [];
    let cookie = document.cookie;
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
    let device = {};
    let md = new MobileDetect(window.navigator.userAgent);
    if (md.match(/android/i)) {
        device.os = "android";
        device.version = md.version("android");
    } else if(md.match(/(iphone|ipad|ipod);?/i)) {
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
            webToken: "uFzbcvZQVwIlwQaC8aktlA==",
            error_msg: "",
            error_cou:6,
            loading:false
        }    
    },
    watch: {
        error_msg: function (val) {
            $('body').toggleClass('_freeze');
        }
    },
    methods: {
        gaEvant: function (action, category, label) {
            ga('send', 'event',{
                eventCategory: category,
                eventAction: action,
                eventLabel: label
            });
            fbq('trackCustom', action, { custom_param: "左岸_" + label });
            console.log("ga:", action, category, label);
        },
        getAccessToken: function (access) {
            let vm = this;
            vm.logger(3, {
                'text': "call api: GetAccessToken",
                'data': access
            }, 'GetAccessToken');
            return new Promise(function (resolve) { 
                $.ajax({
                    url: friendo_url + "GetAccessToken",
                    method: "POST",
                    headers: {
                        "Token": vm.webToken,
                        "User": access
                    },
                    success: function (e) {
                        vm.logger(3, {
                            'name': 'GetAccessToken',
                            'result': e
                        }, 'GetAccessToken');
                    },
                    error: function (xhr, status, error) {
                        console.log("GetAccessToken error:", xhr.statusText);
                        vm.logger(0, {
                            'name': 'GetAccessToken',
                            'httpStatus': status,
                            'errorMsg': xhr.statusText
                        }, 'GetAccessToken');
                    },
                    dataType: "json"
                }).then(function (e) { 
                    vm.setCookie("_AT", e.data, 3600);
                    resolve(e.data);
                })
            })
        },
        server_busy: function () {
            let vm = this;
            vm.error_msg = "系統忙碌中，請稍後在試!";
            vm.loading = false;
            vm.error_cou = 6;
        },
        setCookie: function (cname, cvalue, time){
            var d = new Date();
            d.setTime(d.getTime() + (time * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";";
        },
        logger: function (level, content, tag) {
            if (production){
                // level : ['ERROR' => 0, DEBUG' => 1, 'WARNING' => 2, 'INFO' => 3, 'ALL' => 4]
                let level_info = ['ERROR', 'DEBUG', 'WARNING',  'INFO', 'ALL'];
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
        }
    }
})