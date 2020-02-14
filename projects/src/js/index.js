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

        particlesJS("particles-js", {
            "particles":{
                "number":{
                    "value":80,
                    "density":{
                        "enable":true,
                        "value_area":800
                    }
                },
                "color":{
                    "value":"#000000"
                },
                "shape":{
                    "type":"circle",
                    "stroke":{
                        "width":0,
                        "color":"#000000"
                    },
                    "polygon":{
                        "nb_sides":5
                    },
                    "image":{
                        "src":"img/github.svg",
                        "width":100,
                        "height":100
                    }
                },
                "opacity":{
                    "value":0.5,
                    "random":false,
                    "anim":{
                        "enable":false,
                        "speed":1,
                        "opacity_min":0.1,
                        "sync":false
                    }
                },
                "size":{
                    "value":3,
                    "random":true,
                    "anim":{
                        "enable":false,
                        "speed":40,
                        "size_min":0.1,
                        "sync":false
                    }
                },
                "line_linked":{
                    "enable":true,
                    "distance":100,
                    "color":"#000000",
                    "opacity":0.4,
                    "width":1
                },
                "move":{
                    "enable":true,
                    "speed":6,
                    "direction":"none",
                    "random":false,
                    "straight":false,
                    "out_mode":"out",
                    "bounce":false,
                    "attract":{
                        "enable":false,
                        "rotateX":600,
                        "rotateY":1200
                    }
                }
            },
            "interactivity":{
                "detect_on":"canvas",
                "events":{
                    "onhover":{
                        "enable":false,
                        "mode":"repulse"
                    },
                    "onclick":{
                        "enable":false,
                        "mode":"push"
                    },
                    "resize":true
                },
                "modes":{
                    "grab":{
                        "distance":400,
                        "line_linked":{
                            "opacity":1
                        }
                    },
                    "bubble":{
                        "distance":400,
                        "size":40,
                        "duration":2,
                        "opacity":8,"speed":3
                    },
                    "repulse":{
                        "distance":200,
                        "duration":0.4
                    },
                    "push":{
                        "particles_nb":4
                    },
                    "remove":{
                        "particles_nb":2
                    }
                }
            },
            "retina_detect":true
        });

    }
})
