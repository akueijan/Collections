var index_view = new Vue({
    el: "#app",
    data: {
        gamePop: false,
        prodsPop: false,
        exPop: false,
        eggPop: false,
        perdataPop: null,
        kvideoPop: false,
        finishPop: false,
        awardPop: false,
        joinedPop: false,
        rolePop: false,
        kvideo: kvideo,
        token: "",
        probability: 0,
        base64Img: "",
        capKey: "",
        inputCap: "",
        inputName: "",
        inputMobile: "",
        inputEmail: "",
        luckyAward: 0,
        awardItem: "",
        checkagree: false,
        checkwish: false,
        lonely: null,
        game: {
            prodPop:false
        },
        room: {},
    },
    methods: {
        windowScroll: function () {
            var vm = this;
            $(window).scroll(function () {
                var windowScrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
                var stopHeight = $('#kv-bottom').offset().top;
                var cutHeight = $('#kv-top')[0].clientHeight;
                if (windowScrollTop > stopHeight - cutHeight) {
                    $("#fixed-icon").addClass('active');
                } else {
                    $("#fixed-icon").removeClass('active');
                }
            });
        },
        allPopupClose: function () {
            var vm = this;
            vm.gamePop = false;
            vm.prodsPop = false;
            vm.exPop = false;
            vm.eggPop = false;
            vm.kvideoPop = false;
            vm.finishPop = false;
            vm.joinedPop = false;
            vm.rolePop = false;
            vm.awardPop = false;
            vm.game.prodPop = false;
            vm.perdataPop = null;
        },
        awardIssue: function () {
            window.alert('得獎名單將於2019/2/28前公布，敬請期待。');
        },
        gameOpen: function () {
            if (this.endDate()) {
                alert('活動已結束，2/28前將於活動網站公布得獎名單');
                return;
            }
            this.gamePop = true;
            this.clearData()
        },
        navIssue: function () {

        },
        stopIssue: function (item,height) {
            $(item).addClass('active');
            $(item).css('top', height);
        },
        overStopIssue: function (item) {
            $(item).removeClass('active');
            $(item).css('top', 0);
        },
        eggRandom(x) {
            Math.floor(Math.random()*x);
        },
        videoPlay: function (index) {
            var vm = this;
            var videoId = vm.video_link[index - 1];
            vm.kvideoPop = true;
            kvideo.loadVideoById(videoId);
            kvideo.unMute();
            kvideo.playVideo();
            // vm.popupOpen();
            $("#fixed-icon").addClass('activepop');
        },
        lonely_close: function () { },
        videoPlayLink: function () {
            var vm = this;
            vm.kvideoPop = true;
        },
        videoClose: function (index) {
            var vm = this;
            vm.kvideoPop = false;
            kvideo.stopVideo();
            vm.popupClose();
            $("#fixed-icon").removeClass('activepop');
        },
    },
    mounted: function() {
        var vm = this;
        vm.showProj();
        // vm.saveCaptcha();
        vm.windowScroll();
        // $(".loading-page").addClass('none');
        $(".fixed-icon").click(function () {
            $(this).toggleClass('open')
        })
        var windowLeft = document.getElementById('window-loading-left');
        var windowRight = document.getElementById('window-loading-right');
        windowLeft.classList.add('active');
        windowRight.classList.add('active');
        $(".light-item").css('animation-play-state', 'running');
        // fixed-qrcode

        // var qrmark = qrcode(0, 'M');
        // qrmark.addData(`${window.location.origin}${window.location.pathname}?roomId=${guid()}`);
        // qrmark.make();
        // document.getElementById("fixed-qrcode").innerHTML = qrmark.createImgTag();

        vm.awardPop = true; vm.popupOpen();
    }
})
