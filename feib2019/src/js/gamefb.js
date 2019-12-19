
class Gamesfb{
    constructor(options) {
        var _self = this;
        this.canvasHeight = 1000;
        this.canvasWidth = 1000;
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
        // this.canvasHeiht = $(".answerblock > .l-container").height();
        this.titles = [
            {
                name: "h2",
                width: 566,
                height: 100,
                y: 59,
                pic: this.Gtitleh2url,
                mbwidth: 288,
                mbheight: 51,
                mby: 24,
                fbsharex: 10,
                fbsharey: 600,
            },
            {
                name: "h3",
                width: 500,
                height: 42,
                y: 205,
                pic: this.Gtitleh3url,
                mbwidth: 350,
                mbheight: 30,
                mby: 80,
                fbsharex: 10,
                fbsharey: 700,
            },
        ];
        this.items = [
            {
                name: "people",
                width: 492,
                height: 422,
                x: 269,
                y: 439,
                pic: "./images/people.png",
                mbwidth: 153,
                mbheight: 131,
                mbx: 77,
                mby: 224,
            },
            {
                name: "cloud-1",
                width: 139,
                height: 117,
                x: 32,
                y: 260,
                // pic: "./images/status1-8.png",
                pic: this.Gitemspic[7],
                mbwidth: 66,
                mbheight: 54,
                mbx: 45,
                mby: 137,
                txt: this.GinputArr[0],
            },
            {
                name: "cloud-2",
                width: 139,
                height: 117,
                x: 830,
                y: 298,
                // pic: "./images/status1-8.png",
                pic: this.Gitemspic[8],
                mbwidth: 66,
                mbheight: 54,
                mbx: 204,
                mby: 147,
                txt: this.GinputArr[1],
            },
            {
                name: "cloud-3",
                width: 139,
                height: 117,
                x: 79,
                y: 540,
                // pic: "./images/status1-8.png",
                pic: this.Gitemspic[9],
                mbwidth: 66,
                mbheight: 54,
                mbx: 122,
                mby: 339,
                txt: this.GinputArr[2],
            },
            {
                name: "plane",
                width: 113,
                height: 101,
                x: 318,
                y: 316,
                pic: this.Gitemspic[6],
                mbwidth: 104/2,
                mbheight: 94/2,
                mbx: 267/2,
                mby: 259/2,
            },
            {
                name: "babycar",
                width: 111,
                height: 110,
                x: 174,
                y: 397,
                pic: this.Gitemspic[5],
                mbwidth: 102/2,
                mbheight: 100/2,
                mbx: 67/2,
                mby: 386/2,
            },
            {
                name: "house",
                width: 123,
                height: 107,
                x: 454,
                y: 362,
                pic: this.Gitemspic[4],
                mbwidth: 100/2,
                mbheight: 90/2,
                mbx: 270/2,
                mby: 372/2,
            },
            {
                name: "hat",
                width: 99,
                height: 119,
                x: 644,
                y: 356,
                // pic: "./images/status1-4.png",
                pic: this.Gitemspic[0],
                mbwidth: 92/2,
                mbheight: 110/2,
                mbx: 580/2,
                mby: 289/2,
            },
            {
                name: "bag",
                width: 107,
                height: 103,
                x: 828,
                y: 424,
                pic: this.Gitemspic[1],
                mbwidth: 100/2,
                mbheight: 96/2,
                mbx: 418/2,
                mby: 444/2,
            },
            {
                name: "money",
                width: 104,
                height: 95,
                x: 698,
                y: 513,
                pic: this.Gitemspic[2],
                mbwidth: 97/2,
                mbheight: 88/2,
                mbx: 542/2,
                mby: 472/2,
            },
            {
                name: "car",
                width: 122,
                height: 109,
                x: 275,
                y: 677,
                pic: this.Gitemspic[3],
                mbwidth: 112/2,
                mbheight: 100/2,
                mbx: 88/2,
                mby: 602/2,
            },
        ];
        this.app=null;
        this.init();
    }
    init() {
        var _self = this;
        PIXI.utils.skipHello();
        //=====設定canvas大小=====/
        _self.app = new PIXI.Application(_self.canvasWidth,_self.canvasHeight,{
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
        document.getElementById("pixifbshare").appendChild(_self.app.view);

        PIXI.loader
            .add('./images/people.png')
            .add('./images/bg-canvas.png')
            .add('./images/game_h2-type1.png')
            .add('./images/game_h2-type2.png')
            .add('./images/game_h2-type3.png')
            .add('./images/game_h2-type4.png')
            .load(init);

        function init() {
            var graphics = new PIXI.Graphics();
            graphics.beginFill(0x8DDEF0);
            graphics.drawRect(0, 0, _self.canvasWidth, _self.canvasHeight);
            graphics.endFill();
            _self.app.stage.addChild(graphics);

            //=====設定背景=====//
            var canbg = new PIXI.Sprite.fromImage('./images/bg-canvas-fb.png');
            canbg.width =  _self.canvasWidth;
            _self.app.stage.addChild(canbg);

            var people = new PIXI.Container();
            people.name = 'people_content';
            _self.app.stage.addChild(people);
            _self.items.map(function (obj) {
                itemContainer(obj)
            });
            people.position = new PIXI.Point(0, 0)

            _self.titles.map(function (obj) {
                titleContainer(obj)
            });
            function titleContainer(obj) {
                //=====設定元件的容器=====//
                var titleContainer = new PIXI.Container();
                titleContainer.width = obj.width;
                // titleContainer.x = (_self.canvasWidth - obj.width)/2;
                // titleContainer.y = obj.y-50;
                titleContainer.x = _self.canvasWidth-obj.width;
                titleContainer.y = obj.fbsharey;
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
                itemContainer.y = obj.y-50;
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

            window.onresize = function(event) {
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
        // return _self.app.renderer.view.toDataURL("image/png", 1);
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