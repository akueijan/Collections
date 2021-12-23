Vue.component('lottery-fillin', {
    template: "#lotteryBackfill",
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
            captcha: null
        }
    },
    watch: {
        IdcardFront: function () {
            var vm = this;
            if (!vm.IdcardFrontShow == "") {
                document.querySelector('#frontpre p').style.display = 'none';
                document.querySelector('#frontpre img').style.opacity = '1';
            }
        },
        IdcardBack: function () {
            var vm = this;
            if (!vm.IdcardBackShow == "") {
                document.querySelector('#backpre p').style.display = 'none';
                document.querySelector('#backpre img').style.opacity = '1';
            }
        },
        Bankbook: function () {
            var vm = this;
            if (!vm.BankbookShow == "") {
                document.querySelector('#bankpre p').style.display = 'none';
                document.querySelector('#bankpre img').style.opacity = '1';
            }
        },
        CertificatePhotoShow: function () {
            var vm = this;
            if (!vm.CertificatePhotoShow == "") {
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
            console.log(file)

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
        checkData() {
            const vm = this
            return new Promise(resolve => {
                if(!vm.name) {
                    alert("請填入收件人")
                    return
                }
                if(!vm.address) {
                    alert("請填入地址")
                    return
                }
                if (vm.type == "FB") { 
                    if (!vm.fbData.fbId) {
                        alert("請先登入FB");
                        return
                    }
                } else if(vm.type == "Invoice") {
                    if (!vm.CertificatePhoto) {
                        alert("請上傳發票正本電子檔")
                        return
                    }
                }
                if (!vm.agree) {
                    alert("請勾選我已詳閱");
                    return
                }
                vm.loading = true
                resolve()
            })
        },
        postback() {
            const vm = this
            vm.checkData().then(() => {
                vm.grecaptcha("fillin").then(() => {
                    vm.postRecipientinfo()
                })
            })
        },
        postRecipientinfo() {
            const vm = this
            let formData = new FormData(document.getElementById('fillinform'))
                formData.append("name", vm.name);
                formData.append("address", vm.address);
                formData.append("idcardFront", vm.IdcardFront);
                formData.append("idcardBack", vm.IdcardBack);
                formData.append("bankbook", vm.Bankbook);
                formData.append("certificate", vm.CertificatePhoto);
                formData.append("captcha", vm.captcha);
                formData.append("code", vm.userid);
                formData.append("referenceInfo", vm.invNumber);
                formData.append("campaignId", 98);
            vm.projApi.post("Kombucha2021/recipientinfo", formData)
                .then(res => {
                    alert("資料已送出，感謝您的參與！")
                    window.location.href = "./index.html"
                    vm.loading = false
                })
        },
        fbLogin() {
            const vm = this;
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
        getRecipientinfo() {
            const vm = this;
            return new Promise(function(resolve){
                vm.projApi.get(`Kombucha2021/recipientinfo/${vm.userid}`)
                .then(res => {
                    if(res && res.code !== 200) {
                        // alert('驗證碼已失效')
                    } else {
                        vm.mobile = res.data.mobile;
                        vm.invNumber = res.data.referenceInfo;
                        vm.awardItem = res.data.awardName;
                        vm.type = res.data.referenceType;
                        resolve()
                    }
                })
                .catch(err => {
                    console.log(err.response.data.message)
                    alert('未找到符合的資料或已填寫過')
                    window.location.href = 'index.html'
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
        },
    },
    created() {
        const vm = this

        vm.userid = findGetParameter('user')
    },
    mounted: function () {
        const vm = this;
        // vm.readpic();
        // loadpage('init');
        vm.getRecipientinfo().then(function () { 
            vm.checkPaper();
        });

        let fbAppId = "3705614096208882"
        window.fbAsyncInit = function() {
            FB.init({
                appId      : fbAppId,
                status     : true,
                cookie     : true,
                xfbml      : true,
                version    : 'v12.0'
            });
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
});