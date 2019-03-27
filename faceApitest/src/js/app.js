const
    production = $("#appjs").data("mode") === "false",
    friendo_url = $("#appjs").data("site");

const device = deviceCheck();

Vue.config.devtools = !production;
Vue.config.debug = !production;
Vue.config.silent = !production;

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
            start_date: "2100/08/09 12:09:10",
            error_msg: "",
            mode: production ? "Started" : "Testing",
            loading: false,
            popuptop: "",
            navHeight: "",
            rewardShake: true,
            lineHref: '',
        }
    },
    computed: {
        openCome: function () {
            return !(this.mode == "Testing" || start_date <= 0);
        }
    },
    watch: {
        error_msg: function (val) {
            $('body').toggleClass('_freeze');
        }
    },
    methods: {
        gaEvant: function (gtmData) {
            dataLayer.push({'event': gtmData});
            console.log("ga:", gtmData);
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
        state_check: function () {
            var vm = this;
            return $.ajax({
                method: "GET",
                url: `${friendo_url}GetProjectInfo`,
                success: function (res) {
                    // console.log(res);
                    var data = res.Data;
                    vm.start_date = data.StartDateTime;
                    vm.mode = data.Status;
                }
            })
        },
        scrollTo: function (e) {
            var vm = this;
            vm.room = null;
            vm.allPopupClose();
            $("html,body").animate({
                scrollTop: $(e).offset().top - vm.navHeight
            }, 500);
        },
        popupOpen: function () {
            var vm = this;
            if (!vm.popuptop || vm.popuptop === 0) {
                vm.popuptop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
            }
            $('body').addClass('_freeze');
        },
        popupClose: function () {
            var vm = this;
            $('body').removeClass('_freeze');
            $('html, body').scrollTop(vm.popuptop);
            vm.popuptop = 0;
        },
        afterEnter: function () {
            var vm = this;
            vm.popupOpen();
        },
        getToken: function() {
            var vm = this;
            return $.ajax({
                // url: "https://carrefour2019cny.azurewebsites.net/api/auth/login?projectId=61",
                url: `${friendo_url}api/auth/login?projectId=61`,
                headers: {
                    "webtoken": "2YRiIGevkjZZ-S22iwwuSoajRcnZUSeEJ+dwslTtM+s="
                },
                method: "GET",
                dataType: "json"
            });
        },
    },
    components: {
        comingsoon: comingsoon
    },
    mounted: function () {
        var vm = this;
        // fix-body-space
        var navHeight = $('.window-top').height();
        vm.navHeight = navHeight - 30;
        $('body').css('margin-top', vm.navHeight);
        $(".nav-lock").click(function(){
            $("body").removeClass("_freeze");
        })
        alert('a')
    }
})


Vue.component('comingsoon', {
    template: "#comingsoon",
    props: ['StartDate', 'mode'],
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
        }   
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
        // vm.state_check().then(function (res) {
        //     var data = res.Data;
        //     vm.start_date = data.StartDateTime;
        var timeinterval = setInterval(function () {
            var t = Date.parse(new Date(vm.StartDate)) - Date.parse(new Date());
            var seconds = Math.floor((t / 1000) % 60);
            var minutes = Math.floor((t / 1000 / 60) % 60);
            var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            vm.date = {
                'total': t,
                'days': padLeft(days, 2),
                'hours': padLeft(hours, 2),
                'minutes': padLeft(minutes, 2),
                'seconds': padLeft(seconds, 2)
            };
            if (vm.date.total <= 0 || vm.mode == "Testing") {
                clearInterval(timeinterval);
                vm.comingsoon = false;
            } else {
                vm.comingsoon = true;
            }
        }, 1000);
        // });
    },
})
