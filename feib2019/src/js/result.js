var result = new Vue({
    el: "#app",
    data: {
        allcun: 0,
        cunArr: [],
        shareTitle: "製作你的夢想雲圖",
        titleh2url: "",
        titleh3url: "",
        inputArr: [],
        game: {},
        answer: {
            anstitle: "",
            roundpic: "",
            ansleft: "",
            ansleftmb: "",
            ansright: "",
            ansrightmb: "",
            lefttxt: "",
            righttxt: "",
            mbrtxt1: "",
            mbrtxt2: "",
            mbltxt1: "",
            mbltxt2: "",
            content: "",
        },
        itemspicUrl: [
            "./images/status1-4.png",
            "./images/status1-7.png",
            "./images/status1-5.png",
            "./images/status1-3.png",
            "./images/status1-1.png",
            "./images/status1-6.png",
            "./images/status1-2.png",
            "./images/status1-8.png",
            "./images/status1-8.png",
            "./images/status1-8.png",
        ],

        //=====api=====//
        base64Img: "",
        token: "",
        aid: "",
        shareUrl: "",
    },
    methods: {
        setgame: function(){
            var vm = this;
            vm.game = new Games({
                Gitemspic : vm.itemspicUrl,
                Gtitleh2url : vm.titleh2url,
                Gtitleh3url : vm.titleh3url,
                GinputArr : vm.inputArr,
                appendAt: $('#pixiarea'),
                canHeight: 1000,
                canWidth: 1000,
                titleArr: [
                    {
                        name: "h2",
                        width: 840,
                        height: 149,
                        x: (1000-840)/2,
                        y: 59,
                        pic: vm.titleh2url,
                    },
                    {
                        name: "h3",
                        width: 750,
                        height: 64,
                        x: (1000-750)/2,
                        y: 225,
                        pic: vm.titleh3url,
                    },
                ],
                itemsArr: [
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
                        pic: vm.itemspicUrl[7],
                        mbwidth: 66,
                        mbheight: 54,
                        mbx: 45,
                        mby: 137,
                        txt: vm.inputArr[0],
                    },
                    {
                        name: "cloud-2",
                        width: 139,
                        height: 117,
                        x: 830,
                        y: 298,
                        // pic: "./images/status1-8.png",
                        pic: vm.itemspicUrl[8],
                        mbwidth: 66,
                        mbheight: 54,
                        mbx: 204,
                        mby: 147,
                        txt: vm.inputArr[1],
                    },
                    {
                        name: "cloud-3",
                        width: 139,
                        height: 117,
                        x: 79,
                        y: 540,
                        // pic: "./images/status1-8.png",
                        pic: vm.itemspicUrl[9],
                        mbwidth: 66,
                        mbheight: 54,
                        mbx: 122,
                        mby: 339,
                        txt: vm.inputArr[2],
                    },
                    {
                        name: "plane",
                        width: 113,
                        height: 101,
                        x: 318,
                        y: 316,
                        pic: vm.itemspicUrl[6],
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
                        pic: vm.itemspicUrl[5],
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
                        pic: vm.itemspicUrl[4],
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
                        pic: vm.itemspicUrl[0],
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
                        pic: vm.itemspicUrl[1],
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
                        pic: vm.itemspicUrl[2],
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
                        pic: vm.itemspicUrl[3],
                        mbwidth: 112/2,
                        mbheight: 100/2,
                        mbx: 88/2,
                        mby: 602/2,
                    },
                ],
            });
            vm.game.init()
        },
        setTitle: function() {
            var vm = this;
            if(vm.allcun <= 6) {
                vm.titleh2url = "./images/game_h2-type1.png";
                vm.titleh3url = "./images/game_h3-type1.png";
                vm.answer.anstitle = "./images/ans1-title.png";
                vm.answer.roundpic = "./images/ans1-round.png";
                vm.answer.ansleft = "./images/ans1-left.png";
                vm.answer.ansleftmb = "./images/ans1-left-mb.png";
                vm.answer.ansright = "./images/ans1-right.png";
                vm.answer.ansrightmb = "./images/ans1-right-mb.png";
                vm.answer.lefttxt = "財富原來這麼近";
                vm.answer.mbltxt1 = "財富原來";
                vm.answer.mbltxt2 = "這麼近";
                vm.answer.righttxt = "COCO放大術";
                vm.answer.mbrtxt1 = "COCO";
                vm.answer.mbrtxt2 = "放大術";
                vm.answer.content = "趁年輕就要開始理財，如何成為完美理財的";
            }
            if(vm.allcun >= 7 && vm.allcun <= 12) {
                vm.titleh2url = "./images/game_h2-type2.png";
                vm.titleh3url = "./images/game_h3-type2.png";
                vm.answer.anstitle = "./images/ans1-title.png";
                vm.answer.roundpic = "./images/ans2-round.png";
                vm.answer.ansleft = "./images/ans2-left.png";
                vm.answer.ansleftmb = "./images/ans2-left-mb.png";
                vm.answer.ansright = "./images/ans2-right.png";
                vm.answer.ansrightmb = "./images/ans2-right-mb.png";
                vm.answer.lefttxt = "有付出才有富出";
                vm.answer.mbltxt1 = "有付出";
                vm.answer.mbltxt2 = "才有富出";
                vm.answer.righttxt = "財富能量大爆發!";
                vm.answer.mbrtxt1 = "財富能量";
                vm.answer.mbrtxt2 = "大爆發!";
                vm.answer.content = "沒有錢萬萬不能，趁年輕就要開始理財，如何成為完美理財的";
            }
            if(vm.allcun >= 13 && vm.allcun <= 17) {
                vm.titleh2url = "./images/game_h2-type3.png";
                vm.titleh3url = "./images/game_h3-type3.png";
                vm.answer.anstitle = "./images/ans3-title.png";
                vm.answer.roundpic = "./images/ans3-round.png";
                vm.answer.ansleft = "./images/ans3-left.png";
                vm.answer.ansleftmb = "./images/ans3-left-mb.png";
                vm.answer.ansright = "./images/ans3-right.png";
                vm.answer.ansrightmb = "./images/ans3-right-mb.png";
                vm.answer.lefttxt = "你的理財夜明珠";
                vm.answer.mbltxt1 = "你的理財";
                vm.answer.mbltxt2 = "夜明珠";
                vm.answer.righttxt = "自己財富自己賺";
                vm.answer.mbrtxt1 = "自己財富";
                vm.answer.mbrtxt2 = "自己賺";
                vm.answer.content = "沒有錢萬萬不能，理財永遠不嫌晚，如何成為完美理財的";
            }
            if(vm.allcun >= 18) {
                vm.titleh2url = "./images/game_h2-type4.png";
                vm.titleh3url = "./images/game_h3-type4.png";
                vm.answer.anstitle = "./images/ans4-title.png";
                vm.answer.roundpic = "./images/ans4-round.png";
                vm.answer.ansleft = "./images/ans4-left.png";
                vm.answer.ansleftmb = "./images/ans4-left-mb.png";
                vm.answer.ansright = "./images/ans4-right.png";
                vm.answer.ansrightmb = "./images/ans4-right-mb.png";
                vm.answer.lefttxt = "投資不停，財富穩贏";
                vm.answer.mbltxt1 = "投資不停";
                vm.answer.mbltxt2 = "財富穩贏";
                vm.answer.righttxt = "存得安心，花得開心";
                vm.answer.mbrtxt1 = "存得安心";
                vm.answer.mbrtxt2 = "花得開心";
                vm.answer.content = "沒有錢萬萬不能，理財永遠不嫌晚，如何成為完美理財的";
            }
        },
        fbshare: function() {
            var vm = this;
            var fbhtml_url= "http://share.friendo.com.tw/feib2019/index2?aid=" + vm.aid; //網址
            // var fbhtml_url= vm.shareUrl; //圖
            var isIE=window.ActiveXObject || "ActiveXObject" in window;
            if(isIE) {
                window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url);return false;
            } else {
                window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url+'&hashtag=%23'+vm.shareTitle);return false;
            }
        },
        setImgurl: function() {
            var vm = this;
            vm.itemspicUrl[0] = "./images/status"+(parseInt(vm.cunArr[0].split("_",1))+1)+"-4.png";
            vm.itemspicUrl[1] = "./images/status"+(parseInt(vm.cunArr[1].split("_",1))+1)+"-7.png";
            vm.itemspicUrl[2] = "./images/status"+(parseInt(vm.cunArr[2].split("_",1))+1)+"-5.png";
            vm.itemspicUrl[3] = "./images/status"+(parseInt(vm.cunArr[3].split("_",1))+1)+"-3.png";
            vm.itemspicUrl[4] = "./images/status"+(parseInt(vm.cunArr[4].split("_",1))+1)+"-1.png";
            vm.itemspicUrl[5] = "./images/status"+(parseInt(vm.cunArr[5].split("_",1))+1)+"-6.png";
            vm.itemspicUrl[6] = "./images/status"+(parseInt(vm.cunArr[6].split("_",1))+1)+"-2.png";
            if(vm.cunArr[7]!=null || vm.cunArr[7]!=undefined) {
                vm.itemspicUrl[7] = "./images/status"+(parseInt(vm.cunArr[7].split("_",1))+1)+"-8.png";
                vm.inputArr.push(vm.cunArr[7].split("_")[1]);
            }
            if(vm.cunArr[8]!=null || vm.cunArr[8]!=undefined) {
                vm.itemspicUrl[8] = "./images/status"+(parseInt(vm.cunArr[8].split("_",1))+1)+"-8.png";
                vm.inputArr.push(vm.cunArr[8].split("_")[1]);
            }
            if(vm.cunArr[9]!=null || vm.cunArr[9]!=undefined) {
                vm.itemspicUrl[9] = "./images/status"+(parseInt(vm.cunArr[9].split("_",1))+1)+"-8.png";
                vm.inputArr.push(vm.cunArr[9].split("_")[1]);
            }
            // vm.cunArr.forEach(function(obj){
            // });
        },
    },
    mounted: function() {
        var vm = this;
        var url = location.href;
        vm.aid = findGetParameter("aid");
        if(url.indexOf('?')==-1) {
            window.open("index.html","_self");
        } else {
            if(vm.aid=="") {
                window.open("index.html","_self");
            }
        }
        vm.getToken().then(function(){
            vm.getShare().then(function(){
                vm.setTitle();
                vm.setImgurl();
                vm.setgame();
            });
        });
        // vm.setgame();
        PIXI.loader.add(`./images/people.png`);
        for (var x = 1; x <= 8; x++){
            for (var y = 1; y <= 4; y++) {
                PIXI.loader.add(`./images/status${y}-${x}.png`);
            }
        }
        for (var x = 1; x <= 4; x++) {
            PIXI.loader.add(`./images/game_h2-type${x}.png`);
            PIXI.loader.add(`./images/game_h3-type${x}.png`);
        }
        PIXI.loader.load(function(){
            vm.pageLoad();
        })
    }
});