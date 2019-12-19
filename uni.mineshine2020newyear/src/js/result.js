var result_view = new Vue({
    el: "#app",
    data: {
        step: 2, //2,3
        code:"",
        name: "",
        friendName: "",
        address: "",
        mobile: "",
        text: "",
        textImg: "",
        serialNumber: "",
        agree: false,
        link: "",
        savedata: false,
        user: {
            shareImg: "",
            userImg1: "",
            userImg2: "",
            userImg3: "",
        },
        keyWord: {
            word1: "",
            word2: "",
            word3: ""
        },
    },
    methods: {
        getImg() {
            var vm = this;
            return $.ajax({
                url: `${friendo_url}MineShine/image/${vm.code}`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                method: "GET",
            }).done(function(res) {
                // console.log("getImg:",res);
                vm.serialNumber = res.data.serialNumber;
                vm.user.shareImg = res.data.shareImg;
                vm.toDataURL(res.data.userImg1,function(Url){
                    vm.user.userImg1 = Url;
                });
                vm.toDataURL(res.data.userImg2,function(Url){
                    vm.user.userImg2 = Url;
                });
                vm.toDataURL(res.data.userImg3,function(Url){
                    vm.user.userImg3 = Url;
                });
                vm.toDataURL(res.data.shareImg,function(Url){
                    vm.user.shareImg = Url;
                });
                // vm.user.userImg1 = res.data.userImg1;
                // vm.user.userImg2 = res.data.userImg2;
                // vm.user.userImg3 = res.data.userImg3;
                vm.keyWord.word1 = res.data.keyword1;
                vm.keyWord.word2 = res.data.keyword2;
                vm.keyWord.word3 = res.data.keyword3;
                vm.link = res.data.link;
                vm.savedata = res.data.saveData;
                $("body").loadpage("close");
            });
        },
        saveData() {
            var vm = this;
            var post_data = new FormData();
            post_data.append("code",vm.code);
            post_data.append("name",vm.name);
            post_data.append("friendName",vm.friendName);
            post_data.append("address",vm.address);
            post_data.append("mobile",vm.mobile);
            post_data.append("textImg",vm.textImg);
            post_data.append("serialNumber",vm.serialNumber);
            post_data.append("reCaptcha",vm.reCaptcha);
            return $.ajax({
                url: `${friendo_url}MineShine/data`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                processData: false,
                contentType: false,
                // dataType: "json"
            }).done(function(res) {
                // console.log("saveData:",res);
                if(res.success) {
                    vm.resultLoad = false;
                    vm.popup = true;
                    vm.popEvent = "type";
                    vm.popPage = "suc";
                } else {
                    alert("您已填過表單 感謝您的參與");
                    window.location.href = "index.html";
                }
            });
        },
        downloadImg() {
            var vm = this;
            var dl1 = document.getElementById("dl1");
            var dl2 = document.getElementById("dl2");
            var dl3 = document.getElementById("dl3");
            var dl4 = document.getElementById("dl4");
            var time = Date.now();
            dl1.setAttribute("download","img"+time);
            dl2.setAttribute("download","img"+time+1);
            dl3.setAttribute("download","img"+time+2);
            dl4.setAttribute("download","img"+time+3);

            setTimeout(function() {
                dl1.click();
                dl2.click();
                dl3.click();
                dl4.click();
            }, 500);
        },
        giftput() {
            var vm = this;
            //check 表單
            if(!vm.loading) {
                var mobile_rule = /^09[0-9]{8}$/;
                var ch_rule = /^[\u4e00-\u9fa5]{1,10}$/; //限定中文
                if(vm.name == "") {
                    vm.popup = true;
                    vm.popEvent = "type";
                    vm.popPage = "dataerr";
                    return
                }
                if(vm.mobile == "" || !vm.mobile.match(mobile_rule)) {
                    vm.popup = true;
                    vm.popEvent = "type";
                    vm.popPage = "dataerr";
                    return
                }
                if(vm.friendName == "") {
                    vm.popup = true;
                    vm.popEvent = "type";
                    vm.popPage = "dataerr";
                    return
                }
                if(vm.text == "") {
                    vm.popup = true;
                    vm.popEvent = "type";
                    vm.popPage = "dataerr";
                    return
                }
                if(vm.agree == false) {
                    vm.popup = true;
                    vm.popEvent = "type";
                    vm.popPage = "dataerr";
                    return
                }
                vm.popup = true;
                // vm.loading = true;
                vm.resultLoad = true;
                // $("body").loadpage("init",{async : true});

                //canvas giftbox
                var giftcan = document.getElementById("giftbox");
                var gcc = giftcan.getContext('2d');
                
                giftcan.width = 2835;
                giftcan.height = 2421;
                // giftcan.width = 835;
                // giftcan.height = 421;
                gcc.clearRect(0,0,giftcan.width,giftcan.height);
                gcc.font = "50px Arial";

                var giftBg = new Image();
                var userimg1 = new Image();
                var userimg2 = new Image();
                var userimg3 = new Image();
                var keyword1 = new Image();
                var keyword2 = new Image();
                var keyword3 = new Image();

                var prbg = new Promise(function(resolve){
                    giftBg.addEventListener("load", function(){
                        resolve();
                    });
                    giftBg.src="./images/giftboxbg.jpg";
                });

                var primg1 = new Promise(function(resolve){
                    userimg1.addEventListener("load", function(){
                        resolve();
                    });
                    userimg1.src= vm.user.userImg1;
                });

                var primg2 = new Promise(function(resolve){
                    userimg2.addEventListener("load", function(){
                        resolve();
                    });
                    userimg2.src= vm.user.userImg2;
                });

                var primg3 = new Promise(function(resolve){
                    userimg3.addEventListener("load", function(){
                        resolve();
                    });
                    userimg3.src= vm.user.userImg3
                });

                var prkw1 = new Promise(function(resolve){
                    keyword1.addEventListener("load", function(){
                        resolve();
                    });
                    keyword1.src= vm.keyWord.word1;
                });

                var prkw2 = new Promise(function(resolve){
                    keyword2.addEventListener("load", function(){
                        resolve();
                    });
                    keyword2.src= vm.keyWord.word2;
                });

                var prkw3 = new Promise(function(resolve){
                    keyword3.addEventListener("load", function(){
                        resolve();
                    });
                    keyword3.src= vm.keyWord.word3;
                });

                Promise.all([prbg,primg1,primg2,primg3,prkw1,prkw2,prkw3]).then(function(){
                    gcc.drawImage(giftBg,0,0,giftBg.width,giftBg.height,0,0,giftcan.width,giftcan.height);
                    gcc.drawImage(userimg1,0,0,300,300,398,1487,346,333);
                    gcc.drawImage(userimg2,0,0,300,300,923,1523,346,333);
                    gcc.drawImage(userimg3,0,0,300,300,1413,1482,346,333);
                    gcc.fillText(vm.serialNumber,320,385);
                    gcc.rotate(-9 * Math.PI / 180);
                    gcc.drawImage(keyword1,0,0,keyword1.width,keyword1.height,240,1340,keyword1.width*1.2,keyword1.height*1.2);
                    gcc.font = "bold 50px Noto Sans TC";
                    gcc.fillStyle = "#f2dc24";
                    gcc.textAlign = "start"
                    gcc.fillText("To: "+ vm.friendName,850,1170);
                    gcc.textAlign = "center"
                    gcc.fillText(vm.text,1100,1220);
                    gcc.rotate(9 * Math.PI / 180);
                    gcc.rotate(-1 * Math.PI / 180);
                    gcc.drawImage(keyword2,0,0,keyword2.width,keyword2.height,920,1300,keyword2.width*1.2,keyword2.height*1.2);
                    gcc.rotate(1 * Math.PI / 180);
                    gcc.rotate(8 * Math.PI / 180);
                    gcc.drawImage(keyword3,0,0,keyword3.width,keyword3.height,1610,1040,keyword3.width*1.2,keyword3.height*1.2);
                    gcc.rotate(-8 * Math.PI / 180);
                    vm.textImg = giftcan.toDataURL("image/jpeg", 1);
                    vm.getToken().then(function(){
                        vm.grecaptcha("result").then(function(){
                            vm.saveData();
                        })
                    })
                })
            }
             
        },
        toFb() {
            var vm = this;
            return new Promise(function(resolve){
                vm.popup = true;
                vm.popEvent = "type";
                vm.popPage = "tip";
                resolve();
            })
        },
        fbshare() {
            var vm = this;
            var fbhtml_url= vm.link;
            var isIE=window.ActiveXObject || "ActiveXObject" in window;
            vm.popupClose();
            vm.step = 3;
            window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url+'&hashtag=%23麥香曬友情');return false;
            // if(isIE) {
            //     window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url);return false;
            // } else {
            //     window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url+'&hashtag=%23麥香曬友情');return false;
            // }
        },
        toDataURL(url, callback) {
            var vm = this;
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                var reader = new FileReader();
                reader.onloadend = function() {
                    callback(reader.result);
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        },
        checkBrowser() {
            var vm = this;
            var device = {};
            var md = new MobileDetect(window.navigator.userAgent);
            var u = navigator.userAgent;
            var isFbApp = u.indexOf("FBAV") > -1; // FB App 內建瀏覽器
            if(md.match(/android/i)) {
                if(isFbApp) {
                    vm.popup = true;
                    vm.popEvent = "fbapp";
                } else {
                    vm.downloadImg();
                }
            } else if(md.match(/(iphone|ipad|ipod);?/i)) {
                vm.popup = true;
                vm.popEvent = "type";
                vm.popPage = "ios";
            } else {
                vm.downloadImg();
            }
        }
    },
    created: function() {
        var vm = this;
        vm.code = findGetParameter("user");
    },
    mounted: function() {
        var vm = this;
        $("body").loadpage("init",{async : true});
        vm.getToken().then(function(){
            vm.getImg();
        })
        // vm.checkBrowser();
    }
})