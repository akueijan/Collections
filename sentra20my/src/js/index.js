var index_view = new Vue({
    el: "#app",
    data: {
        step: 'kv', //kv start reason result profile done lottery useraward
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
        saveLeader() {
            var vm = this; 
            var data = {
                "line_user_id": vm.lineId,
                "second": vm.userScore
            };
            return $.ajax({
                url: `${vm.apiUrl}api/lottery/${vm.entId}/leader`,
                headers: {
                    'Authorization': 'Bearer ' + vm.mainToken
                },
                method: 'POST',
                data: data,
                dataType: 'json'
            }).done((res) => {
                // console.log('saveLeader: ', res)
            })
        },
        getData() {
            var vm = this
            var data = {
                "line_user_id": vm.lineId
            };
            return $.ajax({
                url: `${vm.apiUrl}api/lottery/${vm.entId}/profile`,
                headers: {
                    'Authorization': 'Bearer ' + vm.mainToken
                },
                method: 'GET',
                data: data,
                dataType: 'json'
            }).done((res) => {
                // console.log('getData: ', res)
                vm.userName = res.data.name
                vm.userPhone = res.data.phone
                vm.isMember = res.data.isMember
                vm.isPlay = res.data.isPlay
                vm.isNissan = res.data.isNissan
                if(!res.data.birthday == '' || !res.data.birthday == null) {
                    vm.userbir.year = parseInt(res.data.birthday.slice(0,4))
                    vm.userbir.month = parseInt(res.data.birthday.slice(5,7))
                    vm.userbir.day = parseInt(res.data.birthday.slice(8,10))
                }
                // vm.ticketCount = res.data.ticketCount
                vm.awardName = res.data.awardName
                vm.awardCode = res.data.awardCode
                vm.awardShortUrl = res.data.awardShortUrl
            })
        },
        saveData() {
            var vm = this
            if(vm.userbir.month < 10) {
                vm.userbir.month = '0' + vm.userbir.month
            }
            if(vm.userbir.day < 10) {
                vm.userbir.day = '0' + vm.userbir.day
            }
            if(vm.isNissan) {
                vm.isNissan = 1
            } else {
                vm.isNissan = 0
            }
            var data = {
                "line_user_id": vm.lineId,
                "name": vm.userName,
                "phone": vm.userPhone,
                "birthday": vm.userbir.year + '-' + vm.userbir.month + '-' + vm.userbir.day,
                "is_nissan": vm.isNissan
            };
            return $.ajax({
                url: `${vm.apiUrl}api/lottery/${vm.entId}/profile`,
                headers: {
                    'Authorization': 'Bearer ' + vm.mainToken
                },
                method: 'POST',
                data: data,
                dataType: 'json'
            }).done((res) => {
                // console.log('saveData: ', res)
            })
        },
        getLottery() {
            var vm = this
            var data = {
                "line_user_id": vm.lineId
            };
            return $.ajax({
                url: `${vm.apiUrl}api/lottery/${vm.entId}/drawing`,
                headers: {
                    'Authorization': 'Bearer ' + vm.mainToken
                },
                method: 'POST',
                data: data,
                dataType: 'json'
            }).done((res) => {
                // console.log('getLottery: ', res)
                // vm.awardName = res.data.awardName
            })
        },
        saveShare() {
            var vm = this
            var data = {
                "line_user_id": vm.lineId
            };
            return $.ajax({
                url: `${vm.apiUrl}api/lottery/${vm.entId}/share`,
                headers: {
                    'Authorization': 'Bearer ' + vm.mainToken
                },
                method: 'POST',
                data: data,
                dataType: 'json'
            }).done((res) => {
                // console.log('saveShare: ', res)
                // vm.ticketCount = res.data.ticketCount
            })
        },
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
            var vm = this;
            vm.step = 'done'
            vm.isGame = false;
            // vm.getData().then(() => {
            //     if(vm.isPlay) {
            //         vm.step = 'done'
            //         vm.isGame = false
            //     } else {
            //         vm.step = 'profile'
            //         setTimeout(() => {
            //             if(vm.isMember) {
            //                 document.querySelector('#phone').setAttribute('disabled', 'disabled')
            //             }
            //         }, 50)
            //     }
            // })
        },
        toLottery() {
            var vm = this;
            vm.step = 'lottery';
            // vm.getData().then(() => {
            //     if(!vm.awardName == "" || !vm.awardName == null) {
            //         vm.step = 'useraward'
            //     } else {
            //         vm.step = 'lottery'
            //     }
            // })
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
                    // vm.getData().then(()=>{
                    //     vm.step = 'useraward'
                    //     vm.isGame = false
                    // })
                }
            }})
            vm.lotteryPlay = true
            tl.fromTo(".lotterybg", sec*5, {
                rotation: 0
            },
            {
                rotation: round*5
            })
            let isGet = Math.floor(Math.random()*2);
            if(isGet == 0) {
                offset = Math.floor(Math.random() * (170-100)) + 100
                vm.lotteryPlay = false
                vm.ticketCount -= 1
                tl.to(".lotterybg", sec*2,{
                    rotation: round*5 + offset
                },'-=0.3')
            }
            if(isGet == 1) {
                offset = Math.floor(Math.random() * (80-30)) + 30
                // vm.awardName = res.data.awardName
                vm.lotteryPlay = false
                vm.isGet = true
                vm.ticketCount -= 1
                tl.to(".lotterybg", sec*2,{
                    rotation: round*5 + offset
                },'-=0.3')
            }
            // if(vm.ticketCount <= 0) {
            //     vm.popup = true
            //     vm.popPage = 'noticketcount'
            // } else {
            //     vm.lotteryPlay = true
            //     tl.fromTo(".lotterybg", sec*5, {
            //         rotation: 0
            //     },
            //     {
            //         rotation: round*5
            //     })
            //     let isGet = Math.floor(Math.random()*2);
            //     if(isGet == 0) {
            //         offset = Math.floor(Math.random() * (170-100)) + 100
            //         vm.lotteryPlay = false
            //         vm.ticketCount -= 1
            //         tl.to(".lotterybg", sec*2,{
            //             rotation: round*5 + offset
            //         },'-=0.3')
            //     }
            //     if(isGet == 1) {
            //         offset = Math.floor(Math.random() * (80-30)) + 30
            //         vm.awardName = res.data.awardName
            //         vm.lotteryPlay = false
            //         vm.isGet = true
            //         vm.ticketCount -= 1
            //         tl.to(".lotterybg", sec*2,{
            //             rotation: round*5 + offset
            //         },'-=0.3')
            //     }
            //     vm.getLottery().then((res) => {
            //         if(res.data.isGet) {
            //             offset = Math.floor(Math.random() * (80-30)) + 30
            //             vm.awardName = res.data.awardName
            //             vm.lotteryPlay = false
            //             vm.isGet = true
            //             vm.ticketCount -= 1
            //             tl.to(".lotterybg", sec*2,{
            //                 rotation: round*5 + offset
            //             },'-=0.3')
            //         } else {
            //             offset = Math.floor(Math.random() * (170-100)) + 100
            //             vm.lotteryPlay = false
            //             vm.ticketCount -= 1
            //             tl.to(".lotterybg", sec*2,{
            //                 rotation: round*5 + offset
            //             },'-=0.3')
            //         }
            //     })
            // }
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
            vm.saveData().then(() => {
                vm.step = 'done'
                vm.popup = false
                vm.popPage = ''
            })
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
        if(window.innerWidth > 1000) {
            vm.step = 'pcindex'
            vm.isGame = true
        }
        // vm.initLiff('1514260586-2OkdXWoe')
        vm.birthdayArr()
        vm.kvAni()
    }
})