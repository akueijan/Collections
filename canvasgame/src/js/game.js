var game_view = new Vue({
    el: "#app",
    data: {
        
    },
    methods: {
        stop: function(){
            var vm = this;
            clearInterval(ani);
        }
    },
    mounted: function() {
        var vm = this;

        var lCan = document.getElementById("loadcan");
        var lctx = lCan.getContext('2d');
        lCan.width = window.innerWidth/2;
        // lCan.height = window.innerHeight/2;
        lCan.height = 800;

        var gameBg = new Image();
        gameBg.src = "./images/gamebg.jpg";
        var scoreW = gameBg.width;
        var scoreH = gameBg.height
        console.log(scoreW);
        console.log(scoreH);
        var rel;
        rel = scoreW / scoreH;
        var x = 0;
        var endX;

        gameBg.onload = function(){
            
            gameBg.height = lCan.height;
            gameBg.width = lCan.height*rel;
            console.log(gameBg.height);
            console.log(gameBg.width);
            console.log(lCan.width);
            endX = gameBg.width - lCan.width;
            console.log(endX);
            // return setInterval(function(){
            //     lctx.clearRect(0,0,lCan.width,lCan.height);
            //     lctx.drawImage(gameBg,0,0,scoreW,scoreH,x,0,gameBg.width,gameBg.height);
            //     if(Math.abs(x) > endX){
            //         //創造一個obj在後
            //         //定位歸0
            //         x = 0;
            //     }
            //     x -= 2;
            // }, 20);
        };
        

        document.getElementById("stop").addEventListener("click", function(){
            // clearInterval(ani);
            console.log("stop");
        })

    }
})