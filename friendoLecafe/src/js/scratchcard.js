var scratch_view = new Vue({
    el: "#app",
    data: {
        question: "",
        answer: "",
        user: "",
        allotId: "",
        awardWin: false,
        addr_from: false,
        awardName: "",
        awardImage: "",
        cardOpen: false,
        gotoAddr: false,
        checkAddr: false,
        loading: false,
        success:false,
        invoice: {
            id: "",
            randomNum:""
        },
        addrForm: {
            username: "",
            phone: "",
            city: "",
            area: "",
            addr: "",
            cityInx: "",
            areaInx:""
        },
        citys: {},
        areas:{}
    },
    watch: {
        'addrForm.cityInx':function(val) {
            this.addrForm.city = this.citys[val].city_id;
            this.areas = this.citys[val].area;     
        },
        'addrForm.areaInx': function (val) {
            this.addrForm.area = this.areas[val].area_id;
        }
    },
    methods: {
        getLottery: function () {
            let vm = this;
            let post_data = {
                "ReceiptId": vm.invoice.id,
                "RandomNumber": vm.invoice.randomNum
            };
            vm.logger(3, {
                'text': "call api: GetLottery",
                'data': {
                    'Authorization': vm.user,
                    'post_data':post_data
                }
            }, 'getLottery');
            return $.ajax({
                url: friendo_url + "GetLottery",
                method: "POST",
                headers: {
                    "Token": vm.webToken,
                    "Authorization":vm.user
                },
                data:post_data,
                success: function (e) {
                    vm.logger(3, {
                        'name': 'GetLottery',
                        'result': e
                    }, 'getLottery');
                },
                error: function (xhr, status, error) {
                    console.log("error:", xhr.statusText);
                    vm.logger(0, {
                        'name': 'GetLottery',
                        'httpStatus': status,
                        'errorMsg': xhr.statusText
                    }, 'getLottery');
                },
                dataType:"json"
            });
        },
        openLottery: function () {
            let vm = this;
            let post_data = {
                "allotId": vm.allotId,
            };

            vm.logger(3, {
                'text': "call api: OpenLottery",
                'data': {
                    'Authorization': vm.user,
                    'post_data':post_data
                }
            }, 'openLottery');

            return $.ajax({
                url: friendo_url + "OpenLottery",
                method: "POST",
                headers: {
                    "Token": vm.webToken,
                    "Authorization": vm.user
                },
                data: post_data,
                success: function (e) {
                    vm.logger(3, {
                        'name': 'OpenLottery',
                        'result': e
                    }, 'openLottery');
                },
                error: function (xhr, status, error) {
                    console.log("error:", xhr.statusText);
                    vm.logger(0, {
                        'name': 'OpenLottery',
                        'httpStatus': status,
                        'errorMsg': xhr.statusText
                    }, 'openLottery');
                },
                dataType:"json"
            });
        },
        checkAddrView: function () {
            let vm = this,
                addrData = vm.addrForm;
            let phone_rule = /^09[0-9]{8}$/;
            if (addrData.addr == "" || addrData.area == "" || addrData.city == "" ) {
                vm.error_msg = "請填寫寄送地址";
                return
            }
            if (addrData.phone == "" || !addrData.phone.match(phone_rule)) {
                vm.error_msg = "請輸入手機正確格式";
                return
            }
            if (addrData.username =="") {
                vm.error_msg = "請填寫姓名";
                return
            }
            vm.checkAddr = true;
        },
        submitAddr: function () {
            let vm = this,
                addrData = vm.addrForm;
            let post_data = {
                "Address": addrData.addr,
                "AllotId": vm.allotId,
                "Area": addrData.area,
                "CellphoneNo": addrData.phone,
                "City": addrData.city,
                "UserName": addrData.username
            };
            vm.loading = true;
            vm.logger(3, {
                'text': "call api: SetAwardAddress",
                'data': {
                    'Authorization': vm.user,
                    'post_data': post_data
                }
            }, 'submitAddr');

            $.ajax({
                url: friendo_url + "SetAwardAddress",
                method: "POST",
                headers: {
                    "Token": vm.webToken,
                    "Authorization": vm.user
                },
                data:post_data,
                success: function (e) {
                    vm.logger(3, {
                        'name': 'SetAwardAddress',
                        'result': e
                    }, 'submitAddr');
                },
                error: function (xhr, status, error) {
                    console.log("SetAwardAddress error:", xhr.statusText);
                    vm.gaEvant('result', 'scratchcard_填寫寄件資料失敗', 'scratchcard_填寫寄件資料失敗');
                    vm.logger(0, {
                        'name': 'SetAwardAddress',
                        'httpStatus': status,
                        'errorMsg': xhr.statusText
                    }, 'submitAddr');
                },
                dataType: "json"
            }).then(function (e) { 
                vm.success = true;
                vm.gaEvant('result', 'scratchcard_填寫寄件資料完成', 'scratchcard_填寫寄件資料完成');
            });
        },
        sendSMS: function () {
            let vm = this;
            return $.ajax({
                url: friendo_url + "SendSMS",
                method: "POST",
                headers: {
                    "Token": vm.webToken,
                    "Authorization": vm.user
                },
                data: {
                    "ReceiptId": vm.invoice.id,
                    "RandomNumber": vm.invoice.randomNum
                },
                success: function (e) {
                    vm.logger(3, {
                        'name': 'SendSMS',
                        'result': e
                    }, 'sendSMS');
                },
                error: function (xhr, status, error) {
                    console.log("sendSMS error:", xhr.statusText);
                    vm.logger(0, {
                        'name': 'SetAwardAddress',
                        'httpStatus': status,
                        'errorMsg': xhr.statusText
                    }, 'submitAddr');
                },
                dataType:"json"
            });
        },
        setScratch: function (awardImage) {
            let vm = this;
            let sc_dom = document.getElementsByClassName("card__main")[0];
            const sc = new ScratchCard(sc_dom, {
                width: 535,
                height: 363,
                imageForwardSrc: 'images/scratch-card.png',
                imageBackgroundSrc: awardImage,
                clearRadius: 30,
                percentToFinish: 30,
                open: function () {
                    vm.openLottery().then(function () {
                        vm.setCookie("_INV", "", -1);
                        if (vm.awardWin){
                            vm.sendSMS();
                            vm.gaEvant('result', 'scratchcard_刮刮卡得獎', 'scratchcard_刮刮卡得獎');
                        }
                        else {
                            vm.gaEvant('result', 'scratchcard_刮刮卡未得獎', 'scratchcard_刮刮卡未得獎');
                        }
                    });
                },
                callback: function () {
                    vm.cardOpen = true;
                }
            });
        }
    },
    mounted: function () {
        let vm = this,
            sc_dom = document.getElementsByClassName("card__main")[0];
        $(window).on("online offline", vm.checkOnline);
        $("body").loadpage('init', { async:true});
        vm.citys = city_json;
        if (checkCookie("_AT") && checkCookie("_INV")) {
            vm.user = checkCookie("_AT");
            let invoice = checkCookie("_INV").split("_");
            vm.invoice.id = invoice[0];
            vm.invoice.randomNum = invoice[1];
            vm.getLottery().then(function (e) {
                if (e.result) {
                    if (e.data.ErrorCode == "588" || e.data.allotId == "0") {
                        vm.gaEvant('result', 'scratchcard_領取刮刮卡失敗_ER', 'scratchcard_領取刮刮卡失敗_ER');
                        console.log(e.errorMsg);
                        alert(e.data.ErrorMessage);
                        window.location.href = "index.html";
                    } else {
                        vm.gaEvant('result', 'scratchcard_領取刮刮卡成功', 'scratchcard_領取刮刮卡成功');
                        vm.allotId = e.data.AllotId;
                        vm.awardWin = e.data.AwardWin;
                        if (vm.awardWin) {
                            // vm.awardImage = e.data.AwardImage + "&op=thumbnail&w=535&h=363";
                            vm.awardImage = "images/winner-pic.png"
                        }
                        else {
                            vm.awardImage = "images/bare-award.png";
                        }
                        vm.setScratch(vm.awardImage);
                        $("body").loadpage('close');
                    }
                }
                else {
                    vm.gaEvant('result', 'scratchcard_領取刮刮卡失敗', 'scratchcard_領取刮刮卡失敗');
                    console.log(e.errorMsg);
                    alert("查無此刮刮卡!");
                    window.location.href = "index.html";
                }
            })            
        } else {
            vm.logger(2, {
                'text': 'fail invasion',
                "AT": checkCookie("_AT"),
                "INV": checkCookie("_INV")
            },'scratchCard')
             window.location.href = "index.html";
        }
    }
})