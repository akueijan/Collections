const production = document.getElementById("appjs").dataset.mode === false;
const device = deviceCheck();
const md = new MobileDetect(window.navigator.userAgent);

Vue.config.devtools = !production;
Vue.config.debug = !production;
Vue.config.silent = production;

document.addEventListener('DOMContentLoaded', function() {
    console.log("v1.01");
    console.log(device);
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
            projApi:null,
            errorMsg: "",
            envMode: production ? "Started" : "Testing", // Testing
            loading: false,
            popup: false,
            popPage: "", // awardpage oops shareover invoend
            shareLink: window.location.href.includes('campaign.friendo.com.tw')? 'https://campaign.friendo.com.tw/Grapekingbeverage/' : 'https://release.azureedge.net/Grapekingbeverage/',
            isIndex: false
        }
    },
    computed: {
    },
    watch: {
        errorMsg: function (val) {
            document.querySelector('body').classList.toggle('_freeze');
        }
    },
    methods: {
        gaEvant: function (gtmData) {
            dataLayer.push({'event': gtmData});
            console.log("ga:", gtmData);
        },
        // server_busy: function () {
        //     var vm = this;
        //     vm.errorMsg = "系統忙碌中，請稍後在試!";
        //     vm.loading = false;
        //     vm.errorCou = 6;
        // },
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
        scrollTo: function (to) {
            var vm = this;
            // var html = document.querySelector("html");
            // var body = document.querySelector("body");
            var element = document.scrollingElement || document.documentElement;
            var target = document.querySelector(to);
            // var startEl = (body.scrollTop > 0) ? body : html,
            var duration = 1500; //整個過程時間 可自定義
            var padding = 0; //滑動後留白 可自定義
            var startEl = element,
                change = Math.abs(target.offsetTop - startEl.scrollTop - padding),
                currentTime = 0,
                increment = 50;
            var animateScroll = function() {
                //算出滑動的步數
                Math.easeInOutQuad = function (t, b, c, d) {
                    t /= d/2;
                    if (t < 1) return c/2*t*t + b;
                    t--;
                    return -c/2 * (t*(t-2) - 1) + b;
                };
                currentTime += increment;
                var val = Math.easeInOutQuad(currentTime, startEl, change, duration);
                // console.log('val:',typeof(val))
                if(startEl.scrollTop > target.offsetTop) {
                    startEl.scrollTop -= parseInt(val);
                    if(startEl.scrollTop <= target.offsetTop) {
                        startEl.scrollTop =  target.offsetTop
                        return
                    }
                } else {
                    startEl.scrollTop = parseInt(val);
                }
                // console.log(val)
                // console.log(startEl.scrollTop)
                if(currentTime < duration) {
                    requestAnimationFrame(animateScroll);
                }
            };
            animateScroll();
        },
        grecaptcha: function (page) {
            var vm = this;
            return new Promise(function (resolve, reject) {
                grecaptcha.execute('6LeP0NAcAAAAAOIFyfCq1Smo-tzpnq7JAQhJfeuz', {
                    action: page
                })
                .then(function (token) {
                    vm.captcha = token;
                    resolve()
                }, function () {
                    alert('Google驗證失敗，請再次嘗試\n如無法排除此問題，建議重新整理此頁面');
                    reject()
                });
            });
        },
        aLink: function() {
            var alinks = document.querySelectorAll('a');
            for(let i=0; i<alinks.length; i++) {
                alinks[i].setAttribute('rel' ,'noreferrer noopener');
            }
        },
        popOpen(page) {
            this.popup = true
            this.popPage = page
        },
        popClose() {
            this.popup = false
            this.popPage = ""
            switch(this.ticketOpt) {
                case "invoice":
                    this.gaEvant("電子發票_成功登錄_繼續登錄")
                    break
                case "cloud":
                    this.gaEvant("雲端載具_綁定成功_繼續綁定")
                    break
                case "tradition":
                    this.gaEvant("傳統發票_成功登錄_繼續登錄")
                    break
                default:
                    break
            }
        },
        checkBroswer() {
            let u = navigator.userAgent
            let ua = navigator.userAgent.toLowerCase()
            let isLineApp = u.indexOf("Line") > -1

            if(isLineApp) {
                window.location.href = window.location.href + '?openExternalBrowser=1'
            }
        }
    },
    created: function() {
        this.projApi = new ProjectApi(98, "7Ui9hadlLhlcZDjZhUgByw==");
    },
    mounted: function () {
        // this.projApi = new ProjectApi(98, "7Ui9hadlLhlcZDjZhUgByw==");  // projectId, webToekn
        if(this.envMode === "Started") {
            console.log = function() {}
        }
    }
})
