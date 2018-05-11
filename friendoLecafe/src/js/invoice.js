const invoice_view = new Vue({
    el: "#app",
    data: {
        checkNum: "",
        surveyAnswer: "",
        username: "",
        phone: "",
        inv_date: "10704",
        num: "",
        random_number: "",
        check: "",
        success: false,
        demo: false,
        step: 0,
        verifyCode: ""
    },
    computed: {
        inv_num: function () {
            return this.num.toUpperCase()
        }
    },
    methods: {
        SaveInvoice: function () {
            let vm = this;
            let post_data = {
                "cellphoneId": vm.phone,
                "Username": vm.username,
                "Id": vm.inv_num,
                "IssueDate": vm.inv_date,
                "RandomNumber": vm.random_number,
                "captcha": $("#g-recaptcha-response").val()
            }
            vm.logger(3, {
                'text': "call api: SubmitReceipt",
                'data': post_data
            }, 'SaveInvoice');
            return $.ajax({
                url: friendo_url + "SubmitReceipt",
                method: "POST",
                headers: {
                    "Token": vm.webToken
                },
                data:post_data,
                success: function (e) {
                    vm.logger(3, {
                        'name': 'SubmitReceipt',
                        'result': e
                    }, 'SaveInvoice');
                },
                error: function (xhr, status, error) {
                    console.log("SubmitInvoice error:", xhr.statusText);
                    vm.logger(0, {
                        'name': 'SubmitReceipt',
                        'httpStatus': status,
                        'errorMsg': xhr.statusText
                    }, 'SaveInvoice');
                },
                dataType: "json"
            });
        },
        checkSurvey: function (user) {
            let vm = this;
            vm.logger(3, {
                'text': "call api: NeedSurvey",
                'data': user
            }, 'checkSurvey');
            return $.ajax({
                url: friendo_url + "NeedSurvey",
                method: "POST",
                headers: {
                    "Token": vm.webToken,
                    "Authorization": user
                },
                success: function (e) {
                    vm.logger(3, {
                        'name': 'NeedSurvey',
                        'result': e
                    }, 'checkSurvey');
                },
                error: function (xhr, status, error) {
                    console.log("NeedSurvey error:", xhr.statusText);
                    vm.logger(0, {
                        'name': 'NeedSurvey',
                        'httpStatus': status,
                        'errorMsg': xhr.statusText
                    }, 'checkSurvey');
                },
                dataType: "json"
            });
        },
        getSurvey: function () {
            let vm = this;
            vm.setCookie("_INV", vm.inv_num + "_" + vm.random_number, 3600);
            vm.getAccessToken(vm.phone).then(function (token) {
                const accessToken = token;
                vm.checkSurvey(accessToken).then(function (e) {
                    if (!e.data.Done) {
                        window.location.href = "survey.html";
                    } else {
                        window.location.href = "scratchcard.html";
                    }
                }).fail(function () {
                    vm.gaEvant('result', 'invoice_重複確認_ER', 'invoice_重複確認_ER');
                    vm.error_cou--;
                    if (vm.error_cou > 0) {
                        vm.getSurvey();
                    } else {
                        vm.logger(0, {
                            'name': 'NeedSurvey',
                            'errorMsg': "error count > 5 out"
                        }, 'checkSurvey');
                        vm.server_busy();
                    }
                });
            }); 
        },
        post_code: function () {
            let vm = this;
            let TO;
            let post_data = {
                "cellphoneId": vm.phone,
                "verifyCode": vm.verifyCode,
                "cell_no": vm.phone,
                "Username": vm.username,
                "email": "",
                "Id": vm.inv_num,
                "IssueDate": vm.inv_date,
                "RandomNumber": vm.random_number
            };
            if (!vm.loading && vm.step == 1) {
                vm.loading = true;
                if (vm.verifyCode == "") {
                    vm.error_msg = "請輸入認證碼";
                    vm.loading = false;
                    return
                }
                function checkCode(e) {
                    vm.loading = false;
                    vm.gaEvant('result', 'invoice_認證成功', 'invoice_認證成功');
                    vm.getSurvey();
                }
                vm.logger(2, "set timeout for checkChode", "post_code");
                TO = setTimeout(checkCode, 15000);
                vm.gaEvant('click', 'invoice_輸入認證碼', 'invoice_輸入認證碼');

                vm.logger(3, {
                    'text': "call api: checkOTP",
                    'data': post_data
                }, 'post_code');
                $.ajax({
                    url: friendo_url + "checkOTP",
                    method: "POST",
                    headers: {
                        "Token": vm.webToken
                    },
                    data: post_data,
                    success: function (e) {
                        vm.logger(3, {
                            'name': 'checkOTP',
                            'result': e
                        }, 'post_code');
                    },
                    error: function (xhr, status, error) {
                        console.log("checkOTP error:", xhr.statusText);
                        vm.logger(0, {
                            'name': 'checkOTP',
                            'httpStatus': status,
                            'errorMsg': xhr.statusText
                        }, 'post_code');
                    },
                    dataType: "json"
                }).then(function (e) {
                    if (e.result) {
                        checkCode(e);
                    } else {
                        if (result.errorCode != "500") {
                            vm.error_msg = "系統忙碌中，請稍後在試!";
                        } else {
                            vm.error_msg = "認證失敗，請重新輸入";
                        }
                        vm.gaEvant('result', 'invoice_認證失敗', 'invoice_認證失敗');
                        vm.loading = false;
                    }
                    vm.logger(2, "clear timeout for checkChode", "post_code");
                    clearTimeout(TO);
                    }).fail(function () {
                        vm.error_msg = "系統忙碌中，請稍後在試!";
                        vm.loading = false;
                        vm.logger(2, "clear timeout for checkChode -> fail", "post_code");
                        clearTimeout(TO);
                    });
            }
        },
        ResendSMS: function (errRe) {
            let vm = this;
            if ((!vm.loading && vm.step == 1) || errRe) {
                vm.loading = true;
                vm.getAccessToken(vm.phone).then(function (token) {
                    vm.logger(3, {
                        'text': 'call api: GetOTP',
                        'data': {
                            'Authorization': token,
                            'post_data': {
                                "cellphoneId": vm.phone
                            }
                        },
                    }, 'ResendSMS');
                    $.ajax({
                        url: friendo_url + "GetOTP",
                        method: "POST",
                        headers: {
                            "Token": vm.webToken,
                            "Authorization": token
                        },
                        data: {
                            "cellphoneId": vm.phone
                        },
                        success: function (e) {
                            vm.logger(3, {
                                'name': 'GetOTP',
                                'result': e
                            }, 'ResendSMS');
                        },
                        error: function (xhr, status, error) {
                            console.log("GetOTP error:", xhr.statusText);
                            vm.logger(0, {
                                'name': 'GetOTP',
                                'httpStatus': status,
                                'errorMsg': xhr.statusText
                            }, 'ResendSMS');
                            vm.error_cou--;
                            if (vm.error_cou > 0) {
                                vm.ResendSMS(true);
                            }
                            else {
                                vm.logger(0, {
                                    'name': 'GetOTP',
                                    'errorMsg': "error count > 5 out"
                                }, 'ResendSMS');
                                vm.server_busy();
                            }
                        }
                    }).then(function () {
                        vm.loading = false;
                        alert("已重新送出。");
                    })
                })
            }
        },
        post_inv: function () {
            let vm = this;
            let TO;
            vm.checkOnline();
            try {
                if (!vm.loading && vm.step == 0) {
                    vm.loading = true;  //evan
                    let phone_rule = /^09[0-9]{8}$/
                    let inv_rule = /^[a-zA-Z]{2}[0-9]{8}$/
                    if (vm.username == "") {
                        vm.error_msg = "請輸入使用者名稱";
                        vm.loading = false;
                        return
                    }
                    if (vm.phone == "" || !vm.phone.match(phone_rule)) {
                        vm.error_msg = "請輸入手機正確格式";
                        vm.loading = false;
                        return
                    }
                    if (vm.inv_date == "") {
                        vm.error_msg = "請選擇發票期別";
                        vm.loading = false;
                        return
                    }
                    if (vm.inv_num == "" || !vm.inv_num.match(inv_rule)) {
                        vm.error_msg = "請輸入發票正確格式";
                        vm.loading = false;
                        return
                    }
                    if (vm.random_number == "") {
                        vm.error_msg = "請輸入發票隨機碼";
                        vm.loading = false;
                        return
                    }
                    if (vm.check != 1) {
                        vm.error_msg = "請勾選同意說明";
                        vm.loading = false;
                        return
                    }
                    if ($("#g-recaptcha-response").val() == "") {
                        vm.error_msg = "請勾選我不是機器人";
                        vm.loading = false;
                        return
                    }
                    function checkInv(result) {
                        if (typeof result !== "undefined") {
                            if (result.data) {
                                if (result.data.ReadyToCheck) {
                                    vm.gaEvant('result', 'invoice_登入成功', 'invoice_登入成功');
                                    vm.step = 1;
                                    vm.loading = false;
                                } else {
                                    vm.gaEvant('result', 'invoice_登入成功', 'invoice_登入成功');
                                    vm.getSurvey();
                                }
                            }
                            else {
                                vm.gaEvant('result', 'invoice_登錄失敗_ER', 'invoice_登錄失敗_ER');
                                vm.error_msg = "系統忙碌中，請稍後在試";
                                vm.loading = false;
                            }
                        }
                        else {
                            vm.gaEvant('result', 'invoice_登入成功_TO', 'invoice_登入成功_TO');
                            vm.getSurvey();
                        }
                    }
                    if (vm.error_msg == "") {
                        //送出資料
                        vm.logger(2, "set timeout for post_inv", "post_inv");
                        TO = setTimeout(checkInv, 15000);
                        vm.gaEvant('click', 'invoice_登錄發票', 'invoice_登錄發票');
                        vm.SaveInvoice().then(function (result) {
                            if (result.result) {
                                checkInv(result);
                            } else {
                                // vm.error_msg = result.errorMsg;
                                // if (result.data.ErrorCode != "200") {
                                //     vm.gaEvant('result', 'invoice_登錄失敗', 'invoice_登錄失敗');
                                //     vm.error_msg = "發票已被使用";
                                //     vm.loading = false;
                                //     grecaptcha.reset();
                                //     return
                                // }
                                if (result.errorCode != "500") {
                                    vm.error_msg = "系統忙碌中，請稍後在試!";
                                } else {
                                    vm.error_msg = result.errorMsg;
                                }
                                vm.gaEvant('result', 'invoice_登錄失敗', 'invoice_登錄失敗');
                                vm.loading = false;
                                grecaptcha.reset();
                            }
                            vm.logger(2, "clear timeout for post_inv", "post_inv");
                            clearTimeout(TO);
                        }).fail(function () {
                            vm.gaEvant('result', 'invoice_登錄失敗_ER', 'invoice_登錄失敗_ER');
                            vm.error_msg = "系統忙碌中，請稍後在試";
                            vm.loading = false;
                            vm.logger(2, "clear timeout for post_inv -> fail", "post_inv");
                            clearTimeout(TO);
                        });
                    }
                }
            }
            catch(e){
                vm.loading = false;
                vm.logger(0, {
                    "name": "post_inv",
                    "msg": e
                }, "post_inv");
            }
        },
        goBack: function () {
            grecaptcha.reset();
            this.step = 0;
        },
        getMemberPhone: function () {
            let vm = this;
            let post_data = {}
            vm.logger(3, {
                'text': "call api: GetMemberCellphoneNo",
                'data': {
                    'Authorization': checkCookie("_AT")
                }
            }, 'getMemberPhone');
            return $.ajax({
                url: friendo_url + "GetMemberCellphoneNo",
                method: "POST",
                headers: {
                    "Token": vm.webToken,
                    "Authorization": checkCookie("_AT")
                },
                data: {},
                success: function (e) {
                    vm.logger(3, {
                        'name': 'GetMemberCellphoneNo',
                        'result': e
                    }, 'getMemberPhone');
                },
                error: function (xhr, status, error) {
                    console.log("error:", xhr.statusText);
                    vm.logger(0, {
                        'name': 'GetMemberCellphoneNo',
                        'httpStatus': status,
                        'errorMsg': xhr.statusText
                    }, 'getMemberPhone');
                    vm.error_cou--;
                    if(vm.error_cou > 0){
                        vm.getMemberPhone();
                    } else {
                        vm.logger(0, {
                            'name': 'GetMemberCellphoneNo',
                            'errorMsg': "error count > 5 out"
                        }, 'getMemberPhone');
                        vm.server_busy();
                    }
                },
                dataType: "json"
            });
        },
    },
    mounted: function () {
        let vm = this;
        $(window).on("online offline", vm.checkOnline);
        $("body").loadpage('init', {
            async: true
        });
        if (checkCookie("_AT")) {
            vm.getMemberPhone().then(function (e) {
                if(e.result){
                vm.phone = e.data.cell_no;
                    $("body").loadpage("close");
                }
                else {
                    vm.setCookie("_AT", "", 0);
                }
            })
        } else {
            $("body").loadpage("close");
        }
    }
})