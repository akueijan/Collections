var index_view = new Vue({
    el: "#app",
    data: {
        stepPage: "result",
        faceUrl: "",
        faceId: "",
        faceEye: 0,
        faceLip: 0,
        faceNose: 0,
        faceScore: 0,
        answer: {
            title: "",
            eyes: "",
            eyesimg: "",
            nose: "",
            noseimg: "",
            lip: "",
            lipimg: ""
        },
        fbcanBg: "",
        fbImg: "",
        linetitle: "",
        resulth2: "",
        perinfo: {
            name: "",
            mobile: "",
            address: "",
            agree: false,
        },
        fbLink: "user",
    },
    methods: {
        fbcanvas() {
            var vm = this;
            return new Promise(function(resolve, reject) {
                var canvas = document.getElementById("fbcanvas");
                var ctx = canvas.getContext('2d');
                var fbScore = vm.faceScore;
                var fbcanBg = new Image();
                fbcanBg.src= vm.fbcanBg;
                // var fbcanImg = document.getElementById("fbImg");
                var fbcanImg = new Image();
                fbcanImg.setAttribute('crossorigin', 'anonymous');
                fbcanImg.src= vm.faceUrl;
                fbcanImg.onload = function() {
                    ctx.font = "93px Arial";
                    ctx.drawImage(fbcanBg,0,0,fbcanBg.width,fbcanBg.height,0,0,1200,628);
                    ctx.drawImage(fbcanImg,0,0,fbcanImg.width,fbcanImg.height,156,109,435,435);
                    ctx.fillStyle = "#217190";
                    ctx.fillText(fbScore,840,540);
                    var fbimg = canvas.toDataURL("image/jpeg", 0.5);
                    // console.log(fbimg);
                    vm.fbImg = fbimg;
                }
                // ctx.drawImage(imageData,10,10);
                resolve();
            })
        },
        setfbBg() {
            var vm = this;
            if(vm.faceScore < 2) {
                vm.fbcanBg = "./images/fbshare_type_1.png";
                vm.answer.title = "來來來～介紹你好藥～這台有外型有內涵的#SENTRA撒去開，<span class='blue blod'>是你硬起來的唯一希望</span>（認真"
                vm.linetitle = "軟趴趴的苔蘚";
                vm.resulth2 = "./images/result_rank1.png"
            }
            if(vm.faceScore >= 2 && vm.faceScore < 3) {
                vm.fbcanBg = "./images/fbshare_type_2.png";
                vm.answer.title = "雖然外表低調老實，但依然可以靠著充實自我，最終還是能夠成為<span class='blue blod'>雜草中的霸主～</span>（但還是雜草︿︿"
                vm.linetitle = "雜草BOY";
                vm.resulth2 = "./images/result_rank2.png"
            }
            if(vm.faceScore >=3 && vm.faceScore < 4) {
                vm.fbcanBg = "./images/fbshare_type_3.png";
                vm.answer.title = "水草系神奇寶貝，喜歡於人群中隱藏自己的蹤跡，<span class='blue blod'>擅長在不知不覺中接近心儀的女子（變態？</span>"
                vm.linetitle = "水草系男子";
                vm.resulth2 = "./images/result_rank3.png"
            }
            if(vm.faceScore >= 4 && vm.faceScore < 5) {
                vm.fbcanBg = "./images/fbshare_type_4.png";
                vm.answer.title = "難道你就是萬中無一的仙草系男子！？無論觀察力、包容力、感情觀都堪稱極品，<span class='blue blod'>不知官人您還有沒有缺小妾啊？</span>"
                vm.linetitle = "仙草好男人";
                vm.resulth2 = "./images/result_rank4.png"
            }
            if(vm.faceScore >= 5) {
                vm.fbcanBg = "./images/fbshare_type_5.png";
                vm.answer.title = "不可能！這<span class='blue blod'>一定是修改器改出來的！瞧如此精美的仙草級五官，要是我以後再也看不到怎麼辦啊～～</span>"
                vm.linetitle = "極品仙草男";
                vm.resulth2 = "./images/result_rank5.png"
            }
        },
        setans() {
            var vm = this;
            if(vm.faceEye == 1) {
                vm.answer.eyes = "目光如豆，可說是短視近利代表，建議你配套<span class='blue blod'>#AVM360ﾟ環景影像監控系統</span>，增加自己的視野唷~";
                vm.answer.eyesimg = "./images/star1.png"
            }
            if(vm.faceEye == 2) {
                vm.answer.eyes = "歐爸~小眼睛也是帥帥滴啦~但行車時建議加裝<span class='blue blod'>#AVM360ﾟ環景影像監控系統</span>，這樣更安心喔！";
                vm.answer.eyesimg = "./images/star2.png"
            }
            if(vm.faceEye == 3) {
                vm.answer.eyes = "眼睛圓而大，善於觀察周遭事物如<span class='blue blod'>#AVM360ﾟ環景影像監控系統</span>般，可以透析一切衣物（事物）";
                vm.answer.eyesimg = "./images/star3.png"
            }
            if(vm.faceEye == 4) {
                vm.answer.eyes = "注視這水晶晶的眼神，就像注視著迷人外表的<span class='blue blod'>#SENTRA旗艦版</span>一般，讓人不戀愛都難！";
                vm.answer.eyesimg = "./images/star4.png"
            }
            if(vm.faceEye == 5) {
                vm.answer.eyes = "目光如炬，一看就非池中物，如果給你台 <span class='blue blod'>#SENTRA旗艦版</span>，你豈不就飛天啦！";
                vm.answer.eyesimg = "./images/star5.png"
            }
            if(vm.faceNose == 1) {
                vm.answer.nose = "鼻塌且小，毫無包容力可言！建議入手<span class='blue blod'>#SENTRA豪華版</span>，超大空間加舒適座椅，誰能比你會包容?";
                vm.answer.noseimg = "./images/star1.png"
            }
            if(vm.faceNose == 2) {
                vm.answer.nose = "鼻樑挺直，但包容力遜遜der，建議以<span class='blue blod'> #PM2.5負離子雙區恆溫空調</span>，強化對於氣氛的調節能力唷~";
                vm.answer.noseimg = "./images/star2.png"
            }
            if(vm.faceNose == 3) {
                vm.answer.nose = "鼻寬而厚，心胸寬大可包容一切。就像<span class='blue blod'>#SENTRA</span>的510L超大寬敞後車廂，完全海放各牌同級車啊！";
                vm.answer.noseimg = "./images/star3.png"
            }
            if(vm.faceNose == 4) {
                vm.answer.nose = "瞧你的鼻翼如此寬闊，堪比<span class='blue blod'>#SENTRA</span>的510L超大寬敞後車廂。還不承認你就包龍星包大人？";
                vm.answer.noseimg = "./images/star4.png"
            }
            if(vm.faceNose == 5) {
                vm.answer.nose = "我的天~ 這鼻子的包容力跟太平洋一樣寬啊！就像<span class='blue blod'>#SENTRA尊爵版</span>，性能強大全都包！";
                vm.answer.noseimg = "./images/star5.png"
            }
            if(vm.faceLip == 1) {
                vm.answer.lip = "唇薄無情94在講你啦！還不快去入手<span class='blue blod'>#SENTRA豪華版</span>，包你好男人形象大增！";
                vm.answer.lipimg = "./images/star1.png"
            }
            if(vm.faceLip == 2) {
                vm.answer.lip = "唉唷帥氣薄唇內！但感情觀很差哦～建議可在車上加裝<span class='blue blod'>#Premium精選空力套件</span>，提高（感情上的）穩定性喔~";
                vm.answer.lipimg = "./images/star2.png"
            }
            if(vm.faceLip == 3) {
                vm.answer.lip = "唇厚且闊，如同<span class='blue blod'>#SENTRA</span>的<span class='blue blod'>#Premium精選空力套件</span>，讓人感到安心穩定可依賴~";
                vm.answer.lipimg = "./images/star3.png"
            }
            if(vm.faceLip == 4) {
                vm.answer.lip = "先生～掛香腸講話味道會很重喔！建議打開<span class='blue blod'>#PM2.5負離子雙區恆溫空調</span>，讓大家好好呼吸一下！";
                vm.answer.lipimg = "./images/star4.png"
            }
            if(vm.faceLip == 5) {
                vm.answer.lip = "瞧這完美的唇形，真讓人想要阿姑親一口，就像<span class='blue blod'>#SENTRA尊爵版</span>的迷人外型，隨便一個move就煞翻全場！";
                vm.answer.lipimg = "./images/star5.png"
            }
        },
        fbshare() {
            var vm = this;
            var fbhtml_url= "https://event-nissan.azurewebsites.net/sentra2019/index?id=" + vm.faceId; //網址
            // var fbhtml_url= vm.shareUrl; //圖
            window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url);return false;
            // var isIE=window.ActiveXObject || "ActiveXObject" in window;
            // if(isIE) {
            //     window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url);return false;
            // } else {
            //     window.open('https://www.facebook.com/sharer/sharer.php?u='+fbhtml_url+'&hashtag=%23'+vm.shareTitle);return false;
            // }
        },
        lineshare() {
            var fbhtml_url="早就跟你說過我是"+vm.faceScore+"星的"+vm.linetitle+"了吼！快幫我看看這個測驗結果，跟我說你覺得準不準～對了！偷偷告訴你現在參加這個活動，還能抽XXXX喔！";
            window.open('https://social-plugins.line.me/lineit/share?url='+fbhtml_url);
        },
    },
    mounted: function() {
        var vm = this;
        var url = location.href;
        vm.faceId = findGetParameter("id");
        vm.fbLink = findGetParameter("type");
        vm.sendId();
        // if(url.indexOf('?')==-1) {
        //     window.open("index.html","_self");
        // } else {
        //     if(vm.aid=="") {
        //         window.open("index.html","_self");
        //     }
        // }
    }
})