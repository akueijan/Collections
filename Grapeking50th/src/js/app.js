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
            // start_date: "",
            error_msg: "",
            // mode: production ? "Started" : "Testing",
            // mode_status: "",
            loading: false,
            popuptop: "",
            navHeight: "",
            rewardShake: true,
            lineHref: '',
            gToken: "",
            Logo: "",
            fbData: {
                mb_id: "",
                token: "",
                fb_id: "",
                fbName: "",
                fbPic: "",
                fbPhone: "",
            },
            user: {
                phone: "",
            },
            play: {
                ticket: "",
                code: "",
                score: 0
            },
            popup: false,
            popPage: "",
            gameStep: "",
            awardList: "",
            reCaptcha: "",
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
        //===api區===//
        getToken: function() {
            var vm = this;
            return $.ajax({
                // url: "https://carrefour2019cny.azurewebsites.net/api/auth/login?projectId=61",
                url: `${friendo_url}auth/login?projectId=67`,
                headers: {
                    "WebToken": "u+Fw6wqP5Tgn+txlgClW+g=="
                },
                method: "GET",
                dataType: "json",
                success: function(res) {
                    // console.log("token:",res);
                    vm.gToken = res.token;
                }
            });
        },
        state_check: function () {
            var vm = this;
            var post_data = {
                "mb_id": vm.fbData.mb_id,
            }
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}comebest2/getstatus`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json",
                success: function (res) {
                    // console.log("state",res);
                    if (res.data.game_status == 3) {
                        vm.mode_status = "timeover";
                    } else if(res.data.game_status == 1) {
                        vm.mode_status = "comingsoon";
                        vm.start_date = res.data.start_date;
                    } else {
                        vm.mode_status = "started"
                    }
                }
            })
        },
        getStatus: function() {
            var vm = this;
            var post_data = {
                "mb_id": vm.fbData.mb_id,
            }
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}comebest2/getstatus`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json",
                success: function (res) {
                    // console.log("getStatus",res);
                    vm.fbData.fbName = res.data.name;
                    vm.fbData.fbPic = res.data.pic_url;
                    vm.fbData.fbPhone = res.data.phone;
                }
            })
        },
        register: function() {
            var vm = this;
            var post_data = {
                "token": vm.fbData.token,
                "fb_id": vm.fbData.fb_id,
                // "token": "EAAGIzfxjcCABAKJ0C6WeiGtiGsPixOYWWzM6ghX4yrHZAffKp9KZB1roD5EM6dsoYlYq6LMeKkASwtIF7XVUotVHSGySmqL6FzqxZCFyesHfvl1mr4xuogBSCaZBN5DGyIWqTjTQRWjXpvUNOZAfBZCZABNnEoMcDy744a7ZCPutLFH3hudul5dF26xtXwUZCuNXDsPshBWDij6Yx1NKZCC7DvFd4hxhZCS3mFL2vjTcDAujgZDZD",
                // "fb_id": "2664861673524692"
            }
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}comebest2/register`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json",
                success: function (res) {
                    console.log("mb_id",res);
                    vm.fbData.mb_id = res.data;
                }
            })
        },
        fbshare: function() {
            var vm = this;
            var post_data = {
                "mb_id": vm.fbData.mb_id
            }
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}comebest2/fbshare`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json",
                success: function (res) {
                    // console.log("fbshare",res);
                    // vm.fbData.mb_id = res.data;
                }
            })
        },
        savePhone: function() {
            var vm = this;
            var post_data = {
                "mb_id": vm.fbData.mb_id,
                "phone": vm.user.phone
            }
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}comebest2/savephone`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json",
                success: function (res) {
                    // console.log("savephone",res);
                    // vm.fbData.mb_id = res.data;
                }
            })
        },
        playTicket: function() {
            var vm = this;
            var post_data = {
                "mb_id": vm.fbData.mb_id,
                // "phone": vm.user.phone
                "score": vm.total
            }
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}comebest2/play`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json",
                success: function (res) {
                    console.log("play",res);
                }
            })
        },
        record: function() {
            var vm = this;
            var post_data = {
                "mb_id": vm.fbData.mb_id,
                "ticket": vm.play.ticket,
                "score": vm.play.score
            }
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}comebest2/record`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json",
                success: function (res) {
                    // console.log("record",res);
                    
                }
            })
        },
        top100: function() {
            var vm = this;
            var post_data = {
                "mb_id": vm.fbData.mb_id,
            }
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}comebest2/top100`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                dataType: "json",
                success: function (res) {
                    // console.log("top100",res);
                    
                }
            })
        },
        invoiceSave: function() {
            var vm = this;
            var post_data = {
                "cell": vm.mobile,
                "inv_num": vm.inv_num.toUpperCase(),
                "random_number": vm.inv_random,
                "inv_date": vm.inv_date,
                "actToken" : "Te8RvO6ZlEjaJJtTetH8Mg==",
                "captcha": vm.reCaptcha
            }
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
                // console.log("invores:",res);
            });
        },
        getaward: function() {
            var vm = this;
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}comebest2/LotteryResult/67`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                method: "GET",
                // dataType: "json",
            }).done(function(res){
                console.log("getaward",res);
            })
        },
        grecaptcha: function(page) {
            var vm = this;
            // console.log('in') 
            return new Promise(function (resolve, reject) {
                grecaptcha.execute('6Ld54LMUAAAAAKnhc5FkZICJ4ioSlF7t5ofMg0Ng', { action: page }).then(function (token) {
                    vm.reCaptcha = token;
                    resolve()
                }, function () { 
                    alert('Google驗證失敗，請再次嘗試\n如無法排除此問題，建議重新整理此頁面');
                    reject()
                });
            });
        },
        getRecipientinfo: function() {
            var vm = this;
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}comebest2/recipientinfo/${vm.userid}`,
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
                    vm.ploading = false;
                } else {
                    vm.mobile = res.data.mobile;
                    vm.inv_num = res.data.referenceInfo;
                    vm.awarditem = res.data.awardName;
                    vm.type = res.data.referenceType;
                    vm.ploading = false;
                }
            })
        },
        postRecipientinfo: function() {
            var vm = this;
            var post_data = new FormData();
            post_data.append("CampaignId",67)
            post_data.append("Code",vm.userid)
            post_data.append("Name",vm.name)
            post_data.append("Address",vm.address)
            post_data.append("IdcardFront",vm.IdcardFront)
            post_data.append("IdcardBack",vm.IdcardBack)
            post_data.append("Bankbook",vm.Bankbook)
            post_data.append("Certificate",vm.CertificatePhoto)
            post_data.append("reCaptcha",vm.reCaptcha)
            post_data.append("FBId",vm.fbData.fb_id)
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
                url: `${friendo_url}comebest2/recipientinfo`,
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
        //===功能區===//
        scrollTo: function (e) {
            var vm = this;
            // vm.room = null;
            // vm.allPopupClose();
            $("html,body").animate({
                scrollTop: $(e).offset().top
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
            vm.popup = false;
            vm.popPage = "";
            vm.awardList = "";
            $('body').removeClass('_freeze');
            $('html, body').scrollTop(vm.popuptop);
            vm.popuptop = 0;
        },
        afterEnter: function () {
            var vm = this;
            vm.popupOpen();
        },
        gotoPage: function(page) {
            var vm = this;
            var thisPage = window.location.pathname;
            if(thisPage == page || thisPage == '/') {
                vm.comingsoon = false;
                vm.comPage = "";
            } else {
                window.location.href = page;
            }
        },
        navfbshare: function() {
            window.open('https://www.facebook.com/sharer/sharer.php?u='+"https://campaign.friendo.com.tw/Grapeking50th/index.html"+'&hashtag=%23'+'葡萄王50陪您精彩向前');return false;
        },
    },
    components: {
        comingsoon: comingsoon
    },
    mounted: function () {
        var vm = this;
         
        // 測試用
        // vm.start_date = "2019/10/01 12:00:00";
        // vm.mode_status = "started" // started  timeover  comingsoon
    }
})


Vue.component('comingsoon', {
    template: "#comingsoon",
    props: ['start_date', 'mode_status'], //vue在載入時，會先把子層的元件掛載上去，會造成父層的變數資料是沒有值的狀態
    data: function () {
        return {
            comingsoon: false,
            comPage: "",
            start_date: "",
            mode_status: "",
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
        // vm.getToken().then(function(){
        //     vm.state_check().then(function(){
        //         vm.mode_status = "started";
        //         vm.start_date = "2019/10/02 17:00:00"
        //     })
        // });
        vm.mode_status = "started";
        vm.start_date = "2019/10/02 17:00:00"
        // vm.state_check().then(function (res) {
        //     var data = res.Data;
        //     vm.start_date = data.StartDateTime;
        var timeinterval = setInterval(function () {
            var t = Date.parse(new Date(vm.start_date)) - Date.parse(new Date());
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
            if (vm.mode_status == "started") {
                clearInterval(timeinterval);
                vm.comingsoon = false;
                vm.comPage = "";
            } 
            if (vm.mode_status == "timeover") {
                clearInterval(timeinterval);
                vm.comingsoon = true;
                // vm.comingsoon = false;
                vm.comPage = "timeover";
            } 
            if (vm.mode_status == "comingsoon") {
                vm.comingsoon = true;
                // vm.comingsoon = false;
                vm.comPage = "comingsoon";
            }
        }, 1000);
        // });
    },
})

Vue.component('hello-world', {
    template: '<p>hello world</p>'
})
