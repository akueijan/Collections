var survey_view = new Vue({
    el: "#app",
    data: {
        question: "",
        answer: "",
        example: "",
        user: "",
        MID: ""
    },
    methods: {
        getQuestion: function () {
            let vm = this;
            vm.logger(3, "call api: GetSurveyQuestion", 'getQuestion');
            return $.ajax({
                url: friendo_url + "GetSurveyQuestion",
                methods: "POST",
                headers: {
                    "Token": vm.webToken
                },
                success: function (e) {
                    vm.logger(3, {
                        'name': 'GetSurveyQuestion',
                        'result': e
                    }, 'getQuestion');
                },
                error: function (xhr, status, error) {
                    console.log("GetSurveyQuestion error:", xhr.statusText);
                    vm.logger(0, {
                        'name': 'GetSurveyQuestion',
                        'httpStatus': status,
                        'errorMsg': xhr.statusText
                    }, 'getQuestion');
                },
                dataType: "json"
            });
        },
        getUserToken: function () {
            let vm = this,
                accessToken = "";
            vm.logger(3, "check User Token", "getUserToken");
            return new Promise(function (resolve) {
                vm.MID = findGetParameter("memberID");
                if (vm.MID) {
                    vm.logger(3, "get MID" + vm.MID, 'getUserToken');
                    vm.getAccessToken(findGetParameter("memberID")).then(function (data) {
                        vm.user = data;
                    });
                }
                else if (checkCookie("_AT")) {
                    vm.logger(3, "get cookie _AT" + checkCookie("_AT"), 'getUserToken');
                    vm.user = checkCookie("_AT");
                }
                else {
                    vm.logger(2, "no data _AT and MID", 'getUserToken');
                    location = "index.html";
                }
                resolve(vm.user);
            });
        },
        submitSurvey: function (e) {
            let vm = this;
            if (vm.answer == "") {
                alert("請填寫答案");
                return
            } else {
                if (!vm.loading) {
                    let post_data = {
                        answer: vm.answer
                    };
                    vm.loading = true;
                    vm.logger(3, {
                        'text': "call api: SubmitSurvey",
                        'data': {
                            'Authorization': vm.user,
                            'post_data': post_data
                        }
                    }, 'submitSurvey');
                    $.ajax({
                        url: friendo_url + "SubmitSurvey",
                        method: "POST",
                        headers: {
                            "Token": vm.webToken,
                            "Authorization": vm.user
                        },
                        data: post_data,
                        success: function (e) {
                            vm.logger(3, {
                                'name': 'GetSurveyQuestion',
                                'result': e
                            }, 'getQuestion');
                        },
                        error: function (xhr, status, error) {
                            console.log("SubmitSurvey error:", xhr.statusText);
                            vm.logger(0, {
                                'name': 'GetSurveyQuestion',
                                'httpStatus': status,
                                'errorMsg': xhr.statusText
                            }, 'GetAccessToken');
                        },
                        dataType: "json"
                    }).then(function (e) {
                        if (e.result) {
                            vm.gaEvant('click', 'survey_填寫完成', 'survey_填寫完成');
                            if (findGetParameter("memberID")) {
                                switch (device.os) {
                                    case "ios":
                                        window.webkit.messageHandlers.answerFinsh.postMessage("test");
                                        break;
                                    case "android":
                                        window.gdcard.answerFinish(); //android
                                        break;
                                }
                            }
                            else {
                                location = "scratchcard.html";
                            }
                            vm.loading = false;
                        }
                    })
                }
            }
        }
    },
    mounted: function () {
        let vm = this;
        $("body").loadpage('init', { async: true });
        $(window).on("online offline", vm.checkOnline);
        vm.getUserToken().then(function () {
            vm.getQuestion().then(function (e) {
                vm.gaEvant('result', 'survey_填寫問卷', 'survey_填寫問卷');
                if (e.result) {
                    vm.question = e.data.Question;
                    vm.example = e.data.Example;
                    $("body").loadpage('close');
                } else {
                    window.location.reload();
                }
            });
        })
    }
})