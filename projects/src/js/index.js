var index_view = new Vue({
    el: "#app",
    data: {
        scoreArr: [
            {
                name: "111",
                pic: "xxx"
            },
            {
                name: "222",
                pic: "xxx"
            },
            {
                name: "333",
                pic: "xxx"
            },
            {
                name: "444",
                pic: "xxx"
            },
            {
                name: "555",
                pic: "xxx"
            },
            {
                name: "666",
                pic: "xxx"
            },
            {
                name: "777",
                pic: "xxx"
            },
            {
                name: "888",
                pic: "xxx"
            },
            {
                name: "999",
                pic: "xxx"
            },
            {
                name: "101010",
                pic: "xxx"
            },
            {
                name: "111111",
                pic: "xxx"
            },
            {
                name: "121212",
                pic: "xxx"
            },
            {
                name: "131313",
                pic: "xxx"
            },
            {
                name: "141414",
                pic: "xxx"
            },
            {
                name: "151515",
                pic: "xxx"
            },
        ],
        randomArr: [],
    },
    methods: {
        pushArr() {
            var vm = this;
            var temp;
            vm.randomArr = [];
            temp = vm.scoreArr;
            if(temp.length <= 0) {
                alert("沒有資料了");
                return
            }
            for(let i=0; i<5; i++) {
                var j = Math.floor(Math.random()*temp.length);
                vm.randomArr.push(vm.shuffle(temp)[j]);
                temp.splice(j,1);
            }
        },

        shuffle(arr) { //洗牌
            var vm = this;
            var i,j,temp;
            for(i = arr.length-1; i > 0; i--) {
                j = Math.floor(Math.random()*(i+1));
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
            return arr;
        },

        kvAni() {
            var sec = 0.3;
            var tl = new TimelineMax({delay: 0.3, repeat: -1});
            // tl.to(".hanabox",sec,{opacity: 0,})
            tl.from(".kv",sec,{
                opacity: 0,
            })
            tl.from(".hello",sec*2, {
                opacity: 0,
            })
            tl.from(".hello > .slogn",sec*2, {
                opacity: 0,
                x: -50
            }, "-=0.3")
            tl.to(".hello > .slogn",sec*2, {
                opacity: 0,
                x: 50
            }, "+=3")
            tl.from(".whois",sec*2, {
                opacity: 0
            })
            tl.from(".whois > .slogn", sec*2, {
                opacity: 0,
            })
            tl.from(".portfolio", sec*2, {
                opacity: 0,
            }, "-=0.6")
            tl.to(".whois > .slogn", sec*2, {
                opacity: 0,
            }, "+=3")
            tl.to(".portfolio", sec*2, {
                opacity: 0,
            }, "-=0.6")
            // tl.from(".whois",sec*2, {
            //     opacity: 0
            // })
        },

        winScroll() {
            var vm = this;
            var targetHeight = document.getElementsByClassName("kv")[0].offsetHeight;
            window.onscroll = function() {
                var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
                if(scrollTop > targetHeight/2) {
                    document.getElementsByClassName('nav')[0].style.background = "#dddddd";
                    document.getElementsByClassName('nav')[0].style.boxShadow = "0 1px 5px rgba(0,0,0,0.3)"
                } else {
                    document.getElementsByClassName('nav')[0].style.background = "none";
                    document.getElementsByClassName('nav')[0].style.boxShadow = "none"
                }
            }
        },

        gamePlay() {
            var vm = this;
            var speed = 0;
            var int = 0;
            var over = false;

            speed = Math.ceil(Math.random() * 5);
            console.log(speed);
            //計數器
            var gameInv = setInterval(function() {
                if(!over) {
                    if(int < 100) {
                        int++
                        document.getElementById("game").style.transform = "translateY("+(100-int)+"%)"
                        // console.log(int);
                    }
                    if(int == 100) {
                        over = true;
                    }
                } else {
                    if(int > 0) {
                        int--;
                        document.getElementById("game").style.transform = "translateY("+(100-int)+"%)"
                        // console.log(int);
                    }
                    if(int == 0) {
                        over = false;
                    }
                }
            }, speed);

            //遊戲停止
            document.getElementById("stopG").addEventListener("click", function(){
                clearInterval(gameInv);
            })
        },

        gameCss() {
            var vm = this;
            var speed = 0;
            var setCss = setInterval(function(){
                speed = Math.floor(Math.random() * 6)/10;
                // document.getElementById("game2").style.height = "0px";
                document.getElementById("game2").style.transform = "translateY(0)";
                document.getElementById("game2").style.transition = ""+speed+"s";
                setTimeout(function(){
                    speed = Math.floor(Math.random() * 6)/10;
                    document.getElementById("game2").style.transition = ""+speed+"s";
                    // document.getElementById("game2").style.height = "50px";
                    document.getElementById("game2").style.transform = "translateY(-25%)";
                    setTimeout(function(){
                        speed = Math.floor(Math.random() * 6)/10;
                        document.getElementById("game2").style.transition = ""+speed+"s";
                        // document.getElementById("game2").style.height = "100px";
                        document.getElementById("game2").style.transform = "translateY(-50%)";
                        setTimeout(function(){
                            speed = Math.floor(Math.random() * 6)/10;
                            document.getElementById("game2").style.transition = ""+speed+"s";
                            // document.getElementById("game2").style.height = "150px";
                            document.getElementById("game2").style.transform = "translateY(-75%)";
                            setTimeout(function(){
                                speed = Math.floor(Math.random() * 6)/10;
                                document.getElementById("game2").style.transition = ""+speed+"s";
                                // document.getElementById("game2").style.height = "200px";
                                document.getElementById("game2").style.transform = "translateY(-100%)";
                            },50*4)
                        },50*3)
                    },50*2)
                },50)
            },300);
            // document.getElementById("game2").style.transition = ""+speed+"s";
            // document.getElementById("game2").style.height = "66px";

            document.getElementById("stopG").addEventListener("click", function(){
                var highestTimeoutId = setTimeout(";");
                for (var i = 0 ; i < highestTimeoutId ; i++) {
                    clearTimeout(i); 
                };
                clearInterval(setCss);
                // alert(document.getElementById("game2").style.height);
            })
        }
    },
    mounted: function() {
        var vm = this;
        vm.kvAni();
        vm.winScroll();
        // vm.gamePlay();

        var can = document.getElementById("canvas")
        var ctx = can.getContext('2d');

        var img1 = new Image();
        img1.onload = function(){
            ctx.drawImage(img1, 0, 0);
            var Imgdata = ctx.getImageData(0, 0, can.width, can.height);
            console.log(Imgdata);
        };
        img1.src = "./images/aj93DUQ.jpg";
    }
})
