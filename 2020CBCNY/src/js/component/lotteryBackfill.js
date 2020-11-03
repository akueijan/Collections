Vue.component('lottery-backfill', {
    template: "#lotteryBackfill",
    data: function () {
        return {
            type: "", // Invoice" or FB
            mobile: "",
            userid: "",
            awardPaper: [
                {
                    "awardName": "十萬元黃金鼠",
                    "path": "images/領獎憑證-十萬元黃金鼠.pdf"
                }, {
                    "awardName": "Apple Watch",
                    "path": "images/領獎憑證-金鼠獎.pdf"
                }, {
                    "awardName": "現金$8,888",
                    "path": "images/領獎憑證-週週抽$8,888.pdf"
                },
            ],
            paper: null,
            fblogin: false,
            fbData: {
                fbToken: "",
                fbId: "",
                fbName: "",
                fbPic: "",
            },
            invNumber: "",
            awardItem: "",
            name: "",
            address: "",
            IdcardFront: null, //正面
            IdcardBack: null, //反面
            Bankbook: null, //存摺
            CertificatePhoto: null, //發票
            agree: false,
            imageShow: {
                "IdcardFront": null,
                "IdcardBack": null,
                "Bankbook": null,
                "CertificatePhoto": null
            },
            comPop: false,
        }
    },
    watch: {
        IdcardFront: function () {
            var vm = this;
            if (!vm.IdcardFrontShow == "") {
                $("#frontpre p").css("display", "none");
                $("#frontpre img").css("opacity", "1");
            }
        },
        IdcardBack: function () {
            var vm = this;
            if (!vm.IdcardBackShow == "") {
                $("#backpre p").css("display", "none");
                $("#backpre img").css("opacity", "1");
            }
        },
        Bankbook: function () {
            var vm = this;
            if (!vm.BankbookShow == "") {
                $("#bankpre p").css("display", "none");
                $("#bankpre img").css("opacity", "1");
            }
        },
        CertificatePhotoShow: function () {
            var vm = this;
            if (!vm.CertificatePhotoShow == "") {
                $("#certificatepre p").css("display", "none");
                $("#certificatepre img").css("opacity", "1");
            }
        },
    },
    methods: {
        readpoto(e) { //input file onchange event
            var vm = this;
            var file = e.target.files.item(0);
            var id = e.target.id;
            var reader = new FileReader();
            reader.addEventListener('load', imgLoad);
            reader.readAsDataURL(file);

            function imgLoad(e) {
                if (id == "front") {
                    vm.imageShow.IdcardFront = e.target.result;
                    vm.IdcardFront = file;
                }
                if (id == "back") {
                    vm.imageShow.IdcardBack = e.target.result;
                    vm.IdcardBack = file;
                }
                if (id == "bank") {
                    vm.imageShow.Bankbook = e.target.result;
                    vm.Bankbook = file;
                }
                if (id == "certificate") {
                    vm.imageShow.CertificatePhoto = e.target.result;
                    vm.CertificatePhoto = file;
                }
            }
        },
        postback() {
            var vm = this;
            if (!vm.comPop) {
                vm.comPop = true;
                if (!vm.name) {
                    alert("請填入收件人");
                    vm.comPop = false;
                    return
                };
                if (!vm.address) {
                    alert("請填入地址");
                    vm.comPop = false;
                    return
                };
                if (vm.type == "FB") { 
                    if (!vm.fbData.fbId) {
                        alert("請先登入FB");
                        vm.comPop = false;
                        return
                    };
                } else if (vm.type == "Invoice") {
                    if (!vm.CertificatePhoto) {
                        alert("請上傳發票正本電子檔");
                        vm.comPop = false;
                        return
                    };
                    // if(!vm.IdcardFront) {
                    //     alert("請上傳身份證正面電子檔");
                    //     vm.loading = false;
                    //     return
                    // };
                    // if(!vm.IdcardBack) {
                    //     alert("請上傳身份證反面電子檔");
                    //     vm.loading = false;
                    //     return
                    // };
                    // if(!vm.Bankbook) {
                    //     alert("請上傳存摺電子檔");
                    //     vm.loading = false;
                    //     return
                    // };
                }
                if (!vm.agree) {
                    alert("請勾選我已詳閱");
                    vm.comPop = false;
                    return
                };
                vm.getToken().then(function () {
                    vm.grecaptcha("backfill").then(function () {
                        vm.postRecipientinfo().then(function (res) {
                            if (!res.success) {
                                alert("您並無資格領取此獎項。");
                                window.location.href = "./index.html";
                                vm.comPop = false;
                            } else {
                                alert("資料已送出，感謝您的參與！");
                                window.location.href = "./index.html";
                                vm.comPop = false;
                            }
                        });
                    })
                })
            }
        },
        fbLogin() {
            var vm = this;
            FB.login(function (res) {
               // console.log(res);
                if (res.status === 'connected') {
                    vm.fbData.fbToken = res.authResponse.accessToken;
                    vm.fbData.fbId = res.authResponse.userID;

                    // 取得fb個人資料
                    FB.api('/me', 'GET', {
                            "fields": "id,name,picture"
                        },
                        function (apires) {
                            // console.log(apires);
                            vm.fbData.fbName = apires.name;
                            // vm.fbData.fbPic = apires.picture.data.url;
                            vm.fbData.fbPic = 'http://graph.facebook.com/' + apires.id + '/picture?width=140&height=140';
                            vm.fblogin = true;
                        }
                    );
                }
            })
        },
        getRecipientinfo: function () {
            var vm = this;
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}Comebest2020CNY/recipientinfo/${vm.userid}`,
                headers: {
                    "Authorization": "Bearer " + vm.gToken,
                },
                method: "GET",
                // dataType: "json",
            }).done(function (res) {
                if (!res.success) {
                    alert("資料已回填或無法查獲此獎項");
                    // window.location.href = "./index.html";
                } else {
                    console.log("data:",res);
                    vm.mobile = res.data.mobile;
                    vm.invNumber = res.data.referenceInfo;
                    vm.awardItem = res.data.awardName;
                    vm.type = res.data.referenceType;
                }
            })
        },
        postRecipientinfo: function() {
            var vm = this;
            var post_data = new FormData();
            post_data.append("CampaignId",76)
            post_data.append("Code",vm.userid)
            post_data.append("Name",vm.name)
            post_data.append("Address",vm.address)
            post_data.append("IdcardFront",vm.IdcardFront)
            post_data.append("IdcardBack",vm.IdcardBack)
            post_data.append("Bankbook",vm.Bankbook)
            post_data.append("Certificate",vm.CertificatePhoto)
            post_data.append("reCaptcha",vm.reCaptcha)
            post_data.append("FBId",vm.fbData.fbId)
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
                url: `${friendo_url}Comebest2020CNY/recipientinfo`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                processData: false,
                contentType: false,
                // dataType: "json"
            }).done(function(res) {
                console.log("postRecipientinfo:",res);
            })
        },
        checkPaper: function () { 
            var vm = this;
            vm.awardPaper.forEach(function (item) { 
                if (vm.awardItem == item.awardName) {
                    return vm.paper = item;
                }
            })
        }
    },
    mounted: function () {
        var vm = this;
        // vm.readpic();
        $("body").loadpage("init", {
            async: false
        });
        $(".nav").hide();
        vm.userid = findGetParameter('user');

        vm.getToken().then(function () {
            vm.getRecipientinfo().then(function () { 
                vm.checkPaper();
            });
            // $("body").loadpage("close");
        })

        // fb sdk引用
        window.fbAsyncInit = function () {
            FB.init({
                appId: '2283542121938015',
                status: true,
                cookie: true,
                xfbml: false,
                version: 'v5.0'
            });
        };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
});