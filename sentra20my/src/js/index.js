var index_view = new Vue({
    el: "#app",
    data: {
        step: 'start', //kv start reason result profile done lottery useraward
        reason: '', // near far
        lineuserid: '',
        linePic: '',
        lineName: '',
        userScore: 0,
        userMin: 0,
        userSec: 0,
        slick: true,
        resultWord: '',
        yearArr: [],
        monthArr: [],
        dayArr: [],
        userName: '',
        userPhone: '',
        userbir: {
            year: '',
            month: '',
            day: ''
        },
        isMember: false,
        haveAward: false,
        isPlay: false,
        isNissan: false,
        // noNissan: false,
        isAgree: false,
        ticketCount: 0,
        awardName: '',
        awardCode: '',
        awardShortUrl: '',
        isGame: false,
        lotteryPlay: false,
        isGet: false
    },
    methods: {
        togame() {
            var vm = this
            vm.isGame = true
            vm.step = 'start'
            vm.popup = true
            vm.popPage = 'readme'
            setTimeout(function(){
                var testgame = new carGame()
                testgame.init()
            }, 100)
        },
        toGrades() {
            var vm = this
            vm.showArr()
            vm.step = 'result'
            vm.reason = ''
        },
        toProfile() {
            var vm = this
            if(vm.isPlay) {
                vm.step = 'done'
                vm.isGame = false
            } else {
                vm.step = 'profile'
                setTimeout(() => {
                    if(vm.isMember) {
                        document.querySelector('#phone').setAttribute('disabled', 'disabled')
                    }
                }, 50)
            }
        },
        toLottery() {
            var vm = this
            if(!vm.awardName == "" || !vm.awardName == null) {
                vm.step = 'useraward'
            } else {
                vm.step = 'lottery'
            }
        },
        rePlay() {
            var vm = this
            vm.isGame = true
            vm.step = 'start'
            vm.popup = true
            vm.popPage = 'readme'
            vm.slick = true
            document.querySelector('.popup').style = 'background: url(./images/popup_bg.png) center top repeat'
            setTimeout(function(){
                var testgame = new carGame()
                testgame.init()
            }, 100)
        },
        playturn() {
            var vm = this
            let offset
            let round = 360
            let sec = 0.3
            let tl = new TimelineMax({delay: 0.3, onComplete: () => {
                if(vm.isGet) {
                    vm.step = 'useraward'
                    vm.isGame = false
                }
            }})
            if(vm.ticketCount <= 0) {
                vm.popup = true
                vm.popPage = 'noticketcount'
            } else {
                vm.lotteryPlay = true
                tl.fromTo(".lotterybg", sec*5, {
                    rotation: 0
                },
                {
                    rotation: round*5
                })
                if(vm.isGet) {
                    offset = Math.floor(Math.random() * (80-30)) + 30
                    vm.lotteryPlay = false
                    vm.isGet = true
                    vm.ticketCount -= 1
                    tl.to(".lotterybg", sec*2,{
                        rotation: round*5 + offset
                    },'-=0.3')
                } else {
                    offset = Math.floor(Math.random() * (170-100)) + 100
                    vm.lotteryPlay = false
                    vm.ticketCount -= 1
                    tl.to(".lotterybg", sec*2,{
                        rotation: round*5 + offset
                    },'-=0.3')
                }
            }
        },
        birthdayArr() {
            var vm = this
            for(let i=2020; i>1919; i--) {
                vm.yearArr.push(i)
            }
            for(let i=1; i<13; i++) {
                vm.monthArr.push(i)
            }
            for(let i=1; i<32; i++) {
                vm.dayArr.push(i)
            }
        },
        kvAni() {
            var vm = this
            let sec = 0.3
            let tl = new TimelineMax({delay: 0.6})
            tl.from(".kv h2", sec*2, {
                opacity: 0
            })
            tl.from(".kv .togame", sec*2, {
                opacity: 0
            }, '-=0.6')
            tl.from(".kvcar", sec*2, {
                y: -60,
                x: 300,
                opacity: 0
            })
            tl.from(".kv .kvft", sec*2, {
                opacity: 0
            }, '-=0.3')
        },
        checkData() {
            var vm = this
            var phoneRule = /^09[0-9]{8}$/
            if(vm.userName == "") {
                alert("請填寫姓名")
                return
            }
            if(vm.userPhone == "" || !vm.userPhone.match(phoneRule)) {
                alert("請輸入正確格式手機號碼")
                return
            }
            if(vm.userbir.year == "" || vm.userbir.year == null) {
                alert("請選擇出生年")
                return
            }
            if(vm.userbir.month == "" || vm.userbir.month == null) {
                alert("請選擇出生月")
                return
            }
            if(vm.userbir.day == "" || vm.userbir.day == null) {
                alert("請選擇出生日")
                return
            }
            if(!vm.isAgree) {
                alert("請勾選我已詳閱並同意活動辦法")
                return
            }
            vm.popup = true
            vm.popPage = 'loading'
            vm.step = 'done'
            vm.popup = false
            vm.popPage = ''
        },
        lotteryShare() {
            var vm = this
            vm.eventShare()
            vm.ticketCount += 1
            // vm.saveShare().then(() => {
            //     // vm.getData()
            // })
        },
        awardreadme() {
            var vm = this
            vm.popup = true
            vm.popPage = 'awardreadme'
        }
    },
    mounted: function() {
        var vm = this
        vm.birthdayArr()
        // vm.kvAni()
        var cargame = new carGame()
        cargame.init()
    }
})