var invisible_grecaptcha;

function onloadCallback() {
    // console.log("=== onloadCallback ===");
    invisible_grecaptcha = grecaptcha.render('recaptcha', {
        'sitekey': '6LdJ_YsUAAAAABY4BTGXKgCF4RVUVjCXwZi1aJD6',
        'size': 'invisible',
        'callback': onSubmit,
    });
}
function onSubmit(recaptcha_token) {
    invoice.token = recaptcha_token;
    invoice.captchaCallback();
}

var invoice = new Vue({
    el: "#app",
    data: {
        isGyro: false,
        userId: '',
        invForm: {
            name: '',
            phone: '',
            date: '10802',
            num: '',
            randomNum: '',
            checkagree: false,
        },
        dragLottery: '',
        checkPos: false,
        shakePos: '',
        loading: false,
        birth_loading: false,
        birthday: {
            date: '',
            year: '',
        },
        canShake: false,
        shakeOK: false,
        animals: 0,
        animalItem: ['kX5dJ', 'eA5kD', 'uCHkr', 'oZewi', 'CSi2I', 'ejzXO', 'HvNDO', 'BhTqo', 'UWblU', '9BHZO', 'i2v4w','Ro2eX'],
        shareLink: '',
        formstep: "form",
        formbtn: "before",
        token: '',
        isGA: false,
        
    },
    methods: {
        testGyro: function () {
            var vm = this;
            if (vm.isGyro) {
                // console.log("有陀螺儀");
            } else {
                vm.lotteryEvent();
                // console.log("偵測不到陀螺儀");
            }
            setTimeout(function () {
                vm.lotterySuccess();
            }, 3000);
        },
        eventGyro: function () {
            var vm = this;
            if (window.DeviceOrientationEvent) {
                window.addEventListener('deviceorientation', function (event) {
                    if (event.alpha) {
                        // check Gyro
                        vm.isGyro = true;
                        vm.testGyro();
                        Draggable.get("#shakePoint").disable();
                    }
                    var a = document.getElementById('alpha'),
                        b = document.getElementById('beta'),
                        g = document.getElementById('gamma'),
                        beta = event.beta,
                        gamma = "";

                    if (vm.canShake) {
                        // if (!vm.checkPos) {
                        //     // first position
                        //     vm.checkPos = true;
                        //     setTimeout(function () {
                        //         vm.lotterySuccess();
                        //     }, 3000);
                        // }
                        // shake issue
                        // var position = event.alpha + event.beta + event.gamma;
                        // if (position > vm.shakePos + 360 || position < vm.shakePos - 360) {
                        //     if (!vm.shakeOK) {
                        //         vm.shakeOK = true;
                        //         vm.lotterySuccess();
                        //     }
                        // }
                        // rotate style issue
                        if (event.gamma > -60 && event.gamma < 60) {
                            gamma = event.gamma;
                        }
                        var target = document.getElementById('shakePoint');
                        target.style.webkitTransform = 'translate(' + gamma/3 + '%,' + beta/3 + '%)';
                        target.style.transform = 'translate(' + gamma/3 + '%,' + beta/3 + '%)';
                        target.style.mozTransform = 'translate(' + gamma/3 + '%,' + beta/3 + '%)';
                    }
                
                }, false);
            }
        },
        sendInvoice: function () {
            var vm = this;
            if (!vm.loading) {
                vm.loading = true;
                var phone_rule = /^09[0-9]{8}$/;
                var inv_rule = /^[a-zA-Z]{2}[0-9]{8}$/;
                var random_rule = /^[0-9]{4}$/;
                var form = vm.invForm;
                if (form.name == "") {
                    alert("請輸入聯絡人姓名");
                    vm.loading = false;
                    return
                }
                if (form.phone == "" || !form.phone.match(phone_rule)) {
                    alert("請輸入手機正確格式");
                    vm.loading = false;
                    return
                }
                if (form.date == "") {
                    alert("請選擇發票期別");
                    vm.loading = false;
                    return
                }
                if (form.num == "" || !form.num.match(inv_rule)) {
                    alert("請輸入發票正確格式");
                    vm.loading = false;
                    return
                }
                if (form.randomNum == "" || !form.randomNum.match(random_rule)) {
                    alert("請輸入發票隨機碼正確格式");
                    vm.loading = false;
                    return
                }
                if (!form.checkagree) {
                    alert("請勾選同意說明");
                    vm.loading = false;
                    return
                }
                grecaptcha.execute();
            }
        },
        captchaCallback: function () {
            var vm = this;
            vm.SaveInvoice().then(function (res) {
                // console.log(res);
                vm.loading = false;
                if (res.errorCode === 2000) {
                    //-填寫資料成功
                    vm.gaEvant('發票登錄_成功登錄');
                    vm.userId = res.data.member_id;
                    vm.scrollTo('body');
                    vm.formstep = "formover";
                    vm.birthInit();
                } else {
                    alert(res.errorMsg);
                    grecaptcha.reset(invisible_grecaptcha);
                    vm.invForm.num = "";
                    vm.invForm.randomNum = "";
                    vm.invForm.checkagree = false;
                }
            })
        },
        birthInit: function () {
            $("#birthday").dateDropdowns({
                defaultDate: '1999-01-01',
                displayFormat: 'ymd',
                maxAge: 100,
                monthFormat: 'numeric',
                monthSuffixes: false,
                daySuffixes: false,
                required: true,
                wrapperClass: 'select-birthday',
            });
            $(".select-birthday .year").after('<label for="year"> 年</label>');
            $(".select-birthday .month").after('<label for="month"> 月</label>');
            $(".select-birthday .day").after('<label for="day"> 日</label>');
        },
        birthPop: function () {
            var vm = this;
            vm.popupOpen();
            vm.popuppage = 'birthday';
            vm.popup = true;
        },
        SaveInvoice: function () {
            var vm = this;
            var inv_data = {
                user_name: vm.invForm.name,
                cell: vm.invForm.phone,
                inv_date: vm.invForm.date,
                inv_num: vm.invForm.num.toUpperCase(),
                random_number: vm.invForm.randomNum,
            };
            return $.ajax({
                url: apiUrl + "/invoiceEntry",
                method: "POST",
                headers: {
                    "Verify-Token": vm.token
                },
                error: function (e) {
                    alert("系統忙碌中，請稍後再試!");
                    grecaptcha.reset(invisible_grecaptcha);
                    vm.loading = false;
                },
                data: inv_data,
                dataType: "json"
            });
        },
        lotteryEvent: function () {
            var vm = this;
            var x = [];
            var range = 60;
            var check1 = false;
            var check2 = false;
            if (isMobile) {
                range = 0
            }
            vm.dragLottery = Draggable.create("#shakePoint", {
                type: "x",
                edgeResistance: 0.65,
                bounds: ".fortune-area",
                throwProps: true,
                autoScroll: true,
                onDragStart: function (event) {
                    x[0] = event.clientX - range;
                    x[1] = event.clientX + event.srcElement.clientWidth + range;
                    $(".l-container ").css('overflow-x', 'hidden');
                    vm.gaEvant('發票登錄_點住按鈕');
                },
                onDrag: function (event) {
                    if (event.clientX < x[0]) {
                        check1 = true;
                    } else if (event.clientX > x[1]) {
                        check2 = true;
                    }
                },
                onDragEnd: function () {
                    $(".l-container ").css('overflow-x', 'inherit');
                    if (!isMobile) {
                        if (check1 && check2) {
                            vm.lotterySuccess();
                        }
                    } else {
                        vm.lotterySuccess();
                    }
                }
            });
        },
        lotterySuccess: function () {
            var vm = this;
            $(".fortune-area").addClass('active');
            // vm.gaEvant('發票登錄_搖晃抽籤');
        },
        SaveBirthday: function () {
            var vm = this;
            var birth_data = {
                member_id: vm.userId,
                birthday: vm.birthday.date,
            };
            return $.ajax({
                url: apiUrl + "/memberBirthday",
                method: "POST",
                error: function (e) {
                    alert("系統忙碌中，請稍後再試!");
                },
                data: birth_data,
                dataType: "json"
            });
        },
        sendBirthday: function () {
            var vm = this;
            var birthRes = $('#birthdayForm').serializeArray();
            // console.log(birthRes);
            vm.birthday.date = birthRes[0].value;
            vm.birthday.year = birthRes[1].value;
            vm.SaveBirthday().then(function (res) {
                vm.birth_loading = false;
                // console.log(res);
                if (res.errorCode === 2000) {
                    //-填寫生日成功
                    vm.animals = parseInt((vm.birthday.year - 1912) % 12);
                    // console.log(vm.animals);
                    vm.popupClose();
                    vm.scrollTo('body');
                    vm.formstep = 'lottery';
                    vm.fortuneIssue();
                } else {
                    alert(res.errorMsg);
                }
            })
        },
        fortuneIssue: function () {
            var vm = this;
            // 偵測陀螺儀,開始搖
            vm.testGyro();
            vm.eventGyro();
            vm.canShake = true;
            vm.fbshare();
            var pen = document.getElementById('oracale');
            pen.addEventListener('animationend', function () {
                if (!vm.isGA) {
                    vm.gaEvant('發票登錄_搖晃抽籤');
                    vm.isGA = true;
                }
                vm.scrollTo('body');
                vm.formstep = 'lottery_over';
            });
        },
        fbshare: function () {
            var vm = this;
            var url = "https://result.friendo.com.tw/" + vm.animalItem[vm.animals];
            vm.shareLink = "https://www.facebook.com/sharer/sharer.php?u=" + url + "&hashtag=%232019能量求籤筒";
        },
        sampleOpen: function() {
            var vm = this;
            vm.popup = true;
            vm.popuppage = "sample";
        },
    },
    mounted: function () {
        var vm = this;
        vm.cloud_Ani();
    }
});


