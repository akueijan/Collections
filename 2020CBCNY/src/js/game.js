var game_view = new Vue({
    el: "#app",
    data: {
        voltest: true,
        testing: false,
        deScore: 0, //聲量基準
        miss: 0,
        good: 0,
        gamecom: "",
        comment: "",
        stepPage: "fblogin", // fblogin
        song: "",
        level: 0,
        gameCode: "",
        gameresult: false,
        gameStart: false,
        hasMobile: false,
        // guid: "",
        lvpage: 0,
        userPhone: "",
        agree: false,
        fbData: {
            fbName: "",
            fbPic: "",
            fbId: "",
            fbtoken: "",
        },
        lock: {
            game2: true,
            game3: true,
        },
        reCaptcha: "",
    },
    methods: {
        // handleSuccess(stream) {
        //     var vm = this;
        //     window.AudioContext = window.AudioContext || window.webkitAudioContext;
        //     // var player = document.getElementById('player');
        //     // var btnStart = document.getElementById('btnStart');
        //     var s = document.getElementById('s');
        //     var p = document.getElementById('p');
        //     var d = document.getElementById('d');
        //     for(var i=0; i<16; i++){
        //         d.innerHTML += '<div></div>';
        //     }
        //     var dd = document.querySelectorAll('#d div');
        //     var context = new AudioContext();
        //     // var microphone = context.createMediaStreamSource(stream);

        //     // var recorder = new Recorder(microphone);
        //     // recorder.record();

        //     // function forceSafariPlayAudio() {
        //     //     player.load(); // iOS 9   還需要額外的 load 一下, 否則直接 play 無效
        //     //     player.play(); // iOS 7/8 僅需要 play 一下
        //     //     // alert("55555555");
        //     // }
        //     // player.addEventListener('play', function() {
        //     //     // 當 audio 能夠播放後, 移除這個事件
        //     //     btnStart.removeEventListener('touch', forceSafariPlayAudio, false);
        //     //     btnStart.removeEventListener('click', forceSafariPlayAudio, false);
        //     // }, false);

        //     // btnStart.addEventListener('touch', forceSafariPlayAudio, false);
        //     // btnStart.addEventListener('click', forceSafariPlayAudio, false);
        //     // player.play();
        //     // player.volume = 0.2;

        //     var analyser = context.createAnalyser();
        //     // microphone.connect(analyser);
        //     // analyser.connect(context.destination);
        //     analyser.fftSize = 32;
        //     var bufferLength = analyser.frequencyBinCount;
        //     var dataArray = new Uint8Array(analyser.fftSize);

        //     if(window.innerWidth < 768) {
        //         document.getElementsByClassName("front")[0].style = "top: 60px";
        //         document.getElementsByClassName("back")[0].style = "top: 60px";
        //         document.getElementsByClassName("mask").style = "width: 0";
        //     } else {
        //         document.getElementsByClassName("front")[0].style = "top: 160px";
        //         document.getElementsByClassName("back")[0].style = "top: 160px";
        //         document.getElementsByClassName("mask").style = "width: 0";
        //     }
        //     var timeArr = [];
        //     var speed = 0;
        //     var sSec = 0;
        //     var lvTime;
        //     if(vm.lvpage == 1) {
        //         speed = '3.25s';
        //         sSec = 3250;
        //         lvTime = sSec*8+500;
        //     }
        //     if(vm.lvpage == 2) {
        //         speed = '2.00s';
        //         sSec = 2000;
        //         lvTime = sSec*12+500;
        //     };
        //     if(vm.lvpage == 3) {
        //         speed = '1.70s';
        //         sSec = 1700;
        //         lvTime = sSec*12+500;
        //     };
        //     document.getElementsByClassName("mask")[0].style = "width: 100%; transition: "+speed+" linear";
        //     for(let i=0; i<document.getElementsByClassName("mask").length; i++) {
        //         var line = 1;
        //         timeArr.push(setTimeout(function() {
        //             // console.log(i+1);
        //             document.getElementsByClassName("mask")[i].style = "width: 100%; transition: "+speed+" linear";
        //             if(window.innerWidth < 768) {
        //                 if(i>=line) {
        //                     document.getElementsByClassName("front")[0].style = "top: "+(60-(49*(i+1-line)))+"px; transition: 1.5s linear";
        //                     document.getElementsByClassName("back")[0].style = "top: "+(60-(49*(i+1-line)))+"px; transition: 1.5s linear";
        //                 }
        //             } else {
        //                 if(i>=line) {
        //                     document.getElementsByClassName("front")[0].style = "top: "+(160-(65*(i+1-line)))+"px; transition: 1.5s linear";
        //                     document.getElementsByClassName("back")[0].style = "top: "+(160-(65*(i+1-line)))+"px; transition: 1.5s linear";
        //                 }
        //             }
        //         },sSec*i+1));
        //     };

        //     var gameTime = setTimeout(function(){
        //         stopGame();
        //         vm.gameresult = true;
        //         vm.getToken().then(function(){
        //             vm.record();
        //         })
        //         // vm.comment = "遊戲結束";
        //         // vm.stepPage = "success";
        //     },lvTime);

        //     update(); 
        //     var timer;
        //     var total = 0;
        //     var cun = 0;
        //     function update(){
        //         // console.log(dataArray);
        //         analyser.getByteFrequencyData(dataArray);
        //         timer = setTimeout(update, 200);
        //         var sum = 0;
        //         for(var j=0; j<16; j++){
        //             dd[j].style.height = dataArray[j]+'px';
        //             // dd[j].style.background = 'rgba('+(255-j)+','+j*2+',0,1)';
        //             dd[j].style.background = 'rgba(154,106,184,0.8)';
        //             sum += dataArray[j];
        //         }
        //         // console.log("sum", sum);
        //         total += sum;
        //         // console.log("total",total);
        //         if(sum < vm.deScore) {
        //             // cun += 1;
        //             vm.miss += 1;
        //             vm.good = 0;
        //         } else {
        //             // cun = 0;
        //             vm.miss = 0;
        //             vm.good += 1;
        //         }
        //         // if(vm.good >= 10) {
        //         //     vm.comment = "nice";
        //         // }
        //         // if(vm.good >= 20) {
        //         //     vm.gamecom = "good";
        //         //     vm.comment = "images/game-good.png";
        //         // }
        //         // if(vm.good >= 40) {
        //         //     vm.gamecom = "perefect";
        //         //     vm.comment = "images/game-perefect.png";
        //         // }
        //         // if(vm.miss >= 8) {
        //         //     vm.gamecom = "miss";
        //         //     vm.comment = "images/game-miss.png";
        //         // }
        //         // if(vm.miss >= 16) {
        //         //     vm.gamecom = "bad";
        //         //     vm.comment = "images/game-bad.png";
        //         // }
        //         // if(vm.miss >= 25) {
        //         //     // alert("失敗");
        //         //     // stream.getTracks().forEach(function(track){
        //         //     //     track.stop();
        //         //     // });
        //         //     clearTimeout(timer);
        //         //     clearTimeout(gameTime);
        //         //     timeArr.forEach(function(timer){
        //         //         clearTimeout(timer);
        //         //     });
        //         //     for(var j=0; j<16; j++){
        //         //         dd[j].style.height = 0 +'px';
        //         //         dd[j].style.transition = "0.6s";
        //         //         d.innerHTML = "";
        //         //     }
        //         //     dd = [];
        //         //     // recorder.stop();
        //         //     // recorder.clear();
        //         //     vm.gameresult = false;
        //         //     vm.record();
        //         //     vm.stepPage = "fail";
        //         //     return
        //         // }
        //     };

        //     function stopGame() {
        //         // stream.getTracks().forEach(function(track){
        //         //     track.stop();
        //         // });
        //         clearTimeout(timer);
        //         for(var j=0; j<16; j++){
        //             dd[j].style.height = 0 +'px';
        //             dd[j].style.transition = "0.6s";
        //             d.innerHTML = "";
        //         }
        //         dd = [];
        //         // recorder.stop();
        //         // createDownloadLink();
        //         // recorder.clear();
        //         vm.stepPage = "success";
        //     };

        //     s.onclick = function(){
        //         stopGame();
        //         // shouldStop = true;
        //     };

        //     function createDownloadLink(){
        //         recorder.exportWAV(function(blob) {
        //             var url = URL.createObjectURL(blob);
        //             var li = document.createElement('li');
        //             var au = document.createElement('audio');
        //             var hf = document.createElement('a');
                    
        //             au.controls = true;
        //             au.src = url;
        //             hf.href = url;
        //             hf.download = new Date().toISOString() + '.wav';
        //             hf.innerHTML = hf.download;
        //             li.appendChild(au);
        //             li.appendChild(hf);
        //             recordingslist.appendChild(li);
        //         });
        //     }
        // },

        // mediaTest(stream) {
        //     var vm = this;
        //     vm.testing = true;
        //     window.AudioContext = window.AudioContext || window.webkitAudioContext;
        //     // var player = document.getElementById('player');
        //     var d = document.getElementById('d');
        //     for(var i=0; i<16; i++){
        //         d.innerHTML += '<div></div>';
        //     }
        //     var dd = document.querySelectorAll('#d div');

        //     var context = new AudioContext();
        //     // var microphone = context.createMediaStreamSource(stream);

        //     var analyser = context.createAnalyser();
        //     // microphone.connect(analyser);
        //     // analyser.connect(context.destination);
        //     analyser.fftSize = 32;
        //     var bufferLength = analyser.frequencyBinCount;
        //     var dataArray = new Uint8Array(analyser.fftSize);


        //     update();
        //     var timer;
        //     var total = 0;
        //     var cun = 0;
        //     function update(){
        //         // console.log(dataArray);
        //         analyser.getByteFrequencyData(dataArray);
        //         timer = setTimeout(update, 200);
        //         var sum = 0;
        //         for(var j=0; j<16; j++){
        //             dd[j].style.height = dataArray[j]+'px';
        //             // dd[j].style.background = 'rgba('+(255-j)+','+j*2+',0,1)';
        //             dd[j].style.background = 'rgba(154,106,184,0.8)';
        //             sum += dataArray[j];
        //         }
        //         cun++;
        //         // console.log("sum", sum);
        //         total += sum;
        //         // console.log("total",total);
        //         // vm.deScore = Math.round(total/cun);
        //     };
            
        //     setTimeout(function(){
        //         // stream.getTracks().forEach(function(track){
        //         //     track.stop();
        //         // });
        //         clearTimeout(timer);
        //         vm.testing = false;
        //         for(var j=0; j<16; j++){
        //             dd[j].style.width = 0 +'px';
        //             dd[j].style.transition = "0.6s";
        //             d.innerHTML = "";
        //         }
        //         dd = [];
        //         // if(vm.deScore < 200) {
        //         //     vm.popup = true;
        //         //     vm.poPage = "testfail";
        //         // } else {
                    
        //         // }
        //         vm.stepPage = "game";
        //         if(vm.level == 1) {
        //             vm.lvpage = 1;
        //             vm.popup = true;
        //             vm.poPage = "testsuc";
        //             vm.song = "迎財神"
        //         }
        //         if(vm.level == 2) {
        //             vm.lvpage = 2;
        //             vm.popup = true;
        //             vm.poPage = "testsuc";
        //             vm.song = "財運爆"
        //         }
        //         if(vm.level == 3) {
        //             vm.lvpage = 3;
        //             vm.popup = true;
        //             vm.poPage = "testsuc";
        //             vm.song = "好運到"
        //         }
        //     },5000) //testtime
        // },

        // startGame() {
        //     var vm = this;
        //     var player = document.getElementById('player');
        //     player.volume = 0.2;
        //     player.play();
        //     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        //     var cun = 3;
        //     vm.popup = false;
        //     vm.poPage = "";
        //     vm.gameStart = true;
        //     var recun = setInterval(function(){
        //         cun--;
        //         document.getElementById('sec').innerHTML = cun;
        //     },1000)
        //     setTimeout(function(){
        //         vm.gameStart = false;
        //         clearInterval(recun);
        //         vm.handleSuccess();
        //         // if(navigator.mediaDevices.getUserMedia || true) {
        //         //     navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        //         //     .then(vm.handleSuccess)
        //         //     .catch(function(err){
        //         //         // console.log(err.name + ": " + err.message);
        //         //         // vm.popup = true;
        //         //         // vm.poPage = "testfail";
        //         //     })
        //         // } else {
        //         //     navigator.getUserMedia({ audio: true, video: false }, vm.handleSuccess, function(){
        //         //         // console.log("error");
        //         //         vm.popup = true;
        //         //         vm.poPage = "testfail";
        //         //     })
        //         // }
        //     },3000)
        // },

        // testStart() {
        //     var vm = this;
        //     vm.mediaTest();
        //     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        //     // if(navigator.mediaDevices.getUserMedia || true) {
        //     //     navigator.mediaDevices.getUserMedia({ audio: true, video: false, muted: true })
        //     //     .then(vm.mediaTest)
        //     //     .catch(function(err){
        //     //         // console.log(err.name + ": " + err.message);
        //     //         // vm.popup = true;
        //     //         // vm.poPage = "testfail";
        //     //         vm.mediaTest()
        //     //     })
        //     // } else {
        //     //     navigator.getUserMedia({ audio: true, video: false, muted: true }, vm.mediaTest, function(){
        //     //         // console.log("error");
        //     //         vm.popup = true;
        //     //         vm.poPage = "testfail";
        //     //     })
        //     // }
        // },

        retest() {
            var vm = this;
            // vm.voltest = true;
            vm.popup = false;
            vm.poPage = "";
            vm.testing = false;
            vm.gameStart = false;
        },

        selLv(lv) {
            var vm = this;
            vm.level = lv;
            vm.getToken().then(function(){
                vm.game();
            })
            // vm.stepPage = "voltest";
        },

        playagain() {
            var vm = this;
            vm.good = 0;
            vm.miss = 0;
            vm.deScore = 600; //聲音基準
            vm.comment = "";
            vm.gamecom = "";
            vm.gameStart = false;
            // vm.stepPage = "voltest";
            vm.getToken().then(function(){
                vm.game();
            })
        },

        golotter() {
            var vm = this;
            vm.fbshare();
            if(!vm.hasMobile) {
                vm.stepPage = "loydata";
            } else {
                vm.stepPage = "done";
            }
        }, 

        conplay() {
            var vm = this;
            window.location.href = "./game.html";
        },

        fbLogin() {
            var vm = this;
            if(vm.failBro) {
                alert("您所使用的瀏覽器可能無法正常瀏覽網頁以及遊玩遊戲。若想體驗完整的活動網頁請您使用(Safari、Chrome、edge、firefox)瀏覽器開啟")
                return
            }
            vm.popup = true;
            vm.loading = true;
            FB.login(function(res){
                // console.log(res);
                if (res.status === 'connected') {
                    vm.fbData.fbtoken = res.authResponse.accessToken;
                    vm.fbData.fbId = res.authResponse.userID;
                    FB.api('/me','GET',{"fields":"id,name,picture"},
                        function(apires) {
                            // console.log(apires);
                            vm.fbData.fbName = apires.name;
                            vm.fbData.fbPic = 'http://graph.facebook.com/'+ apires.id +'/picture?width=300&height=300';
                            vm.getToken().then(function() {
                                vm.getLevel().then(function(res) {
                                    if(res.data.level == 2) {
                                        vm.lock.game2 = false;
                                    }
                                    if(res.data.level == 3) {
                                        vm.lock.game2 = false;
                                        vm.lock.game3 = false;
                                    }
                                    vm.stepPage = "selgame";
                                    vm.loading = false;
                                    vm.popup = false;
                                })
                            })
                        }
                    );
                } else {
                    vm.popup = false;
                    vm.loading = false;
                }
            })
        },

        getLevel() {
            var vm = this;
            var post_data = {
                "token" : vm.fbData.fbtoken
            }
            return $.ajax({
                url: `${friendo_url}Comebest2020CNY/level`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "GET",
                dataType: "json"
            }).done(function(res){
                // console.log("Level",res);
                
            });
        },

        game() {
            var vm = this;
            var post_data = new FormData();
            post_data.append("token",vm.fbData.fbtoken);
            post_data.append("round",vm.level);
            return $.ajax({
                url: `${friendo_url}Comebest2020CNY/game`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                processData: false,
                contentType: false,
                // dataType: "json"
            }).done(function(res){
                // console.log("play",res);
                vm.gameCode = res.data.gameCode;
                vm.stepPage = "voltest";
            });
        },

        record() {
            var vm = this;
            // var post_data = new FormData();
            // post_data.append("gameCode",vm.gameCode);
            // post_data.append("result",vm.gameresult);
            var post_data = {
                "gameCode": vm.gameCode,
                "result": vm.gameresult
            }
            return $.ajax({
                url: `${friendo_url}Comebest2020CNY/record`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                // processData: false,
                // contentType: false,
                // contentType: "application/json",
                dataType: "json"
            }).done(function(res){
                // console.log("record",res);
                vm.hasMobile = res.data.hasMobile;
                // vm.stepPage = "voltest";
            });
        },

        postData() {
            var vm = this;
            // var post_data = new FormData();
            // post_data.append("token",vm.fbData.fbtoken);
            // post_data.append("mobile",vm.userPhone);
            var post_data = {
                "gamecode": vm.gameCode,
                "mobile": vm.userPhone,
                "captcha": vm.reCaptcha
            }
            return $.ajax({
                url: `${friendo_url}Comebest2020CNY/data`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                // processData: false,
                // contentType: false,
                dataType: "json"
            }).done(function(res){
                // console.log("postData",res);
                if(res.success) {
                    vm.stepPage = "done";
                    vm.popup = false;
                    vm.loading = false;
                }
            });
        },

        goData() {
            var vm = this;
            if(!vm.loading) {
                vm.popup = true;
                vm.loading = true;
                var mobile_rule = /^09[0-9]{8}$/;
                if(vm.userPhone == "" || !vm.userPhone.match(mobile_rule)) {
                    alert("請輸入手機正確格式");
                    vm.loading = false;
                    vm.popup = false;
                    return
                }
                vm.getToken().then(function(){
                    vm.grecaptcha("game").then(function() {
                        vm.postData()
                    })
                })
            }
            
        },

        //===舊版備份===//
        handleSuccess(stream) {
            var vm = this;
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            // var player = document.getElementById('player');
            // var btnStart = document.getElementById('btnStart');
            var s = document.getElementById('s');
            var p = document.getElementById('p');
            var d = document.getElementById('d');
            for(var i=0; i<16; i++){
                d.innerHTML += '<div></div>';
            }
            var dd = document.querySelectorAll('#d div');
            var context = new AudioContext();
            var microphone = context.createMediaStreamSource(stream);

            var recorder = new Recorder(microphone);
            recorder.record();

            // function forceSafariPlayAudio() {
            //     player.load(); // iOS 9   還需要額外的 load 一下, 否則直接 play 無效
            //     player.play(); // iOS 7/8 僅需要 play 一下
            //     // alert("55555555");
            // }
            // player.addEventListener('play', function() {
            //     // 當 audio 能夠播放後, 移除這個事件
            //     btnStart.removeEventListener('touch', forceSafariPlayAudio, false);
            //     btnStart.removeEventListener('click', forceSafariPlayAudio, false);
            // }, false);

            // btnStart.addEventListener('touch', forceSafariPlayAudio, false);
            // btnStart.addEventListener('click', forceSafariPlayAudio, false);
            // player.play();
            // player.volume = 0.2;

            var analyser = context.createAnalyser();
            microphone.connect(analyser);
            // analyser.connect(context.destination);
            analyser.fftSize = 32;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Uint8Array(analyser.fftSize);

            if(window.innerWidth < 768) {
                document.getElementsByClassName("front")[0].style = "top: 60px";
                document.getElementsByClassName("back")[0].style = "top: 60px";
                document.getElementsByClassName("mask").style = "width: 0";
            } else {
                document.getElementsByClassName("front")[0].style = "top: 160px";
                document.getElementsByClassName("back")[0].style = "top: 160px";
                document.getElementsByClassName("mask").style = "width: 0";
            }
            var timeArr = [];
            var speed = 0;
            var sSec = 0;
            var lvTime;
            if(vm.lvpage == 1) {
                speed = '3.25s';
                sSec = 3250;
                lvTime = sSec*8+500;
            }
            if(vm.lvpage == 2) {
                speed = '2.00s';
                sSec = 2000;
                lvTime = sSec*12+500;
            };
            if(vm.lvpage == 3) {
                speed = '1.70s';
                sSec = 1700;
                lvTime = sSec*12+500;
            };
            document.getElementsByClassName("mask")[0].style = "width: 100%; transition: "+speed+" linear";
            for(let i=0; i<document.getElementsByClassName("mask").length; i++) {
                var line = 1;
                timeArr.push(setTimeout(function() {
                    // console.log(i+1);
                    document.getElementsByClassName("mask")[i].style = "width: 100%; transition: "+speed+" linear";
                    if(window.innerWidth < 768) {
                        if(i>=line) {
                            document.getElementsByClassName("front")[0].style = "top: "+(60-(49*(i+1-line)))+"px; transition: 1.5s linear";
                            document.getElementsByClassName("back")[0].style = "top: "+(60-(49*(i+1-line)))+"px; transition: 1.5s linear";
                        }
                    } else {
                        if(i>=line) {
                            document.getElementsByClassName("front")[0].style = "top: "+(160-(65*(i+1-line)))+"px; transition: 1.5s linear";
                            document.getElementsByClassName("back")[0].style = "top: "+(160-(65*(i+1-line)))+"px; transition: 1.5s linear";
                        }
                    }
                },sSec*i+1));
            };

            var gameTime = setTimeout(function(){
                stopGame();
                vm.gameresult = true;
                vm.getToken().then(function(){
                    vm.record();
                })
                // vm.comment = "遊戲結束";
                // vm.stepPage = "success";
            },lvTime);

            update(); 
            var timer;
            var total = 0;
            var cun = 0;
            function update(){
                // console.log(dataArray);
                analyser.getByteFrequencyData(dataArray);
                timer = setTimeout(update, 200);
                var sum = 0;
                for(var j=0; j<16; j++){
                    dd[j].style.height = dataArray[j]+'px';
                    // dd[j].style.background = 'rgba('+(255-j)+','+j*2+',0,1)';
                    dd[j].style.background = 'rgba(154,106,184,0.8)';
                    sum += dataArray[j];
                }
                // console.log("sum", sum);
                total += sum;
                // console.log("total",total);
                if(sum < vm.deScore) {
                    // cun += 1;
                    vm.miss += 1;
                    vm.good = 0;
                } else {
                    // cun = 0;
                    vm.miss = 0;
                    vm.good += 1;
                }
                // if(vm.good >= 10) {
                //     vm.comment = "nice";
                // }
                if(vm.good >= 20) {
                    vm.gamecom = "good";
                    vm.comment = "images/game-good.png";
                }
                if(vm.good >= 40) {
                    vm.gamecom = "perefect";
                    vm.comment = "images/game-perefect.png";
                }
                if(vm.miss >= 8) {
                    vm.gamecom = "miss";
                    vm.comment = "images/game-miss.png";
                }
                if(vm.miss >= 16) {
                    vm.gamecom = "bad";
                    vm.comment = "images/game-bad.png";
                }
                // if(vm.miss >= 25) {
                //     // alert("失敗");
                //     stream.getTracks().forEach(function(track){
                //         track.stop();
                //     });
                //     clearTimeout(timer);
                //     clearTimeout(gameTime);
                //     timeArr.forEach(function(timer){
                //         clearTimeout(timer);
                //     });
                //     for(var j=0; j<16; j++){
                //         dd[j].style.height = 0 +'px';
                //         dd[j].style.transition = "0.6s";
                //         d.innerHTML = "";
                //     }
                //     dd = [];
                //     // recorder.stop();
                //     // recorder.clear();
                //     vm.gameresult = false;
                //     vm.record();
                //     vm.stepPage = "fail";
                //     return
                // }
            };

            function stopGame() {
                stream.getTracks().forEach(function(track){
                    track.stop();
                });
                clearTimeout(timer);
                for(var j=0; j<16; j++){
                    dd[j].style.height = 0 +'px';
                    dd[j].style.transition = "0.6s";
                    d.innerHTML = "";
                }
                dd = [];
                // recorder.stop();
                // createDownloadLink();
                // recorder.clear();
                vm.stepPage = "success";
            };

            s.onclick = function(){
                stopGame();
                // shouldStop = true;
            };

            function createDownloadLink(){
                recorder.exportWAV(function(blob) {
                    var url = URL.createObjectURL(blob);
                    var li = document.createElement('li');
                    var au = document.createElement('audio');
                    var hf = document.createElement('a');
                    
                    au.controls = true;
                    au.src = url;
                    hf.href = url;
                    hf.download = new Date().toISOString() + '.wav';
                    hf.innerHTML = hf.download;
                    li.appendChild(au);
                    li.appendChild(hf);
                    recordingslist.appendChild(li);
                });
            }
        },

        mediaTest(stream) {
            var vm = this;
            vm.testing = true;
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            // var player = document.getElementById('player');
            var d = document.getElementById('d');
            for(var i=0; i<16; i++){
                d.innerHTML += '<div></div>';
            }
            var dd = document.querySelectorAll('#d div');

            var context = new AudioContext();
            var microphone = context.createMediaStreamSource(stream);

            var analyser = context.createAnalyser();
            microphone.connect(analyser);
            // analyser.connect(context.destination);
            analyser.fftSize = 32;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Uint8Array(analyser.fftSize);


            update();
            var timer;
            var total = 0;
            var cun = 0;
            function update(){
                // console.log(dataArray);
                analyser.getByteFrequencyData(dataArray);
                timer = setTimeout(update, 200);
                var sum = 0;
                for(var j=0; j<16; j++){
                    dd[j].style.height = dataArray[j]+'px';
                    // dd[j].style.background = 'rgba('+(255-j)+','+j*2+',0,1)';
                    dd[j].style.background = 'rgba(154,106,184,0.8)';
                    sum += dataArray[j];
                }
                cun++;
                // console.log("sum", sum);
                total += sum;
                // console.log("total",total);
                vm.deScore = Math.round(total/cun);
            };
            
            setTimeout(function(){
                stream.getTracks().forEach(function(track){
                    track.stop();
                });
                clearTimeout(timer);
                vm.testing = false;
                for(var j=0; j<16; j++){
                    dd[j].style.width = 0 +'px';
                    dd[j].style.transition = "0.6s";
                    d.innerHTML = "";
                }
                dd = [];
                // if(vm.deScore < 200) {
                //     vm.popup = true;
                //     vm.poPage = "testfail";
                // } else {
                vm.stepPage = "game";
                if(vm.level == 1) {
                    vm.lvpage = 1;
                    vm.popup = true;
                    vm.poPage = "testsuc";
                    vm.song = "迎財神"
                }
                if(vm.level == 2) {
                    vm.lvpage = 2;
                    vm.popup = true;
                    vm.poPage = "testsuc";
                    vm.song = "財運爆"
                }
                if(vm.level == 3) {
                    vm.lvpage = 3;
                    vm.popup = true;
                    vm.poPage = "testsuc";
                    vm.song = "好運到"
                }
                // }
            },10000) //testtime
        },

        startGame() {
            var vm = this;
            var player = document.getElementById('player');
            player.volume = 0.2;
            player.play();
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            var cun = 3;
            vm.popup = false;
            vm.poPage = "";
            vm.gameStart = true;
            var recun = setInterval(function(){
                cun--;
                document.getElementById('sec').innerHTML = cun;
            },1000)
            setTimeout(function(){
                vm.gameStart = false;
                clearInterval(recun);
                if(navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                    .then(vm.handleSuccess)
                    .catch(function(err){
                        // console.log(err.name + ": " + err.message);
                        vm.popup = true;
                        vm.poPage = "testfail";
                    })
                } else {
                    navigator.getUserMedia({ audio: true, video: false }, vm.handleSuccess, function(){
                        // console.log("error");
                        vm.popup = true;
                        vm.poPage = "testfail";
                    })
                }
            },3000)
        },

        testStart() {
            var vm = this;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            if(navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ audio: true, video: false, muted: true })
                .then(vm.mediaTest)
                .catch(function(err){
                    // console.log(err.name + ": " + err.message);
                    vm.popup = true;
                    vm.poPage = "testfail";
                })
            } else {
                navigator.getUserMedia({ audio: true, video: false, muted: true }, vm.mediaTest, function(){
                    // console.log("error");
                    vm.popup = true;
                    vm.poPage = "testfail";
                })
            }
        },

    },
    mounted: function() {
        var vm = this;
        // console.log("v947");
        // vm.handleSuccess()
        $("body").loadpage("init",{async : false});
        document.getElementsByClassName("nav")[0].style = "display: none";
        document.getElementsByClassName("footer")[0].style = "display: none";

        vm.getIe();
        vm.checkBrowser();
        alert("活動已結束 感謝您的參與");
        window.location.href = "./index.html";

        // $('.slickarea').slick({
        //     dots: false,
        //     infinite: true,
        //     speed: 300,
        //     slidesToShow: 1,
        //     centerMode: true,
        //     variableWidth: true,
        //     arrows: true,
        //     draggable: false,
        // });


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
})
