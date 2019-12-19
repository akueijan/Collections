class Game {
    constructor(options) {
        // this.ratio = (window.innerWidth >= window.innerHeight) ? 375 / 667: window.innerWidth / window.innerHeight;]
        this.ratio = 375 / 667; // 整體遊戲比例
        if (isMobile) {
            this.mainSize = {
                width: window.innerWidth,
                height: window.innerHeight
            }
        } else {
            this.mainSize = {
                width: window.innerHeight * this.ratio,
                height: window.innerHeight
            }
        }
        this.memberData = options.memberData;
        // console.log("size:", isMobile, this.mainSize);
        // console.log("_selfmem",this.memberData);
        // console.log("optmem",options.memberData);
        this.app = new ScenesManager({
            width: this.mainSize.width,
            height: this.mainSize.height,
            backgroundColor: 0xdcddde,
            autoResize: true,
            resolution: 2,
        });
        this.player = {
            sprite: {},
            sprite_hover: {},
            move: 1,
            drink: 0,
            distance:0
        };
        this.timer = 0;
        this.bump = new PIXI.extras.Bump();

        this.tools = new Tools({
            debug: !production
        });

        this.level = {
            step:10,  //影響速度
            monster: 15,  //機率
            drink: 10  //機率
        }

        this.playing = false;

        this.speed = this.level.step * 0.5;

        // this.vmPage = options.vmPage;
        // this.vmScore = options.vmScore;

        this.maps = [{
            name: 'selectorBg',
            src: './images/playBg.jpg'
        }, {
            name: 'playerA',
            src: './images/playerA.png',
        }, {
            name: 'playerB',
            src: './images/playerB.png',
        }, {
            name: 'playerC',
            src: './images/playerC.png',
        }, {
            name: 'playerD',
            src: './images/playerD.png',
        }, {
            name: 'playerA-txt',
            src: './images/playerA-txt.png'
        }, {
            name: 'playerB-txt',
            src: './images/playerB-txt.png'
        }, {
            name: 'playerC-txt',
            src: './images/playerC-txt.png'
        }, {
            name: 'playerD-txt',
            src: './images/playerD-txt.png'
        }, {
            name: 'playerA-head',
            src: './images/playerA-head.png'
        }, {
            name: 'playerB-head',
            src: './images/playerB-head.png'
        }, {
            name: 'playerC-head',
            src: './images/playerC-head.png'
        }, {
            name: 'playerD-head',
            src: './images/playerD-head.png'
        }, {
            name: 'smallplayerA',
            src: './images/smallplayerA.json'
        }, {
            name: 'smallplayerA-hover',
            src: './images/smallplayerA-hover.json'
        }, {
            name: 'smallplayerB',
            src: './images/smallplayerB.json'
        }, {
            name: 'smallplayerB-hover',
            src: './images/smallplayerB-hover.json'
        }, {
            name: 'smallplayerC',
            src: './images/smallplayerC.json'
        }, {
            name: 'smallplayerC-hover',
            src: './images/smallplayerC-hover.json'
        }, {
            name: 'smallplayerD',
            src: './images/smallplayerD.json'
        }, {
            name: 'smallplayerD-hover',
            src: './images/smallplayerD-hover.json'
        }, {
            name: 'drink',
            src: './images/drink.json'
        }, {
            name: 'road',
            src: './images/road.jpg'
        }, {
            name: 'monsterA',
            src: './images/monsterA.png'
        }, {
            name: 'monsterB',
            src: './images/monsterB.png'
        }, {
            name: 'monsterC',
            src: './images/monsterC.png'
        }, {
            name: 'monsterD',
            src: './images/monsterD.png'
        }, {
            name: 'gameover',
            src:'./images/gameover.json'
        }, {
            name: 'teachBg',
            src: './images/teachBg.jpg'
        }, {
            name: 'teach_1',
            src: './images/teach-step1.png'
        }, {
            name: 'teach_2',
            src: './images/teach-step2.png'
        }, {
            name: 'teach_3',
            src: './images/teach-step3.png'
        }, {
            name: 'play-title',
            src: './images/sel-title.png'
        }, {
            name: 'selbtnBg',
            src: './images/player-head-Bg.png'
        }, {
            name: 'selbtnBg-hover',
            src: './images/player-head-hover.png'
        }, {
            name: 'sel-btn',
            src: './images/sel-btn.png'
        }, {
            name: 'score-Bg',
            src: './images/score-Bg.png'
        }, {
            name: 'btn-left',
            src: './images/btn-left.png'
        }, {
            name: 'btn-right',
            src: './images/btn-right.png'
        }, {
            name: 'btn-fast',
            src: './images/btn-fast.png'
        }, {
            name: 'btn-start',
            src: './images/btn-start.png'
        }, {
            name: 'btn-next',
            src: './images/btn-next.png'
        }];

        this.teachs = [{
            id: 'step1',
            src: 'teach_1'
        }, {
            id: 'step2',
            src: 'teach_2'
        }, {
            id: 'step3',
            src: 'teach_3'
        }];

        this.btns = [{
            name: 'decide',
            src: 'sel-btn'
        }, {
            name: 'btnLeft',
            src: 'btn-left'
        }, {
            name: 'btnRight',
            src: 'btn-right'
        }, {
            name: 'btnFast',
            src: 'btn-fast'
        }, {
            name: 'btnStart',
            src: 'btn-start'
        }, {
            name: 'btnNext',
            src: 'btn-next'
        }];

        this.gameItem = [{
            name: 'score',
            src: 'score-Bg'
        }]

        this.btnBg = [{
            src: './images/player-head-Bg.png',
            hover: './images/player-head-hover.png'
        }]
        
        this.plays = [{
            id: 'worker',
            name: '老油條',
            // intro: '上班時間是一般上班族，下班時間是加班上班族，看透職場百態，擅長應對慣老闆的要求。',
            intro: 'playerA-txt',
            mainImg: 'playerA',
            head: 'smallplayerA',
            head_hover: 'smallplayerA-hover',
            src: 'playerA-head',
            ignore: 'monsterA',
            gtmData: '遊戲選擇人物頁_老油條',
        }, {
            id: 'ol',
            name: '厭世上班族',
            // intro: '在職場打滾資歷十幾年，跟各種不同的豬隊友合作過，體內已經產生豬隊友抗體。',
            intro: 'playerB-txt',
            mainImg: 'playerB',
            head: 'smallplayerB',
            head_hover: 'smallplayerB-hover',
            src: 'playerB-head',
            ignore: 'monsterB',
            gtmData: '遊戲選擇人物頁_厭世上班族',
        }, {
            id: 'loser',
            name: '魯宅男大生',
            // intro: '每天下課都宅在宿舍看動漫、吃泡麵，對於2D版的學生妹早已免疫，但遇到真人3D版就不行了。',
            intro: 'playerC-txt',
            mainImg: 'playerC',
            head: 'smallplayerC',
            head_hover: 'smallplayerC-hover',
            src: 'playerC-head',
            ignore: 'monsterC',
            gtmData: '遊戲選擇人物頁_魯宅男大生',
        }, {
            id: 'girl',
            name: '西斯女大生',
            // intro: '身材、外貌都讓校園裡的男性們忍不住心癢癢，忘記交報告暴怒男教授還是讓你歐趴，碰到也不怕。',
            intro: 'playerD-txt',
            mainImg: 'playerD',
            head: 'smallplayerD',
            head_hover: 'smallplayerD-hover',
            src: 'playerD-head',
            ignore: 'monsterD',
            gtmData: '遊戲選擇人物頁_西斯女大生',
        }];

        this.monsters = [{
            id: 'monsterA',
            name: '慣老闆',
        }, {
            id: 'monsterB',
            name: '豬隊友',
        }, {
            id: 'monsterC',
            name: '公主病女孩'
        }, {
            id: 'monsterD',
            name: '暴怒教授'
        }];

        this.api = {
            oldcode: 0,
            ticket: "",
        }

        this.preload();

        this.getToken = () => {
            return $.ajax({
                type: 'GET',
                url: `${friendo_url}auth/login?projectId=66`,
                headers: {
                    WebToken: 'WBqIHc9hTmwyL+g9m0ykfA=='
                },
                // data: {
                //     projectId: 66
                // }
            })
        }
        window.onresize = () => {
            if (window.innerWidth / window.innerHeight >= this.ratio) {
                var w = window.innerHeight * this.ratio;
                var h = window.innerHeight;
            } else {
                var w = window.innerWidth;
                var h = window.innerWidth / this.ratio;
            }
            this.app.renderer.view.style.width = w + 'px';
            this.app.renderer.view.style.height = h + 'px';
        }
    }
    preload() {
        const loader = new PIXI.loaders.Loader();
        this.maps.map(function (obj) {
            // console.log('load obj', obj)
            loader.add(obj.name, obj.src);
        })
        // loader.add('testBG','../images/testBg.jpg')
        loader.on("progress", loadProgressHandler)
        loader.load((loader, resources) => {
            this.init();
            // index_view.loading = false;
            setTimeout(function(){
                game_view.popup = false;
                game_view.popPage = "";
            },100);
            if(isMobile) {
                if(loader.progress >= 60) {
                    $(".js-bar").css({
                        "width" : "67%",
                    });
                }
            } else {
                if(loader.progress >= 60) {
                    $(".js-bar").css({
                        "width" : "96%",
                    });
                }
            }
        });

        function loadProgressHandler(loader, resource) {
            // console.log("loading: " + resource.url);
            // console.log("progress: " + Math.ceil(loader.progress) + "%");
            // $("#loading .mask").css({
            //     "height": `${Math.ceil(loader.progress)}vh`,
            //     "top": `${100 - Math.ceil(loader.progress)}%`
            // });
            if(isMobile) {
                $(".js-bar").css({
                    "width" : `${Math.ceil(loader.progress*0.67)}%`
                });
            } else {
                $(".js-bar").css({
                    "width" : `${Math.ceil(loader.progress)}%`
                });
            }
        }
    }

    init() {
        var _self = this;
        var timer;
        _self.app.create("game");
        
        var playteach = _self.app.createScene('teacharea');
        var playteach2 = _self.app.createScene('teacharea2');
        var playteach3 = _self.app.createScene('teacharea3');
        var playerSle = _self.app.createScene('selector');
        var mainGame = _self.app.createScene('game');
        let road = new PIXI.Sprite.from('road');
        let mainScale = _self.mainSize.width / road.width;
        var p1 = (road.width - 180) * mainScale / 3;
        let posX = [p1 / 2 + 90 * mainScale, p1 * 3 / 2 + 90 * mainScale, p1 * 5 / 2 + 90 * mainScale];
        mainGame.name = 'mainGame';
        let loopCon = new PIXI.Container();
        loopCon.name = 'loop';
        let itemCon = new PIXI.Container();
        itemCon.name = 'itemLoop';
        let itemCon2 = new PIXI.Container();
        itemCon2.name = 'itemLoop2';
        let grid = {
            row: 13,
            col: 3
        }
        var monsters = [];
        var drinks = [];

        //scenes 1 selector
        var selector_bg = PIXI.Sprite.from('selectorBg');
        // selector_bg.width = _self.mainSize.width;
        // console.log(selector_bg.width);
        // console.log("223:"+window.innerHeight);
        if(window.innerHeight > 650) {
            selector_bg.scale.set(0.5);
            selector_bg.height = window.innerHeight*2;
        } else {
            selector_bg.scale.set(0.5);
        }
        // selector_bg.width = selector_bg.width;
        // selector_bg.height = selector_bg.height;
        // selector_bg.height = _self.mainSize.height;
        playerSle.addChild(selector_bg);

        var teach_bg = PIXI.Sprite.from('teachBg');
        if(!isMobile) {
            teach_bg.width = _self.mainSize.width;
            teach_bg.height = _self.mainSize.height;
        } else {
            teach_bg.width = window.innerWidth;
            teach_bg.height = window.innerHeight;
        }
        // console.log("teb:"+teach_bg.width);
        playteach.addChild(teach_bg);
        // let title = new PIXI.Text('請選擇你的人物', {
        //     fontSize: 30,
        //     fill: 0xff1010,
        //     align: 'center'
        // })
        let title = new PIXI.Sprite.from('play-title');
        var titlera = title.width / title.height;
        title.width = 637
        title.height = title.width / titlera;
        title.y = 84
        _self.tools.objCenter(title, playerSle, 'x');
        playerSle.addChild(title);

        let playerbox = _self.playerSet();
        playerSle.addChild(playerbox);

        var teachbox = new PIXI.Container();
            teachbox.name = 'teachbox';
            if(isPc) {
                teachbox.width = 750;
                // teachbox.height = window.innerHeight;
                _self.tools.objCenter(teachbox, playteach, 'x');
                _self.tools.objCenter(teachbox, playteach, 'y');
            }
            // teachbox.width = window.innerWidth;
            teachbox.width = 750;
            teachbox.height = window.innerHeight;
            _self.tools.objCenter(teachbox, playteach, 'x');
            _self.tools.objCenter(teachbox, playteach, 'y');

        //===遊戲教學鍵===//
        let teachBtn = _self.tools.button({
            src: _self.btns[0].src,
            fn: function() {
                game_view.gaEvant("遊戲選擇人物頁_就決定是你");
                _self.app.goToScene('teacharea');
                // let teachbox = _self.teachSet();
                playteach.addChild(teachbox);
                playteach.addChild(nextBtn);
                playteach.addChild(gotoBtn);
                teachbox.addChild(teachtxt1);
            }
        });
        teachBtn.width = teachBtn.width/2;
        teachBtn.height = teachBtn.height/2;
        // teachBtn.anchor.set(1, 0);
        // teachBtn.y = _self.mainSize.height - 100;
        teachBtn.y = window.innerHeight / (_self.mainSize.width / 750) - teachBtn.height - 30;
        _self.tools.objCenter(teachBtn, playerSle, 'x')
        // _self.tools.objCenter(teachBtn, playerSle, 'x')
        playerSle.addChild(teachBtn);

        //===跳過教學===//
        let gotoBtn = _self.tools.button({
            src: _self.btns[3].src,
            // graphic: {
            //     color: '0x00ff11',
            //     width: 100,
            //     height: 70
            // },
            fn: function () {
                // console.log(_self.player);
                game_view.gaEvant("遊戲教學頁_跳過教學");
                game_view.gaEvant(_self.player.gtmData);
                // finger object
                var fingerTextures = [];

                for (var i = 0; i < 2; i++) {
                    var texture = PIXI.Texture.fromFrame(_self.player.head + '-' + (i + 1) + '.png');
                    fingerTextures.push(texture);
                }
                _self.player.sprite = new PIXI.extras.AnimatedSprite(fingerTextures);
                _self.player.sprite.animationSpeed = 0.05;
                _self.player.sprite.infinite = true;
                _self.player.sprite.play();
                _self.player.sprite.scale.set(250 / _self.player.sprite.height * mainScale);
                _self.player.sprite.anchor.set(0.5);
                _self.player.sprite.x = posX[1];
                _self.player.sprite.y = _self.mainSize.height - 145;
                mainGame.addChildAt(_self.player.sprite, 3);


                var fingerTextures_hover = [];

                for (var i = 0; i < 2; i++) {
                    var texture_hover = PIXI.Texture.fromFrame(_self.player.head_hover + '-' + (i + 1) + '.png');
                    fingerTextures_hover.push(texture_hover);
                }
                _self.player.sprite_hover = new PIXI.extras.AnimatedSprite(fingerTextures_hover);
                _self.player.sprite_hover.animationSpeed = 0.05;
                _self.player.sprite_hover.infinite = true;
                _self.player.sprite_hover.alpha = 0;
                _self.player.sprite_hover.play();
                _self.player.sprite_hover.scale.set(250 / _self.player.sprite_hover.height * mainScale);
                _self.player.sprite_hover.anchor.set(0.5);
                _self.player.sprite_hover.x = posX[1];
                _self.player.sprite_hover.y = _self.mainSize.height - 145;
                mainGame.addChildAt(_self.player.sprite_hover, 4);
                _self.app.goToScene('game');
                setTimeout(gameStart, 500);
            },
            
        });
        // gotoBtn.width = gotoBtn.width/2;
        // gotoBtn.height = gotoBtn.height/2;
        // gotoBtn.anchor.set(1, 0);
        // gotoBtn.y = _self.mainSize.height - 100;
        // gotoBtn.y = 1144
        gotoBtn.name = 'gotobtn';
        gotoBtn.scale.set(60 / gotoBtn.height * mainScale);
        gotoBtn.y = 30;
        gotoBtn.x = playteach.width - gotoBtn.width - 20;
        // gotoBtn.y = window.innerHeight - 300;
        // gotoBtn.x = 100;
        // _self.tools.objCenter(gotoBtn, playerSle, 'x')
        // playteach.addChild(gotoBtn);

        let nextBtn = _self.tools.button({
            src: _self.btns[5].src,
            fn: function() {
                game_view.gaEvant("遊戲教學頁_下一步1");
                _self.app.goToScene('teacharea2');
                // let teachbox = _self.teachSet();
                teachbox.removeChild(teachtxt1);
                playteach2.addChild(teach_bg);
                playteach2.addChild(teachbox);
                playteach2.addChild(nextBtn2);
                playteach2.addChild(gotoBtn);
                teachbox.addChild(teachtxt2);
            }
        });
        // nextBtn.width = nextBtn.width/2;
        // nextBtn.height = nextBtn.height/2;
        nextBtn.scale.set(120 / nextBtn.height * mainScale);
        nextBtn.y = window.innerHeight - nextBtn.height - 30;
        _self.tools.objCenter(nextBtn, playteach, 'x');
        // playteach.addChild(nextBtn);

        let nextBtn2 = _self.tools.button({
            src: _self.btns[5].src,
            fn: function() {
                game_view.gaEvant("遊戲教學頁_下一步2");
                _self.app.goToScene('teacharea3');
                // let teachbox = _self.teachSet();
                teachbox.removeChild(teachtxt2);
                playteach3.addChild(teach_bg);
                playteach3.addChild(teachbox);
                playteach3.addChild(startBtn);
                playteach3.addChild(gotoBtn);
                teachbox.addChild(teachtxt3);
            }
        });
        // nextBtn.width = nextBtn.width/2;
        // nextBtn.height = nextBtn.height/2;
        nextBtn2.scale.set(120 / nextBtn2.height * mainScale);
        nextBtn2.y = window.innerHeight - nextBtn2.height - 30;
        _self.tools.objCenter(nextBtn2, playteach, 'x');
        // playteach.addChild(nextBtn);

        let startBtn = _self.tools.button({
            src: _self.btns[4].src,
            fn: function () {
                // console.log(_self.player);
                game_view.gaEvant("遊戲教學頁_我明白了");
                game_view.gaEvant(_self.player.gtmData);
                // finger object
                var fingerTextures = [];

                for (var i = 0; i < 2; i++) {
                    var texture = PIXI.Texture.fromFrame(_self.player.head + '-' + (i + 1) + '.png');
                    fingerTextures.push(texture);
                }
                _self.player.sprite = new PIXI.extras.AnimatedSprite(fingerTextures);
                _self.player.sprite.animationSpeed = 0.05;
                _self.player.sprite.infinite = true;
                _self.player.sprite.play();
                _self.player.sprite.scale.set(250 / _self.player.sprite.height * mainScale);
                _self.player.sprite.anchor.set(0.5);
                _self.player.sprite.x = posX[1];
                _self.player.sprite.y = _self.mainSize.height - 145;
                mainGame.addChildAt(_self.player.sprite, 3);


                var fingerTextures_hover = [];

                for (var i = 0; i < 2; i++) {
                    var texture_hover = PIXI.Texture.fromFrame(_self.player.head_hover + '-' + (i + 1) + '.png');
                    fingerTextures_hover.push(texture_hover);
                }
                _self.player.sprite_hover = new PIXI.extras.AnimatedSprite(fingerTextures_hover);
                _self.player.sprite_hover.animationSpeed = 0.05;
                _self.player.sprite_hover.infinite = true;
                _self.player.sprite_hover.alpha = 0;
                _self.player.sprite_hover.play();
                _self.player.sprite_hover.scale.set(250 / _self.player.sprite_hover.height * mainScale);
                _self.player.sprite_hover.anchor.set(0.5);
                _self.player.sprite_hover.x = posX[1];
                _self.player.sprite_hover.y = _self.mainSize.height - 145;
                mainGame.addChildAt(_self.player.sprite_hover, 4);

                _self.app.goToScene('game');
                setTimeout(gameStart, 500);
            },
        });
        // nextBtn.width = nextBtn.width/2;
        // nextBtn.height = nextBtn.height/2;
        startBtn.scale.set(100 / startBtn.height * mainScale);
        startBtn.y = window.innerHeight - startBtn.height - 30;
        _self.tools.objCenter(startBtn, playteach, 'x');
        // playteach.addChild(nextBtn);

        var teachtxt1 = new PIXI.Sprite.from(_self.teachs[0].src);
            teachtxt1.scale.set(600 / teachtxt1.height * mainScale);
            _self.tools.objCenter(teachtxt1, teachbox, 'x');
            _self.tools.objCenter(teachtxt1, teachbox, 'y');
            teachtxt1.y -= 30;
            // teachtxt1.x = 200;
            // teachtxt1.y = 100;

        var teachtxt2 = new PIXI.Sprite.from(_self.teachs[1].src);
            teachtxt2.scale.set(600 / teachtxt2.height * mainScale);
            _self.tools.objCenter(teachtxt2, teachbox, 'x');
            _self.tools.objCenter(teachtxt2, teachbox, 'y');
            teachtxt2.y -= 30;
            // teachtxt2.y = 100;

        var teachtxt3 = new PIXI.Sprite.from(_self.teachs[2].src);
            teachtxt3.scale.set(700 / teachtxt3.height * mainScale);
            _self.tools.objCenter(teachtxt3, teachbox, 'x');
            _self.tools.objCenter(teachtxt3, teachbox, 'y');
            teachtxt3.y -= 30;
            // teachtxt3.y = 100;


        //create main game
        let roadCopy = new PIXI.Sprite.from('road');
        roadCopy.y = -roadCopy.height+1;
        road.y = 0;
        loopCon.scale.set(mainScale);
        loopCon.addChild(road, roadCopy);
        
        //monster and drink
        itemSet(itemCon);
        itemSet(itemCon2);
        itemCon.y = -itemCon.height;
        itemCon2.y = -itemCon2.height - itemCon.height - 30;

        //Control
        var contorls = new PIXI.Container();
        contorls.name = 'contorls';
        var leftBtn = _self.tools.button({
            src: _self.btns[1].src,
            // graphic: {
            //     color: '0xff00ff',
            //     width: 50,
            //     height: 50
            // },
            fn: playerControl('left')
        })
        leftBtn.scale.set(200 / leftBtn.height * mainScale);
        leftBtn.x = 0;
        leftBtn.y = _self.mainSize.height - leftBtn.height - 50;
        var rightBtn = _self.tools.button({
            src: _self.btns[2].src,
            // graphic: {
            //     color: '0xff00ff',
            //     width: 50,
            //     height: 50
            // },
            fn: playerControl('right')
        })
        rightBtn.scale.set(200 / rightBtn.height * mainScale);
        rightBtn.x = _self.mainSize.width - rightBtn.width;
        rightBtn.y = _self.mainSize.height - rightBtn.height - 50;
        let scoreCon = new PIXI.Container();
        // let scBG = _self.tools.graphic({
        //     colro: '#00C3FF',
        //     width: 200,
        //     height: 60
        // })
        var scBG = new PIXI.Sprite.from(_self.gameItem[0].src);
            scBG.scale.set(180 / scBG.height * mainScale);
        var score = new PIXI.Text('0', {
            fontFamily: 'Arial',
            fontSize: 30,
            fill: 0xffffff,
            align: 'center'
        })
        // score.x = scBG.width - score.width -10;
        score.x = 70 * mainScale;
        score.y = scBG.height - score.height - 20;
        scoreCon.addChild(scBG, score);
        scoreCon.x = _self.mainSize.width - scoreCon.width - 10;
        scoreCon.y = 10;
        var time = new PIXI.Text(_self.timer, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFF7665,
            align: 'center'
        })
        time.x = 200;
        time.y = 40;
        // contorls.addChild(leftBtn, rightBtn, scoreCon,time);
        contorls.addChild(leftBtn, rightBtn, scoreCon);

        //game over sence
        var gameOver = new PIXI.Container();
        let overBg = _self.tools.graphic({
            color: 0x000,
            x: 0,
            y: 0,
            width: _self.mainSize.width,
            height:_self.mainSize.height
        })
        overBg.alpha = .6;

        var overArr = [];

        for (var i = 0; i < 8; i++) {
            var texture = PIXI.Texture.fromFrame('gameover-' + (i + 1) + '.png');
            overArr.push(texture);
        }
        var over = new PIXI.extras.AnimatedSprite(overArr);
        over.animationSpeed = 0.08;
        over.infinite = true;
        over.play();
        over.scale.set(0.4);
        over.anchor.set(0.5);
        over.x = _self.mainSize.width / 2;
        over.y = _self.mainSize.height / 2;
        gameOver.addChild(overBg, over);
        var overTL = new TimelineLite({
            paused: true
        });
        overTL.from(gameOver, 0.5, {
            alpha:0
        })
        
        //===鍵盤操作功能===//
        // window.addEventListener('keydown', function (e) {
        //     // console.log(e.keyCode);
        //     switch (e.keyCode) {
        //         case 37:  //left
        //             playerControl('left')();
        //             break;
        //         case 39:  //right
        //             playerControl('right')();
        //             break;
        //     }
        // }, false);

        function playerControl(rl) {
            return function () {
                return new Promise((resolve) => {
                    if (!_self.playing){
                        resolve();
                        return;
                    }
                    switch (rl) {
                        case 'left':
                            if (_self.player.move != 0) {
                                _self.player.move--;
                                _self.player.sprite.x = posX[_self.player.move];
                                _self.player.sprite_hover.x = posX[_self.player.move];
                                game_view.gaEvant("遊戲進行頁_左鍵");
                            }
                            break;
                        case 'right':
                            if (_self.player.move != 2) {
                                _self.player.move++;
                                _self.player.sprite.x = posX[_self.player.move];
                                _self.player.sprite_hover.x = posX[_self.player.move];
                                game_view.gaEvant("遊戲進行頁_右鍵");
                            }
                            break;
                    }
                    resolve();
                })
            }
        }

        function roadLoop() {
            road.y += _self.tools.guiData.speed;
            roadCopy.y += _self.tools.guiData.speed;
            time.text = _self.timer;
            _self.player.distance += Math.floor(_self.tools.guiData.speed);
            score.text = parseInt(score.text) + Math.floor(_self.tools.guiData.speed);
            _self.tools.guiData.speed = (Math.floor(_self.timer / 5) + _self.level.step) * 0.5;
            //  for (var i in _self.tools.gui.__controllers) {
            //      _self.tools.gui.__controllers[i].updateDisplay();
            //  }
            if (road.y >= _self.mainSize.height / mainScale) {
                road.y = -road.height +1;
            }
            if (roadCopy.y >= _self.mainSize.height / mainScale) {
                roadCopy.y = -roadCopy.height +1;
            }
        }

        function itemLoop() {
            itemCon.y += _self.tools.guiData.speed;
            if (itemCon.y >= _self.mainSize.height / mainScale) {
                while (itemCon.children[0]) {
                    itemCon.removeChild(itemCon.children[0]);
                    var index = drinks.indexOf(itemCon.children[0]);
                    if (index > -1) {
                        drinks.splice(index, 1);
                    }
                    index = monsters.indexOf(itemCon.children[0]);
                    if (index > -1) {
                        monsters.splice(index, 1);
                    }
                }
                itemSet(itemCon);
                itemCon.y = itemCon2.y - itemCon.height - 600;
            }
            if (itemCon2.y >= _self.mainSize.height / mainScale) {
                while (itemCon2.children[0]) {
                    itemCon2.removeChild(itemCon2.children[0]);
                    var index = drinks.indexOf(itemCon2.children[0]);
                    if (index > -1) {
                        drinks.splice(index, 1);
                    }
                    index = monsters.indexOf(itemCon2.children[0]);
                    if (index > -1) {
                        monsters.splice(index, 1);
                    }
                }
                itemSet(itemCon2);
                itemCon2.y = itemCon.y - itemCon2.height - 300;
            } else {
                itemCon2.y += _self.tools.guiData.speed;
            }
            _self.bump.hit(_self.player.sprite, monsters, false, false, true, function (collision, platform) {
                if (platform.name != _self.player.ignore) {
                    // console.log(collision, platform);
                    // let tl = new TimelineMax();
                    // tl.to(_self.player.sprite,0.3,{rotation: 60 * (Math.PI / 180)});
                    // _self.player.sprite.rotation = 60 * (Math.PI / 180);
                    gameEnd();
                    // alert('bump~!');
                    // console.log('bump!');
                }
            })
            // _self.bump.hit(_self.player.sprite_hover, monsters, false, false, true, function (collision, platform) {
            //     if (platform.name != _self.player.ignore) {
            //         console.log(collision, platform);
            //         gameEnd();
            //         // alert('bump~!');
            //         console.log('bump!');
            //     }
            // })
            _self.bump.hit(_self.player.sprite, drinks, false, false, true, function (collision, platform) {
                platform.alpha = 0;
                // _self.player.sprite_hover.alpha = 1;
                let tl = new TimelineMax({repeat:1});
                tl.to(_self.player.sprite_hover,0.1,{alpha:1})
                tl.to(_self.player.sprite_hover,0.1,{alpha:0})
                 let i = drinks.indexOf(platform);
                 drinks.splice(i, 1);
                // console.log(' drinks bump~!')
                score.text = parseInt(score.text) + 3000;
                _self.player.drink++;
                // console.log(_self.player.drink);
            })
        }

        function itemSet(container) {
            let Mcun = 0;
            for (let m = 0; m < (grid.row * grid.col); m++) {
                let type = Math.floor(Math.random() * 4);  //怪物種類
                let tmpM = _self.monsters[type];

                let addMonster = (Math.random() * 100 <= _self.level.monster);
                let addDrink = (Math.random() * 100 <= _self.level.drink);
                if(!addMonster) {
                    Mcun = 0;
                }
                // let randPos = 0;
                if (addDrink || m == 0 || m == (grid.row * grid.col) - 1) {
                    // var drink = new PIXI.Sprite.from('drink');
                    // drink.name = 'drink' + m;
                    // drink.scale.set(145 / drink.height * mainScale)
                    // drink.anchor.set(0.5, 0);
                    // drink.x = posX[m % 3];
                    // drink.y = 300 * (Math.floor(m / 3));
                    // drinks.push(drink);
                    // container.addChild(drink);
                    Mcun = 0;
                    var drinkArr = [];
                    for (var i = 0; i < 2; i++) {
                        var texture = PIXI.Texture.fromFrame('drink-' + (i + 1) + '.png');
                        drinkArr.push(texture);
                    }
                    var drink = new PIXI.extras.AnimatedSprite(drinkArr);
                    drink.name = 'drink' + m;
                    drink.animationSpeed = 0.08;
                    drink.infinite = true;
                    drink.play();
                    drink.scale.set(220 / drink.height * mainScale);
                    drink.anchor.set(0.5, 0);
                    drink.x = posX[m % 3];
                    drink.y = 350 * (Math.floor(m / 3));
                    drinks.push(drink);
                    container.addChild(drink);
                } else if (addMonster) {
                    Mcun++;
                    if(Mcun <= 2) {
                        var monster = new PIXI.Sprite.from(tmpM.id);
                        monster.name = tmpM.id;
                        // monster.scale.set(145 / monster.height * mainScale)
                        monster.scale.set(200 / monster.height * mainScale)
                        monster.anchor.set(0.5, 0);
                        monster.x = posX[m % 3];
                        monster.y = 350 * (Math.floor(m / 3));
                        monsters.push(monster);
                        container.addChild(monster);
                    }
                }
            }
        }
        
        function gameStart() {
            _self.playing = true
            timer = setInterval(() => {
                _self.timer++;
            }, 1000);
            _self.app.ticker.add(roadLoop);
            _self.app.ticker.add(itemLoop);
            //call api
            var userType = _self.player.head.substr(-1);
            if(userType == "A") {
                game_view.fbslink = "https://result.friendo.com.tw/kzOwL";
            }
            if(userType == "B") {
                game_view.fbslink = "https://result.friendo.com.tw/gzh7C";
            }
            if(userType == "C") {
                game_view.fbslink = "https://result.friendo.com.tw/0pXUW";
            }
            if(userType == "D") {
                game_view.fbslink = "https://result.friendo.com.tw/GKIOV";
            }
            // _self.getToken().then(({ token }) => {
            //     $.ajax({
            //         url: `${friendo_url}comebest/play`,
            //         type: 'POST',
            //         headers: {
            //             Authorization: `Bearer ${token}`
            //         },
            //         data: {
            //             mb_id: _self.memberData,
            //             // mb_id: "f1b730fd-7f51-4555-923b-a4fa6de0d6c6",
            //             role: _self.player.head.substr(-1),
            //         }
            //     }).done(function(res){
            //         // console.log('gp:',res);
            //         _self.api.oldcode = res.data.code;
            //         _self.api.ticket = res.data.ticket;
            //     })
            // })
        }

        function gameEnd() {
            _self.playing = false;
            _self.player.sprite.stop();
            clearInterval(timer);
            _self.app.ticker.remove(itemLoop);
            _self.app.ticker.remove(roadLoop);
            // document.body.appendChild(app.view);
            overTL.play();
            game_view.gamePage = "grade";
            over.stop();
            //call api
            // _self.getToken().then(({ token }) => {
            //     $.ajax({
            //         url: `${friendo_url}comebest/record`,
            //         type: 'POST',
            //         headers: {
            //             Authorization: `Bearer ${token}`
            //         },
            //         data: {
            //             mb_id: _self.memberData,
            //             // mb_id: "f1b730fd-7f51-4555-923b-a4fa6de0d6c6",
            //             ticket: _self.api.ticket,
            //             code: newcode,
            //             score: score.text,
            //             timespan: _self.timer
            //         }
            //     }).done(function(res){
            //         // console.log('record:',res);
            //         game_view.gcode = res.data.this_score;
            //         // console.log('vmScore:',_self.vmScore);
            //         game_view.person.id = res.data.seq;
            //         game_view.person.img = res.data.pic_url;
            //         game_view.person.name = res.data.name;
            //         game_view.person.score = res.data.max_score;
            //         if(res.data.seq > 100) {
            //             game_view.person.id = "未進榜";
            //         };
            //         game_view.top100Arr = res.data.list;
            //         game_view.gamePage = "grade";
            //         over.stop();
            //         // _self.mainSize = 0;
            //     })
            // })
            var newcode = _self.api.oldcode+_self.timer+","+_self.player.distance+","+_self.player.drink;
            game_view.person.score = score.text;
            game_view.gcode = score.text;
            game_view.top100Api();
            // console.log(newcode);
            // console.log("dis:"+_self.player.distance);
            // console.log("score:"+score.text);
            // console.log("time:"+_self.timer);
        }


        _self.tools.addGui('speed', {
            type: 'number',
            setVal: _self.speed,
            min:1,
            max: 100
        })
        _self.tools.addGui('stop', {
            setVal: function () {
                _self.app.ticker.remove(itemLoop);
                _self.app.ticker.remove(roadLoop);
            },
        })
        _self.tools.addGui('start', {
            setVal: function () {
                setInterval(() => {
                    _self.timer++;
                }, 1000);
                _self.app.ticker.add(roadLoop);
                _self.app.ticker.add(itemLoop);
            },
        })
        // mainGame.scale.set(mainScale);
        mainGame.addChild(loopCon, itemCon, itemCon2, contorls, gameOver);


        //start
        playerSle.scale.set(_self.mainSize.width / 750);
        _self.app.goToScene('selector');
    }

    playerSet() {
        //select btn 
        var _self = this;
        var pb = new PIXI.Container();
            pb.name = 'playerBox';
            // pb.width = 750;
        var btns = new PIXI.Container();
            btns.name = 'selcharAll';
            // btns.width = 659;
            btns.x = 52;
            // _self.tools.objCenter(btns, pb, 'x');
            btns.y = 157;
        _self.plays.forEach((obj, inx) => {
            // console.log(obj);
            var selectBtn = _self.tools.button({
                src:obj.src,
                // graphic: {
                //     color: '0xff0011',
                //     // x: 30,
                //     // y: 230 + (inx * 80),
                //     x: 30 + (inx * 80),
                //     y: 157 * _self.ratio,
                //     // width: 70,
                //     // height: 100
                // },
                fn: playerShow(inx)
            });
            var selbtnra = selectBtn.width / selectBtn.height
                selectBtn.name = 'selchar';
                selectBtn.width = 311/2;
                selectBtn.height = 542/2;
            var selbox = new PIXI.Container();
                selbox.name = 'selbox';
                selbox.width = 311/2;
                selbox.height = 542/2;
                // selbox.y = 157;
                selbox.x = inx * 160;
            // var selbtnBg = new PIXI.Sprite.from(_self.btnBg.src);
            var selbtnBg = new PIXI.Sprite.from('./images/player-head-Bg.png');
                selbtnBg.name = 'btnBg';
                // var selbtnra = selectBtn.width / selectBtn.height
                selbtnBg.width = 311/2;
                selbtnBg.height = 542/2;
                // selbtnBg.zIndex = 2;
            var selbtnhover = new PIXI.Sprite.from('./images/player-head-hover.png');
                selbtnhover.name = 'btnhover';
                selbtnhover.width = 311/2;
                selbtnhover.height = 542/2;
                selbtnhover.alpha = 0;
                // selbtnhover.visible = false;
                // selbtnhover.zIndex = 1;
           
            btns.addChild(selbox);
            selbox.addChild(selbtnBg);
            selbox.addChild(selbtnhover);
            selbox.addChild(selectBtn);
        })
        pb.addChild(btns);
        var defualt_set = playerShow(0);
        defualt_set();
        
        function playerShow() {
            let v = arguments[0]
            return function () {
                let inx = v;
                return new Promise((resolve, reject) => {
                    _self.player = _self.plays[inx];
                    _self.player.move = 1;
                    _self.player.drink = 0;
                    _self.player.distance = 0;
                    let con = _self.app.getScene('selector');
                    let tl = new TimelineLite({
                        onComplete: () => {
                            return resolve(true);
                        }
                    })
                    if (con.getChildByName('playerBox')) {
                        let PB = con.getChildByName('playerBox');
                        // let oldName = PB.getChildByName('pName');
                        let oldIntro = PB.getChildByName('pIntro');
                        let oldImg = PB.getChildByName('pImg');
                        // let oldselarea = PB.getChildByName('selcahrAll');
                        // let oldselbox = oldselarea.getChildByName('selbox');
                        // let oldhover = oldselbox.getChildByName('btnhover');
                            // oldhover.visible = false;
                        tl.add(TweenMax.to([oldIntro, oldImg], .2, {
                            alpha: 0,
                            onComplete: () => {
                                PB.removeChild(oldIntro, oldImg);
                            }
                        }))
                    }
                    // var pName = new PIXI.Text(_self.player.name, {
                    //     fontSize: 34,
                    //     fill: 0x0c0c0c,
                    // });
                    // pName.name = 'pName';
                    // pName.y = 519*_self.ratio;
                    // pName.x = 45*_self.ratio;
                    // pName.alpha = 0;
                    // _self.tools.objCenter(pName, con, 'x');
                    // var pIntro = new PIXI.Text(_self.player.intro, {
                    //     fontSize: 20,
                    //     fill: 0x121212,
                    //     align: 'left',
                    //     wordWrap: true,
                    //     breakWords: true,
                    //     // wordWrapWidth: _self.mainSize.width * 0.8
                    //     wordWrapWidth: 336*_self.ratio
                    // });
                    var pIntro = new PIXI.Sprite.from(_self.player.intro);
                    pIntro.name = 'pIntro';
                    pIntro.width = (672/2)*1;
                    pIntro.height = (1220/2)*0.9;
                    // pIntro.y = 519;
                    pIntro.y = window.innerHeight - 100;
                    pIntro.x = 45;
                    // _self.tools.objCenter(pIntro, con, 'x');
                    if(!isMobile) {
                        pIntro.y = 519;
                    }
                    var pImg = new PIXI.Sprite.from(_self.player.mainImg);
                    pImg.name = 'pImg';
                    // pImg.ac
                    // pImg.x = _self.mainSize.width - 20;
                    pImg.anchor.set(1, 1);
                    pImg.x = 750;
                    pImg.y = 1334;
                    // pImg.y = 485;
                    // pImg.scale.set(450 / pImg.height);
                    pImg.width = pImg.width/2;
                    pImg.height = pImg.height/2;
                    if(window.innerHeight > 800) {
                        pImg.y = 1600;
                    }
                    if(!isMobile) {
                        pImg.y = 1334;
                    }
                    pb.addChild(pIntro);
                    // pb.addChildAt(pImg, 3);
                    pb.addChild(pImg);
                    var ps = pb.getChildByName('selcharAll');
                    var selboxs = ps.children;
                    var lightoff = []
                    selboxs.map((obj)=>{
                        lightoff.push(TweenMax.to(obj.getChildByName('btnhover'),.1,{
                            alpha:0
                        }));
                    })
                    tl.add(lightoff);
                    tl.add([TweenMax.to(selboxs[v].getChildByName('btnhover'),.1,{
                        alpha:1
                    }),TweenMax.from([pIntro, pImg], .1, {
                        alpha: 0
                    })])
                    tl.play();
                })
            }
        }
        return pb;
    }
}