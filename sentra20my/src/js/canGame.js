class carGame {
    constructor(speed=10) {
        this.speed = speed
        // this.rot = window.innerHeight / window.innerWidth
        this.mainSize = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        // this.rot = 1334/750
        this.rot = this.mainSize.height / this.mainSize.width
        this.imgs = {
            roadimg: {
                src: './images/road.jpg'
            },
            userCar: {
                src: './images/game_usercar.png'
            },
            userCarwan: {
                src: './images/game_usercar_wan.png'
            },
            targetCar: {
                src: './images/game_targetcar.png'
            },
            targetCarbrk: {
                src: './images/game_targetcar_brk.png'
            },
            gameoverCar: {
                src: './images/white_brakes_gameover.png'
            },
            scoreBg: {
                src: './images/game-secondbg.png'
            },
            overimg: {
                src: './images/gameover_near.jpg'
            }
        }
    }
    init() {
        var _self = this
        let can1 = document.querySelector('#canvas')
        can1.width = _self.mainSize.width
        can1.height = _self.mainSize.height
        // can1.width = 375
        // can1.height = 667
        let roadimg1 = new Image()
        let roadimg2 = new Image()
        let userCar = new Image()
        let userCarwan = new Image()
        let targetCar = new Image()
        let targetCarbrk = new Image()
        let gameoverCar = new Image()
        let scoreBg = new Image()
        let overImg = new Image()

        let canctx = can1.getContext('2d')
        let y1
        let y2
        let y3
        let targetY = 2
        let offsetY = 150
        let userCarY
        let score = 0
        let sec = 0
        let min = 0
        let kilo = 60
        let gameSetin
        let overgameSetin
        let timeAdd
        let timeDel
        let timeCun
        let cun = 0
        let mincun = 0
        let hardcun = 0
        // let stop = false
        let playbtn = document.querySelector('.playbtn')

        roadimg1.src = _self.imgs.roadimg.src
        roadimg2.src = _self.imgs.roadimg.src
        userCar.src = _self.imgs.userCar.src
        userCarwan.src = _self.imgs.userCarwan.src
        targetCar.src = _self.imgs.targetCar.src
        targetCarbrk.src = _self.imgs.targetCarbrk.src
        gameoverCar.src = _self.imgs.gameoverCar.src
        scoreBg.src = _self.imgs.scoreBg.src
        overImg.src = _self.imgs.overimg.src
        let roadBg1 = new Promise(function(resolve){
            roadimg1.onload = function() {
                resolve()
            }
        })
        let roadBg2 = new Promise(function(resolve){
            roadimg2.onload = function() {
                resolve()
            }
        })
        let userCarimg = new Promise(function(resolve){
            userCar.onload = function() {
                resolve()
            }
        })
        let userCarwanimg = new Promise(function(resolve){
            userCarwan.onload = function() {
                resolve()
            }
        })
        let targetCarimg = new Promise(function(resolve){
            targetCar.onload = function() {
                resolve()
            }
        })
        let targetCarbrkimg = new Promise(function(resolve){
            targetCarbrk.onload = function() {
                resolve()
            }
        })
        let gameoverCarimg = new Promise(function(resolve){
            gameoverCar.onload = function() {
                resolve()
            }
        })
        let scoreBgimg = new Promise(function(resolve){
            scoreBg.onload = function() {
                resolve()
            }
        })
        let overImgBg = new Promise(function(resolve){
            overImg.onload = function() {
                resolve()
            }
        })
        //canvas畫面初始化
        Promise.all([roadBg1,roadBg2,userCarimg,userCarwanimg,targetCarimg,targetCarbrkimg,gameoverCarimg,scoreBgimg,overImgBg]).then(function() {
            y1 = -((roadimg1.height/_self.rot)-can1.height)
            canctx.drawImage(roadimg1, 0, 0, roadimg1.width, roadimg1.height, 0, y1, can1.width, roadimg1.height/_self.rot)
            y2 = -(roadimg2.height/_self.rot-y1)
            canctx.drawImage(roadimg2, 0, 0, roadimg2.width, roadimg2.height, 0, y2, can1.width, roadimg2.height/_self.rot)
            userCarY = can1.height-(userCar.height/2)-10
            canctx.drawImage(userCar, 0, 0, userCar.width, userCar.height, (can1.width/2)-(userCar.width/4), userCarY, userCar.width/2, userCar.height/2)
            canctx.drawImage(targetCar, 0, 0, targetCar.width, targetCar.height, (can1.width/2)-(targetCar.width/4), offsetY, targetCar.width/2, targetCar.height/2)
            canctx.drawImage(scoreBg, 0, 0, scoreBg.width, scoreBg.height, (can1.width-scoreBg.width/2)-10, 20, scoreBg.width/2, scoreBg.height/2)
            canctx.fillStyle = "#ffffff"
            canctx.font = 'italic 20px Helvetica'
            canctx.fillText('km/h', 70, 50)
            canctx.font = 'italic 30px Helvetica'
            canctx.shadowOffsetX = 3
            canctx.shadowOffsetY = 3
            canctx.shadowColor = "rgba(0,0,0,0.3)"
            canctx.fillText('00', can1.width-58, 48)
            canctx.fillText(':', can1.width-73, 48)
            canctx.fillText('0', can1.width-95, 48)
            canctx.font = 'italic 40px Helvetica'
            canctx.fillText(Math.floor(kilo), 20, 50)
            // gameStart()
        })
        document.querySelector('.readmebtn').addEventListener('click', function(){
            index_view.popPage = 'gamestart'
            document.querySelector('.popup').style = 'background: none'
            let second = 3
            let gameCun = setInterval(() => {
                second -= 1
                document.querySelector('.gamecun').innerHTML = second
                if(second <= 0) {
                    document.querySelector('.gamecun').innerHTML = 'GO!!'
                    clearInterval(gameCun)
                    setTimeout(function() {
                        document.querySelector('.decoarr').style = 'display: none'
                        document.querySelector('.popup').style = 'background: url(./images/popup_bg.png) center top repeat'
                        index_view.popup = false
                        index_view.popPage = ''
                        gameStart()
                    }, 1000)
                }
            }, 1000)
        })
        function gameStart() {
            gameSetin = setInterval(drawCan, 20)
            gamePlay()
            timeCun = setInterval(() => {
                score += 1
                sec += 1
                if(sec >=60 ) {
                    min += 1
                    sec = 0
                }
            }, 1000);
        }
        // setTimeout(function(){
        //     setInterval(function() {
        //         targetY = Math.random() < 0.5 ? -2 : 2
        //         // console.log(targetY)
        //     }, 1200)
        // }, 10000)

        function drawCan() {
            if(y1 > can1.height) {
                y1 = -(roadimg1.height/_self.rot-y2)
            }
            if(y2 > can1.height) {
                y2 = -(roadimg2.height/_self.rot-y1)
            }
            canctx.clearRect(0,0,can1.width,can1.height)
            canctx.drawImage(roadimg1, 0, 0, roadimg1.width, roadimg1.height, 0, y1, can1.width, roadimg1.height/_self.rot)
            canctx.drawImage(roadimg2, 0, 0, roadimg2.width, roadimg2.height, 0, y2, can1.width, roadimg2.height/_self.rot)
            canctx.drawImage(scoreBg, 0, 0, scoreBg.width, scoreBg.height, (can1.width-scoreBg.width/2)-10, 20, scoreBg.width/2, scoreBg.height/2)
            y1 += _self.speed
            y2 += _self.speed

            // if(kilo <= 40) {
            //     offsetY -= _self.speed*0.05
            // }

            // if(score <= 10) {
            //     offsetY -= (3-kilo*0.05)
            // }
            if(kilo >= 70) {
                offsetY -= (targetY-kilo*0.03)
            }
            if(kilo >= 80) {
                offsetY -= (targetY-kilo*0.02)
            }
            if(kilo >= 100) {
                targetY = 1
                offsetY -= (targetY-kilo*0.01)
            }
            
            // targetY = 2 // 煞車為負值
            if(score >= 5 && score < 21) {
                offsetY -= (targetY-kilo*0.025)
                if(kilo >= 90) {
                    cun++
                    if(cun >= 20) {
                        targetY = Math.random() < 0.5 ? -0.1 : 2
                        cun = 0
                    }
                }
            }
            if(score >= 21 && score < 31) {
                offsetY -= (targetY-kilo*0.02)
                if(kilo >= 85) {
                    mincun++
                    if(mincun == 10) {
                        targetY = Math.random() < 0.5 ? -0.1 : 2
                    }
                    if(mincun == 13) {
                        targetY = Math.random() < 0.5 ? -0.1 : 2
                        // return
                    }
                    if(mincun >= 15) {
                        mincun = 0
                    }
                        // targetY = 2.5
                }
            }
            if(score >= 31) {
                offsetY -= (targetY-kilo*0.01)
                if(kilo >= 80) {
                    hardcun++
                    if(hardcun == 10) {
                        targetY = Math.random() < 0.5 ? -0.15 : 2
                    }
                    if(hardcun == 12) {
                        targetY = Math.random() < 0.5 ? -0.15 : 2
                    }
                    if(hardcun >= 13) {
                        hardcun = 0
                    }
                }
                // targetY = 2.7
            }
            offsetY -= (targetY-kilo*0.03)
            // console.log('targetY: ', targetY)
            // console.log('cun: ', cun)
            // console.log('hardcun: ', hardcun)

            // console.log(offsetY)
            canctx.fillStyle = "#ffffff"
            canctx.font = 'italic 20px Helvetica'
            canctx.fillText('km/h', 70, 50)
            canctx.font = 'italic 30px Helvetica'
            canctx.shadowOffsetX = 3
            canctx.shadowOffsetY = 3
            canctx.shadowColor = "rgba(0,0,0,0.3)"
            canctx.fillText(sec, can1.width-58, 48)
            canctx.fillText(':', can1.width-73, 46)
            canctx.fillText(min, can1.width-95, 48)
            canctx.font = 'italic 40px Helvetica'
            canctx.fillText(Math.floor(kilo), 20, 50)
            
            canctx.drawImage(userCar, 0, 0, userCar.width, userCar.height, (can1.width/2)-(userCar.width/4), can1.height-(userCar.height/2)-10, userCar.width/2, userCar.height/2)
            // canctx.fillRect(can1.width/2-50,can1.height - 150,100,150)
            if(targetY < 0) {
                canctx.drawImage(targetCarbrk, 0, 0, targetCar.width, targetCar.height, (can1.width/2)-(targetCar.width/4), offsetY, targetCar.width/2, targetCar.height/2)
            } else {
                canctx.drawImage(targetCar, 0, 0, targetCar.width, targetCar.height, (can1.width/2)-(targetCar.width/4), offsetY, targetCar.width/2, targetCar.height/2)
            }
            // canctx.fillRect(can1.width/2-50,offsetY,100,150)
            // console.log(y1)
            // console.log(_self.speed)

            let overLine = 0 - targetCar.height/2
            let nearLine = can1.height - userCar.height/2 - targetCar.height/2 + 40
            if(offsetY >= nearLine - 30) {
                canctx.drawImage(userCarwan, 0, 0, userCarwan.width, userCarwan.height, (can1.width/2)-(userCarwan.width/4), can1.height-(userCarwan.height/2)-10, userCarwan.width/2, userCarwan.height/2)
            }
            if(offsetY >= nearLine) {
                // console.log('進入安全距離')
                clearInterval(gameSetin)
                playbtn.removeEventListener('touchstart',handleStart)
                playbtn.removeEventListener('touchend',handleEnd)
                clearInterval(timeDel)
                clearInterval(timeAdd)
                clearInterval(timeCun)
                gameoverNear()
            }

            if(offsetY <= overLine) {
                // console.log('車已遠')
                clearInterval(gameSetin)
                playbtn.removeEventListener('touchstart',handleStart)
                playbtn.removeEventListener('touchend',handleEnd)
                clearInterval(timeDel)
                clearInterval(timeAdd)
                clearInterval(timeCun)
                gameoverFar()
            }
        }
        function gamePlay() {
            playbtn.addEventListener('touchstart',handleStart)
            playbtn.addEventListener('touchend',handleEnd)
        }
        function handleStart(el) {
            el.preventDefault()
            // console.log(this)
            this.style.background = 'url(./images/game_brakes-on.png) center top no-repeat'
            this.style.backgroundSize  = 'cover'
            clearInterval(timeDel)
            timeAdd = setInterval(function(){
                kilo += 1.5
                _self.speed += 1.5
                
                if(_self.speed >= 50) {
                    _self.speed = 50
                }
                if(kilo >= 99) {
                    kilo = 99
                }
                // console.log(_self.speed)
            },300)
        }
        function handleEnd(el) {
            el.preventDefault()
            this.style.background = 'url(./images/game_brakes-off.png) center top no-repeat'
            this.style.backgroundSize  = 'cover'
            clearInterval(timeAdd)
            timeDel = setInterval(function(){
                kilo -= 2.5
                _self.speed -= _self.speed*0.08
                if(_self.speed <= 15) {
                    _self.speed = 15
                    // clearInterval(timeDel)
                }
                if(kilo <= 60) {
                    kilo = 60
                }
                // console.log(_self.speed)
            },300)
        }
        function gameoverNear() {
            index_view.popup = true
            index_view.popPage = 'gameover'
            index_view.userScore = score
            index_view.userMin = min
            index_view.userSec = sec
            // index_view.saveLeader()
            if(score < 10) {
                index_view.resultWord = '才剛開始就累了!? 這要怎麼開車出門啊?<br>讓ALL NEW SENTRA來拯救你吧！'
            }
            if(score >= 10 && score <= 30) {
                index_view.resultWord = '感覺到疲憊了嗎?現實可沒這麼輕鬆呢~<br>輕鬆更有型就靠ALL NEW SENTRA！'
            }
            if(score >= 31) {
                index_view.resultWord = '太潮了吧!你該不會一個人開車環過島?<br>那你一定要試試ALL NEW SENTRA！'
            }
            setTimeout(() => {
                index_view.popup = false
                index_view.popPage = ''
                let speed = 8
                // y3 = -(overImg.height/_self.rot)
                y3 = -(gameoverCar.height/2)
                overgameSetin = setInterval(() => {
                    // if(y1 > can1.height) {
                    //     y1 = -(roadimg1.height/_self.rot-y2)
                    // }
                    // if(y2 > can1.height) {
                    //     y2 = -(roadimg2.height/_self.rot-y1)
                    // }
                    y1 += speed
                    y2 += speed
                    y3 += speed
                    // offsetY += speed
                    // userCarY += speed
                    canctx.clearRect(0,0,can1.width,can1.height)
                    canctx.drawImage(roadimg1, 0, 0, roadimg1.width, roadimg1.height, 0, y1, can1.width, roadimg1.height/_self.rot)
                    canctx.drawImage(roadimg2, 0, 0, roadimg2.width, roadimg2.height, 0, y2, can1.width, roadimg2.height/_self.rot)
                    // canctx.drawImage(overImg, 0, 0, overImg.width, overImg.height, 0, y3, can1.width, overImg.height/_self.rot)
                    canctx.drawImage(gameoverCar, 0, 0, gameoverCar.width, gameoverCar.height, (can1.width/2)-(userCar.width/4), y3, gameoverCar.width/2, gameoverCar.height/2)
                    canctx.drawImage(scoreBg, 0, 0, scoreBg.width, scoreBg.height, (can1.width-scoreBg.width/2)-10, 20, scoreBg.width/2, scoreBg.height/2)
                    canctx.fillStyle = "#ffffff"
                    canctx.font = 'italic 20px Helvetica'
                    canctx.fillText('km/h', 70, 50)
                    canctx.font = 'italic 30px Helvetica'
                    canctx.shadowOffsetX = 3
                    canctx.shadowOffsetY = 3
                    canctx.shadowColor = "rgba(0,0,0,0.3)"
                    canctx.fillText(sec, can1.width-58, 48)
                    canctx.fillText(':', can1.width-73, 46)
                    canctx.fillText(min, can1.width-95, 48)
                    canctx.font = 'italic 40px Helvetica'
                    canctx.fillText(Math.floor(kilo), 20, 50)
                    
                    canctx.drawImage(userCar, 0, 0, userCar.width, userCar.height, (can1.width/2)-(userCar.width/4), userCarY, userCar.width/2, userCar.height/2)
                    // canctx.fillRect(can1.width/2-50,can1.height - 150,100,150)
                    if(targetY < 0) {
                        canctx.drawImage(targetCarbrk, 0, 0, targetCar.width, targetCar.height, (can1.width/2)-(targetCar.width/4), offsetY, targetCar.width/2, targetCar.height/2)
                    } else {
                        canctx.drawImage(targetCar, 0, 0, targetCar.width, targetCar.height, (can1.width/2)-(targetCar.width/4), offsetY, targetCar.width/2, targetCar.height/2)
                    }
                    if(y3 >= 0) {
                        clearInterval(overgameSetin)
                        setTimeout(function() {
                            index_view.step = 'reason'
                            index_view.reason = 'near'
                        }, 1500)

                    }
                }, 20);
            }, 1500);
        }
        function gameoverFar() {
            index_view.popup = true
            index_view.popPage = 'gameover'
            index_view.userScore = score
            index_view.userMin = min
            index_view.userSec = sec
            // index_view.saveLeader()
            if(score < 10) {
                index_view.resultWord = '才剛開始就累了!? 這要怎麼開車出門啊?<br>讓ALL NEW SENTRA來拯救你吧！'
            }
            if(score >= 10 && score <= 30) {
                index_view.resultWord = '感覺到疲憊了嗎?現實可沒這麼輕鬆呢~<br>輕鬆更有型就靠ALL NEW SENTRA！'
            }
            if(score >= 31) {
                index_view.resultWord = '太潮了吧!你該不會一個人開車環過島?<br>那你一定要試試ALL NEW SENTRA！'
            }
            setTimeout(function() {
                index_view.popup = false
                index_view.popPage = ''
                index_view.step = 'reason'
                index_view.reason = 'far'
            }, 1200)
        }
    }
}