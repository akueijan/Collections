var index_view = new Vue({
    el: "#app",
    data: {
        memberInfo: {
            monsterId: "",
            isReached: null,
            cellNO: "",
            name: "",
            actId: 0
        },
        memberId: "",
        code: "",
        score: 0, // 0
        hasResultRecord: false, // false
        clickCun: 0,
        isReached: false,
        isNewscore: false,
        time: {
            min: 0,
            sec: 0,
            milli: 0
        },
        besttime: {
            min: 0,
            sec: 0,
            milli: 0
        },
        bestScore: 0,
        userRank: 0,
        rank: {},
        ranking: [],
        rankArr: [],
        retry: false,
        pages: "kv", // kv game success sucagain fail ranking
        lottiepath: ["./static/lottie/QM_CNY_2.json","./static/lottie/QM_CNY_3.json"][Math.floor(Math.random()*2)],
        lottie: 1,
        randomtxt: "",
        recun: 0,
    },
    methods: {
        cunClick(el) {
            el.preventDefault();

            this.clickCun += 1;
            // let clickCun = 0;

            let clock = document.querySelector(".clock");
            let progress = document.querySelector(".progress");

            clock.style.left = 7 + (77/100)*this.clickCun + "%";
            progress.style.width = (84/100)*this.clickCun + "%";
            if(this.clickCun >= 33) {
                this.lottie = 2
            }
            if(this.clickCun >= 66) {
                this.lottie = 3
            }
            if(this.clickCun >= 99) {
                this.clickCun = 100;
            }
        },
        reciprocal() {
            const vm = this;
            vm.recun = 3;
            setTimeout(() => {
                vm.recun = 2;
                setTimeout(() => {
                    vm.recun = 1;
                    setTimeout(() => {
                        vm.gameStart()
                    }, 1000)
                }, 1000)
            }, 1000)
        },
        randomWord() {
            const vm = this;
            let randomArr = ["再讓我多睡一下","ZZZ...","呼...呼...","好睏呀......","真的好累......","好冷好想睡......"];
            vm.randomtxt = randomArr[Math.floor(Math.random()*randomArr.length)];
            let randomInterval = setInterval(() => {
                vm.randomtxt = randomArr[Math.floor(Math.random()*randomArr.length)];
                if(vm.clickCun >= 33) {
                    randomArr = ["怎麼一直睡不好","不要吵啦.....","好癢呀！","是什麼東西一直嗡嗡叫......","還不想起床......","再給我五分鐘啦！"]
                }
                if(vm.clickCun >= 66) {
                    randomArr = ["咦...到底誰在吵我睡覺...","叫不醒我就要繼續睡囉～","以為這樣就能叫醒我嗎..."]
                }
                if(vm.clickCun >= 100) {
                    clearInterval(randomInterval);
                    randomArr = ["哇嗚~喚醒Q摸年獸","恭喜發財~牛來運轉","可愛的Q摸送你一個紅包"];
                    vm.randomtxt = randomArr[Math.floor(Math.random()*randomArr.length)];
                }
            }, 3000);
        },
        gameStart() {
            const vm = this;
            vm.popup = false;
            vm.popPage = "";

            let clickTarget = document.querySelector(".clickarea");
            // clickTarget.addEventListener('click', vm.cunClick, false);
            clickTarget.addEventListener('touchstart', vm.cunClick, false);

            vm.randomWord();

            // function timecun() {
            //     vm.score += 1;
            //     window.requestAnimationFrame(timecun);
            // };

            // window.requestAnimationFrame(timecun);

            let gameCun = setInterval(() => {
                vm.score += 3;
                vm.time.milli = parseInt(vm.score.toString().slice(-2));
                vm.time.sec = parseInt(vm.score / 100) - parseInt(vm.score / 6000)*60;
                vm.time.min = parseInt(vm.score / 6000);
                if(vm.time.milli < 10) {
                    vm.time.milli = "0" + vm.time.milli
                } else {
                    vm.time.milli = "" + vm.time.milli
                }
                if(vm.time.sec < 10) {
                    vm.time.sec = "0" + vm.time.sec
                } else {
                    vm.time.sec = "" + vm.time.sec
                }
                // vm.time.milli += 1;
                // if(vm.time.milli < 10) {
                //     vm.time.milli = "0", vm.time.milli
                // }
                // if(vm.score%100 == 0) {
                //     vm.time.milli = "0" + 0;
                // }

                if(vm.clickCun >= 99) {
                    clearInterval(gameCun);
                    // alert("遊戲成功");
                    clickTarget.removeEventListener('touchstart', vm.cunClick, false);
                    vm.gaEvent("遊戲成功");
                    vm.hasResultRecord = true;
                    // vm.gameRecord();
                    // vm.retry = true;
                    document.querySelector(".gamemonster svg").remove();
                    let ani = lottie.loadAnimation({
                        wrapper: document.querySelector('.gamemonster'),
                        animType: 'svg',
                        loop: false,
                        path: "./static/lottie/QM_CNY_5.json",
                    });
                    ani.addEventListener('complete', function() {
                        // ani.removeEventListener('complete');

                        vm.pages = "sucagain";
                        vm.$nextTick(() => {
                            lottie.loadAnimation({
                                wrapper: document.querySelector('.monster'),
                                animType: 'svg',
                                loop: true,
                                path: './static/lottie/QM_CNY_5.json'
                            });
                        })

                        // vm.gameRecord().then(() => {
                        //     if(vm.isReached) {
                        //         vm.pages = "sucagain";
                        //         vm.$nextTick(() => {
                        //             lottie.loadAnimation({
                        //                 wrapper: document.querySelector('.monster'),
                        //                 animType: 'svg',
                        //                 loop: true,
                        //                 path: './static/lottie/QM_CNY_5.json'
                        //             });
                        //         })
                        //     } else {
                        //         vm.pages = "success";
                        //         vm.$nextTick(() => {
                        //             lottie.loadAnimation({
                        //                 wrapper: document.querySelector('.monster'),
                        //                 animType: 'svg',
                        //                 loop: true,
                        //                 path: './static/lottie/QM_CNY_5.json'
                        //             });
                        //         })
                        //     }
                        // });
                    })
                }
                if(parseInt(vm.score / 6000) >= 3) {
                    clearInterval(gameCun);
                    // alert("遊戲失敗");
                    clickTarget.removeEventListener('touchstart', vm.cunClick, false);
                    vm.gaEvent("遊戲失敗")
                    vm.hasResultRecord = false;

                    vm.pages = "fail";
                    vm.$nextTick(() => {
                        let patharr = ["./static/lottie/QM_CNY_2.json", "./static/lottie/QM_CNY_3.json"];
                        lottie.loadAnimation({
                            wrapper: document.querySelector('.monster'),
                            animType: 'svg',
                            loop: true,
                            path: patharr[Math.floor(Math.random()*2)]
                        });
                    })

                    // vm.gameRecord().then(() => {
                    //     vm.pages = "fail";
                    //     vm.$nextTick(() => {
                    //         let patharr = ["./static/lottie/QM_CNY_2.json", "./static/lottie/QM_CNY_3.json"];
                    //         lottie.loadAnimation({
                    //             wrapper: document.querySelector('.monster'),
                    //             animType: 'svg',
                    //             loop: true,
                    //             path: patharr[Math.floor(Math.random()*2)]
                    //         });
                    //     })
                    // })
                }
            }, 30);
        },
        gameRetry() {
            const vm = this;
            vm.score = 0;
            vm.clickCun = 0;
            vm.time.min = 0;
            vm.time.sec = 0;
            vm.time.milli = 0;
            vm.recun = 0;
            // vm.retry = false;
            vm.beforeGame();
        },
        postMember() {
            const vm = this;

            let data = {
                monsterId: vm.memberInfo.monsterId,
                // monsterId: "70516c33-69a9-41ae-83e6-074e8741b17c",
                isReached: vm.memberInfo.isReached,
                mobile: vm.memberInfo.cellNO,
                name: vm.memberInfo.name,
                actId: vm.memberInfo.actId
                // actId: 252
            };
            console.log(data)
            return new Promise(resolve => {
                vm.projApi.post("Monster2021CNY/member", data)
                    .then(res => {
                        console.log('postMember: ', res);
                        vm.memberId = res.data.memberId;
                        resolve();
                    })
                    .catch(err => {
                        console.log('postMembererr: ', err);
                    })
            })
        },
        beforeGame() {
            const vm = this;
            vm.togame();

            // vm.popup = true;
            // vm.popPage = "loading";

            // vm.postMember().then(() => {
            //     let data = {
            //         memberId: vm.memberId
            //     }
            //     // let memberId = vm.memberId
            //     vm.projApi.post("Monster2021CNY/before/game", data).then(res => {
            //         console.log('beforeGame: ', res);
            //         vm.code = res.data.code;
            //         vm.popup = false;
            //         vm.popPage = "";
            //         vm.togame();
            //     })
            // })

        },
        gameRecord() {
            const vm = this;

            let data = {
                memberId: vm.memberId,
                code: vm.code,
                score: vm.score,
                hasResultRecord: vm.hasResultRecord
            }
            return new Promise(resolve => {
                vm.projApi.post("Monster2021CNY/game", data).then(res => {
                    console.log('gameRecord: ', res);
                    vm.isReached = res.data.isReached;
                    // vm.isReached = false;
                    vm.isNewscore = res.data.isNewScore;
                    vm.bestScore = res.data.bestScore;
                    vm.besttime.min = "" + parseInt(vm.bestScore / 6000);
                    vm.besttime.sec = parseInt(vm.bestScore / 100);
                    if(vm.besttime.sec < 10) {
                        vm.besttime.sec = "0" + vm.besttime.sec
                    } else {
                        vm.besttime.sec = "" + vm.besttime.sec
                    };
                    vm.besttime.milli = parseInt(vm.bestScore.toString().slice(-2));
                    if(vm.besttime.milli < 10) {
                        vm.besttime.milli = "0" + vm.besttime.milli;
                    } else {
                        vm.besttime.milli = "" + vm.besttime.milli;
                    }
                    resolve();
                })
            })
        },
        getRanking() {
            const vm = this;

            vm.pages = "ranking";
            let tempArr = [];
            for(let i=0; i<10; i++) {
                let temp = {};
                temp.name = "aaa"+i;
                temp.mobile = "09XXXXXXX"+i;
                temp.rank = i+1;
                temp.milli = "0"+i;
                temp.sec = "0"+i;
                temp.min = "0";
                vm.rankArr.push(temp);
            }
            // vm.$nextTick(() => {
            //     if(vm.userRank <= 100) {
            //         vm.scrolltoUser();
            //     }
            // })

            // vm.popup = true;
            // vm.popPage = "loading";
            // vm.postMember().then(() => {
            //     vm.projApi.get(`Monster2021CNY/ranking/${vm.memberId}`).then(res => {
            //         console.log('getRanking: ', res);
            //         vm.rank = res.data;
            //         let tempArr = vm.rank.resultDtos;
            //         console.log(tempArr)
            //         for(let i=0; i<tempArr.length; i++) {
            //             let min;
            //             let sec;
            //             let milli;
            //             let temp = {
            //                 name: "",
            //                 mobile: "",
            //                 rank: 0,
            //                 milli: 0,
            //                 sec: 0,
            //                 min: 0,
            //             };
            //             min = parseInt(tempArr[i].score/6000);
            //             sec = parseInt(tempArr[i].score/100) - min*60;
            //             milli = parseInt(tempArr[i].score.toString().slice(-2));
            //             if(milli < 10) {
            //                 milli = "0" + milli;
            //             }
            //             if(sec < 10) {
            //                 sec = "0" + sec;
            //             }
            //             temp.name = tempArr[i].name;
            //             temp.mobile = tempArr[i].mobile;
            //             temp.rank = tempArr[i].rank;
            //             temp.milli = "" + milli;
            //             temp.sec = "" + sec;
            //             temp.min = "" + min;
            //             vm.rankArr.push(temp);
            //         };
            //         vm.besttime.min = parseInt(vm.rank.bestRecord / 6000);
            //         vm.besttime.sec = parseInt(vm.rank.bestRecord / 100) - vm.besttime.min*60;
            //         if(vm.besttime.sec < 10) {
            //             vm.besttime.sec = "0" + vm.besttime.sec
            //         } else {
            //             vm.besttime.sec = "" + vm.besttime.sec
            //         }
            //         vm.besttime.milli = parseInt(vm.rank.bestRecord.toString().slice(-2));
            //         if(vm.besttime.milli < 10) {
            //             vm.besttime.milli = "0" + vm.besttime.milli;
            //         } else {
            //             vm.besttime.milli = "" + vm.besttime.milli;
            //         }
            //         vm.besttime.min = "" + vm.besttime.min;
            //         vm.pages = "ranking";
            //         vm.$nextTick(() => {
            //             vm.popup = false;
            //             vm.popPage = "";
            //             if(vm.userRank <= 100) {
            //                 vm.scrolltoUser();
            //             }
            //         })
            //     })
            // })
        },
        postGivebox() {
            const vm = this;
            vm.popup = true;
            vm.popPage = "loading";
            let data = {
                memberId: vm.memberId
            }
            vm.projApi.post("Monster2021CNY/giveBox", data)
            .then(res => {
                console.log('postGivebox: ', res);
                if(res.code == 200) {
                    vm.popup = false;
                    vm.popPage = "";
                    if (/(iPhone|iPad|iPod|iOS|iPhone Simulator)/i.test(navigator.userAgent)) {
                        window.webkit.messageHandlers.doStuffMessageHandler.postMessage({
                            "url": "http://official.friendo.com.tw/",
                            "event": 1,
                            "btn_text": "去首頁",
                            "act_transfer": {
                                "page_no": "A01",
                                "url": "https://goo.gl/forms/hu7YrYCYYI4D57Nn2",
                                "title": "",
                                "act_id": 0
                            }
                        });
                    } else if (/(Android)/i.test(navigator.userAgent)) {
                        qmonster.transfer('{"url": "http://official.friendo.com.tw/","event": 1,"btn_text": "去首頁","act_transfer": {"page_no": "A01","url":"https://goo.gl/forms/hu7YrYCYYI4D57Nn2","title": "","act_id": 0}}');
                    }
                } else {
                    alert("哎呀！回到怪獸的通道好像故障了！請拉掉APP並重新開啟，就可以成功領獎囉！");
                    vm.popup = false;
                    vm.popPage = "";
                }
            })
            .catch(err => {
                console.log("postGiveboxErr: ", err);
                alert("哎呀！回到怪獸的通道好像故障了！請拉掉APP並重新開啟，就可以成功領獎囉！");
                vm.popup = false;
                vm.popPage = "";
            })
        },
        togame() {
            const vm = this;
            vm.popup = true;
            vm.popPage = "gamealert";
            vm.pages = "game";
            vm.$nextTick(() => {
                lottie.loadAnimation({
                    wrapper: document.querySelector('.gamemonster'),
                    animType: 'svg',
                    loop: true,
                    path: vm.lottiepath
                });
            })
        },
        kvAni() {
            const vm = this;
            let sec = 0.3;
            let tl = gsap.timeline({duration: 1})

            tl.from('.kv .kvslogn', {
                duration: sec*2,
                y: +50,
                opacity: 0
            })
            tl.from('.kv .kvtxt', {
                duration: sec*2,
                y: +50,
                opacity: 0
            }, "-=0.3")
            tl.from('.kv .kvmonster', {
                duration: sec,
                y: +50,
                opacity: 0
            })
            tl.from('.kv .btnarea', {
                duration: sec,
                y: +50,
                opacity: 0
            })
            tl.from('.kv .deco', {
                duration: sec*2,
                opacity: 0
            }, "-=0.3")
            tl.from('.kv .btnreadme', {
                duration: sec*2,
                opacity: 0
            }, "-=0.6")
        },
        scrolltoUser() {
            const vm = this;
            let el = document.querySelector(".highline")
            let height = el.offsetTop - el.offsetHeight;
            // console.log(height);
            document.querySelector(".ranking ul").scrollTo(0, height);
        }
    },
    watch: {
        // lottie: function(val) {
        //     const vm = this;
        //     let elpath;
        //     let gameloop;
        //     document.querySelector(".gamemonster svg").remove();
        //         setTimeout(()=> {
        //             lottie.loadAnimation({
        //                 wrapper: document.querySelector('.gamemonster'),
        //                 animType: 'svg',
        //                 loop: gameloop,
        //                 path: elpath,
        //             });
        //         }, 100);
        //     switch (val) {
        //         case 2:
        //             elpath = './static/lottie/QM_CNY_2.json';
        //             gameloop = true;
        //             // complete = "";
        //             break;
        //         case 3:
        //             elpath = './static/lottie/QM_CNY_3.json';
        //             gameloop = true;
        //             // complete = "";
        //             break;
        //         default:
        //             break;
        //     }
        // }
    },
    created: function() {
        const vm = this;

        vm.memberInfo.monsterId = findGetParameter("member_id");
        vm.memberInfo.isReached = findGetParameter("is_reached")===("false") ? false : true;
        vm.memberInfo.cellNO = findGetParameter("cell_no");
        vm.memberInfo.name = findGetParameter("name");
        vm.memberInfo.actId = parseInt(findGetParameter("act_id"));

        // if(vm.memberInfo.monsterId == "" || vm.memberInfo.monsterId == null) {
        //     alert("OOPS~非正常通道進入");
        //     location.href = "https://friendo.page.link/zLH4";
        // };
    },
    mounted: function() {
        // this.projApi.post(uri, data)  //Ex
        const vm = this;

        // vm.postMember(); 
        if(vm.pages=="kv") {
            lottie.loadAnimation({
                wrapper: document.querySelector('.kvmonster'),
                animType: 'svg',
                loop: true,
                path: './static/lottie/QM_CNY_1.json'
            });
        };
        vm.kvAni();
        // document.querySelector(".ranking").scrollTo(0, 700);
    }
})
