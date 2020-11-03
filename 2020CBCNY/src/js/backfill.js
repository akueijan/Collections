var backfill_view = new Vue({
    el: "#app",
    data: {
        type: "FB", // Invoice" or FB
        fblogin: false,
        fbData: {
            fbtoken: "",
            fbId: "",
            fbName: "",
            fbPic: "",
            // mb_id: "",
        },
        userid: "",
        mobile: "0915887654",
        inv_num: "aa55487985",
        awarditem: "",
        name: "",
        address: "",
        IdcardFrontShow: "",
        IdcardBackShow: "",
        BankbookShow: "",
        CertificatePhotoShow: "",
        IdcardFront: null, //正面
        IdcardBack: null, //反面
        Bankbook: null, //存摺
        CertificatePhoto: null, //發票
        agree: false,
    },
    watch: {
        IdcardFront: function() {
            var vm = this;
            if(!vm.IdcardFrontShow == "") {
                $("#frontpre p").css("display","none");
                $("#frontpre img").css("opacity","1");
            }
        },
        IdcardBack: function() {
            var vm = this;
            if(!vm.IdcardBackShow == "") {
                $("#backpre p").css("display","none");
                $("#backpre img").css("opacity","1");
            }
        },
        Bankbook: function() {
            var vm = this;
            if(!vm.BankbookShow == "") {
                $("#bankpre p").css("display","none");
                $("#bankpre img").css("opacity","1");
            }
        },
        CertificatePhotoShow: function() {
            var vm = this;
            if(!vm.CertificatePhotoShow == "") {
                $("#certificatepre p").css("display","none");
                $("#certificatepre img").css("opacity","1");
            }
        },
    },
    methods: {
        readfront() {
            var vm = this;
            // if (input.files && input.files[0]) {
            //     // console.log(input.files[0].size);
            //     if(input.files[0].size < 10000000) {
            //         var reader = new FileReader();
            //         reader.onload = function(e) {
            //             console.log(e.target.result);
            //             // vm.caretCan(e.target.result);
            //             // vm.facebase64 = e.target.result;
            //         }
            //         reader.readAsDataURL(input.files[0]);
            //     } else {
            //         alert("圖檔太大了");
            //         return
            //     }
            // }
            var input = document.getElementById("front");
            // var input_b = document.getElementById("back");
            // var input_bank = document.getElementById("bank");
            // var input_cer = document.getElementById("certificate");
            // var result;
            // if(typeof FileReader==='undefined') {
            //     console.log(result);
            //     // result.innerHTML = "抱歉，你的瀏覽器不支援 FileReader";
            //     // input.setAttribute('disabled','disabled');
            // } else {
            //     input.addEventListener('change',readFile,false);
            // }
            input.addEventListener('change',readFile,false);
            // input_b.addEventListener('change',readFile("IdcardBack"),false);
            // input_bank.addEventListener('change',readFile("Bankbook"),false);
            // input_cer.addEventListener('change',readFile("CertificatePhoto"),false);
            // function readFile() {
            //     for(var i=0; i < this.files.length; i++) {
            //         var reader = new FileReader();
            //         reader.readAsDataURL(this.files[i]);
            //         reader.onload = function(e) {
            //             vm.base64Arr.push(e.target.result);
            //         }
            //         // reader.readAsDataURL(this.files[i]);
            //         // console.log(reader);
            //     }
            // }
            function readFile() {
                var reader = new FileReader();
                reader.readAsDataURL(this.files[0]);
                reader.onload = function(e) {
                    vm.IdcardFront = e.target.result;
                }
                // reader.readAsDataURL(this.files[i]);
                // console.log(reader);
            }
        },
        readpoto(e) {      //input file onchange event
            var vm = this;
            var file = e.target.files.item(0);
            var id = e.target.id;
            console.log(e);
            console.log(e.target.id);
            console.log(file);
            var reader = new FileReader();
            reader.addEventListener('load',imgLoad);
            reader.readAsDataURL(file);
            function imgLoad(e) {
                if(id == "front") {
                    vm.IdcardFrontShow = e.target.result;
                    vm.IdcardFront = file;
                }
                if(id == "back") {
                    vm.IdcardBackShow = e.target.result;
                    vm.IdcardBack = file;
                }
                if(id == "bank") {
                    vm.BankbookShow = e.target.result;
                    vm.Bankbook = file;
                }
                if(id == "certificate") {
                    vm.CertificatePhotoShow = e.target.result;
                    vm.CertificatePhoto = file;
                }
            }
        },
        getUserid() {
            var vm = this;
            return new Promise(function(resolve, reject) {
                vm.userid = findGetParameter('user');
                resolve();
            })
        },
        postback() {
            var vm = this;
            if(vm.type == "FB") {
                if(!vm.loading) {
                    vm.loading = true;
                    if(!vm.name) {
                        alert("請填入收件人");
                        vm.loading = false;
                        return
                    };
                    if(!vm.address) {
                        alert("請填入地址");
                        vm.loading = false;
                        return
                    };
                    if(!vm.fbData.fbId) {
                        alert("請先登入FB");
                        vm.loading = false;
                        return
                    };
                    if(!vm.agree) {
                        alert("請勾選我已詳閱");
                        vm.loading = false;
                        return
                    };
                    vm.GameToken().then(function(){
                        vm.grecaptcha("backfill").then(function() {
                            vm.postRecipientinfo().then(function(res){
                                if(!res.success) {
                                    // alert(res.responseMessage);
                                    alert("您並無資格領取此獎項。");
                                    window.location.href = "./index.html";
                                    vm.loading = false;
                                } else {
                                    alert("資料已送出，感謝您的參與！");
                                    window.location.href = "./index.html";
                                    // vm.popup = true;
                                    // vm.popPage = "invSuccess";
                                    vm.loading = false;
                                }
                            });
                        })
                    })
                }
            } else {
                if(!vm.loading) {
                    vm.loading = true;
                    if(!vm.name) {
                        alert("請填入收件人");
                        vm.loading = false;
                        return
                    };
                    if(!vm.address) {
                        alert("請填入地址");
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
                    if(!vm.CertificatePhoto) {
                        alert("請上傳發票正本電子檔");
                        vm.loading = false;
                        return
                    };
                    if(!vm.agree) {
                        alert("請勾選我已詳閱");
                        vm.loading = false;
                        return
                    };
                    vm.GameToken().then(function(){
                        vm.grecaptcha("backfill").then(function() {
                            vm.postRecipientinfo().then(function(res){
                                if(!res.success) {
                                    alert(res.responseMessage);
                                    vm.loading = false;
                                } else {
                                    alert("資料已送出，感謝您的參與！");
                                    window.location.href = "./index.html";
                                    // vm.popup = true;
                                    // vm.popPage = "invSuccess";
                                    vm.loading = false;
                                }
                            });
                        })
                    })
                }
            }
            
        },
        fbLogin() {
            var vm = this;
            FB.login(function(res){
                // console.log(res);
                if (res.status === 'connected') {
                    vm.fbData.fbtoken = res.authResponse.accessToken;
                    vm.fbData.fbId = res.authResponse.userID;

                    // 取得fb個人資料
                    FB.api('/me','GET',{"fields":"id,name,picture"},
                        function(apires) {
                            // console.log(apires);
                            vm.fbData.fbName = apires.name;
                            // vm.fbData.fbPic = apires.picture.data.url;
                            vm.fbData.fbPic = 'http://graph.facebook.com/'+ apires.id +'/picture?width=140&height=140';
                            vm.fblogin = true;
                        }
                    );
                }
            })
        },
    },
    mounted: function(){
        var vm = this;
        // vm.readpic();
        $("body").loadpage("init",{async : false});
        $(".nav").hide()
        // vm.getUserid().then(function() {
        //     vm.GameToken().then(function() {
        //         vm.getRecipientinfo();
        //         // $("body").loadpage("close");
        //     })
        // });
        window.fbAsyncInit = function () {
            FB.init({
                appId: '2283542121938015',
                status:true,
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
