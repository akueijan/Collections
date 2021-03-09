var index_view = new Vue({
    el: "#app",
    data: {
        step: 'kv' //kv aniplay linelogin logintest
    },
    methods: {
        getGuid() {
            const vm = this;

            // let friendo_url = document.getElementById("appjs").dataset.site;
            // this.projApi.post().then( res => {
            //     vm.guid = res.guid
            // });
            axios.post(`${vm.friendo_url}firework2021/code`)
                .then(function(res){
                    // console.log('getGuid: ',res)
                    vm.guid = res.data.data
                })
                .catch(function(err){
                    console.log(err)
                })
        },
        lineOpen() {
            const vm = this;
            vm.sendLoading = true;
            // client_id: 1511930966(測試)、1515344613 (正式)
            // redirect_url: https://tsdib-test.taishinbank.com.tw/TSDIB_RichartWeb_line/RC08/Line10(測試) https://richart.tw/TSDIB_RichartWeb/RC08/Line10(正式)

            // window.location = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${vm.client_Id}&redirect_uri=${vm.redirect_Url}&state=Richart2020-${vm.guid}&bot_prompt=normal&scope=openid%20profile`
            location.href = "award.html"
        },
        kvAni() {
            let sec = 0.3;
            let tl = gsap.timeline({duration: 1});

            tl.from('.kv .ballon', {
                duration: sec,
                opacity: 0
            })
            tl.from('.kv .deco', {
                duration: sec,
                opacity: 0
            }, "-=0.3")
            tl.from('.kv .cloud', {
                duration: sec*2,
                opacity: 0,
                scale: 0.8
            })
            tl.from('.kv .slogn', {
                duration: sec*2,
                opacity: 0,
                scale: 0.8
            }, "-=0.3")
            tl.from('.kv .acbtn', {
                duration: sec*2,
                opacity: 0,
                y: 50
            }, "-=0.3")
            tl.from('.kv .ft', {
                duration: sec*2,
                opacity: 0,
                y: 50
            }, "-=0.3")
        },
        playAni() {
            const vm = this;
            Draggable.create(".dragbox", {  // .playline
                type: "y", 
                edgeResistance: 1, 
                bounds: ".aniarea", // linearea
                dragResistance: 0.6,
                throwProps: true,
                inertia: true,
                onDragStart: function () {
                    clearTimeout(autoStart)
                    // console.log("start")
                    vm.gaEvant("互動頁_拉拉炮");
                    let tl = gsap.timeline();
                    document.querySelector(".playhand").style = "display: none";
                    document.querySelector(".playkv").style = "display: none";
                    // document.querySelector(".playitem").style = "transform: scaleY(0.8)";
                    tl.to(".playitem", {
                        duration: 0.3,
                        scaleY: 0.7
                    })
                    tl.to(".playback", {
                        duration: 0.3,
                        scaleY: 0.4,
                        y: +5
                    },"-=0.3")
                    tl.to(".playline", {
                        duration: 0.6,
                        // scaleY: 0.4,
                        y: +10
                    },"-=0.6")
                },
                onDragEnd: function () {
                    tranAni();
                },
            });

            let autoStart = setTimeout(()=> {
                vm.gaEvant("互動頁_拉拉炮");
                let tl = gsap.timeline();
                document.querySelector(".playhand").style = "display: none";
                document.querySelector(".playkv").style = "display: none";
                // document.querySelector(".playitem").style = "transform: scaleY(0.8)";
                tl.to(".playitem", {
                    duration: 0.6,
                    scaleY: 0.7
                })
                tl.to(".playback", {
                    duration: 0.6,
                    scaleY: 0.4,
                    y: +5
                },"-=0.6")
                tranAni();
            }, 3600);

            function tranAni() {
                document.querySelector('.aniarea .dragbox').style.display = "none"
                let tl = gsap.timeline({
                    onComplete: function() {
                        for(let i=1; i<4; i++) {
                            document.querySelector(`.aniarea .robbin-b-b${i}`).classList.add(`robbin-b-b${i}--active`);
                            document.querySelector(`.aniarea .robbin-b-w${i}`).classList.add(`robbin-b-w${i}--active`);
                            document.querySelector(`.aniarea .robbin-b-y${i}`).classList.add(`robbin-b-y${i}--active`);
                            document.querySelector(`.aniarea .robbin-b-r${i}`).classList.add(`robbin-b-r${i}--active`);
                        };
                
                        for(let i=1; i<10; i++) {
                            document.querySelector(`.aniarea .robbin-s-b${i}`).classList.add(`robbin-s-b${i}--active`);
                            document.querySelector(`.aniarea .robbin-s-w${i}`).classList.add(`robbin-s-w${i}--active`);
                            document.querySelector(`.aniarea .robbin-s-y${i}`).classList.add(`robbin-s-y${i}--active`);
                            document.querySelector(`.aniarea .robbin-s-r${i}`).classList.add(`robbin-s-r${i}--active`);
                        };
                        
                        setTimeout(()=> {
                            vm.happyNewYear();
                        }, 1200)
                    }
                });
                tl.to(".playline", {
                    duration: 0.6,
                    y: +750
                })
                // tl.to(".playitem", {
                //     duration: 0.9,
                //     scale: 1.2,
                // },"-=0.3")
                tl.to(".playitem", {
                    duration: 0.6,
                    // x: -260,
                    y: +250,
                    // rotation: 45
                })
                tl.to(".playback", {
                    duration: 0.6,
                    // x: -260,
                    y: +255,
                    // rotation: 45
                },"-=0.6")
                tl.to(".playitem", {
                    duration: 0.3,
                    scaleY: 1,
                },'+=0.3')
                tl.to(".playback", {
                    duration: 0.3,
                    scaleY: 1,
                    // y: -100
                },'-=0.3')
                tl.to(".aniarea .ballon", {
                    duration: 0.3,
                    opacity: 0,
                    // y: -50
                },'-=0.3')
                tl.to(".aniarea .robbinarea", {
                    duration: 0.3,
                    opacity: 1
                },'-=0.3')
            }
        },
        happyNewYear() {
            const vm = this;
            let tl = gsap.timeline({
                onComplete: function() {
                    // for(let i=1; i<9; i++) {
                    //     document.querySelector(`.fireworkarea .firework${i}`).classList.add(`firework${i}--active`);
                    // };
                    document.querySelector('.robbinrichart').classList.add('robbinrichart-active');
                    document.querySelector('.ballon2021').classList.add('ballon2021-active');
                    setTimeout(()=> {
                        vm.step = "linelogin";
                        setTimeout(()=> {
                            vm.sliderOpen();
                        }, 100)
                    }, 2400)
                }
            });
            let sec = 0.3
            tl.to(".playarea", {
                duration: sec,
                opacity: 0
            })
            tl.to(".playback", {
                duration: sec,
                opacity: 0
            },"-=0.3")
            tl.to(".aniarea .robbinarea", {
                duration: sec*3,
                opacity: 0,
                y: +150
            })
            tl.to(".happynewyear", {
                duration: sec*5,
                opacity: 1,
                y: 100
            },"-=0.6")
            for(let i=1; i<9; i++) {
                // document.querySelector(`.fireworkarea .firework${i}`).classList.add(`firework${i}--active`);
                tl.set(`.fireworkarea .firework${i}`, {
                    className: `+=firework firework${i} firework${i}--active`
                },"-=1.8")
            };
            // tl.set(".aniarea .robbinarea", {
            //     opacity: 0,
            // })
            // tl.set(".robbinrichart", {
            //     className: "robbinrichart robbinrichart-active"
            // })
            // tl.set(".ballon2021", {
            //     className: "ballon2021 ballon2021-active"
            // },"+=0.3")
        },
        openAward() {
            const vm = this;
            window.location = `https://sp-develop.azurewebsites.net/firework2021/award?User=${vm.guid}&Status=1`
        },
        togame() {
            const vm = this;
            vm.step = 'aniplay';
            document.querySelector('.nav').style.display = 'none';
            setTimeout(()=> {
                vm.playAni();
            }, 100);
        },
        sliderOpen() {
            const vm = this;
            let slider = tns({
                container: '.slickbd',
                controlsContainer: '.slickctr',
                prevButton: '.prev',
                nextButton: '.next',
                items: 1,
                startIndex: vm.startItem, //重0開始
                // slideBy: 'page',
                autoplay: true,
                controls: true,
                nav: false
            })
        },
        checkTime() {
            const vm = this;
            let now = new Date();
            let eventTime = new Date("2020/12/29 09:00:00");

            if(now < eventTime) {
                alert("活動尚未開始");
                return;
            } else {
                vm.togame();
            }
        }
    },
    created: function() {
        const vm = this;
        vm.checkbrowser();
        vm.checkWeek();
    },
    mounted: function() {
        const vm = this;
        // this.projApi.post(uri, data)  //Ex
        loadpage('init') 
        // vm.getGuid();
        vm.kvAni();
        // alert("活動已結束 感謝您的參與");
        // gsap.set(".playline",{transformOrigin: "bottom left"})
        // vm.playAni()
        // vm.sliderOpen() 
    }
})
