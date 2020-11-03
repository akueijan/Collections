var game_view = new Vue({
    el: "#app",
    data: {
        stepPage: 1,
        scenPage: 1,
        person: "",
        mainber: "",
        canObj: {
            bg: "",
            deco: [
                "./images/can-Deco_1.png",
                "./images/can-Deco_2.png",
                "./images/can-Deco_3.png",
            ],
            food: "",
            item: "",
            // kv: "",
        },
        shareImg: "",
        relationship: "",
        txtLen: 0,
        // transPage: true
    },
    methods: {
        transition() {
            var vm = this;
            vm.transPage = true;
            setTimeout(function(){
                sakuraBg(2000,0.2);
                var tl = new TimelineMax({delay: 0.6})
                tl.set(".step5 .word1",{
                    opacity: 0
                })
                tl.to(".step5 .word2",0.9,{
                    opacity: 1,
                })
            },50)
        },

        step1_scen1() {
            var vm = this;
            var tl = new TimelineMax({
                delay: 1.5,
                onComplete: () => {
                    // vm.transition(1,2).then(function(){
                    //     vm.step1_scen2();
                    // });
                    setTimeout(function(){
                        vm.scenPage = 2;
                        setTimeout(function(){
                            vm.step1_scen2();
                        },10)
                    },900)
                }
            })
            tl.from(".step1 .scenes1", 1.2, {
                opacity: 0,
                y: 50
            })
            tl.from(".step1 .word1", 1.2, {
                opacity: 0,
                // y: 50
            })
            tl.to(".step1 .word1", 1.2, {
                opacity: 0,
                top: 200
            },"+=2.1")
            // tl.to("#tranarea",1.5,{
            //     x: 400,
            //     opacity: 0,
            // })
        },

        step1_scen2() {
            var vm = this;
            var tl = new TimelineMax()
            tl.from(".step1 .scenes2 h2", 0.9, {
                opacity: 0,
                y: 50
            })
            tl.from(".step1 .scenes2 .selbtn1", 0.9, {
                opacity: 0,
                x: -50
            })
            tl.from(".step1 .scenes2 .selbtn2", 0.9, {
                opacity: 0,
                x: -50
            },"-=0.6")
            tl.from(".step1 .scenes2 .selbtn3", 0.9, {
                opacity: 0,
                x: -50
            },"-=0.6")
            tl.from(".step1 .scenes2 .selbtn4", 0.9, {
                opacity: 0,
                x: -50
            },"-=0.6")
            tl.set(".mask", {
                display: "none"
            })
        },

        step_sel(str) {
            var vm = this;
            var targetbtn;
            var i = Math.floor(Math.random()* 4)+1;
            if(str === "family") {
                vm.relationship = "家人";
                vm.canObj.bg = "./images/can-" + str + "-" + i +".jpg";
                targetbtn = ".step1 .selbtn1";
            }
            if(str === "bf") {
                vm.relationship = "哥們";
                vm.canObj.bg = "./images/can-" + str +".jpg";
                targetbtn = ".step1 .selbtn2";
            }
            if(str === "gf") {
                vm.relationship = "閨蜜";
                vm.canObj.bg = "./images/can-" + str +".jpg";
                targetbtn = ".step1 .selbtn3";
            }
            if(str === "lover") {
                vm.relationship = "戀人";
                vm.canObj.bg = "./images/can-" + str + "-" + i +".jpg";
                targetbtn = ".step1 .selbtn4";
            }
            setTimeout(function(){
                var tl = new TimelineMax({
                    onComplete: () => {
                        setTimeout(function(){
                            vm.stepPage = 2;
                            vm.scenPage = 1;
                            setTimeout(function(){
                                vm.step2_scen1();
                            },10)
                        },900)
                    }
                })
                tl.set(".mask", {
                    display: "block"
                })
                tl.to(targetbtn, 0.3,{
                    scale: 1.05
                })
                // tl.to(".trans", 0.3, {
                //     css: {zIndex: 9, opacity: 1}
                // },"+=0.3")
            },50)
        },

        step2_scen1() {
            var vm = this;
            window.scrollTo(0,0);
            var tl = new TimelineMax({
                delay: 0.9,
                onComplete: () => {
                    setTimeout(function(){
                        vm.scenPage = 2;
                        setTimeout(function(){
                            vm.step2_scen2();
                        },10)
                    },300)
                }
            })
            // tl.to(".trans", 0.3, {
            //     css: {zIndex: -1, opacity: 0}
            // })
            tl.from(".step2 .scenes1 .wordbg",0.9,{
                opacity: 0,
                y: 50
            })
            // tl.from(".wordbg .txt",0.9,{
            //     opacity: 0,
            //     x: -50
            // })
            tl.set(".step2 .scenes1 .shock",{
                opacity: 1
            },"+=1.2")
            tl.from(".step2 .scenes1 .shock .content",0.1,{
                opacity: 0,
            })
            tl.to(".step2 .scenes1 .shock .content",0.1,{
                opacity: 0,
            })
            tl.to(".step2 .scenes1 .shock .content",0.1,{
                opacity: 1,
            })
            tl.set(".step2 .scenes1 .wordbg", {
                opacity: 0
            },"-=0.3")
            tl.set(".step2 .scenes1 .shock",{
                opacity: 0
            },"+=1.5")
            tl.to(".step2 .scenes1 .stationbg",1.2,{
                // top: -6,
                scale: 1.2
            })
            // tl.to(".step2 .scenes1 .stationbg",0.6,{
            //     top: 0,
            //     scale: 1.15
            // })
            // tl.to(".step2 .scenes1 .stationbg",0.6,{
            //     top: -6,
            //     scale: 1.2
            // })
            // tl.to(".step2 .scenes1 .stationbg",0.2,{
            //     top: 0,
            //     scale: 1.25
            // })
            // tl.to(".step2 .scenes1 .stationbg",0.2,{
            //     top: -20,
            //     scale: 1.3
            // })
            // tl.to(".step2 .scenes1 .stationbg",0.2,{
            //     top: 0,
            //     scale: 1.35
            // })
            // tl.to(".step2 .scenes1 .stationbg",0.2,{
            //     top: -20,
            //     scale: 1.4
            // })
        },

        step2_scen2() {
            var vm = this;
            var tl = new TimelineMax({
                delay: 0.3,
                onComplete: () => {
                    setTimeout(function(){
                        $(".trans").addClass("transact");
                        setTimeout(function(){
                            vm.stepPage = 3;
                            vm.scenPage = 1;
                            setTimeout(function(){
                                $(".trans").removeClass("transact");
                                vm.step3_scen1();
                            },600)
                        },900)
                    },1800)
                }
            })
            tl.from(".step2 .scenes2 .hand",0.6,{
                opacity: 0,
                x: 150,
                y: 100
            })
            // tl.from(".step2 .scenes2 .alert",0.3,{
            //     opacity: 0,
            // })
            // tl.set(".step2 .scenes2 .alert",{
            //     opacity: 0,
            // },"+=0.6")
            tl.from(".step2 .scenes2 .wordbg",0.6,{
                opacity: 0,
                y: 50
            })
            // tl.from(".scenes2 .wordbg",0.9,{
            //     opacity: 0,
            //     y: 50
            // },"+=0.3")
            // tl.to(".trans", 0.3, {
            //     css: {zIndex: 9, opacity: 1}
            // },"+=1.2")
        },

        step3_scen1() {
            var vm = this;
            window.scrollTo(0,0);
            var tl = new TimelineMax({
                delay: 0.9,
                // onComplete: () => {
                //     // setTimeout(function(){
                //     //     vm.scenPage = 2;
                //     //     setTimeout(function(){
                //     //         vm.step2_scen2();
                //     //     },50)
                //     // },1200)
                // }
            })
            // tl.to(".trans", 0.3, {
            //     css: {zIndex: -1, opacity: 0}
            // })
            tl.from(".step3 .scenes1 .wordbg",0.9,{
                opacity: 0,
                y: 50
            })
            tl.to(".step3 .scenes1 .wordbg",0.9, {
                opacity: 0,
                y: -50
            },"+=1.2")
            tl.from(".step3 .scenes1 .selbox", 0.9,{
                opacity: 0
                // top: 100
            },"+=0.6")
            tl.from(".step3 .scenes1 .selbox h2", 0.9,{
                opacity: 0,
                y: 50
                // top: 100
            },"+=0.6")
            tl.from(".step3 .scenes1 .selbtn1", 0.9, {
                opacity: 0,
                x: -50
            })
            tl.from(".step3 .scenes1 .selbtn2", 0.9, {
                opacity: 0,
                x: -50
            },"-=0.6")
            tl.from(".step3 .scenes1 .selbtn3", 0.9, {
                opacity: 0,
                x: -50
            },"-=0.6")
            tl.set(".mask", {
                display: "none"
            })
        },

        step3_sel(str) {
            var vm = this;
            vm.canObj.food = "./images/can-" + str + ".png";
            var targetbtn;
            if(str === "sasimi") {
                targetbtn = ".step3 .scenes1 .selbtn1"
            }
            if(str === "tea") {
                targetbtn = ".step3 .scenes1 .selbtn2"
            }
            if(str === "food") {
                targetbtn = ".step3 .scenes1 .selbtn3"
            }
            var tl = new TimelineMax({
                // delay: 0.6,
                onComplete: () => {
                    setTimeout(function(){
                        vm.scenPage = 2;
                        setTimeout(function(){
                            vm.step3_scen2();
                        }, 10)
                    },300)
                }
            })
            tl.set(".mask", {
                display: "block"
            })
            tl.to(targetbtn, 0.3,{
                scale: 1.05
            })
            tl.set(".step3 .scenes1 .selbox",{
                opacity: 0
            },"+=0.3")
            tl.set(".step3 .scenes1 .shock",{
                opacity: 1,
            })
            tl.from(".step3 .scenes1 .shock .content",0.1,{
                opacity: 0,
            },"+=0.3")
            tl.to(".step3 .scenes1 .shock .content",0.1,{
                opacity: 0,
            })
            tl.to(".step3 .scenes1 .shock .content",0.1,{
                opacity: 1,
            })
            tl.set(".step3 .scenes1 .shock",{
                opacity: 0,
            },"+=1.5")
            tl.to(".step3 .scenes1 .storebg",0.9,{
                // top: -5,
                scale: 1.2
            })
            // tl.to(".step3 .scenes1 .storebg",0.6,{
            //     top: 0,
            //     scale: 1.15
            // })
            // tl.to(".step3 .scenes1 .storebg",0.6,{
            //     top: -5,
            //     scale: 1.2
            // })
        },

        step3_scen2() {
            var vm = this;
            var tl = new TimelineMax({
                // delay: 0.3,
                onComplete: () => {
                    setTimeout(function(){
                        $(".trans").addClass("transact");
                        setTimeout(function(){
                            vm.stepPage = 4;
                            vm.scenPage = 1;
                            setTimeout(function(){
                                $(".trans").removeClass("transact");
                                vm.step4_scen1();
                            },600)
                        },900)
                    },1800)
                }
            })
            tl.from(".step3 .scenes2 .hand",0.9,{
                opacity: 1,
                x: 100,
                y: 200
            })
            // tl.set(".alert",{
            //     opacity: 0,
            // },"+=0.3")
            tl.from(".step3 .scenes2 .wordbg",0.9,{
                opacity: 0,
                y: 50
            },"+=0.6")
            // tl.to(".trans", 0.3, {
            //     css: {zIndex: 9, opacity: 1}
            // },"+=1.2")
        },

        step4_scen1() {
            var vm = this;
            window.scrollTo(0,0);
            var tl = new TimelineMax({
                delay: 0.9,
                // onComplete: () => {
                //     // setTimeout(function(){
                //     //     vm.scenPage = 2;
                //     //     setTimeout(function(){
                //     //         vm.step2_scen2();
                //     //     },50)
                //     // },1200)
                // }
            })
            // tl.to(".trans", 0.3, {
            //     css: {zIndex: -1, opacity: 0}
            // })
            tl.from(".step4 .scenes1 .wordbg",0.9,{
                opacity: 0,
                y: 50
            })
            tl.to(".step4 .scenes1 .wordbg",0.9, {
                opacity: 0,
                y: -50
            },"+=1.2")
            tl.from(".step4 .scenes1 .selbox", 0.9,{
                opacity: 0
                // top: 100
            },"+=0.6")
            tl.from(".step4 .scenes1 .selbox h2", 0.9,{
                opacity: 0,
                y: 50
                // top: 100
            },"+=0.6")
            tl.from(".step4 .scenes1 .selbtn1", 0.9, {
                opacity: 0,
                x: -50
            })
            tl.from(".step4 .scenes1 .selbtn2", 0.9, {
                opacity: 0,
                x: -50
            },"-=0.6")
            tl.from(".step4 .scenes1 .selbtn3", 0.9, {
                opacity: 0,
                x: -50
            },"-=0.6")
            tl.set(".mask", {
                display: "none"
            })
        },

        step4_sel(str) {
            var vm = this;
            vm.canObj.item = "./images/can-" + str + ".png";
            var targetbtn;
            if(str === "kol") {
                targetbtn = ".step4 .scenes1 .selbtn1"
            }
            if(str === "sing") {
                targetbtn = ".step4 .scenes1 .selbtn2"
            }
            if(str === "tgame") {
                targetbtn = ".step4 .scenes1 .selbtn3"
            }
            var tl = new TimelineMax({
                // delay: 0.6,
                onComplete: () => {
                    setTimeout(function(){
                        vm.scenPage = 2;
                        setTimeout(function(){
                            vm.step4_scen2();
                        },10)
                    },300)
                }
            })
            tl.set(".mask", {
                display: "block"
            })
            tl.to(targetbtn, 0.3,{
                scale: 1.05
            })
            tl.set(".step4 .scenes1 .selbox",{
                opacity: 0
            },"+=0.3")
            tl.set(".step4 .scenes1 .shock",{
                opacity: 1,
            })
            tl.from(".step4 .scenes1 .shock .content",0.1,{
                opacity: 0,
            },"+=0.3")
            tl.to(".step4 .scenes1 .shock .content",0.1,{
                opacity: 0,
            })
            tl.to(".step4 .scenes1 .shock .content",0.1,{
                opacity: 1,
            })
            tl.set(".step4 .scenes1 .shock",{
                opacity: 0,
            },"+=1.2")
            tl.to(".step4 .scenes1 .machinebg",0.9,{
                top: -50,
                scale: 1.25
            })
        },

        step4_scen2() {
            var vm = this;
            var tl = new TimelineMax({
                delay: 0.6,
                onComplete: () => {
                    setTimeout(function(){
                        $(".trans").addClass("transact");
                        setTimeout(function(){
                            vm.stepPage = 5;
                            vm.scenPage = 1;
                            setTimeout(function(){
                                $(".trans").removeClass("transact");
                                vm.step5_scen1();
                            },600)
                        },900)
                    },1800)
                }
            })
            tl.from(".step4 .scenes2 .hand",0.9,{
                opacity: 1,
                x: 100,
                y: 150
            })
            tl.from(".step4 .scenes2 .alert",0.3,{
                opacity: 0,
            })
            tl.set(".step4 .scenes2 .alert",{
                opacity: 0,
            },"+=0.3")
            tl.from(".step4 .scenes2 .wordbg",0.9,{
                opacity: 0,
                y: 50
            },"+=0.6")
            tl.set(".mask", {
                display: "none"
            },"+=1.2")
            // tl.to(".trans", 0.6, {
            //     css: {zIndex: 9, opacity: 1}
            // },"+=1.2")
        },

        step5_scen1() {
            var vm = this;
            window.scrollTo(0,0);
            var tl = new TimelineMax({
                delay: 0.6,
                onComplete: () => {
                    vm.transition();
                    setTimeout(function(){
                        vm.scenPage = 2;
                        setTimeout(function(){
                            vm.resultCan();
                        },500)
                    },4200)
                }
            })
            // tl.to(".trans", 0.3, {
            //     css: {zIndex: -1, opacity: 0}
            // })
            tl.from(".step5 .scenes1 .wordbg",0.9,{
                opacity: 0,
                y: 50
            })
            tl.from(".step5 .scenes1 .word1",0.9,{
                opacity: 0,
            })
            tl.to(".step5 .scenes1 .parkbg",3,{
                top: 0
            })

        },

        resultCan() {
            var vm = this;
            var rescan = document.getElementById("rescan");
            var rescc = rescan.getContext('2d');

            //===canvas初始化===//
            rescan.width = 1200;
            rescan.height = 628;
            rescc.clearRect(0,0,rescan.width,rescan.height);

            var rescBg = new Image();
            // var rescKv = new Image();
            var rescDeco = new Image();
            var rescFood = new Image();
            var rescItem = new Image();
            var rescVisa = new Image();
            var rescName = new Image();

            var prbg = new Promise(function(resolve){
                rescBg.addEventListener("load", function(){
                    rescc.drawImage(rescBg,0,0,rescBg.width,rescBg.height,0,0,rescan.width,rescan.height);
                    // vm.shareImg = rescan.toDataURL("image/jpeg", 0.8);
                    // console.log(vm.shareImg);
                    resolve();
                });
                // rescBg.src = "./images/can-Bg_1.png";
                rescBg.src = vm.canObj.bg;
            });

            // var prkv = new Promise(function(resolve){
            //     rescKv.addEventListener("load", function(){
            //         // console.log("kv");
            //         resolve();
            //     });
            //     // rescKv.src="./images/can-bf.png";
            //     rescKv.src = vm.canObj.kv;
            // });

            var prdeco = new Promise(function(resolve){
                rescDeco.addEventListener("load", function(){
                    resolve();
                });
                // rescDeco.src="./images/can-Deco_1.png";
                var i = Math.floor(Math.random()*vm.canObj.deco.length);
                rescDeco.src = vm.canObj.deco[i];
            });

            var prfood = new Promise(function(resolve){
                rescFood.addEventListener("load", function(){
                    resolve();
                });
                // rescFood.src="./images/can-food.png";
                rescFood.src = vm.canObj.food;
            });

            var pritem = new Promise(function(resolve){
                rescItem.addEventListener("load", function(){
                    resolve();
                });
                // rescItem.src="./images/can-kol.png";
                rescItem.src = vm.canObj.item;
            });

            var prvisa = new Promise(function(resolve){
                rescVisa.addEventListener("load", function(){
                    resolve();
                });
                rescVisa.src="./images/can-visa.png";
            });

            var prname = new Promise(function(resolve){
                rescName.addEventListener("load", function(){
                    resolve();
                });
                rescName.src="./images/nameBg.png";
            });

            //===字串處理===//
            var keyword;
            var keyStr
            keyword = vm.fbData.fbName.split(" ",2);
            if(keyword[1]) {
                keyStr = keyword[0] + " " + keyword[1] + "の" + vm.relationship + "席";
            } else {
                keyStr = keyword[0] + "の" + vm.relationship + "席";
            }
            // console.log(keyStr);
            // vm.checkLen(keyword);
            // console.log(vm.txtLen);
            // console.log(vm.checkLen("佐佐木"));
            vm.checkLen(keyStr);
            var fontType;
            if(vm.txtLen >= 7) {
                fontType = "bold 40px DFKangKaiStd-W5";
            }
            if(vm.txtLen >= 16) {
                fontType = "bold 36px DFKangKaiStd-W5";
            }
            if(vm.txtLen < 7) {
                fontType = "bold 60px DFKangKaiStd-W5";
            }
            
            // keyword.split("");
            // wordArr.push(keyword);
            // var length = keyword[0].replace(/[^/x00-/xff]/g,"**").length;
            // console.log(length);

            //===圖片合成===//
            prbg.then(function(){
                Promise.all([prdeco,prfood,pritem,prname,prvisa]).then(function(){
                    // rescc.drawImage(rescKv,0,0,rescKv.width,rescKv.height,67,31,rescKv.width,rescKv.height);
                    rescc.drawImage(rescDeco,0,0,rescDeco.width,rescDeco.height,1000,0,200,200);
                    rescc.drawImage(rescFood,0,0,rescFood.width,rescFood.height,540,299,350,320);
                    rescc.drawImage(rescItem,0,0,rescItem.width,rescItem.height,974,222,220,330);
                    rescc.drawImage(rescVisa,0,0,rescVisa.width,rescVisa.height,22,22,90,29);
                    rescc.drawImage(rescName,0,0,rescName.width,rescName.height,47,498,rescName.width,rescName.height);
                    rescc.font = fontType;
                    rescc.textAlign = "center";
                    rescc.fillText(keyStr,250,560,400);
                    vm.shareImg = rescan.toDataURL("image/jpeg", 0.8);
                    // console.log(rescan.toDataURL("image/jpeg", 0.8));
                })
            })
        },

        fbLogin() {
            var vm = this;
            FB.getLoginStatus(function(res) {
                // statusChangeCallback(response);
                // console.log(res);
                if (res.status === 'connected') {
                    vm.fbData.fbtoken = res.authResponse.accessToken;
                    vm.fbData.fbId = res.authResponse.userID;
                    FB.api('/me','GET',{"fields":"id,name,picture"},
                        function(apires) {
                            vm.fbData.fbName = apires.name;
                            vm.fbData.fbPic = 'http://graph.facebook.com/'+ apires.id +'/picture?width=140&height=140';
                        }
                    );
                } else {
                    alert("請先登入FB後入席賞櫻");
                    window.location.href = "./index.html";
                }
            });
        },

        replay() {
            window.location.href = "./index.html";
        },

        sendImg() {
            var vm = this;
            vm.popup = true;
            vm.poPage = "loading";
            vm.getToken().then(function(){
                vm.saveImg();
            })
        },

        //===API===//
        saveImg() {
            var vm = this;
            var post_data = new FormData();
            post_data.append("fbToken",vm.fbData.fbtoken);
            post_data.append("shareImg",vm.shareImg);
            post_data.append("relationship",vm.relationship);
            return $.ajax({
                url: `${friendo_url}VISASakuraMatsuri/img`,
                headers: {
                    "Authorization": "Bearer "+ vm.mainToken,
                },
                data: post_data,
                method: "POST",
                // dataType: "json",
                processData: false,
                contentType: false,
            }).done(function (res) {
                // console.log("saveImg",res);
                vm.fbLink = res.data.sharingUrl;
                // vm.fbShare();
                vm.popup = true;
                vm.poPage = "yourlink";
            });
        },

        checkLen(tx) {
            var vm = this;
            // var txt = tx;
            // console.log(txt);
            // var str = encodeURIComponent(txt);
            // console.log("utf8:"+str);
            // // var len = str.replace(/%[A-F\d]{2}/g, 'U').length;
            // var len = str.replace(/%[A-F0-9]{2}/g, 'U').length;
            // console.log("len = "+len);
            // vm.txtLen = len;
            // console.log(tx);
            function stringBytes(c){
                // console.log(c.length);
                var n=c.length;
                // console.log(n);
                var s;
                var len=0;
                for(var i=0; i <n;i++){
                    s=c.charCodeAt(i);
                    while( s > 0 ){
                        len++;
                        s = s >> 8;
                    }
                }
                console.log(len);
                vm.txtLen = len;
                // return len;
            }
            stringBytes(tx);
            // var tx="測試中文12313";
            // console.log(stringBytes(tx));
        }

    },
    created: function() {
        var vm = this;

    },
    mounted: function() {
        var vm = this;
        if(!isMobile) {
            window.location = "./index_pc.html";
        }
        $("body").loadpage("init",{async : false});
        document.querySelector("nav").style.display = "none";
        window.scrollTo(0,0);

        vm.step1_scen1();
        // vm.step2_scen1();
        // vm.step3_scen1();
        // vm.step3_scen2();
        // vm.step4_scen1();
        // vm.step5_scen1();
        // setTimeout(function(){
        //     // sakuraBg(1000,0.2);
        //     vm.resultCan();
        // },200)


        // fb sdk引用
        window.fbAsyncInit = function () {
            FB.init({
                appId: '619022558645664',
                status:true,
                cookie: true,
                xfbml: false,
                version: 'v6.0'
            });

            vm.fbLogin();
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
})
