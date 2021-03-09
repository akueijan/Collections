var award_view = new Vue({
    el: "#app",
    data: {
        awPage: 'start', //start test
        awardName: "awardName",
        awardCode: "awardCode",
        awardImg: "",
        awardTxt: "awardTxt",
        status: 0,
        pagehaveRichart: true,
    },
    methods: {
        getAward() {
            const vm = this;
            return new Promise((resolve)=> {
                // let url = location.search
                // console.log(url)
                vm.awardName = decodeURI(findGetParameter('award')).toUpperCase();
                vm.awardCode = findGetParameter('awardcode');
                vm.guid = findGetParameter('code');
                vm.status = findGetParameter('status');
                resolve();
            })
        },
        setAwardImg() {
            const vm = this;
            vm.getAward().then(()=> {
                if(vm.awardName.length <= 0 || vm.awardName == 'NULL') {
                    window.location = 'index.html';
                } else {
                    switch(vm.awardName) {
                        case '5R幣序號':
                            vm.awardImg = 'images/award-5r.png';
                            vm.awardTxt = '至2021/2/28止';
                            break;
                        case '10R幣序號':
                            vm.awardImg = 'images/award-10r.png';
                            vm.awardTxt = '至2021/2/28止';
                            break;
                        case '35元折價序號':
                            vm.awardImg = 'images/award-cafe.png';
                            vm.awardTxt = '2021/06/30';
                            break;
                        case '雜誌樂讀包14天服務序號':
                            vm.awardImg = 'images/award-mybook.png';
                            vm.awardTxt = '2021/06/30';
                            break;
                        case '豪華月租14天服務序號':
                            vm.awardImg = 'images/award-myvideo.png';
                            vm.awardTxt = '2021/06/30';
                            break;
                        case 'NT$100購物金序號':
                            vm.awardImg = 'images/award-shopee.png';
                            vm.awardTxt = '2021/2/13';
                            break;
                        case '銘謝惠顧':
                            vm.awardImg = 'images/award-sorry.png';
                            vm.awardCode = '銘謝惠顧';
                            vm.awardName = '';
                            break;
                        default:
                            break;
                    }
                }
            })
        },
        sliderOpen() {
            const vm = this;
            let slider = tns({
                container: '.slickbd',
                controlsContainer: '.slickctr',
                prevButton: '.prev',
                nextButton: '.next',
                items: 1,
                startIndex: vm.startItem, //重0開始
                // slideBy: 'page',
                autoplay: true,
                autoplayButton: false,
                autoplayTimeout: 2400,
                controls: true,
                nav: false
            })
        },
        lineShare() {
            const vm = this;
            let sUrl = encodeURIComponent(`https://pse.is/38l4hx`);
            let picUrl = encodeURIComponent(`https://line.me/S/sticker/19502`);
            window.location = `http://line.naver.jp/R/msg/text/?欸欸~Richart今年的免費貼圖超ㄎㄧㄤ，你下載了嗎？%0D%0A${picUrl}%0D%0A下載完記得參加Richart蹦好運活動%0D%0A一起拉炮🎉蹦好運～%0D%0A完成任務有機會抽中iPhone 12、Switch...等「萬份」好禮喔！🎁%0D%0A來個蹦蹦~蹦好運>>>${sUrl}`;
        }
    },
    created: function() {
        const vm = this;
        // vm.checkbrowser();
        vm.checkWeek();
    },
    mounted: function() {
        const vm = this;
        // this.projApi.post(uri, data)  //Ex
        loadpage('init');
        // vm.setAwardImg();
        vm.sliderOpen()
    }
})
