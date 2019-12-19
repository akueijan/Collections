const
    production = $("#appjs").data("mode") === "false",
    friendo_url = $("#appjs").data("site");

const device = deviceCheck();

Vue.config.devtools = !production;
Vue.config.debug = !production;
Vue.config.silent = !production;

var md = new MobileDetect(window.navigator.userAgent);
var isMobile = md.phone() != null || md.tablet() != null;

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
            // video_link: video_link,
            rewardShake: true,
            lineHref: '',
            popup: false,
            pageload: false,
            // loading: true,
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
        scrollTo: function (e,int) {
            var vm = this;
            // vm.room = null;
            // vm.allPopupClose();
            if(!isMobile) {
                $("html,body").animate({
                    scrollTop: $(e).offset().top+int
                }, 500);
            } else {
                $("html,body").animate({
                    scrollTop: $(e).offset().top
                }, 500);
            }
        },
        popupOpen: function () {
            var vm = this;
            vm.popup = true
            $('body').addClass('_freeze');
        },
        popupClose: function () {
            var vm = this;
            $('body').removeClass('_freeze');
            // $('html, body').scrollTop(vm.popuptop);
            vm.popup = false;
        },
        afterEnter: function () {
            var vm = this;
            vm.popupOpen();
        },
        getToken: function() {
            var vm = this;
            return $.ajax({
                // url: "https://carrefour2019cny.azurewebsites.net/api/auth/login?projectId=61",
                url: `${friendo_url}api/login`,
                headers: {
                    "webtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTE2ODY4MjIsImlzcyI6IkNvcmVKV1Quc3ByaW5nLXRyZWVzLmNvbSIsImF1ZCI6IkZlaWIyMDE5In0.1LQ_yzpj-GnBjyYhnt5-C2tiBNP4mN9Wg7APBoongU4"
                },
                method: "GET",
                dataType: "json"
            }).done(function(redata){
                vm.token = redata.token;
            });
        },
        // saveToken: function() {
        //     var vm =this;
        //     return new Promise(function (resolve) {
        //         vm.getToken().then(function(redata){
        //             vm.token = redata.token;
        //         });
        //         resolve();
        //     });
        // },
        postAnswer: function() {
            var vm = this;
            var post_data = {
                "Json" : JSON.stringify(vm.cunArr),
                "Image" : vm.base64Img,
                "Score" : vm.allcun,
            }
            return $.ajax({
                url: `${friendo_url}feib2019/SaveAnswer`,
                headers: {
                    "Authorization": "Bearer "+ vm.token,
                },
                data: post_data,
                method: "POST",
                dataType: "json"
            }).done(function(res){
                // console.log(res);
            })
        },
        saveAid: function() {
            var vm = this;
            vm.getToken().then(function(redata){
                vm.token = redata.token;
                vm.postAnswer().then(function(redata){
                    console.log(redata);
                    vm.aid = redata.data;
                    // window.open("result.html?aid="+vm.aid,"_self");
                    // vm.getShare();
                });
            })
        },
        getShare: function() {
            var vm = this;
            return $.ajax({
                url: `${friendo_url}feib2019/GetAnswer?aid=`+vm.aid,
                headers: {
                    "Authorization": "Bearer "+ vm.token,
                },
                // data: post_data,
                method: "GET",
                dataType: "json"
            }).done(function(redata){
                console.log(redata)
                vm.shareUrl = redata.data.imageUrl;
                vm.allcun = redata.data.score;
                vm.cunArr = JSON.parse(redata.data.json);
            })
        },
        hashLink: function() {
            var vm = this;
            if (window.location.hash) {
                // window.scrollTo(0, 0);
                setTimeout(function () {
                    window.scrollTo(0, 0);
                }, 1);
            }
            $(document).on('click', '.nav-menu a[href*="#"]', function (event) {
                var url = $.attr(this, 'href')
                var hash = url.substring(url.indexOf('#')); 
                if(!isMobile) {
                    $('html, body').animate({ scrollTop: $(hash).offset().top+460 }, 500);
                } else {
                    $('html, body').animate({ scrollTop: $(hash).offset().top }, 500);
                }
                location.hash = "";
            });
        },
        loadingfn: function() {
            var vm = this;
            vm.loading = true;
            setTimeout(function(){
                // $(".loadingBox").addClass("loadingBox-active");
                $(".load-left").addClass("load-left-active");
                $(".load-right").addClass("load-right-active");
                $("body").css("opacity","1");
                $("body").addClass("_freeze");
                // setTimeout(function() {
                //     $(".load-left").removeClass("load-left-active");
                //     $(".load-right").removeClass("load-right-active");
                //     $("body").removeClass("_freeze");
                //     vm.loading = false;
                // },1500);
            },500);
        },
        loadingfnClose: function() {
            var vm = this;
            $(".load-left").removeClass("load-left-active");
            $(".load-right").removeClass("load-right-active");
            $("body").removeClass("_freeze");
            vm.loading = false;
        },
        pageLoad: function() {
            var vm = this;
            vm.pageload = true;
            setTimeout(function(){
                // $(".loadingBox").addClass("loadingBox-active");
                $(".pageload-left").addClass("pageload-left-active");
                $(".pageload-right").addClass("pageload-right-active");
                $("body").css("opacity","1");
                $("body").addClass("_freeze");
                setTimeout(function() {
                    $("body").removeClass("_freeze");
                    vm.pageload = false;
                },600);
            },500);
        },
        alertTimeover: function() {
            alert("活動已結束");
            return;
        }
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
        });
        vm.hashLink();
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
