const
    production = $("#appjs").data("mode") === false,
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
            mainToken:"",
            isPc: false,
            popup: false,
            popPage: false,
            slickPage: "", //notice fixed exchange
            utm: "",
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
                scrollTop: $(e).offset().top
            }, 500);
        },
        getToken: function() {
            var vm = this;
            return $.ajax({
                // url: "https://carrefour2019cny.azurewebsites.net/api/auth/login?projectId=61",
                url: `${friendo_url}auth/login?projectId=66`,
                headers: {
                    "webtoken": "WBqIHc9hTmwyL+g9m0ykfA=="
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
                grecaptcha.execute('6LfUo7MUAAAAAJQAML08ruhPeYZvihLYaVvtuYrJ', {
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

        popAni(teachpage) {
            var vm = this;
            vm.popup = true;
            vm.popPage = true;
            vm.slickPage = teachpage;

            setTimeout(function() {
                var indexSlick = new slickUse(".slickblock", false);
                indexSlick.Start();
                $(".btn-prev").click(function() {
                    indexSlick.Prev();
                })
                $(".btn-next").click(function() {
                    indexSlick.Next();
                })

                if(vm.slickPage === "notice") {
                    var stepSlick = new slickUse(".slickstep", true);
                    stepSlick.Start();
                }
                
                var sec = 0.6;
                var tl = new TimelineMax({
                    onComplete: () => {
                        vm.popPage = false;
                        $(".popup").css("overflow-y","auto")
                    }
                });
                tl.from(".anipage .content", sec*2.5, {
                    x: -1590,
                })
                tl.to(".anipage .door", sec*2, {
                    x: -650,
                })
                tl.to(".anipage .content", sec*2.5, {
                    css: {scale: 2, transformOrigin:"27% 30%"}
                })
            }, 50)
        },
        popClose() {
            var vm = this;
            
            vm.popPage = "";
            vm.popup = false;
        },
        checkBrower(page) {
            var vm = this;
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
        searhUtm() {
            var vm = this;

            return new Promise(function(resolve) {
                var getUrlString = location.href;
                var url = new URL(getUrlString);
                vm.utm = url.search.replace('?', '&');
                resolve();
            })
        }
    },
    mounted: function () {
        var vm = this;

    }
})

class slickUse {
    constructor(bd, auto) {
        this.bd = bd;
        this.auto = auto;
        // this.Slide = Slide
        // this.prev = prev;
        // this.next = next
    }
    Start() {
        $(this.bd).slick({
            arrows: false,
            autoplay: this.auto
            // initialSlide: this.Slide
        });
    }
    Next() {
        $(this.bd).slick("slickNext");
    }
    Prev() {
        $(this.bd).slick("slickPrev");
    }
}