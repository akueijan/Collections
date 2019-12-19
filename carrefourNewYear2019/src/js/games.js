class Gmaes{ 
    constructor(options) {
        this.canvasWidth = window.innerWidth;
        if(!isMobile) {
            this.canvasHeight = window.innerHeight - ($(".gamePop_area .bottom").height() + $(".gamePop_area .top").height());
        } else {
            this.canvasHeight = window.innerHeight - ($(".nav").height() + $(".gamePop_area .bottom").height() + $(".gamePop_area .top").height());
        }
        this.app = null;
        this.clickCun = 0;
        this.gameProbability = options.probability;
        this.eggPop = false;
        this.prodPop = false;
        this.gameluckyAward = options.luckyAward;
        this.set_awardItem = options.awardItem;
        this.gtmdata = options.gtmData;
        this.porduct = {}
        this.items = [{
                width: 75,
                height: 110,
                x: 255,
                y: 435,
                gtm: "找彩蛋_金牌烏魚子禮盒",
                prod: {
                    pic: "./images/prod-item1.png",
                    title: "你找到了一個關鍵道具!",
                    h3: "金牌烏魚子禮盒",
                    txt: "六兩上。風味獨特，嚼感有彈性，年節禮盒送禮",
                    price: "1999",
                    cupon: "1738",
                    link: "http://bit.ly/2CYH6UT",
                    link_gtm: "立即購買_金牌烏魚子禮盒"
                }
            },
            {
                width: 140,
                height: 90,
                x: 334,
                y: 387,
                gtm: "找彩蛋_萬歲牌天然果物堅果禮盒",
                prod: {
                    pic: "./images/prod-item2.png",
                    title: "你找到了一個關鍵道具!",
                    h3: "萬歲牌天然果物堅果禮盒",
                    txt: "嚴選四款天然食材！口口品嘗堅果、果乾原味！",
                    price: "319",
                    cupon: "288",
                    link: "http://bit.ly/2CXnkZP",
                    link_gtm: "立即購買_萬歲牌天然果物堅果禮盒"
                }
            },
            {
                width: 55,
                height: 55,
                x: 426,
                y: 491,
                gtm: "找彩蛋_澳門鉅記粒粒杏仁餅禮盒",
                prod: {
                    pic: "./images/prod-item3.png",
                    title: "你找到了一個關鍵道具!",
                    h3: "澳門鉅記粒粒杏仁餅禮盒",
                    txt: "澳門製造，銷量第一！濃濃蛋奶香，酥脆可口，令人齒頰留香",
                    price: "1066",
                    cupon: "888",
                    link: "http://bit.ly/2CVA3ME",
                    link_gtm: "立即購買_澳門鉅記粒粒杏仁餅禮盒",
                }
            },
            {
                width: 84,
                height: 84,
                x: 509,
                y: 507,
                gtm: "找彩蛋_LU法式奶油餅乾綜合禮盒",
                prod: {
                    pic: "./images/prod-item4.png",
                    title: "你找到了一個關鍵道具!",
                    h3: "LU法式奶油餅乾綜合禮盒",
                    txt: "源自法國的百年美味，一同享用法式點心",
                    price: "250",
                    cupon: "249",
                    link: "http://bit.ly/2CWTCV4",
                    link_gtm: "立即購買_LU法式奶油餅乾綜合禮盒",
                }
            },
            {
                width: 183,
                height: 183,
                x: 510,
                y: 620,
                gtm: "找彩蛋_桂格養氣人蔘(贈行李箱)",
                prod: {
                    pic: "./images/prod-item5.png",
                    title: "你找到了一個關鍵道具",
                    h3: "桂格養氣人蔘(贈行李箱)",
                    txt: "60毫升x94罐，用好人蔘孝敬爸媽的人生，再送Line Friends拉桿行李箱！",
                    price: "5929",
                    cupon: "4999",
                    link: "http://bit.ly/2CYWY9O",
                    link_gtm: "立即購買_桂格養氣人蔘(贈行李箱)",
                }
            },
            {
                width: 185,
                height: 185,
                x: 686,
                y: 800,
                gtm: "找彩蛋_桂格養氣人蔘(贈行李箱)",
                prod: {
                    pic: "./images/prod-item5.png",
                    title: "你找到了一個關鍵道具",
                    h3: "桂格養氣人蔘(贈行李箱)",
                    txt: "60毫升x94罐，用好人蔘孝敬爸媽的人生，再送Line Friends拉桿行李箱！",
                    price: "5929",
                    cupon: "4999",
                    link: "http://bit.ly/2CYWY9O",
                    link_gtm: "立即購買_桂格養氣人蔘(贈行李箱)",
                }
            },
            {
                width: 137,
                height: 137,
                x: 886,
                y: 862,
                gtm: "找彩蛋_好神拖x鎮瀾宮聯名旋轉拖",
                prod: {
                    pic: "./images/prod-item6.png",
                    title: "你找到了一個關鍵道具",
                    h3: "好神拖x鎮瀾宮聯名旋轉拖",
                    txt: "攜手跨界台灣媽祖大甲鎮瀾宮，有拖有保庇",
                    price: "899",
                    cupon: "799",
                    link: "http://bit.ly/2CYtLfi",
                    link_gtm: "立即購買_好神拖x鎮瀾宮聯名旋轉拖",
                }
            },
            {
                width: 224,
                height: 200,
                x: 1220,
                y: 576,
                gtm: "找彩蛋_優佳麗 10吋碳素電暖器",
                prod: {
                    pic: "./images/prod-item7.png",
                    title: "你找到了一個關鍵道具",
                    h3: "優佳麗 10吋碳素電暖器",
                    txt: "左右擺頭功能，防傾倒斷電",
                    price: "990",
                    cupon: "890",
                    link: "http://bit.ly/2CYFZ7F",
                    link_gtm: "立即購買_優佳麗 10吋碳素電暖器",
                }
            },
            {
                width: 180,
                height: 180,
                x: 1320,
                y: 370,
                gtm: "找彩蛋_新春大福抱枕",
                prod: {
                    pic: "./images/prod-item8.png",
                    title: "你找到了一個關鍵道具",
                    h3: "新春大福抱枕",
                    txt: "53x53公分，喜氣大抱枕，兩款式隨機出貨",
                    price: "270",
                    cupon: "168",
                    link: "http://bit.ly/2CYGe2z",
                    link_gtm: "立即購買_新春大福抱枕",
                }
            },
            // {
            //     width: 123,
            //     height: 123,
            //     x: 1627,
            //     y: 221,
            //     gtm: "找彩蛋_家樂福綜合蘇打餅乾禮盒",
            //     prod: {
            //         pic: "./images/prod-item9.png",
            //         title: "你找到了一個關鍵道具",
            //         h3: "家樂福綜合蘇打餅乾禮盒",
            //         txt: "最佳伴手禮祝您豬事順利，戰無不勝",
            //         price: "199",
            //         cupon: "189",
            //         link: "http://bit.ly/2CYtFEs",
            //         link_gtm: "立即購買_家樂福綜合蘇打餅乾禮盒",
            //     }
            // },
            {
                width: 81,
                height: 98,
                x: 1755,
                y: 672,
                gtm: "找彩蛋_VINACASHEW越南帶皮腰果",
                prod: {
                    pic: "./images/prod-item10.png",
                    title: "你找到了一個關鍵道具",
                    h3: "VINACASHEW越南帶皮腰果",
                    txt: "未剝膜鹽焗腰果， 不加其他調味，純素食帶殼腰果",
                    price: "389",
                    cupon: "299",
                    link: "http://bit.ly/2CXW4dP",
                    link_gtm: "立即購買_VINACASHEW越南帶皮腰果",
                }
            },
            {
                width: 81,
                height: 98,
                x: 1834,
                y: 710,
                gtm: "找彩蛋_VINACASHEW越南帶皮腰果",
                prod: {
                    pic: "./images/prod-item10.png",
                    title: "你找到了一個關鍵道具",
                    h3: "VINACASHEW越南帶皮腰果",
                    txt: "未剝膜鹽焗腰果， 不加其他調味，純素食帶殼腰果",
                    price: "389",
                    cupon: "299",
                    link: "http://bit.ly/2CXW4dP",
                    link_gtm: "立即購買_VINACASHEW越南帶皮腰果",
                }
            },
            {
                width: 137,
                height: 146,
                x: 1937,
                y: 626,
                gtm: "找彩蛋_食樂坡鹹蛋洋芋片",
                prod: {
                    pic: "./images/prod-item11.png",
                    title: "你找到了一個關鍵道具",
                    h3: "食樂坡鹹蛋洋芋片",
                    txt: "新加坡名廚創立品牌，名廚秘方，特製美味",
                    price: "259",
                    cupon: "189",
                    link: "http://bit.ly/2CYFP03",
                    link_gtm: "立即購買_食樂坡鹹蛋洋芋片",
                }
            },
            {
                width: 90,
                height: 90,
                x: 2130,
                y: 400,
                gtm: "找彩蛋_NS Switch主機單機",
                prod: {
                    pic: "./images/prod-item12.png",
                    title: "你找到了一個關鍵道具",
                    h3: "NS Switch主機單機",
                    txt: "無論何時何地都可和任何人遊玩，過年家人團聚必備！",
                    price: "9780",
                    cupon: "9780",
                    link: "http://bit.ly/2CXQS9X",
                    link_gtm: "立即購買_NS Switch主機單機",
                }
            },
            {
                width: 300,
                height: 250,
                x: 2276,
                y: 135,
                gtm: "找彩蛋_SAMSUNG 65吋 UHD電視",
                prod: {
                    pic: "./images/prod-item13.png",
                    title: "你找到了一個關鍵道具",
                    h3: "SAMSUNG 65吋 UHD電視",
                    txt: "大視所趨，首選三星！HDR 10+動態捕捉科技，真正的4K UHD解析度！",
                    price: "49900",
                    cupon: "34900",
                    link: "http://bit.ly/2CXnbFL",
                    link_gtm: "立即購買_SAMSUNG 65吋 UHD電視",
                }
            },
            {
                width: 252,
                height: 112,
                x: 2979,
                y: 819,
                gtm: "找彩蛋_【幸福年菜】陳年紹興醉蝦",
                prod: {
                    pic: "./images/prod-item14.png",
                    title: "你找到了一個關鍵道具",
                    h3: "【幸福年菜】陳年紹興醉蝦",
                    txt: "2018蘋果日報副刊年菜評比 海鮮類第3名！口感彈牙、酒香四溢！",
                    price: "258",
                    cupon: "258",
                    link: "http://bit.ly/2CYzzWa",
                    link_gtm: "立即購買_【幸福年菜】陳年紹興醉蝦",
                }
            },
            // {
            //     width: 206,
            //     height: 79,
            //     x: 3086,
            //     y: 629,
            //     gtm: "找彩蛋_茂林伊利蛋(平飼冷藏)",
            //     prod: {
            //         pic: "./images/prod-item15.png",
            //         title: "你找到了一個關鍵道具",
            //         h3: "茂林伊利蛋(平飼冷藏)",
            //         txt: "快樂飼養的雞生下的勇健的蛋，單一蛋源，有產銷履歷身份的蛋",
            //         price: "135",
            //         cupon: "135",
            //         link: "http://bit.ly/2CWryAX",
            //         link_gtm: "立即購買_茂林伊利蛋(平飼冷藏)",
            //     }
            // },
            {
                width: 294,
                height: 88,
                x: 3117,
                y: 115,
                gtm: "找彩蛋_樂扣耐熱玻璃10件禮盒組(紀念版)",
                prod: {
                    pic: "./images/prod-item16.png",
                    title: "你找到了一個關鍵道具",
                    h3: "樂扣耐熱玻璃10件禮盒組(紀念版)",
                    txt: '樂扣樂扣"上蓋久" x 耐熱玻璃"尚安全"',
                    price: "2690",
                    cupon: "1290",
                    link: "http://bit.ly/2CYETJ5",
                    link_gtm: "立即購買_樂扣耐熱玻璃10件禮盒組(紀念版)",
                }
            }, 
            {
                width: 20,
                height: 90,
                x: 3300,
                y: 250,
                gtm: "找彩蛋_特福鈦金礦物32CM不沾平底鍋",
                prod: {
                    pic: "./images/prod-item17.png",
                    title: "你找到了一個關鍵道具",
                    h3: "特福鈦金礦物32CM不沾平底鍋",
                    txt: "法國製鍋具，FORCE配方鈦極不沾塗層極緻耐用",
                    price: "1880",
                    cupon: "1288",
                    link: "http://bit.ly/2CYwJkc",
                    link_gtm: "立即購買_特福鈦金礦物32CM不沾平底鍋",
                }
            }, 
            {
                width: 117,
                height: 143,
                x: 3230,
                y: 340,
                gtm: "找彩蛋_特福鈦金礦物32CM不沾平底鍋",
                prod: {
                    pic: "./images/prod-item17.png",
                    title: "你找到了一個關鍵道具",
                    h3: "特福鈦金礦物32CM不沾平底鍋",
                    txt: "法國製鍋具，FORCE配方鈦極不沾塗層極緻耐用",
                    price: "1880",
                    cupon: "1288",
                    link: "http://bit.ly/2CYwJkc",
                    link_gtm: "立即購買_特福鈦金礦物32CM不沾平底鍋",
                }
            }, 
            {
                width: 193,
                height: 134,
                x: 3575,
                y: 733,
                gtm: "找彩蛋_【幸福年菜】富貴高麗菜干蹄膀",
                prod: {
                    pic: "./images/prod-item18.png",
                    title: "你找到了一個關鍵道具",
                    h3: "【幸福年菜】富貴高麗菜干蹄膀",
                    txt: "產銷履歷豬肉，肉質Q彈、搭配古早味高麗菜干入口甘甜傳統好汁味",
                    price: "588",
                    cupon: "588",
                    link: "http://bit.ly/2CYrFw0",
                    link_gtm: "立即購買_【幸福年菜】富貴高麗菜干蹄膀",
                }
            }, 
            {
                width: 65,
                height: 211,
                x: 3800,
                y: 500,
                gtm: "找彩蛋_金蘭醬油",
                prod: {
                    pic: "./images/prod-item19.png",
                    title: "你找到了一個關鍵道具",
                    h3: "金蘭醬油",
                    txt: "850毫升，非基因改造黃豆製造，每個不同家庭都要有的金蘭醬油",
                    price: "71",
                    cupon: "70",
                    link: "http://bit.ly/2CYFzhB",
                    link_gtm: "立即購買_金蘭醬油",
                }
            },
        ],
        this.init();
    }
    init() {
        $(".loading-page").addClass('none');
        var _self = this;
        PIXI.utils.skipHello();
        _self.app = new PIXI.Application({
            width: _self.canvasWidth,
            height: _self.canvasHeight,
            backgroundColor: 0x75001b,
            autoResize: true,
            resolution:2
        });
        document.getElementById("game_area").appendChild(_self.app.view);

        PIXI.loader
            .add('./images/images.jpg')
            .add('./images/game-bottom.png')
            .add('./images/pc-game-bottom.png')
            .load(init);
        
        function init() {
            var bgimg = new PIXI.Texture.fromImage('./images/images.jpg');

            var background = new PIXI.Sprite(bgimg);
            _self.app.stage.addChild(background);
            var proportion = background.width / background.height;
            background.height = _self.canvasHeight;
            background.width = _self.canvasHeight * proportion;
            background.interactive = true; // 設定可以互動
            background.buttonMode = true; // 當滑鼠滑過時顯示為手指圖示`
            background.position.x = 0;
            background.position.y = 0;
            background
                .on('mousedown', onDragStart)
                .on('touchstart', onDragStart)
                // events for drag end
                .on('mouseup', onDragEnd)
                .on('mouseupoutside', onDragEnd)
                .on('touchend', onDragEnd)
                .on('touchendoutside', onDragEnd)
                // events for drag move
                .on('mousemove', onDragMove)
                .on('touchmove', onDragMove);
            
            $(".block_1").click(function () {
                background.position.x = 0;
            })
            if(!isMobile) {
                $(".block_2").click(function () {
                    background.position.x = -(background.width *0.2);
                })
            } else {
                $(".block_2").click(function () {
                    background.position.x = -(background.width * 0.5);
                })
                $(".btn-easter").click(function () {
                    background.position.x = -(background.width * 0.5);
                })
            }
            $(".block_3").click(function () {
                background.position.x = -(background.width - _self.canvasWidth);
            })

            //=====bottom=====//
            var bottomCon = new PIXI.Container();
            var bgbottomimg = new PIXI.Texture.fromImage('./images/game-bottom.png');
            var pcbgbottomimg = new PIXI.Texture.fromImage('./images/pc-game-bottom.png');
            var bgbottom = new PIXI.Sprite(bgbottomimg);
            var pcbgbottom = new PIXI.Sprite(pcbgbottomimg);
            var bgppp = window.innerWidth / bgbottomimg.width;
            var pcbgppp = window.innerWidth / pcbgbottomimg.width;
            _self.app.stage.addChild(bottomCon);
            if(!isMobile) {
                bottomCon.addChild(pcbgbottom);
                pcbgbottom.width = window.innerWidth;
                pcbgbottom.height = pcbgbottomimg.height * pcbgppp;
                bottomCon.y = _self.canvasHeight - pcbgbottom.height;
            } else {
                bottomCon.addChild(bgbottom);
                bgbottom.width = window.innerWidth;
                bgbottom.height = bgbottomimg.height * bgppp;
                bottomCon.y = _self.canvasHeight - bgbottom.height;
            }
            // console.log(bgppp)
            
            // bgbottom.y = _self.canvasHeight - bgbottom.height;
            var graphics = new PIXI.Graphics();
            graphics.lineStyle(2, 0x0000FF, 1);
            // graphics.beginFill(0xFF700B, 1);
            graphics.drawRect(50, 250, 120, 120);
            // background.addChild(graphics);

            _self.items.map(function (obj, inx) {
                itemContainer(obj, inx)
            });
            function itemContainer(obj, inx) {
                var itemContainer = new PIXI.Container();
                itemContainer.width = obj.width;
                itemContainer.height = obj.height;
                itemContainer.position.x = obj.x;
                itemContainer.position.y = obj.y;
                itemContainer.name = 'item' + inx;
                itemContainer.interactive = false; // 設定可以互動
                itemContainer.buttonMode = false; // 當滑鼠滑過時顯示為手指圖示
                // itemContainer.on('pointerdown', function () {
                //     _self.gtmdata(obj.gtm);
                //     if(_self.clickCun >= 3) {
                //         // var probability = vm.eggRandom(100);
                //         var probability = Math.floor(Math.random()*100);
                //         console.log(probability);
                //         if(probability <= _self.gameProbability) {
                //             console.log(_self.gameProbability);
                //             _self.eggPop = true;
                //             _self.gameluckyAward = Math.floor(Math.random()*6)+1;
                //             _self.set_awardItem(_self.gameluckyAward)
                //             return;
                //         }
                //     }
                //     _self.clickCun++
                //     _self.prodPop = true;
                //     _self.product = obj.prod;
                // });
                background.addChild(itemContainer);
                // console.log(itemContainer)
                // var item = PIXI.Sprite.fromImage("./images/items-fe.png");

                var item = new PIXI.Graphics();
                // console.log(item)
                var Twidth = obj.width;
                var Theight = obj.height;
                item.beginFill(0xFF00BB, 0);//範圍//
                item.drawRect(0, 0, Twidth, Theight);
                item.endFill();
                item.interactive =  true;
                item.buttonMode = true;
                item.on('pointerdown', function () {
                    _self.gtmdata(obj.gtm);
                    if(_self.clickCun >= 3) {
                        // var probability = vm.eggRandom(100);
                        var probability = Math.floor(Math.random()*100);
                        console.log(probability);
                        if(probability <= _self.gameProbability) {
                            console.log(_self.gameProbability);
                            _self.eggPop = true;
                            _self.gameluckyAward = Math.floor(Math.random()*6)+1;
                            _self.set_awardItem(_self.gameluckyAward)
                            return;
                        }
                    }
                    _self.clickCun++
                    _self.prodPop = true;
                    _self.product = obj.prod;
                });
                itemContainer.addChild(item);

                var aminSize = 165 // x164
                var aniImages = [
                    "./images/deco-item-1-0.png",
                    "./images/deco-item-1-10.png",
                    "./images/deco-item-1-20.png",
                    "./images/deco-item-1-30.png",
                    "./images/deco-item-1-40.png",
                    "./images/deco-item-1-50.png",
                    "./images/deco-item-1-60.png",
                    "./images/deco-item-1-70.png",
                    "./images/deco-item-1-80.png",
                    "./images/deco-item-1-90.png",
                    "./images/deco-item-1-100.png",
                    "./images/deco-item-1-90.png",
                    "./images/deco-item-1-80.png",
                    "./images/deco-item-1-70.png",
                    "./images/deco-item-1-60.png",
                    "./images/deco-item-1-50.png",
                    "./images/deco-item-1-40.png",
                    "./images/deco-item-1-30.png",
                    "./images/deco-item-1-20.png",
                    "./images/deco-item-1-10.png",
                    "./images/deco-item-1-0.png",
                ]
                var textureArray = [];

                for (var i = 0; i < aniImages.length; i++) {
                    var texture = PIXI.Texture.from(aniImages[i]);
                    textureArray.push(texture);
                }
                var animatedSprite = new PIXI.extras.AnimatedSprite(textureArray);
                animatedSprite.anchor.set(0.5);
                // animatedSprite.rotation = 0;
                if (itemContainer.width < 100) {
                    animatedSprite.scale.set(itemContainer.width / aminSize);
                };
                animatedSprite.gotoAndPlay(Math.random() * 10000);
                animatedSprite.animationSpeed = Math.random() * (0.1 - 0.05) + 0.08;
                animatedSprite.x = 20;
                animatedSprite.y = 20;
                itemContainer.addChild(animatedSprite);
            };

            //=====animate=====//
            var aniImages = [
                "./images/deco-item-1-0.png",
                "./images/deco-item-1-10.png",
                "./images/deco-item-1-20.png",
                "./images/deco-item-1-30.png",
                "./images/deco-item-1-40.png",
                "./images/deco-item-1-50.png",
                "./images/deco-item-1-60.png",
                "./images/deco-item-1-70.png",
                "./images/deco-item-1-80.png",
                "./images/deco-item-1-90.png",
                "./images/deco-item-1-100.png",
                "./images/deco-item-1-90.png",
                "./images/deco-item-1-80.png",
                "./images/deco-item-1-70.png",
                "./images/deco-item-1-60.png",
                "./images/deco-item-1-50.png",
                "./images/deco-item-1-40.png",
                "./images/deco-item-1-30.png",
                "./images/deco-item-1-20.png",
                "./images/deco-item-1-10.png",
                "./images/deco-item-1-0.png",
            ]
            var textureArray = [];

            for (var i = 0; i < aniImages.length; i++) {
                var texture = PIXI.Texture.from(aniImages[i]);
                textureArray.push(texture);
            }
            var animatedSprite = new PIXI.extras.AnimatedSprite(textureArray);
            animatedSprite.anchor.set(0.5);
            // animatedSprite.rotation = 0;
            if (itemContainer.width < 100) {
                animatedSprite.scale.set(itemContainer.width / aminSize);
            };
            animatedSprite.gotoAndPlay(Math.random() * 10000);
            animatedSprite.animationSpeed = Math.random() * (0.1 - 0.05) + 0.08;
            animatedSprite.x = 10;
            animatedSprite.y = 10;
            // bottomCon.addChild(animatedSprite);

            window.onresize = function (event) {
                var w = window.innerWidth;
                var h = window.innerHeight;
                // console.log("onresize")
                var rebgppp = window.innerWidth / bgbottomimg.width
                var repcbgppp = window.innerWidth / pcbgbottomimg.width
                // console.log(repcbgppp)
    
                _self.app.renderer.resize(w, h);
                if(!isMobile) {
                    this.canvasHeight = window.innerHeight - ($(".gamePop_area .bottom").height() + $(".gamePop_area .top").height());
                } else {
                    this.canvasHeight = window.innerHeight - ($(".nav").height() + $(".gamePop_area .bottom").height() + $(".gamePop_area .top").height());
                }
                // 將畫面的正中間放在 app.renderer 一半寬高的位置
                // _self.app.stage.x = _self.app.renderer.width * 0.5;
                // _self.app.stage.y = _self.app.renderer.height * 0.5;
                _self.app.stage.x = 0;
                _self.app.stage.y = 0;
                background.height = canvasHeight;
                background.width = background.height * proportion;
                if(!isMobile) {
                    pcbgbottom.width = window.innerWidth;
                    pcbgbottom.height = pcbgbottomimg.height * repcbgppp;
                    bottomCon.y = background.height - pcbgbottom.height;
                } else {
                    bgbottom.width = window.innerWidth;
                    bgbottom.height = bgbottomimg.height * rebgppp;
                    bottomCon.y = background.height - bgbottom.height;
                }
            };
            function onDragStart(event) {
                // store a reference to the data
                // the reason for this is because of multitouch
                // we want to track the movement of this particular touch
                // this.data = event.data;
                // this.alpha = 0.5;
                // this.dragging = true;

                if (!this.dragging) {
                    this.data = event.data;
                    this.dragging = true;
                    this.dragPoint = event.data.getLocalPosition(this.parent);
                    this.dragPoint.x -= this.x;
                    this.dragPoint.y -= this.y;
                }
            };

            function onDragEnd() {
                this.alpha = 1;
                this.dragging = false;
                // set the interaction data to null
                this.data = null;
            };

            function onDragMove() {
                if (this.dragging) {
                    var newPosition = this.data.getLocalPosition(this.parent);
                    // var newPosition = this.data.getLocalPosition(this);
                    // this.x = newPosition.x;
                    this.x = newPosition.x - this.dragPoint.x;
                    // this.y = newPosition.y;
                    // console.log("1="+newPosition.x);
                    // console.log("2="+this.dragPoint.x);
                    // console.log("3="+this.width);
                    if (this.x < -(this.width - _self.canvasWidth)) {
                        // alert("over");
                        // this.dragging = false;
                        // this.x = -this.width;
                        // this.data = null;
                        // console.log("over");
                        this.x = -(this.width - _self.canvasWidth);
                    }
                    if (this.x > 0) {
                        this.x = 0;
                    }
                }
            };
        }

    }
    
    
}