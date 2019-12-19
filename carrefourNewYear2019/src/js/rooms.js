class Rooms {
    constructor(options) {        
        this.domain = options.domain;
        this.roomId = null;
        this.qrcode = {};
        this.socket = {};
        this.status = null;
        this.sort = null;
        this.user_count = 0;
        this.width = 0;
        this.keyman = false;
        this.player = null;
        this.check_event = null;
        this.video_cut = 1;
        this.wt = null;
        this.gtm = options.gtm_event || []
        this.nextStep = options.nextStep || function () { };
        this.YTlist = options.YTlist || ['I7dZ98TBXks', 'BG6FecSsBDw', 'BHJ3V18nusk']
        
    }

    connect() {
        try {
            if (this.socket.connected || this.status == 'connecting') {
                // console.log("socket connected or connecting")
                return 
            }
            // console.log('%csocket connect', 'color:green;');
            this.status = 'connecting';
            var _self = this;
            _self.roomId = findGetParameter("roomId");
            _self.socket = io(_self.domain);

            _self.socket.on('connect', function () {
                // console.log("%cio connect run....", 'color:green;');
                _self.socket.emit('join', _self.roomId, device)
            });
            _self.socket.on('disconnect', function () {
                console.warn('socket server disconnect')
                if (_self.status != 'played' && !(_self.status == 'playing' && _self.video_cut == 3)) {
                    _self.reset();
                }
            })
            _self.socket.on('events', function (server) {
                // console.log(`%cServer::`, 'color:green;', server);
                switch (server.event) {
                    case 'room_over':
                        // 影廳人數已滿，無法加入
                        _self.status = 'room_over';
                        break;
                    case 'user_full':
                        _self.status = 'before_play'
                        _self.user_count = server.user_count;
                        _self.sort = server.sort;
                        _self.width = server.room_width
                        var wiat_time = 20;
                        _self.wt = setInterval(function () {
                            var dc = false;
                            wiat_time--;
                            if (wiat_time < 5 && !dc) {
                                dc = true;
                                _self.socket.emit('video_check', _self.roomId);
                            }
                            if (wiat_time <= 0) {
                                alert('糟糕! 有人網路怪怪的!\n請保持最佳網速以享有流暢觀影體驗。')
                                clearInterval(_self.wt);
                                _self.reset();
                                _self.socket.disconnect();
                            }
                        }, 1000);
                        _self.nextStep(2);
                        break;
                    case 'user_count':
                        _self.user_count = server.user_count;
                        break;
                    case 'room_wait':
                        _self.status = 'wait'
                        _self.nextStep(1)
                        break;
                    case 'play_video':
                        _self.nextStep(3)
                        break;
                    case 'video_ready':
                        _self.status = 'video_ready';
                        if (_self.wt) {
                            clearInterval(_self.wt);
                        }
                        break;
                    case 'user_quit':
                        _self.status = 'wait'
                        _self.user_count = server.user_count;
                        _self.gtm("M秘映版_popup_有人先離開")

                        break;
                    case 'close_room':
                        if (_self.status == 'wait') {
                            _self.gtm('M秘映版_邀請逾時');
                            alert("邀請逾時，請重新揪團觀賞秘映劇場版!");
                        }
                        if (_self.status == 'video_ready'
                             || _self.status == 'before_play' || (_self.status == 'playing' && _self.video_cut != 3)) {
                            alert("唉呀! 您有朋友先行離場了\n本片需要三人到齊才能播映\n快揪好友再看一次搶抽一年份電影票!");
                        }
                        if (_self.status != 'played' && !(_self.status == 'playing' && _self.video_cut == 3)) {
                            _self.reset();
                        }
                        _self.socket.disconnect();
                        break;
                    case 'keyman':
                        _self.keyman = true;
                        break;
                }
            })
        } catch (err) {
            console.warn(err);
        }

    }
    reset() {
        console.warn('room restart');
        this.qrcode = {};
        this.status = null;
        this.sort = null;
        this.user_count = 0;
        this.keyman = false;
        this.player = null;
        this.nextStep(0);
        if (this.check_event) {
            clearInterval(this.check_event)
        }
        if (this.wt) {
            clearInterval(this.wt);
        }

    }
    YTinit() {
        // console.log('%cYT init', 'color:red;');
        var _self = this;
        var done = false;
        _self.player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: _self.YTlist[_self.sort], //x3bDhtuC5yk 3Y0Ut5ozaKs
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
                    e.target.playVideo();
                    e.target.mute();
                    _self.socket.emit('video_ready', _self.roomId);
                },
                'onError': function () {
                    // // console.log('%Error', event, 'background:red;');                
                },
                'onStateChange': function (event) {
                    // console.log('%cchange::', 'background:#ffff00;', event);
                    if (event.data == YT.PlayerState.BUFFERING) {
                         event.target.setPlaybackQuality('medium');
                    }
                    if (event.data == YT.PlayerState.PLAYING && !done) {
                        _self.check_event = setInterval(check_current, 1000);
                        done = true;
                    }
                    if (event.data == YT.PlayerState.ENDED) {
                        if (_self.status == 'playing') {
                            _self.status = 'played'
                            _self.nextStep(4);
                        } else {
                            alert("等待逾時，請重新揪團觀賞秘映劇場版!");
                            _self.reset();
                        }
                    }
                }
            }
        });

        function check_current() {
            var curr_sec = _self.player.getCurrentTime();
            if (curr_sec > 150 && _self.video_cut == 2 ) {
                _self.video_cut = 3;
                clearInterval(_self.check_event);
            }
        }

    }
    close() {
        this.socket.emit('close_room', this.roomId);
    }
    video_start() {
        this.socket.emit('play_click', this.roomId);
    }
    createQR() {
        this.qrcode = qrcode(0, 'M');
        this.qrcode.addData(`${window.location.origin}${window.location.pathname}?roomId=${this.roomId}`);
        this.qrcode.make();
        document.getElementById("qrcode").innerHTML = this.qrcode.createImgTag();
    }
}