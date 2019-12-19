class Games {
    constructor(options) {
        var _self = this;
        this.canvasHeight = options.canHeight;
        this.canvasWidth = options.canWidth;
        // this.canvasWidth = $(".gamearea  .l-container").width();
        // if(!isMobile) {
        //     this.canvasHeight = 891;
        //     this.canvasWidth = $(".gamearea  .l-container").width();
        //     // this.canvasWidth = 891 * 2;
        //     // this.canvasHeight = 600;
        //     // this.canvasWidth = 1200;
        // } else {
        //     this.canvasHeight = 812/2;
        //     this.canvasWidth = screen.width;
        // }
        this.Gitemspic = options.Gitemspic;
        this.Gtitleh2url = options.Gtitleh2url;
        this.Gtitleh3url = options.Gtitleh3url;
        this.GinputArr = options.GinputArr
        this.appendAt = options.appendAt;
        // this.canvasHeiht = $(".answerblock > .l-container").height();
        this.titles = options.titleArr;
        this.items = options.itemsArr;

        this.app = null;
    }
    init() {
        var _self = this;
        return new Promise(function (resolve) {
            PIXI.utils.skipHello();
            //=====設定canvas大小=====/
            _self.app = new PIXI.Application(_self.canvasWidth, _self.canvasHeight, {
                // width: _self.canvasWidth,
                // height: _self.canvasHeight,
                // width: 1000,
                // height: 891,
                // backgroundColor: 0xA9E6F1,
                transparent: false,
                autoResize: true,
                resolution: 2,
            });
            // _self.app.stage.backgroundColor = 0xA9E6F1;
            // document.getElementById("pixiarea").appendChild(_self.app.view);
            _self.appendAt.append(_self.app.view);

            // PIXI.loader
            //     .add('./images/people.png')
            //     .add('./images/bg-canvas.png')
            //     .add('./images/game_h2-type1.png')
            //     .add('./images/game_h2-type2.png')
            //     .add('./images/game_h2-type3.png')
            //     .add('./images/game_h2-type4.png')
            //     .load(function () { 
            init();
            resolve();
        });

        function init() {
            var graphics = new PIXI.Graphics();
            graphics.beginFill(0x8DDEF0);
            graphics.drawRect(0, 0, _self.canvasWidth, _self.canvasHeight);
            graphics.endFill();
            _self.app.stage.addChild(graphics);

            //=====設定背景=====//
            // var canbg = new PIXI.Sprite.fromImage('./images/bg-canvas.png');
            // canbg.width =  _self.canvasWidth;
            // _self.app.stage.addChild(canbg);
            var people = new PIXI.Container();
            people.name = 'people_content';
            _self.app.stage.addChild(people);
            _self.items.forEach(function (obj,x) {
                itemContainer(obj)
            });
            people.position = new PIXI.Point(0, 0)

            _self.titles.forEach(function (obj,x) {
                titleContainer(obj);
            });
            function titleContainer(obj) {
                //=====設定元件的容器=====//
                var titleContainer = new PIXI.Container();
                titleContainer.width = obj.width;
                // titleContainer.x = (_self.canvasWidth - obj.width)/2;
                titleContainer.x = obj.x;
                titleContainer.y = obj.y;
                // titleContainer.x = _self.canvasWidth-obj.width;
                // titleContainer.y = obj.fbsharey;
                // if(!isMobile) {
                //     titleContainer.x = (_self.canvasWidth - obj.width)/2;
                //     titleContainer.y = obj.y;
                // } else {
                //     titleContainer.x = (_self.canvasWidth - obj.mbwidth)/2;
                //     titleContainer.y = obj.mby;
                // }
                titleContainer.name = obj.name;
                _self.app.stage.addChild(titleContainer);

                //=====設定元件大小內容=====//
                var titles = new PIXI.Sprite.fromImage(obj.pic);
                titles.width = obj.width;
                titles.height = obj.height;
                // if(!isMobile) {
                //     titles.width = obj.width;
                //     titles.height = obj.height;
                // } else {
                //     titles.width = obj.mbwidth;
                //     titles.height = obj.mbheight;
                // }
                titleContainer.addChild(titles);
            };
            // var people = new PIXI.Container();
            // people.name = 'people_content';
            // _self.app.stage.addChild(people);
            // _self.items.map(function (obj) {
            //     itemContainer(obj)
            // });
            // people.position = new PIXI.Point(0, 0)
            // if (!isMobile) {
            //     // people.position = new PIXI.Point((_self.app.stage.width - people.width) / 2, 0)
            //     people.position = new PIXI.Point(0, 0)
            // }
            // else {
            //     people.position = new PIXI.Point(0, 0)
            // }
            function itemContainer(obj) {
                //=====設定元件的容器=====//
                var itemContainer = new PIXI.Container();
                itemContainer.x = obj.x;
                itemContainer.y = obj.y;
                // if(!isMobile) {
                //     itemContainer.x = obj.x;
                //     itemContainer.y = obj.y;
                // } else {
                //     itemContainer.x = obj.mbx;
                //     itemContainer.y = obj.mby;
                // }
                itemContainer.name = obj.name;
                people.addChild(itemContainer);

                //=====設定元件大小內容=====//
                var item = new PIXI.Sprite.fromImage(obj.pic);
                item.width = obj.width;
                item.height = obj.height;
                // if(!isMobile) {
                //     item.width = obj.width;
                //     item.height = obj.height;
                // } else {
                //     item.width = obj.mbwidth;
                //     item.height = obj.mbheight;
                // }
                itemContainer.addChild(item);

                //=====填入文字=====//
                var txtstyle = new PIXI.TextStyle({
                    fontFamily: 'Noto Sans TC',
                    fontSize: 22,
                    fontWeight: 'bold',
                    // transform: 'rotate(7deg)',
                });
                // if (!isMobile) {
                //     var txtstyle = new PIXI.TextStyle({
                //         fontFamily: 'Noto Sans TC',
                //         fontSize: 24,
                //         fontWeight: 'bold',
                //         // transform: 'rotate(7deg)',
                //     });
                // }
                // else {
                //     var txtstyle = new PIXI.TextStyle({
                //         fontFamily: 'Noto Sans TC',
                //         fontSize: 12,
                //         // fontWeight: 'bold',
                //         // transform: 'rotate(7deg)',
                //     });
                // }
                // var txttransform = new PIXI.Transform({
                //     rotation : 30,
                // })
                var itemtxt = new PIXI.Text(obj.txt, txtstyle);
                // itemtxt.pivot.x = itemtxt.width / 2;
                itemtxt.pivot.y = itemtxt.height / 2;
                itemtxt.x = 15;
                itemtxt.y = 25;
                // if (!isMobile) {
                //     // itemtxt.x = ((obj.width-itemtxt.width) / 2)+(itemtxt.width/2);
                //     // itemtxt.y = ((obj.height-itemtxt.height) / 2)-(itemtxt.height/2);
                //     itemtxt.x = 34;
                //     itemtxt.y = 30;
                // }
                // else {
                //     // itemtxt.x = itemtxt.width / 1.5;
                //     // itemtxt.y = itemtxt.height / 2.5;
                //     itemtxt.x = 14;
                //     itemtxt.y = 5;
                // }
                // itemtxt.x = (obj.width-itemtxt.width) / 2;
                // itemtxt.y = (obj.height-itemtxt.height) / 2;
                itemtxt.rotation = 0.63,

                    itemContainer.addChild(itemtxt);

                var posy = itemContainer.y;
                // _self.app.ticker.add(function(delta) {
                //     posy += 1;
                //     posy -= 1;
                //     // if(itemContainer.y <= itemContainer.y) {
                //     //     itemContainer.y += 1;
                //     // } if(itemContainer.y >= itemContainer.y+10) {
                //     //     itemContainer.y -= 1;
                //     // }

                // });
            };

            window.onresize = function (event) {
                var w = _self.canvasWidth;
                var h = _self.canvasHeight;

                _self.app.renderer.resize(w, h);
                _self.app.stage.x = 0;
                _self.app.stage.y = 0;
            }
        }
    }
    saveImg() {
        var _self = this;
        return _self.app.renderer.plugins.extract.base64(_self.app.stage);
        // return _self.app.view.toDataURL();
        // return _self.app.renderer.extract.canvas().toDataURL("image/png", 1);
        // if (navigator.userAgent.indexOf('MSIE') > 0) {
        //     return _self.app.renderer.view.toDataURL("image/jpeg", 0.6);
        //     // return _self.app.view.toBlob((blob)=>{
        //     //     console.log(URL.createObjectURL(blob))
        //     // });
        // } else {
        //     return _self.app.renderer.extract.canvas().toDataURL("image/jpeg", 0.6);
        // }
    }
}