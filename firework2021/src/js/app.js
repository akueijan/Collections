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
            envMode: production ? "Started" : "Testing",
            loading: false,
            friendo_url: document.getElementById("appjs").dataset.site,
            // client_Id: "1515344613",
            // redirect_Url: "https://richart.tw/TSDIB_RichartWeb/RC08/Line10",
            popup: "",
            popPage: "",
            guid: "",
            haveRichart: true,
            isPc: false,
            startItem: 0,
            utm: "",
            sendLoading: false
        }
    },
    computed: {
        production: function() {
            return document.getElementById("appjs").dataset.mode;
        },
        client_Id: function() {
            return this.production === "true" ? "1511930966" : "1515344613";
        },
        redirect_Url: function() {
            return this.production === "true" ? "https://tsdib-test.taishinbank.com.tw/TSDIB_RichartWeb_line/RC08/Line10" : "https://richart.tw/TSDIB_RichartWeb/RC08/Line10";
        }
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
                grecaptcha.execute('6LfUo7MUAAAAAJQAML08ruhPeYZvihLYaVvtuYrJ', {
                    action: page
                })
                .then(function (token) {
                    vm.reCaptcha = token;
                    resolve()
                }, function () {
                    alert('Google驗證失敗，請再次嘗試\n如無法排除此問題，建議重新整理此頁面');
                    reject()
                });
            });
        },
        aLink: function() {
            let alinks = document.querySelectorAll('a');
            for(let i=0; i<alinks.length; i++) {
                alinks[i].setAttribute('rel' ,'noreferrer noopener');
            }
        },
        popOpen(page) {
            const vm = this;
            document.querySelector('body').classList.add('_popfreeze')
            switch(page) {
                case 'event':
                    vm.popup = 'event';
                    break;
                case 'usersev':
                    vm.popup = 'usersev';
                    break;
                default:
                    break;
            }
            
        },
        popupClose() {
            const vm = this;
            vm.popup = "";
            vm.popPage = "";
            document.querySelector('body').classList.remove('_popfreeze')
        },
        checkbrowser() {
            const vm = this;
            if(window.innerWidth > 1000) {
                vm.isPc = true;
            } else {
                vm.isPc = false;
            }
        },
        checkWeek() {
            const vm = this;
            let now = new Date();

            if(now > new Date("2021/1/8")) {
                vm.startItem = 0
            }
            if(now > new Date("2021/1/15")) {
                vm.startItem = 1;
                document.querySelector('.event-over1').style.visibility = 'inherit'
            }
            if(now > new Date("2021/1/22")) {
                vm.startItem = 2;
                document.querySelector('.event-over2').style.visibility = 'inherit'
            }
            if(now > new Date("2021/1/29")) {
                vm.startItem = 3;
                document.querySelector('.event-over3').style.visibility = 'inherit'
            }
            if(now > new Date("2021/2/5")) {
                vm.startItem = 4;
                document.querySelector('.event-over4').style.visibility = 'inherit'
            }
            if(now > new Date("2021/2/12")) {
                vm.startItem = 0;
                document.querySelector('.event-over5').style.visibility = 'inherit'
            }
        },
        searhUtm() {
            const vm = this;

            return new Promise(function(resolve) {
                let getUrlString = location.href;
                let url = new URL(getUrlString);
                vm.utm = url.search.replace('?', '&');
                resolve();
            })
        },
        outLink() {
            const vm = this;
            let oldlink = 'utm_source=richart&utm_medium=line&utm_campaign=richart_bcbonbon_20201229&utm_content=textlink_index'

            vm.searhUtm().then(()=> {
                if(vm.utm == "") {
                    window.open(`https://richart.tw/TSDIB_RichartWeb/RC00/RC000000?${oldlink}`)
                } else {
                    window.open(`https://richart.tw/TSDIB_RichartWeb/RC00/RC000000?${vm.utm}${oldlink}`)
                }
            })
        }
    },
    mounted: function () {
        const vm = this;
        // this.projApi = new ProjectApi(89, "cXr7L3Pqo-GF-OcL7U3m8A==");  // projectId, webToekn
        // console.log(document.getElementById("appjs").dataset.mode, production)
    }
})
