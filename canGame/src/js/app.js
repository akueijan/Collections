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
            mainToken:"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY4NjM3MTNjYmU5MDI0NmY2MWY3NWFjNTY0NzA5ZjdiMjdiNjdkNDc1ZWI2YmNmNmFmZmIwYzBmNjUzOThiMzg4YjhiYTBjYTNlM2RmMzkwIn0.eyJhdWQiOiIxIiwianRpIjoiNjg2MzcxM2NiZTkwMjQ2ZjYxZjc1YWM1NjQ3MDlmN2IyN2I2N2Q0NzVlYjZiY2Y2YWZmYjBjMGY2NTM5OGIzODhiOGJhMGNhM2UzZGYzOTAiLCJpYXQiOjE1OTI3OTgyMDksIm5iZiI6MTU5Mjc5ODIwOSwiZXhwIjoxNjI0MzM0MjA5LCJzdWIiOiI2Iiwic2NvcGVzIjpbXX0.VxHy-ndisZgLasdYZ79lkvrupv-S5gkbz3xOEPeMAv-jWlTE_YQnhu7Uhasc6DfkRNRUUMudPEBOJFF-2t6mtxivr0Rchfq8DKFWI_iXL9hZc3AGdFQGzG3nRcQbnwG0gWmzNjTv5aVwHFYU3wNE4jsR53-1ubHyd8cTEK8T7oPTvSlZPaUhgPnYjw-NSZ4U5Wd2JGH5CDligslSBAS3K6SHB4i2dYVhfrxhCDVbe2FTk6AgaqmndDB-8_FZzcuR6h1kjxzQ5dVA915YqqleZWl7vNCa6W0yZLAVNBmrTO-xkTuEsBN3k4rwz-UhAwmE2VjZ7J6fZLO_Mem1ZelHzX4vUCHuSmSY-8gkUpYgXSSz362ucLipShJj9Cy5BXflXcEUIz2xdqfmFH1R9uwe3Yjn3GaeM1dG1l8lS-rgPGfHX1eIqrE7V423ZnTBznk_GW5LgsGuRB31DNXkT1fzKOblvdV6Fdlf5HzKc7ByHp9uCjmi0JYcc4xZOxNeAy1TQpM02wH7cDOScX9m-6ssns_OKJZGrvifwD2IVpzKl-SBmFGMcDwmWjDu9TSCrntebyc0mwMQ3KiyTtRsJ2D6dO7cex2i8Y0wDIRVdpnoEwhDzT7Fq4rUpprsAI917-o-YAdrxvgkVZxQL3TV0w6TmA2x2Znrqqgr7x5MxZwfSjc",
            apiUrl: 'https://nissanlinebc.nissan.com.tw/',
            entId: '1',
            // lineId: 'U5710c6f8916f34e68cd83d0dedecb07c',
            lineId: '',
            popup: false,
            popPage: '', //readme gamestart gameover popleader events noAward awardreadme loading noticketcount
            evtpopup: false,
            userArr: []
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
        initLiff(myliffId) {
            var vm = this;
            liff
                .init({
                    liffId: myliffId
                })
                .then(() => {
                    // console.log(liff.isLoggedIn())
                    liff.ready.then(()=> {
                        // console.log('ready')
                        if(liff.isLoggedIn()) {
                            // const name = profile.displayName
                            liff.getProfile().then(profile => {
                                // console.log(profile)
                                vm.linePic = profile.pictureUrl
                                vm.lineName = profile.displayName
                                vm.lineId = profile.userId
                                // vm.saveLeader()
                            })
                            .catch((err) => {
                                // console.log('error', err);
                            });
                        } else {
                            // window.location = "https://lin.ee/wLVkkm9" // 應加入nissan的好友
                        }
                    }) 
                })
                .catch((err) => {
                    // console.log('err: ', err)
                })
        },
        
        openPop(page) {
            var vm = this
            vm.popup = true
            vm.popPage = page
            if(page=='popleader') {
                vm.showArr()
            }
        },
        closePop() {
            var vm = this
            vm.popup = false
            vm.popPage = ''
        },
        eventShare() {
            var vm = this
            var sUrl = encodeURIComponent(`https://event.nissan.com.tw/sentra_line`)
            window.location = `http://line.naver.jp/R/msg/text/?欸~這超~~~難的！你要不要玩玩看~還可以抽 Switch 和 LINE POINTS 點數哦！%0D%0A《ALL NEW SENTRA 先潮耐力賽》%0D%0A${sUrl}`;
        },
        checkAward() {
            var vm = this
            if(vm.awardName == '' || vm.awardName == null) {
                vm.popup = true
                vm.popPage = 'noAward'
            } else {
                vm.step = 'useraward'
                vm.isGame = false
                // vm.haveAward = true
            }
        },
        noticketShare() {
            var vm = this
            vm.eventShare()
            vm.ticketCount += 1
            vm.popup = false
            vm.popPage = ''
        }
    },
    mounted: function () {
        var vm = this;
    }
})
