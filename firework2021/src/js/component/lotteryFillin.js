Vue.component('lottery-fillin', {
    template: "#lotteryFillin",
    data: function () {
        return {
            type: "", // Invoice" or FB
            mobile: "",
            userid: "",
            awardPaper: [
                {
                    "awardName": "現金 NT.99,999",
                    "path": "images/《能量不斷電終極大獎 現金99,999》中獎回覆函.doc"
                }, {
                    "awardName": "Nintendo Switch",
                    "path": "images/《補充能量獎週週抽 Nintendo Switch》中獎回覆函.doc"
                }, {
                    "awardName": "SONY PS4",
                    "path": "images/《百大鐵人排名獎 SONY PS4》中獎回覆函.doc"
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
        }
    },
    watch: {
        IdcardFront: function () {
            var vm = this;
            if (!vm.IdcardFrontShow == "") {
                // $("#frontpre p").css("display", "none");
                // $("#frontpre img").css("opacity", "1");
                document.querySelector('#frontpre p').style.display = 'none';
                document.querySelector('#frontpre img').style.opacity = '1';
            }
        },
        IdcardBack: function () {
            var vm = this;
            if (!vm.IdcardBackShow == "") {
                // $("#backpre p").css("display", "none");
                // $("#backpre img").css("opacity", "1");
                document.querySelector('#backpre p').style.display = 'none';
                document.querySelector('#backpre img').style.opacity = '1';
            }
        },
        Bankbook: function () {
            var vm = this;
            if (!vm.BankbookShow == "") {
                // $("#bankpre p").css("display", "none");
                // $("#bankpre img").css("opacity", "1");
                document.querySelector('#bankpre p').style.display = 'none';
                document.querySelector('#bankpre img').style.opacity = '1';
            }
        },
        CertificatePhotoShow: function () {
            var vm = this;
            if (!vm.CertificatePhotoShow == "") {
                // $("#certificatepre p").css("display", "none");
                // $("#certificatepre img").css("opacity", "1");
                document.querySelector('#certificatepre p').style.display = 'none';
                document.querySelector('#certificatepre img').style.opacity = '1';
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
            if (!vm.loading) {
                vm.loading = true;
                if (!vm.name) {
                    alert("請填入收件人");
                    vm.loading = false;
                    return
                };
                if (!vm.address) {
                    alert("請填入地址");
                    vm.loading = false;
                    return
                };
                if (vm.type == "FB") { 
                    if (!vm.fbData.fbId) {
                        alert("請先登入FB");
                        vm.loading = false;
                        return
                    };
                } else if (vm.type == "Invoice") {
                    if (!vm.CertificatePhoto) {
                        alert("請上傳發票正本電子檔");
                        vm.loading = false;
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
                    vm.loading = false;
                    return
                };
                // vm.getToken().then(function () {
                    vm.grecaptcha("backfill").then(function () {
                        vm.postRecipientinfo().then(function (res) {
                            if (!res.success) {
                                alert("您並無資格領取此獎項。");
                                window.location.href = "./index.html";
                                vm.loading = false;
                            } else {
                                alert("資料已送出，感謝您的參與！");
                                window.location.href = "./index.html";
                                vm.loading = false;
                            }
                        });
                    })
                // })
            }
        },
        postRecipientinfo: function() {
            var vm = this;
            postInfo({
                name: vm.name,
            }, 'apiName')
            .then(function(res){
                if (!res.success) {
                    alert("您並無資格領取此獎項。");
                    window.location.href = "./index.html";
                    vm.loading = false;
                } else {
                    alert("資料已送出，感謝您的參與！");
                    window.location.href = "./index.html";
                    vm.loading = false;
                }
            })
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
            return new Promise(function(resolve){
                getInfo('','apiName'+vm.userid)
                .then(function(res){
                    if (!res.success) {
                        alert("資料已回填或無法查獲此獎項");
                        window.location.href = "./index.html";
                    } else {
                        vm.mobile = res.data.mobile;
                        vm.invNumber = res.data.referenceInfo;
                        vm.awardItem = res.data.awardName;
                        vm.type = res.data.referenceType;
                        resolve()
                    }
                })
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
        loadpage('init');
        vm.userid = findGetParameter('user');
        vm.getRecipientinfo().then(function () { 
            vm.checkPaper();
        });
    }
});