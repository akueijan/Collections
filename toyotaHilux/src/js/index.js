var index_view = new Vue({
    el: "#app",
    data: {
        page: "kv", //kv game result info
        step: "", //ready start
        question: "", //que1~6
        resultArr: [
            [
                {
                    word: "大哥…你這駕照一定是用<br>烤得油滋滋的雞腿換來的吧？",
                    img: "images/result-11.png",
                    title: "烤雞腿大師",
                    fraction: "你的駕駛技術低於全台 99% 的人",
                    fbLink: "https://result.friendo.com.tw/FB1PA"
                },
                {
                    word: "看來上帝為你關起了一扇門 : 車門。",
                    img: "images/result-12.png",
                    title: "上帝眷顧的人",
                    fraction: "你的駕駛技術低於全台 99% 的人",
                    fbLink: "https://result.friendo.com.tw/FB1PB"
                }
            ],
            [
                {
                    word: "比起高超的技術，<br>你可能更需要高額的保費",
                    img: "images/result-9.png",
                    title: "高額要保人",
                    fraction: "你的駕駛技術低於全台 87% 的人",
                    fbLink: "https://result.friendo.com.tw/FB2PA"
                },
                {
                    word: "路上的三寶飯，想必都出自您手？",
                    img: "images/result-10.png",
                    title: "燒臘店主廚",
                    fraction: "你的駕駛技術低於全台 87% 的人",
                    fbLink: "https://result.friendo.com.tw/FB2PB"
                }
            ],
            [
                {
                    word: "比起方向盤，<br>你好像比較適合洗碗盤？",
                    img: "images/result-7.png",
                    title: "專業洗碗工",
                    fraction: "你的駕駛技術低於全台 66% 的人",
                    fbLink: "https://result.friendo.com.tw/FB3PA"
                },
                {
                    word: "關於「車」這件事<br>你還是下象棋就好",
                    img: "images/result-8.png",
                    title: "高階象棋棋手",
                    fraction: "你的駕駛技術低於全台 66% 的人",
                    fbLink: "https://result.friendo.com.tw/FB3PB"
                }
            ],
            [
                {
                    word: "人要比車兇，全台你最兇！",
                    img: "images/result-5.png",
                    title: "皮卡界SKY葛格",
                    fraction: "你的駕駛技術超過全台 66% 的人",
                    fbLink: "https://result.friendo.com.tw/FB4PA"
                },
                {
                    word: "憑你的技術<br>當個外送員挺剛好的，是吧？",
                    img: "images/result-6.png",
                    title: "專業外送員",
                    fraction: "你的駕駛技術超過全台 66% 的人",
                    fbLink: "https://result.friendo.com.tw/FB4PB"
                }
            ],
            [
                {
                    word: "開車的技術就像唐老大一樣風騷！",
                    img: "images/result-3.png",
                    title: "台灣唐老大",
                    fraction: "你的駕駛技術超過全台 87% 的人",
                    fbLink: "https://result.friendo.com.tw/FB5PA"
                },
                {
                    word: "送豆腐算什麼？<br>皮卡界的藤原拓海就是你！",
                    img: "images/result-4.png",
                    title: "皮卡界拓海哥",
                    fraction: "你的駕駛技術超過全台 87% 的人",
                    fbLink: "https://result.friendo.com.tw/FB5PB"
                }
            ],
            [
                {
                    word: "老司機都不夠看<br>你是萬中無一的越野老司機！",
                    img: "images/result-1.png",
                    title: "越野老司機",
                    fraction: "你的駕駛技術超過全台 99% 的人",
                    fbLink: "https://result.friendo.com.tw/FB6PA"
                },
                {
                    word: "正港民間車神<br>車神只是兩個字，卻跟了你一輩子！",
                    img: "images/result-2.png",
                    title: "正港民間車神",
                    fraction: "你的駕駛技術超過全台 99% 的人",
                    fbLink: "https://result.friendo.com.tw/FB6PB"
                }
            ],
        ],
        result: {},
        resultMan: "",
        videoIntro: false,
        videoPlay: false,
        userScore: 0,
        agreeArr: [],
        userInfo: {
            name: "",
            gender: "",
            age: 0,
            mobile: "",
            email: "",
            agree: false
        },
        // fbLink: "",

    },
    methods: {
        kv_Ani() {
            var vm = this;
            // 順序先出現字
            var sec = 0.3;
            var tl = new TimelineMax({delay: 1.2}, );
            tl.set(".kv .warning",{
                opacity: 1,
            })
            tl.set(".kv .warning",{
                opacity: 0.4,
            },"+=0.1")
            tl.set(".kv .warning",{
                opacity: 1,
            },"+=0.1")
            tl.set(".kv .warning",{
                opacity: 0.4,
            },"+=0.1")
            tl.to(".kv .fogleft", sec*3, {
                x: -150,
                scale: 1.5,
                opacity: 0,
            },"+=0.3")
            tl.to(".kv .fogright", sec*3, {
                x: 150,
                scale: 1.5,
                opacity: 0,
            },"-=0.9")
            tl.from(".kv .slogn", sec, {
                x: -50,
                opacity: 0,
            })
            tl.from(".kv .desc", sec, {
                x: -50,
                opacity: 0,
            })
            tl.from(".kv .acbtn", sec, {
                x: -50,
                opacity: 0,
            })
            tl.to(".kv .warning", sec*2, {
                opacity: 1,
            })
            tl.set(".kv .car",{
                className: "+=car-active"
            },"-=0.6")
            tl.set(".kv .underline", {
                className: "+=udline-active"
            })
            tl.set(".kv .warning",{
                className: "+=warning-active"
            })
            // tl.set(".warning", 1.2, {
            //     // scale: 0.5,
            //     y: -1000,
            //     opacity: 0,
            // })
        },

        game_Ani() {
            var vm = this;

            var sec = 0.3;
            var tl = new TimelineMax();
            tl.to(".question .quebox", sec, {
                opacity: 1,
            })
            // tl.from(".question .head", sec, {
            //     opacity: 0,
            //     // y: 50
            // })
        },

        createVideo(videoSrc, name, target) {
            var vm = this;
            return new Promise(function (relove) {
                var video = document.createElement("video");
                video.src = videoSrc;
                video.autoplay = false;
                video.muted = true;
                video.volume = 0.3;
                // video.setAttribute("controls",""); 
                video.setAttribute("playsinline","");
                video.setAttribute("id", name);
    
                document.getElementById(target).appendChild(video);
                relove()
            })
        }, 

        removeVideo(id) {
            var vm = this;

            document.getElementById(id).remove();
        },

        play(step) {
            var vm = this;

            vm.videoPlay = true;
            // for(let i = 0; i < documenp[;t.querySelectorAll("video").length; i++) {
            //     document.querySelectorAll("video")[i].play();
            // }
            document.querySelectorAll("video")[1].style = "transform: scale(0.3) translate(5%, -20%)";

            switch(step) {
                case 1:
                    vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-lv2-out.mp4", "video3", "videoarea2");
                    vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-lv2-in.mp4", "video4", "videoarea2");
                    document.querySelectorAll("video")[1].onended = function() {
                        vm.videoPlay = false;
                        setTimeout(function(){
                            // vm.popup = true;
                            // vm.popPage = "poploading";
                            vm.loading = true;
                            vm.loadPage = "poploading";
                            setTimeout(function() {
                                vm.nextPage(1);
                            }, 600)
                        }, 600)
                    }
                    break;
                case 2:
                    vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-lv3-out.mp4", "video5", "videoarea3");
                    vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-lv3-in.mp4", "video6", "videoarea3");
                    document.querySelectorAll("video")[1].onended = function() {
                        vm.videoPlay = false;
                        setTimeout(function(){
                            // vm.popup = true;
                            // vm.popPage = "poploading";
                            vm.loading = true;
                            vm.loadPage = "poploading";
                            setTimeout(function() {
                                vm.nextPage(2);
                            }, 600)
                        }, 600)
                    }
                    break;
                case 3:
                    vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-lv4-out.mp4", "video7", "videoarea4");
                    vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-lv4-in.mp4", "video8", "videoarea4");
                    document.querySelectorAll("video")[1].onended = function() {
                        vm.videoPlay = false;
                        setTimeout(function(){
                            // vm.popup = true;
                            // vm.popPage = "poploading";
                            vm.loading = true;
                            vm.loadPage = "poploading";
                            setTimeout(function() {
                                vm.nextPage(3);
                            }, 600)
                        }, 600)
                    }
                    break;
                case 4:
                    vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-lv5-out.mp4", "video9", "videoarea5");
                    vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-lv5-in.mp4", "video10", "videoarea5");
                    document.querySelectorAll("video")[1].onended = function() {
                        vm.videoPlay = false;
                        setTimeout(function(){
                            // vm.popup = true;
                            // vm.popPage = "poploading";
                            vm.loading = true;
                            vm.loadPage = "poploading";
                            setTimeout(function() {
                                vm.nextPage(4);
                            }, 600)
                        }, 600)
                    }
                    break;
                case 5:
                    vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-lv6-out.mp4", "video11", "videoarea6");
                    vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-lv6-in.mp4", "video12", "videoarea6");
                    document.querySelectorAll("video")[1].onended = function() {
                        vm.videoPlay = false;
                        setTimeout(function(){
                            // vm.popup = true;
                            // vm.popPage = "poploading";
                            vm.loading = true;
                            vm.loadPage = "poploading";
                            setTimeout(function() {
                                vm.nextPage(5);
                            }, 600)
                        }, 600)
                    }
                    break;
                case 6:
                    document.querySelectorAll("video")[1].onended = function() {
                        vm.videoPlay = false;
                        // vm.popup = true;
                        // vm.popPage = "poploading";
                        vm.loading = true;
                        vm.loadPage = "poploading";
                        setTimeout(function(){
                            vm.loading = false;
                            vm.loadPage = "";
                        },1000)
                        vm.page = "result";
                        vm.step = "";
                        vm.question = "";
                        vm.removeOrientation();

                        if(vm.userScore == 0) {
                            vm.userScore = 1;
                        }
                        if(vm.userScore <= 3) {
                            vm.resultMan = "images/result-man-low.png";
                        } else {
                            vm.resultMan = "images/result-man-high.png";
                        }
                        vm.result = vm.resultArr[vm.userScore-1][Math.floor(Math.random() * 2)];
                    }
                default:
                    break;
            };
        },

        introPlay(video) {
            var vm = this;

            return new Promise(function(relove) {
                document.getElementById(video).oncanplay = function() {
                    // console.log(onprogress)
                    vm.popup = false;
                    vm.popPage = "";
                };
                document.getElementById(video).oncanplay();
                relove();
            })
        },

        canPlay(videoId_1,videoId_2) {
            var vm = this;
            
            return new Promise(function(relove) {
                var canplay1 = false;
                var canplay2 = false;
                // document.getElementById(videoId).oncanplay = function() {
                //     vm.popup = false;
                //     vm.popPage = "";
                //     // document.getElementById(videoId).play();
                // };
                // document.getElementById(videoId).oncanplay();
                var can1 = new Promise(function(relove) {
                    document.getElementById(videoId_1).oncanplay = function() {
                        canplay1 = true;
                    };
                    document.getElementById(videoId_1).oncanplay();
                    relove()
                });
                var can2 = new Promise(function(relove) {
                    document.getElementById(videoId_2).oncanplay = function() {
                        canplay2 = true;
                    };
                    document.getElementById(videoId_2).oncanplay();
                    relove()
                })
                Promise.all([can1,can2]).then(function() {
                    if(canplay1 && canplay2) {
                        vm.loading = false;
                        vm.loadPage = "";
                    }
                })
                relove();
            })
        },

        nextPage(step) {
            var vm = this;

            switch(step) {
                case 1:
                    vm.removeVideo("videoarea");
                    vm.question = "que2";
                    setTimeout(function() {
                        vm.canPlay("video3","video4");
                    }, 1000)
                    break;
                case 2:
                    vm.removeVideo("videoarea2");
                    vm.question = "que3";
                    setTimeout(function() {
                        vm.canPlay("video5","video6");
                        vm.gameDrag(3);
                    }, 1000)
                    break;
                case 3:
                    vm.removeVideo("videoarea3");
                    vm.question = "que4";
                    setTimeout(function() {
                        vm.canPlay("video7","video8");
                    }, 1000)
                    break;
                case 4:
                    vm.removeVideo("videoarea4");
                    vm.question = "que5";
                    setTimeout(function() {
                        vm.gameDrag(5);
                        vm.canPlay("video9","video10");
                    }, 1000)
                    break;
                case 5:
                    vm.removeVideo("videoarea5");
                    vm.question = "que6";
                    setTimeout(function() {
                        vm.gameDrag(6);
                        vm.canPlay("video11","video12");
                    }, 1000)
                    break;
                default:
            };
        },

        onOrientationchange() {
            var vm = this;

            if (window.orientation === 180 || window.orientation === 0) {
                // alert("直式")
                vm.alertPopup = true;
                vm.alertPage = "alert";
                vm.toggleFullScreen(false);
                for(let i = 0; i < document.querySelectorAll("video").length; i++) {
                    document.querySelectorAll("video")[i].pause();
                }
            }
            if (window.orientation === 90 || window.orientation === -90 ){
                // alert("橫式")
                vm.alertPopup = false;
                vm.alertPage = "";
                // document.body.requestFullscreen();
                if(!vm.question == "") {
                    vm.toggleFullScreen(true);
                }
                document.getElementsByClassName("levelpage")[0].scrollTo(0,10);
                window.scrollTo(0,10);
                if(vm.videoIntro) {
                    document.getElementById("video_intro").play();
                    // console.log("play");
                } 
                if(vm.videoPlay) {
                    // for(let i = 0; i < document.querySelectorAll("video").length; i++) {
                    //     document.querySelectorAll("video")[i].play();
                    // }
                    for(let i = 0; i < 2; i++) {
                        document.querySelectorAll("video")[i].play();
                    }
                }
                // for(let i = 0; i < document.querySelectorAll("video").length; i++) {
                //     document.querySelectorAll("video")[i].play();
                // }
            } 
        },

        checkOrientation() {
            var vm = this;
            window.addEventListener("orientationchange",vm.onOrientationchange ,false);
        },

        removeOrientation() {
            var vm = this;
            window.removeEventListener("orientationchange",vm.onOrientationchange ,false);
        },

        //===強制全螢幕===//
        toggleFullScreen(horizontal) {
            var vm = this;

            var doc = window.document;
            var docEl = doc.documentElement;

            var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
            var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

            if(horizontal) {
                // requestFullScreen.call(docEl);
                if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                    requestFullScreen.call(docEl);
                }
            } else {
                // if(doc.fullscreenElement && doc.mozFullScreenElement && doc.webkitFullscreenElement && doc.msFullscreenElement) {
                //     cancelFullScreen.call(doc);
                // }
                cancelFullScreen.call(doc);
            }
            // if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            //     requestFullScreen.call(docEl);
            // }
            // else {
            //     cancelFullScreen.call(doc);
            // }
        },

        togame() {
            var vm = this;

            vm.gaEvent("btn_首頁_立即挑戰","click");
            // vm.gtmEvent("btn_首頁_立即挑戰");
            // $(".kv .acbtn").css("transform","scale(1.05)");
            // $(".kv .acbtn").css("transition","0.6s");
            // setTimeout(function(){
                
            // },600)
            vm.alertPopup = true;
            vm.alertPage = "alert";
            setTimeout(function() {
                vm.popup = true;
                vm.popPage = "save";
                vm.page = "game";
                vm.step = "ready";
                vm.checkOrientation();
                setTimeout(function() {
                    vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-intro.mp4", "video_intro", "videoarea0")
                    // console.log(document.getElementById('video_intro').volume)
                },50)
            },600)
        },

        gameStrat() {
            var vm = this;
            var readyStart = new Date(2020, 6, 29, 17, 59, 59);
            // var readyStart = new Date(2020, 6, 28, 17, 59, 59);
            var now = new Date()
            if(now > readyStart) {
                vm.checkFb();
            } else {
                alert("活動將於18:00正式開始");
                location.reload();
            }
        },

        checkFb() {
            var vm = this;
            var u = navigator.userAgent;
            var ua = navigator.userAgent.toLowerCase();
            var isFbApp = u.indexOf("FB") > -1; // FB App 內建瀏覽器
            if(isFbApp) {
                // vm.alertPopup = true;
                // vm.alertPage = "oops";
                // vm.gaEvent("FB瀏覽器不支援橫向操作","event");
                // vm.gtmEvent("FB瀏覽器不支援橫向操作");

                vm.fbStart();
            } else {
                vm.togame();
                // vm.fbStart();
            }
        },

        savebtn() {
            var vm = this;

            vm.gaEvent("btn_線上安全同意書_確定","click");
            // vm.gtmEvent("btn_線上安全同意書_確定");
            var ansArr = [];
            if(vm.savecheck.q1 == 0 || vm.savecheck.q2 == 0 || vm.savecheck.q3 == 0) {
                vm.popup = true;
                vm.popPage = "fail";
            } else {
                if(vm.savecheck.q1 == 2 && vm.savecheck.q2 == 2 && vm.savecheck.q3 == 2) {
                    vm.popup = false;
                    vm.popPage = "";
                    vm.page = "game";
                    vm.step = "ready";
                    setTimeout(function() {
                        vm.gameReady();
                    }, 50)
                } else {
                    if(vm.savecheck.q1 == 1) {
                        ansArr.push(vm.savecheck.q1);
                    }
                    if(vm.savecheck.q2 == 1) {
                        ansArr.push(vm.savecheck.q2);
                    }
                    if(vm.savecheck.q3 == 1) {
                        ansArr.push(vm.savecheck.q3);
                    }
                    // console.log(ansArr.length)
                    switch(ansArr.length) {
                        case 1:
                            if(vm.savecheck.q1 == 1) {
                                vm.warning = 1;
                            }
                            if(vm.savecheck.q2 == 1) {
                                vm.warning = 2;
                            }
                            if(vm.savecheck.q3 == 1) {
                                vm.warning = 3;
                            }
                            break;
                        case 2:
                        case 3:
                            vm.warning = 4;
                            break;
                        default:
                            break;
                    };
                    vm.popPage = "warning";
                }
            }
        },

        failbtn() {
            var vm = this;

            vm.popup = true;
            vm.popPage = "save";
        },

        warningbtn() {
            var vm = this;

            vm.gaEvent("btn_線上安全同意書_確定","click");
            // vm.gtmEvent("btn_線上安全同意書_確定");
            vm.popup = false;
            vm.popPage = "";
            // vm.page = "game";
            // vm.step = "ready";
            // document.getElementById("video_intro").muted = false;
            setTimeout(function() {
                vm.gameReady();
            }, 50)
        },

        gameReady() {
            var vm = this;

            Draggable.create("#car", {
                type: "x",
                edgeResistance: 1,
                dragResistance: 0.6,
                bounds: ".carbox",
                inertia: true,
                onDragStart: function () {
                    $(".ready .car").addClass("car-active");
                    $(".ready .arr").css("display","none");
                    document.getElementById("video_intro").muted = false;
                },
                onClick: function () {
                },
                onDragEnd: function () {
                    $(".ready .car").addClass("car-run");
                    vm.gaEvent("btn_迴力車出發","click");
                    // vm.gtmEvent("btn_迴力車出發");
                    vm.introPlay("video_intro").then(function(){
                        document.getElementById("video_intro").pause();
                    })
                    setTimeout(function () {
                        vm.step = "start";
                        setTimeout(function () {
                            vm.gameLevel_1();
                            var ua = navigator.userAgent.toLowerCase();
                            var isFbApp = ua.indexOf("fb") > -1; // FB App 內建瀏覽器
                            if (!isFbApp)
                                vm.toggleFullScreen(true);
                        }, 300)
                    }, 1200)
                }
            });
        },

        gameLevel_1() {
            var vm = this;
            // document.getElementsByClassName("levelpage")[0].scrollTo(0,10);
            vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-lv1-out.mp4", "video1", "videoarea");
            vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-lv1-in.mp4", "vidoe2", "videoarea");
            setTimeout(function() {
                document.getElementById("video_intro").play();
                // document.getElementById("video_intro").muted = false;
                // vm.canPlay("video_intro")
                // console.log("play")
                // setTimeout(function() {
                //     document.getElementById("video_intro").play();
                // },1000)
                vm.videoIntro = true;
            }, 700);
            document.getElementById("video_intro").onended = function() {
                vm.videoIntro = false;
                vm.removeVideo("videoarea0");
                setTimeout(function() {
                    vm.question = "que1";
                    // document.querySelectorAll("#videoarea vidoe").stop();
                    // document.getElementById("video1").pause();
                    // document.getElementById("video2").pause();
                    setTimeout(function () {
                        vm.game_Ani();
                        // $(".question .quebox").css("opacity","1")
                        vm.gameDrag(1);
                        setTimeout(function() {
                            // document.getElementsByClassName("levelpage")[0].scrollTo(0,10);
                            // window.scrollTo(0,10);
                        }, 100)
                    }, 600)
                }, 600)
            }
        },

        gameDrag(que) {
            var vm = this;

            // var rotationSnap = 60;
            var rotationSnap = 72;
            var rotation;
            Draggable.create("#rotabox", {
                type: "rotation",
                inertia: true,
                throwProps: true,
                liveSnap:{
                    rotation: function(value) {
                        rotation = Math.round(value / rotationSnap) * rotationSnap;
                        return Math.round(value / rotationSnap) * rotationSnap;
                    }
                },
                onDrag:function() {
                    // console.log(rotation)
                    if(rotation % 360 == 72 || rotation % 360 == -288) {
                        $(".sel1 p").css("color","#ffffff")
                    } else {
                        $(".sel1 p").css("color","#707070")
                    }
                    if(rotation % 360 == 144 || rotation % 360 == -216) {
                        $(".sel2 p").css("color","#ffffff")
                    } else {
                        $(".sel2 p").css("color","#707070")
                    }
                    if(rotation % 360 == 216 || rotation % 360 == -144) {
                        $(".sel3 p").css("color","#ffffff")
                    } else {
                        $(".sel3 p").css("color","#707070")
                    }
                },
                onDragEnd: function () {
                    // console.log(rotation);
                    // 判斷對錯 呼叫答案popup
                    if(que == 1) {
                        vm.gameAns.txt = "遭遇濕滑陡坡時，應選擇";
                        vm.gameAns.keyword = "L4低速四輪傳動";
                        if(rotation % 360 == 216 || rotation % 360 == -144) {
                            vm.gaEvent("btn_關卡1_按下選項","click");
                            // vm.gtmEvent("btn_關卡1_按下選項");
                            vm.popup = true;
                            vm.question = "";
                            vm.popPage = "correct";
                            vm.userScore += 1;
                            setTimeout(function(){
                                vm.correctBtn(1);
                            },50)
                        }
                        if(rotation % 360 == 72 || rotation % 360 == 144 || rotation % 360 == -288 || rotation % 360 == -216) {
                            vm.gaEvent("btn_關卡1_按下選項","click");
                            // vm.gtmEvent("btn_關卡1_按下選項");
                            vm.popup = true;
                            vm.question = "";
                            vm.popPage = "error";
                            setTimeout(function(){
                                vm.errorBtn(1);
                            },50)
                        }
                    } 
                    if(que == 3) {
                        vm.gameAns.txt = "輪胎陷入崎嶇路面時，應選擇";
                        vm.gameAns.keyword = "「L4低速四輪傳動」";
                        if(rotation % 360 == 216 || rotation % 360 == -144) {
                            vm.gaEvent("btn_關卡3_按下選項","click");
                            // vm.gtmEvent("btn_關卡3_按下選項");
                            vm.popup = true;
                            vm.question = "";
                            vm.popPage = "correct";
                            vm.userScore += 1;
                            setTimeout(function(){
                                vm.correctBtn(3);
                            },50)
                        }
                        if(rotation % 360 == 72 || rotation % 360 == 144 || rotation % 360 == -288 || rotation % 360 == -216) {
                            vm.gaEvent("btn_關卡3_按下選項","click");
                            // vm.gtmEvent("btn_關卡3_按下選項");
                            vm.popup = true;
                            vm.question = "";
                            vm.popPage = "error";
                            setTimeout(function(){
                                vm.errorBtn(3);
                            },50)
                        }
                    }
                    if(que == 5) {
                        vm.gameAns.txt = "在沙地高速行進時，應選擇";
                        vm.gameAns.keyword = "「H4 四輪高速傳動」";
                        if(rotation % 360 == 144 || rotation % 360 == -216) {
                            vm.gaEvent("btn_關卡5_按下選項","click");
                            // vm.gtmEvent("btn_關卡5_按下選項");
                            vm.popup = true;
                            vm.question = "";
                            vm.popPage = "correct";
                            vm.userScore += 1;
                            setTimeout(function(){
                                vm.correctBtn(5);
                            },50)
                        }
                        if(rotation % 360 == 72 || rotation % 360 == 216 || rotation % 360 == -216 || rotation % 360 == -144) {
                            vm.gaEvent("btn_關卡5_按下選項","click");
                            // vm.gtmEvent("btn_關卡5_按下選項");
                            vm.popup = true;
                            vm.question = "";
                            vm.popPage = "error";
                            setTimeout(function(){
                                vm.errorBtn(5);
                            },50)
                        }
                    }
                    if(que == 6) {
                        vm.gameAns.txt = "在沙坑360度甩尾，應選擇";
                        vm.gameAns.keyword = "「H2 高速二輪傳動」";
                        if(rotation % 360 == 72 || rotation % 360 == -288) {
                            vm.gaEvent("btn_關卡6_按下選項","click");
                            // vm.gtmEvent("btn_關卡6_按下選項");
                            vm.popup = true;
                            vm.question = "";
                            vm.popPage = "correct";
                            vm.userScore += 1;
                            setTimeout(function(){
                                vm.correctBtn(6);
                            },50)
                        }
                        if(rotation % 360 == 144 || rotation % 360 == 216 || rotation % 360 == -216 || rotation % 360 == -144) {
                            vm.gaEvent("btn_關卡6_按下選項","click");
                            // vm.gtmEvent("btn_關卡6_按下選項");
                            vm.popup = true;
                            vm.question = "";
                            vm.popPage = "error";
                            setTimeout(function(){
                                vm.errorBtn(6);
                            },50)
                        }
                    }
                }
            });
        },

        listbtn(ans) {
            var vm = this;

            if(vm.question == "que2") {
                vm.gameAns.txt = "欲確認是否有人或障礙物，應選擇";
                vm.gameAns.keyword = "「PVM環景影像輔助系統」";
                vm.gaEvent("btn_關卡2_按下選項","click");
                // vm.gtmEvent("btn_關卡2_按下選項");
                vm.popup = true;
                vm.question = "";
                if(ans == 4) {
                    vm.userScore += 1;
                    vm.popPage = "correct";
                    setTimeout(function(){
                        vm.correctBtn(2);
                    }, 50);
                } else {
                    vm.popPage = "error";
                    setTimeout(function() {
                        vm.errorBtn(2);
                    }, 50);
                }
            }

            if(vm.question == "que4") {
                vm.gameAns.txt = "後輪懸空時，應選擇";
                vm.gameAns.keyword = "「LOCK 後軸差速器鎖定」";
                vm.gaEvent("btn_關卡4_按下選項","click");
                // vm.gtmEvent("btn_關卡4_按下選項");
                vm.popup = true;
                vm.question = "";
                if(ans == 1) {
                    vm.userScore += 1;
                    vm.popPage = "correct";
                    setTimeout(function(){
                        vm.correctBtn(4);
                    }, 50);
                } else {
                    vm.popPage = "error";
                    setTimeout(function() {
                        vm.errorBtn(4);
                    }, 50);
                }
            }
        },

        correctBtn(stepVideo) {
            var vm = this;

            $(".correct .btn").click(function(){
                vm.popup = false;
                vm.popPage = "";
                setTimeout(function() {
                    for(let i = 0; i < document.querySelectorAll("video").length; i++) {
                        document.querySelectorAll("video")[i].play();
                        // document.querySelectorAll("video")[i].muted = false;
                    }
                    document.querySelectorAll("video")[0].muted = false;
                    vm.play(stepVideo);
                }, 600)
            })
        },

        errorBtn(stepVideo) {
            var vm = this;

            $(".error .btn").click(function(){
                vm.popup = false;
                vm.popPage = "";
                setTimeout(function() {
                    for(let i = 0; i < document.querySelectorAll("video").length; i++) {
                        document.querySelectorAll("video")[i].play();
                        // document.querySelectorAll("video")[i].muted = false;
                    }
                    document.querySelectorAll("video")[0].muted = false;
                    vm.play(stepVideo);
                }, 600)
            })
        },

        fbShare() {
            var vm = this;

            vm.gaEvent("btn_結果分享頁_立即分享","click");
            // vm.gtmEvent("btn_結果分享頁_立即分享");
            var fbhtml_url= vm.result.fbLink;
            if(vm.projectStatus == 3) {
                window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url+'&hashtag=%23Hilux壯遊行');
                window.location.href = "carowner.html";
            } else {
                vm.page = "info";
                window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url+'&hashtag=%23Hilux壯遊行');return false;
            }
            // var isIE=window.ActiveXObject || "ActiveXObject" in window;
        },

        infoSavedata() {
            var vm = this;

            var post_data = new FormData();
            post_data.append("mobile",vm.userInfo.mobile);
            post_data.append("name",vm.userInfo.name);
            post_data.append("age",vm.userInfo.age);
            post_data.append("gender",vm.userInfo.gender);
            post_data.append("email",vm.userInfo.email);
            post_data.append("reCaptcha",vm.reCaptcha);
            return $.ajax({
                // url: `${friendo_url}GetProjectInfo`,
                url: `${friendo_url}data`,
                headers: {
                    "Authorization": "Bearer " + vm.mainToken,
                },
                data: post_data,
                method: "POST",
                processData: false,
                contentType: false,
                // dataType: 'json'
            }).done(function (res) {
                // console.log(typeof res);
                vm.loading = false;
                vm.loadPage = "";
                vm.popup = true;
                vm.popPage = "done";
                // if (res == "success") {
                    
                // } else {
                //     console.log(res)
                // }
            })
        },

        userInfobtn() {
            var vm = this;
                // vm.loading = false;
                // vm.loadPage = "";
                // vm.popup = true;
                // vm.popPage = "done";
            var phone_rule = /^09[0-9]{8}$/;
            var email_rule = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]/
            if(!vm.loading) {
                if(vm.userInfo.name == "") {
                    alert('請輸入姓名');
                    return
                }
                if(vm.userInfo.gender == "") {
                    alert('請勾選性別');
                    return
                }
                if(vm.userInfo.age == 0) {
                    alert('請選擇年齡');
                    return
                }
                if (vm.userInfo.mobile == "" || !vm.userInfo.mobile.match(phone_rule)) {
                    alert('手機號碼 格式錯誤');
                    return
                }
                if(vm.userInfo.email == "" || !vm.userInfo.email.match(email_rule)) {
                    alert('email 格式錯誤');
                    return
                } 
                if (!vm.userInfo.agree) {
                    alert('請勾選同意條款');
                    return
                } else {
                    vm.loading = true;
                    vm.gaEvent("btn_留填資料頁_確認送出","click");
                    // vm.gtmEvent("btn_留填資料頁_確認送出");
                    vm.getToken().then(function() {
                        vm.grecaptcha("index").then(function() {
                            vm.infoSavedata();
                        })
                    })
                    // vm.getToken().then(function() {
                    //     vm.infoSavedata();
                    // })
                }
            }
        },

        creatAge() {
            var vm = this;
            for(let i=1; i<100; i++) {
                vm.agreeArr.push(i);
            }
        },

        fbStart() {
            var vm = this;

            var body = document.querySelector("body");
            body.classList.add("fbweb");

            vm.alertPopup = true;
            vm.alertPage = "oops";
            // this.$nextTick(function () {
            //     vm.popup = true;
            //     vm.popPage = "save";
            //     vm.page = "game";
            //     vm.step = "ready";
            //     // setTimeout(function () {
            //     //     vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-intro.mp4", "video_intro", "videoarea0")
            //     //     // console.log(document.getElementById('video_intro').volume)
            //     // }, 100)
            // })

            setTimeout(function () {
                vm.popup = true;
                vm.popPage = "save";
                vm.page = "game";
                vm.step = "ready";
                setTimeout(function() {
                    vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-intro.mp4", "video_intro", "videoarea0")
                },300)
                // console.log(document.getElementById('video_intro').volume)
            }, 300)
            // vm.page = "game";
            // vm.step = "start";
            // setTimeout(function(){
            //     vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-intro.mp4", "video_intro", "videoarea0");
            //     vm.introPlay("video_intro");
            //     vm.gameLevel_1();
            // },300)

        }
    },
    created: function() {
        var vm = this;

    },
    mounted: function() {
        var vm = this;
        // window.scrollTo(0,0);
        // $("body").loadpage("init", {async: false});

        vm.getToken();
        vm.checkBrower("index");
        vm.kv_Ani();

        // vm.creatAge();
        // console.log("瀏覽器: ",navigator.userAgent)
        // vm.createVideo("./static/youtube-test1.mp4", "vidoe1", "videoarea");
        // vm.createVideo("./static/youtube-test2.mp4", "video2", "videoarea");
        // vm.gameReady();
        // vm.createVideo("./static/video-lv2-out.mp4", "video3", "videoarea0");

        // vm.createVideo("https://toyotacdn.azureedge.net/event/HiluxMc/video-intro.mp4", "video_intro", "videoarea0")
        // vm.introPlay("video_intro")
        // vm.gameLevel_1()
    }
})
