var index_view = new Vue({
    el: "#app",
    data: {
        gamePop: false,
        exPop: false,
        eggPop: false,
        prodsPop: false,
        perdataPop: null,  // 填寫表單
        kvideoPop: false,
        finishPop: false,
        joinedPop: false,
        rolePop: false,
        awardPop: false,
        video_step: 0,
        room: null,
        timeout: null,
        timer: 60,
        opening: false,
        window_close:false,
        sec:3,
        token: "",
        probability: 0,
        base64Img: "",
        capKey: "",
        inputCap: "",
        inputName: "",
        inputMobile: "",
        inputEmail: "",
        luckyAward: 0,
        awardItem: "",
        mute:true,
        checkagree: false,
        checkwish: false,
        lonely: null,
        room_domain: 'https://node-carrefour201901.azurewebsites.net', //'https://node-carrefour201901.azurewebsites.net' https://carrefour201901.herokuapp.com
        game: {
            prodPop:false
        }
    },
    methods: {
        windowScroll: function () {
            var vm = this;
            $(window).scroll(function () {
                var windowScrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
                var stopHeight = $('#easter-egg-title').offset().top;
                if (windowScrollTop > stopHeight - vm.navHeight + 30) {
                    vm.stopIssue(".nav", stopHeight - vm.navHeight - 120);
                    vm.stopIssue(".window", stopHeight - vm.navHeight - 120);
                } else {
                    vm.overStopIssue(".nav");
                    vm.overStopIssue(".window");
                }
            });
        },
        gameOpen: function () { 
            if (this.endDate()) {
                alert('活動已結束，2/28前將於活動網站公布得獎名單');
                return;
            }
            this.gamePop = true;
            this.navIssue();
            this.clearData()
        },
        allPopupClose: function () {
            var vm = this;
            vm.gamePop = false;
            vm.exPop = false;
            vm.eggPop = false;
            vm.prodsPop = false;
            vm.kvideoPop = false;
            vm.finishPop = false;
            vm.joinedPop = false;
            vm.rolePop = false;                   
            vm.awardPop = false;                   
            vm.game.prodPop = false;
            vm.perdataPop = null;
        },
        navIssue: function () {
            var issue = $("nav").hasClass('upissue');
            if (issue) {
                $("nav").removeClass('upissue');
            } else {
                $("nav").addClass('upissue');
            }
        },
        awardIssue: function () {
            window.alert('得獎名單將於2019/2/28前公布，敬請期待。');
        },
        step_next: function (val) { 
            this.video_step = val;
        },
        stopIssue: function (item, height) {
            $(item).addClass('active');
            $(item).css('top', height);
        },
        overStopIssue: function (item) {
            $(item).removeClass('active');
            $(item).css('top', 0);
        },
        createRoom: function () {
            if (this.endDate()) {
                alert('活動已結束，2/28前將於活動網站公布得獎名單');
                return;
            }
            var urlQuery = document.location.search.substr(1),
                search = "",
                room_id = guid();
            if (urlQuery != "") {
                if (!urlQuery.match(/roomId/g)) {
                    search = `${urlQuery}&roomId=${room_id}`
                } else {
                    search = `${urlQuery.split('roomId=')[0].replace(/&^/,'')}&roomId=${room_id}`;
                }
            } else {
                search = `roomId=${room_id}`
            }
            window.history.replaceState(null, document.title, `?${search}`);
            this.room = new Rooms({
                gtm_event: this.gaEvant,
                domain: this.room_domain,
                nextStep: this.step_next,
            });
            this.awardItem = "0";
        },
        setTimer: function () { 
            var vm = this;
            vm.timer = 60;
            clearInterval(vm.timeout);
            vm.timeout = setInterval(function () {
                vm.timer--;
            }, 1000);
        },
        video_start: function () {
            this.room.video_start();
        },
        eggRandom(x) {
            Math.floor(Math.random()*x);
        },
        videoPlay: function (index) {
            var vm = this;
            var videoId = vm.video_link[index - 1];
            vm.kvideoPop = true;
            kvideo.loadVideoById(videoId);
            kvideo.unMute();
            kvideo.playVideo();
            // vm.popupOpen();
        },
        videoPlayLink: function () {
            var vm = this;
            vm.kvideoPop = true;
        },
        videoClose: function (index) {
            var vm = this;
            vm.kvideoPop = false;
            kvideo.stopVideo();
            vm.popupClose();
        },
        roomConnet: function () {
            this.room.connect()
        },
        video_mute: function () {
            if (this.room.player) {
                this.mute = !this.mute;
                if (this.room.player.isMuted()) {
                    this.room.player.unMute();
                } else {
                    this.room.player.mute();
                }
            }
        },
        video_done: function () {
            this.room.player.seekTo(117)
        },
        video_play: function () {
            this.room.player.playVideo();
        },
        video_close: function () {
            this.room.socket.disconnect();
            this.room = null;
            window.history.replaceState(null, document.title, document.location.search.split('roomId')[0]);
        },
        lonely_play: function () {
            var vm = this;
            vm.room.socket.disconnect();
            vm.lonely = new YT.Player('lonely--player', {
                height: '100%',
                width: '100%',
                videoId: '2zO2qzehf1A',
                playerVars: {
                    'controls': 0,
                    'disablekb': 1,
                    'rel': 0,
                    'enablejsapi': 1,
                    'showinfo': 0,
                    'iv_load_policy': 3,
                    'modestbranding': 1,
                    'playlist': '',
                    'start': 3,
                    'playsinline': 1
                },
                events: {
                    'onReady': function (e) {
                        e.target.unMute();
                        e.target.playVideo();
                    },
                    'onStateChange': function (event) {
                        if (event.data == YT.PlayerState.ENDED) {
                            vm.step_next(4);
                            vm.lonely = null;
                        }
                    }
                }
            });
            console.log(vm.lonely)
        },
        lonely_close: function () {
            this.lonely.stopVideo();
            $("#lonely--player").remove();
            $(".lonely-content").append("<div id='lonely--player'/>");
            this.lonely = null;
            this.video_close();
        },
        open_video_form: function () {
            var vm = this;
            vm.getToken().then(function (res) {
                vm.token = res.token;
                vm.perdataPop = 'room';
                vm.room = null;
                vm.saveCaptcha();
            });
        }
    },
    watch: {
        video_step: function (newVal) {
            var vm = this;
            switch (newVal) {
                case 1:
                    vm.$nextTick(function () {
                        if (vm.room.status === null) {
                            // vm.room.connect();
                        }
                        vm.room.createQR();
                        if(vm.room.keyman) {
                            vm.setTimer();
                        }
                    })
                    break;
                case 2:
                    vm.$nextTick(function () {
                        clearInterval(vm.timeout);
                        vm.room.YTinit();
                    })
                    break;
                case 3:
                    vm.$nextTick(function () {
                        vm.room.video_cut = 1;
                        vm.sec = 3;
                        $(".controll").addClass("start");
                        var sec_down = setInterval(() => {
                            // console.log(vm.room.width)
                            vm.sec--;
                            if (vm.sec <= 0) {
                                clearInterval(sec_down)
                                $(".controll").removeClass("start");
                                setTimeout(function() {
                                    vm.room.video_cut = 2;
                                    vm.room.status = 'playing'
                                    if (vm.room.player.seekTo) {
                                        vm.room.player.seekTo(0, true);
                                    } else {
                                        vm.room.player.playVideo();
                                    }
                                }, 300);
                            }
                        }, 1500);
                    })
                    break;
                case 4:
                    vm.room.socket.disconnect();
                    break;
            }
        },
        timer: function (val) {
            if (val <= 0) {
                clearInterval(this.timeout);
                this.timer = 60;
                this.room.close();
            }
        },
        room: {
            deep: true,
            handler: function (obj) {
                var vm = this;
                if (obj){
                    if (obj.status == "room_over") {
                        // console.log('%cuser full', 'color:red;');
                        alert('影廳人數已滿，無法加入');
                        vm.room.socket.disconnect();
                        vm.room = null;
                    }
                    if (obj.status == "wait") {
                        vm.video_step = 1;
                    }
                    if (obj.status == "before_play") {
                        // vm.video_step = 2;
                    }
                    if (obj.status === null) {
                        vm.video_step = 0;
                    }
                    $("body").addClass('_freeze');
                } else {
                    if (vm.timeout) {
                        clearInterval(vm.timeout);
                    }
                    $("body").removeClass('_freeze');
                    $('html, body').scrollTop($("#kv-bottom").offset().top - 50);
                }
            }
        }
    },
    computed: {
        sortClass: function () {
            return {
                'center': this.room.sort == 0,
                'left': this.room.sort == 1,
                'right': this.room.sort == 2
            }
        },
        videoClass: function () {
            return {
                'word': this.video_step == 0 || this.video_step == 4 ,
                'join': this.video_step == 1,
                'play': this.video_step == 2,
            }
        },
        mediaStyle: function () {
            return {
                'width': `${this.room.width}px`
            }
        },
        borderStyle: function () {
            return {
                'border-width': `${this.room.width / 2}px`
            }
        }
    },
    mounted: function () {
        var vm = this;
        // $(".loading-page").addClass('none');
        // window fixed
        vm.showProj();
        // vm.saveCaptcha();
        if (findGetParameter("roomId")) {
            vm.room = new Rooms({
                gtm_event: vm.gaEvant,
                domain: vm.room_domain,
                nextStep: vm.step_next,
            });
            vm.awardItem = "0";
            vm.roomConnet();
        }
        vm.isPC = false;
        $("#video-group").slick({
            centerMode: true,
            variableWidth: true,
            autoplay: true,
            autoplaySpeed: 2000,
            pauseOnHover: false,
            pauseOnFocus: false,
            arrows: false,
        });
        $("#game-slick").slick({
            centerMode: true,
            variableWidth: true,
            autoplay: true,
            autoplaySpeed: 2000,
            pauseOnHover: false,
            pauseOnFocus: false,
            arrows: false,
        });
        var windowLeft = document.getElementById('window-loading-left');
        var windowRight = document.getElementById('window-loading-right');
        windowLeft.classList.add('active');
        windowRight.classList.add('active');

        // setTimeout(function(){
        //     vm.game = new Gmaes({
        //         probability : vm.probability,
        //     });
        // },1000)
        vm.awardPop = true; vm.popupOpen();
    }
})
