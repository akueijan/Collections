
const registry_view = new Vue({
    el: "#app",
    data: {
        lineid: "",
        name: "",
        birthday: {
            year: "1980",
            month: "1",
            day:"1",
        },
        phone: "",
        car_no: "",
        owner: false,
        agree: false,
        otp: "",
        check: true,
        isform1: true,
        isform2: false,
        SMScount: 6,
        SMSdisabled: 59,
        plate:"",
        TO: {},
        notebox: false,
        pageload: true,
        firstCheck:true
    },
    computed: {
    },
    watch: {
        car_no: function (val) {
            this.plate = val.toUpperCase();
        }    
    },
    methods: {
        //=====取得用戶資料 API=====//
        GetProfile: function () {
            let vm = this;
            let get_data = {
                "lineid": vm.lineid,
                "act": vm.act,
            };
            return $.ajax({
                url: friendo_url + "CarMember/GetProfile",
                method: "POST",
                headers: {
                    'auth': vm.webToken
                },
                error: function (e) { 
                    alert("系統忙碌中，請稍後再試!");
                    vm.logger(0, e, "GetProfile");
                },
                data: get_data,
                dataType: "json"
            });
        },
        //======流程操作=====//
        EventStart: function() {
            let vm = this;
            
            vm.logger(3, "event start:"+vm.lineid, "EventStart");
            vm.JoinAct().then(function (result) {
                if (result.Success) {
                    if (result.Data.game_over) {
                        vm.error_msg = "活動已結束!";
                    }
                    else {
                        console.log(result);
                        if (result.Data.is_member && result.Data.played) {
                            vm.logger(3, "is member and played:" + vm.lineid, "JoinAct");
                            location = "ending.html";
                        }
                        else {
                            vm.pageload = false;
                            vm.GetProfile().then(function (result) {
                                if (result.Success) {
                                    vm.logger(3, result, "GetProfile");
                                    vm.name = result.Data.name;
                                    vm.phone = result.Data.phone;
                                    if (result.Data.plate) {
                                        vm.car_no = result.Data.plate;
                                        vm.owner = 1;
                                    }
                                    if (result.Data.birthday) {
                                        let getBirthday = result.Data.birthday.split("/");
                                        vm.birthday.year = getBirthday[0];
                                        vm.birthday.month = getBirthday[1];
                                        vm.birthday.day = getBirthday[2];
                                    }
                                }
                                else {
                                    vm.logger(0,result, "GetProfile");
                                }
                            })
                        }
                    }
                }
                else{
                    alert(result.Message);
                }
            })    
        },
        // ======參加活動API======//
        JoinAct: function () { 
            let vm = this;
            let post_data = {
                "act": vm.act,
                "lineid": vm.lineid,
                "finished": false
            };
            return $.ajax({
                url: friendo_url + "CarMember/JoinAct",
                method: "POST",
                headers: {
                    'auth': vm.webToken
                },
                data: post_data,
                error: function (e) {
                    alert("系統忙碌中，請稍後再試!");
                    vm.logger(0, e, "JoinAct");
                    location.reload();
                },
                dataType: "json",
            })
        },
        //======寄送簡訊api=====//
        SendOtp: function() {
            let vm = this;
            let otp_data = {
                "lineid": vm.lineid,
                "phone": vm.phone,
                "act":vm.act
            };
            vm.logger(3, otp_data, "SendData");
            return $.ajax({
                url: friendo_url + "CarMember/SendOtp",
                method: "POST",
                headers: {
                    'auth': vm.webToken
                },
                data: otp_data,
                error: function (e) {
                    alert("系統忙碌中，請稍後再試!");
                    vm.loading = false;
                    vm.logger(0, e, "SendOtp");
                },
                dataType: "json",
            });
        },
        setSMSTime: function () { 
            let vm = this;
            vm.TO = setInterval(function () {
                vm.SMSdisabled--;
                if(vm.SMSdisabled < 0){
                    clearInterval(vm.TO);
                    vm.SMSdisabled = 60;
                }
            }, 1000);
        },
        //======取得OTP 流程操作=====//
        SendData: function () {
            let vm = this;
            let reg=/^[\u4E00-\u9FA5]{2,5}$/;
            let phone_rule = /^09[0-9]{8}$/;
            let car_rule = /^[0-9A-Z]{1,4}-[0-9A-Z]{1,4}$/
            if (vm.name == "" || !String(vm.name).match(reg)) {
                vm.error_msg= "中文姓名格式錯誤";
                return
            }
            else if (vm.birthday.year == "") {
                vm.error_msg = "請選取出生年份";
                return
            }
            else if (vm.birthday.month == "") {
                vm.error_msg = "請選取出生月份";
                return
            }
            else if (vm.birthday.day == "") {
                vm.error_msg = "請選取出生日";
                return
            }
            else if (!vm.phone|| !String(vm.phone).match(phone_rule)) {
                vm.error_msg = "手機號碼格式錯誤";
                return
            }
            else if (vm.owner == true && !String(vm.plate).match(car_rule)){
                vm.error_msg = "車牌格式錯誤";
                return
            }
            else if (vm.agree == false) {
                vm.error_msg = "請點擊確認，同意會員服務條款";
                return
            }

            var testDate = new Date(vm.birthday.year, (vm.birthday.month-1), vm.birthday.day);
            if (testDate.getDate() != vm.birthday.day || testDate.getMonth() != (vm.birthday.month - 1) || testDate.getFullYear() != vm.birthday.year) {
                vm.error_msg = "請選取正確的出生日期";
                return ;
            } 

            if (!vm.loading) {
                vm.gaEvant("click", "registry_送出資料","registry_送出資料");
                vm.loading = true;
                vm.SendOtp().then(function (result) {
                    vm.loading = false;
                    vm.logger(3, result, "SendData");
                    if (result.Success && result.ErrorCode == 0) {
                        if (vm.checkResult(result)) {
                            vm.gaEvant("click", "registry_認證簡訊", "registry_認證簡訊");
                            vm.firstCheck = false;
                            vm.notebox = false;
                            vm.isform1 = false;
                            vm.isform2 = true;
                            vm.SMSdisabled = 59;
                            vm.setSMSTime();
                        }
                        else {
                            vm.gaEvant("result", "registry_送出失敗", "registry_送出失敗");
                        }
                    } else {
                        vm.RSerror(result);
                    }
                })
            }
        },
        resendOTP: function () {
            let vm = this;
            if (!vm.loading) {
                vm.loading = true;
                vm.firstCheck = true;
                vm.logger(3, "resend OTP", "resendOTP");
                vm.setSMSTime();
                vm.SendOtp().then(function (result) {
                    vm.loading = false;
                    if (result.Success && result.ErrorCode == 0) {
                        vm.checkResult(result);
                        vm.firstCheck = false;
                    } else {
                        switch (result.ErrorCode) {
                            case 401:
                                alert("未授權使用網站");
                                break;
                            case 502:
                                alert("發送驗證碼系統忙碌中");
                                break;
                            default:
                                return
                        };
                    }
                }).fail(function (result) {
                    alert("系統忙碌中，請稍後再試!");
                    vm.loading = false;
                    console.log(result);
                });
            }
        },
        //======儲存會員資料api=====//
        SaveProfile: function() {
            let vm = this;
            let post_data = {
                "act": vm.act,
                "lineid": vm.lineid,
                "name": vm.name,
                "birthday": vm.birthday.year+"/"+vm.birthday.month+"/"+vm.birthday.day,
                "phone": vm.phone,
                "plate": vm.plate,
                "otp": vm.otp,
            };
            vm.logger(3, post_data, "SaveProfile");
            return $.ajax({
                url: friendo_url + "CarMember/SaveProfile/",
                method: "POST",
                headers: {
                    'auth': vm.webToken
                },
                error: function (e) { 
                    alert("系統忙碌中，請稍後再試!");
                    vm.loading = false;
                    vm.logger(0, e, "SaveProfile");
                },
                dataType: "json",
                data: post_data,
            });
        },
        //======活動完成API====//
        FinishAct: function () { 
            let vm = this;
            let post_data = {
                "act": vm.act,
                "lineid": vm.lineid,
            };
            vm.logger(3, post_data, "FinishAct");
            return $.ajax({
                url: friendo_url + "CarMember/FinishAct",
                method: "POST",
                headers: {
                    'auth': vm.webToken
                },
                error: function (e) {
                    alert("系統忙碌中，請稍後再試!");
                    vm.loading = false;
                    vm.logger(0, e, "FinishAct");
                },
                dataType: "json",
                data: post_data,
            });
        },
        //======流程操作=====//
        SendRegistry: function() {
            let vm = this;
            let inv_rule = /^[0-9]{6}$/;
            if(vm.otp == "" || !vm.otp.match(inv_rule)) {
                vm.error_msg = "認證碼格式錯誤";
                return
            }
            if (!vm.loading) {
                vm.loading = true;
                vm.gaEvant("click", "registry_送出認證", "registry_送出認證");
                vm.SaveProfile().then(function (result) {
                    vm.logger(3, result, "SendRegistry");
                    console.log(result);
                    vm.loading = false;
                    if (vm.checkResult(result) && result.Data == 0) {
                        vm.FinishAct().then(function () {
                            vm.gaEvant("result", "registry_認證成功", "registry_認證成功");
                            location = "ending.html"; 
                        })
                    } else {

                        vm.gaEvant("result", "registry_認證失敗", "registry_認證失敗");
                    }
                })
            }
        },
        checkResult: function (result) {
            let vm = this;
            vm.logger(3, JSON.stringify(result) + "lineID:"+vm.lineid, "checkResult");
            if (result.Success && result.ErrorCode == 0) {
                if (result.Data > 0 && result.Data < 6) {
                    vm.SMScount = result.Data;
                    if(!vm.firstCheck){
                        vm.error_msg = "驗證碼錯誤，請重新輸入，剩餘次數為:" + result.Data;
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                if (result.Data == 0) {
                    return true;
                }
                switch (result.Data) {
                    case -1:
                        vm.error_msg = "驗證次數已達上線，請洽NISSAN客服0800-088-888。";
                        break;
                    case -2:
                        vm.error_msg = "驗證碼重送次數已達上線，請洽NISSAN客服0800-088-888。";
                        break;
                    case -3:
                        vm.error_msg = "距離上次重送時間過短，請稍後再試。";
                        break;
                    case -4:
                        vm.error_msg = "驗證碼已過期，請重新發送。";
                        break;
                    case -7:
                        vm.error_msg = "資料填寫錯誤，請再確認一次。";
                        break;
                    case -8:
                        vm.error_msg = "此電話號碼已綁定，請使用其他號碼或洽NISSAN客服0800-088-888。";
                        break;
                    case -9:
                        location = "ending.html"
                        break;
                    case -10:
                        alert("您尚未同意LINE使用您的個人資訊，請重新授權。");
                        location = '/CarMember/Index?state=P486ZGhmO4KqAJDrrzsinQ==';
                        break;
                    default:
                        return false;
                };
                return false;
            }
            else {
                switch (result.ErrorCode) {
                    case 401:
                        alert("未授權使用網站");
                        break;
                    case 502:
                        alert("系統忙碌中，請稍後再試!");
                        break;
                    default:
                        return
                };
            }
        },
        //===== api 連接失敗 ==== 
        RSerror: function (result) {
            this.logger(0, result, "RSerror");
            switch (result.ErrorCode) {
                case 401:
                    alert("未授權使用網站");
                    break;
                case 502:
                    alert("發送驗證碼系統忙碌中");
                    break;
                default:
                    alert("系統忙碌中，請稍後再試!");
                    return
            };
        },
        refix: function () {
            let vm = this;
            vm.isform1 = true;
            vm.isform2 = false;
            vm.firstCheck = true;
            clearInterval(vm.TO);
         },
        getYear: function() {
            let y = new Date().getFullYear();
            let ylist = $(".selyear");
            let i;
            for(i=y-100; i<y+1; i++) {
                ylist.append("<option>"+i+"</option>");
            }
        },
        getMonth: function() {
            let i;
            let mlist = $(".selmonth");
            for(i=1; i<13; i++) {
                mlist.append("<option>"+i+"</option>");
            }
        },
        getDay: function() {
            let i;
            let dlist = $(".selday");
            for(i=1; i<32; i++) {
                dlist.append("<option>"+i+"</option>");
            }
        },
        note_toggle: function(obj) {
            $(".note__title").toggleClass("note__title--active");
            this.notebox = !this.notebox
        },
    },
    mounted: function() {
        let vm = this;
        $(window).on("online offline", vm.checkOnline);
        if (findGetParameter('token')) {
            vm.lineid = findGetParameter('token');
            window.history.replaceState('', '', 'registry.html');
            vm.EventStart();
        }
        else {
            location = '/CarMember/Index?state=P486ZGhmO4KqAJDrrzsinQ==';
        }
    },
});