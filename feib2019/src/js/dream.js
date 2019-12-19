
var dream = new Vue({
    el: "#app",
    data: {
        step_page: 'question',
        question: 1, //evan
        btnsel: 1,
        btntype: 1,
        allcun: 0,
        selcun: 0,
        cunArr: [],
        otherinput: "",
        inputArr: [],
        gamefb: {},
        questionpic: {
            q1pic: "./images/quk-1-1.png",
            q2pic: "./images/quk-2-1.png",
            q3pic: "./images/quk-3-1.png",
            q4pic: "./images/quk-4-1.png",
            q5pic: "./images/quk-5-1.png",
            q6pic: "./images/quk-6-1.png",
            q7pic: "./images/quk-7-1.png",
            q8pic: "./images/freeqe-kv-1.png",
            q9pic: "./images/freeqe-kv-1.png",
            q10pic: "./images/freeqe-kv-1.png",
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
        stepCun: function() {
            var vm = this;
            if(vm.selcun=="") {
                alert("請選擇您的答案喔!");
                return
            }
            if(vm.question >= 8) {
                if(vm.otherinput=="") {
                    alert("請輸入夢想");
                    return
                } else {
                    vm.inputArr.push(vm.otherinput);
                    // vm.cunArr.push(vm.selcun+'_'+vm.otherinput);
                }
            }
            vm.allcun += parseInt(vm.selcun);
            vm.cunArr.push(vm.selcun+'_'+vm.otherinput);
            vm.setImgurl();
            vm.question++;
            $(".btnblock li").removeClass("active");
            if(vm.question >= 7) {
                vm.btntype = 2;
            }
            if(vm.question >= 8) {
                vm.btnsel = 2;
            }
            if(vm.question == 10) {
                $(".otherbtn").hide()
            }
            vm.selcun= 0;
            vm.otherinput= "";
            $("html,body").scrollTop(0);
        },
        setImgurl: function() {
            var vm = this;
            if(vm.question == 1) {
                vm.itemspicUrl.splice(0,1,"./images/status"+(parseInt(vm.selcun)+1)+"-4.png");
                vm.gaEvant("game_Q1_next")
            }
            if(vm.question == 2) {
                vm.itemspicUrl.splice(1,1,"./images/status"+(parseInt(vm.selcun)+1)+"-7.png");
                vm.gaEvant("game_Q2_next")
            }
            if(vm.question == 3) {
                vm.itemspicUrl.splice(2,1,"./images/status"+(parseInt(vm.selcun)+1)+"-5.png");
                vm.gaEvant("game_Q3_next")
            }
            if(vm.question == 4) {
                vm.itemspicUrl.splice(3,1,"./images/status"+(parseInt(vm.selcun)+1)+"-3.png");
                vm.gaEvant("game_Q4_next")
            }
            if(vm.question == 5) {
                vm.itemspicUrl.splice(4,1,"./images/status"+(parseInt(vm.selcun)+1)+"-1.png");
                vm.gaEvant("game_Q5_next")
            }
            if(vm.question == 6) {
                vm.itemspicUrl.splice(5,1,"./images/status"+(parseInt(vm.selcun)+1)+"-6.png");
                vm.gaEvant("game_Q6_next")
            }
            if(vm.question == 7) {
                vm.itemspicUrl.splice(6,1,"./images/status"+(parseInt(vm.selcun)+1)+"-2.png");
                vm.gaEvant("game_Q7_next")
            }
            if(vm.question == 8) {
                vm.itemspicUrl.splice(7,1,"./images/status"+(parseInt(vm.selcun)+1)+"-8.png");
                vm.gaEvant("game_Q8_next")
            }
            if(vm.question == 9) {
                vm.itemspicUrl.splice(8,1,"./images/status"+(parseInt(vm.selcun)+1)+"-8.png");
                vm.gaEvant("game_Q9_next")
            }
            if(vm.question == 10) {
                vm.itemspicUrl.splice(9,1,"./images/status"+(parseInt(vm.selcun)+1)+"-8.png");
                // vm.gaEvant("game_Q10_done")
            }
        },
        setTitle: function() {
            var vm = this;
            if(vm.allcun <= 6) {
                vm.titleh2url = "./images/game_h2-type1.png";
                vm.titleh3url = "./images/game_h3-type1.png";
            }
            if(vm.allcun >= 7 && vm.allcun <= 12) {
                vm.titleh2url = "./images/game_h2-type2.png";
                vm.titleh3url = "./images/game_h3-type2.png";
            }
            if(vm.allcun >= 13 && vm.allcun <= 17) {
                vm.titleh2url = "./images/game_h2-type3.png";
                vm.titleh3url = "./images/game_h3-type3.png";
            }
            if(vm.allcun >= 18) {
                vm.titleh2url = "./images/game_h2-type4.png";
                vm.titleh3url = "./images/game_h3-type4.png";
            }

        },
        sendans: function() {
            var vm = this;
            if(vm.selcun=="") {
                alert("請選擇您的答案喔");
                return
            }
            vm.allcun += parseInt(vm.selcun);
            vm.cunArr.push(vm.selcun+'_'+vm.otherinput);
            if(vm.question >= 8) {
                if(vm.otherinput=="") {
                    alert("請輸入夢想");
                    return
                } else {
                    vm.inputArr.push(vm.otherinput);
                    // vm.cunArr.push(vm.selcun+'_'+vm.otherinput);
                }
            }
            if(vm.question == 7) {
                vm.gaEvant("game_Q7_done")
            }
            if(vm.question == 8) {
                vm.gaEvant("game_Q8_done")
            }
            if(vm.question == 9) {
                vm.gaEvant("game_Q9_done")
            }
            if(vm.question == 10) {
                vm.gaEvant("game_Q10_done")
            }
            vm.setImgurl();
            vm.setTitle();
            vm.loadingfn();
            vm.gamefb = new Games({
                Gitemspic: vm.itemspicUrl,
                Gtitleh2url: vm.titleh2url,
                Gtitleh3url: vm.titleh3url,
                GinputArr: vm.inputArr,
                appendAt: $('#pixifbshare'),
                canHeight: 628,
                canWidth: 1200,
                titleArr: [
                    {
                        name: "h2",
                        width: 699,
                        height: 124,
                        x: 470,
                        y: 214,
                        pic: vm.titleh2url,
                    },
                    {
                        name: "h3",
                        width: 685,
                        height: 58,
                        x: 470,
                        y: 343,
                        pic: vm.titleh3url,
                    },
                ],
                itemsArr: [
                    {
                        name: "people",
                        width: 455,
                        height: 390,
                        x: 54,
                        y: 154,
                        pic: "./images/people.png",
                        mbwidth: 153,
                        mbheight: 131,
                        mbx: 77,
                        mby: 224,
                    },
                    {
                        name: "cloud-1",
                        width: 130,
                        height: 109,
                        x: 27,
                        y: 37,
                        // pic: "./images/status1-8.png",
                        pic: vm.itemspicUrl[7],
                        // txt: vm.inputArr[0],
                    },
                    {
                        name: "cloud-2",
                        width: 130,
                        height: 109,
                        x: 930,
                        y: 83,
                        // pic: "./images/status1-8.png",
                        pic: vm.itemspicUrl[8],
                        // txt: vm.inputArr[1],
                    },
                    {
                        name: "cloud-3",
                        width: 120,
                        height: 109,
                        x: 79,
                        y: 493,
                        // pic: "./images/status1-8.png",
                        pic: vm.itemspicUrl[9],
                        // txt: vm.inputArr[2],
                    },
                    {
                        name: "plane",
                        width: 141,
                        height: 124,
                        x: 680,
                        y: 35,
                        pic: vm.itemspicUrl[6],
                        mbwidth: 104 / 2,
                        mbheight: 94 / 2,
                        mbx: 267 / 2,
                        mby: 259 / 2,
                    },
                    {
                        name: "babycar",
                        width: 107,
                        height: 106,
                        x: 806,
                        y: 496,
                        pic: vm.itemspicUrl[5],
                    },
                    {
                        name: "house",
                        width: 123,
                        height: 107,
                        x: 242,
                        y: 77,
                        pic: vm.itemspicUrl[4],
                    },
                    {
                        name: "hat",
                        width: 129,
                        height: 153,
                        x: 550,
                        y: 411,
                        // pic: "./images/status1-4.png",
                        pic: vm.itemspicUrl[0],
                    },
                    {
                        name: "bag",
                        width: 131,
                        height: 126,
                        x: 1025,
                        y: 425,
                        pic: vm.itemspicUrl[1],
                    },
                    {
                        name: "money",
                        width: 110,
                        height: 99,
                        x: 460,
                        y: 86,
                        pic: vm.itemspicUrl[2],
                    },
                    {
                        name: "car",
                        width: 112,
                        height: 101,
                        x: 40,
                        y: 370,
                        pic: vm.itemspicUrl[3],
                    },
                ],
            });
            vm.gamefb.init().then(function () {
                vm.saveImg();
                vm.saveAid();
            })
            // $(window).scrollTop(0);
        },
        selli: function() {
            var vm = this;
            $(".btnblock li").click(function(){
                $(this).addClass("active");
                $(this).siblings().removeClass("active");
                if(vm.question == 1) {
                    vm.questionpic.q1pic = "./images/quk-1-"+(parseInt(vm.selcun)+1)+".png"
                }
                if(vm.question == 2) {
                    vm.questionpic.q2pic = "./images/quk-2-"+(parseInt(vm.selcun)+1)+".png"
                }
                if(vm.question == 3) {
                    vm.questionpic.q3pic = "./images/quk-3-"+(parseInt(vm.selcun)+1)+".png"
                }
                if(vm.question == 4) {
                    vm.questionpic.q4pic = "./images/quk-4-"+(parseInt(vm.selcun)+1)+".png"
                }
                if(vm.question == 5) {
                    vm.questionpic.q5pic = "./images/quk-5-"+(parseInt(vm.selcun)+1)+".png"
                }
                if(vm.question == 6) {
                    vm.questionpic.q6pic = "./images/quk-6-"+(parseInt(vm.selcun)+1)+".png"
                }
                if(vm.question == 7) {
                    vm.questionpic.q7pic = "./images/quk-7-"+(parseInt(vm.selcun)+1)+".png"
                }
                if(vm.question == 8) {
                    vm.questionpic.q8pic = "./images/freeqe-kv-"+(parseInt(vm.selcun)+1)+".png"
                }
                if(vm.question == 9) {
                    vm.questionpic.q9pic = "./images/freeqe-kv-"+(parseInt(vm.selcun)+1)+".png"
                }
                if(vm.question == 10) {
                    vm.questionpic.q10pic = "./images/freeqe-kv-"+(parseInt(vm.selcun)+1)+".png"
                }
            });
        },
        saveImg: function() {
            var vm = this;
            var reg = new RegExp("data:image/png;base64,");
            // vm.base64Img = vm.game.saveImg().replace(reg,"");
            vm.base64Img = vm.gamefb.saveImg().replace(reg,"");
            // console.log(vm.base64Img);
            // window.open(test);
            // console.log(test);
            // console.log($('#pixiarea').val($('canvas')[0].toDataURL('image/jpeg', 1.0)));
        },
    },
    mounted: function() {
        var vm = this;
        vm.selli();
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
    },
});