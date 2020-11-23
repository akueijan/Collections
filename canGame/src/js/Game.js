class canGame {
    constructor(speed=2) {
        this.speed = speed
        this.mainSize = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        this.rot = this.mainSize.height / this.mainSize.width
        this.imgs = {
            gameBg: {
                src: './images/road.jpg'
            },
            playBtn_off: {
                src: './images/game_brakes-off.png'
            },
            playBtn_on: {
                src: './images/game_brakes-on.png'
            },
            mainCar: {
                src: './images/game_usercar.png'
            }
        }
        this.imgsArr = [
            {
                name: 'gameBg',
                src: './images/road.jpg'
            },
            {
                name: 'playBtn_off',
                src: './images/game_brakes-off.png'
            },
            {
                name: 'playBtn_on',
                src: './images/game_brakes-on.png'
            },
            {
                name: 'mainCar',
                src: './images/game_usercar.png'
            }
        ]
        this.mainCar = {
            x: 0
        }
    }
    loadImages(arr) {
        let _self = this
        return new Promise((resolve => {
            let loadedImages = 0
    
            for(let i=0; i<arr.length; i++) {
                let img = new Image()
                img.onload = imageLoaded
                img.src = arr[i].src
            }
    
            function imageLoaded() {
                loadedImages++
                if(loadedImages >= arr.length) {
                    // callback(e)
                    resolve()
                }
            }
        }))
    }
    init() {
        let _self = this
        let canvas = document.querySelector('#canvas')
        canvas.width = _self.mainSize.width
        canvas.height = _self.mainSize.height

        let ctx = canvas.getContext('2d')
        _self.canvas = canvas
        _self.ctx = ctx

        let gameBgY1
        let gameBgY2
        let gameBgimg = new Image()
        
        let playOn = new Image()
        let playOff = new Image()

        let mainCar = new Image()
        let maincarX

        _self.loadImages(_self.imgsArr)
        .then(()=> {
            gameBgimg.src = _self.imgs.gameBg.src
            playOff.src = _self.imgs.playBtn_off.src
            playOn.src = _self.imgs.playBtn_on.src
            mainCar.src = _self.imgs.mainCar.src

            _self.playOff = playOff
            _self.playOn = playOn
            _self.mainCar = mainCar

            gameBgY1 = -((gameBgimg.height/_self.rot)-canvas.height)
            gameBgY2 = -(gameBgimg.height/_self.rot - gameBgY1)
            maincarX = (canvas.width - mainCar.width/2)/2
            _self.maincarX = maincarX

            ctx.drawImage(gameBgimg,0,0,gameBgimg.width,gameBgimg.height,0,gameBgY1,canvas.width,gameBgimg.height/_self.rot)
            ctx.drawImage(gameBgimg,0,0,gameBgimg.width,gameBgimg.height,0,gameBgY2,canvas.width,gameBgimg.height/_self.rot)
            ctx.drawImage(mainCar, 0, 0, mainCar.width, mainCar.height, _self.maincarX, canvas.height - mainCar.height/2, mainCar.width/2, mainCar.height/2)
            ctx.drawImage(playOff, 0, 0, playOff.width, playOff.height, canvas.width - playOff.width/3 - 10, canvas.height - playOff.height/3 - 10, playOff.width/3, playOff.height/3)
            ctx.drawImage(playOn, 0, 0, playOn.width, playOn.height, 10, canvas.height - playOn.height/3 - 10, playOn.width/3, playOn.height/3)
            
            _self.control()
            setInterval(() => {
                drawGame()
            },30)
        })

        function drawGame() {
            gameBgY1 += _self.speed
            gameBgY2 += _self.speed
            if(gameBgY1 > canvas.height) {
                gameBgY1 = -(gameBgimg.height/_self.rot - gameBgY2)
            }
            if(gameBgY2 > canvas.height) {
                gameBgY2 = -(gameBgimg.height/_self.rot - gameBgY1)
            }
            ctx.clearRect(0,0,canvas.width,canvas.height)
            ctx.drawImage(gameBgimg,0,0,gameBgimg.width,gameBgimg.height,0,gameBgY1,canvas.width,gameBgimg.height/_self.rot)
            ctx.drawImage(gameBgimg,0,0,gameBgimg.width,gameBgimg.height,0,gameBgY2,canvas.width,gameBgimg.height/_self.rot)
            ctx.drawImage(mainCar, 0, 0, mainCar.width, mainCar.height, _self.maincarX, canvas.height - mainCar.height/2, mainCar.width/2, mainCar.height/2)
            ctx.drawImage(playOff, 0, 0, playOff.width, playOff.height, canvas.width - playOff.width/3 - 10, canvas.height - playOff.height/3 - 10, playOff.width/3, playOff.height/3)
            ctx.drawImage(playOn, 0, 0, playOn.width, playOn.height, 10, canvas.height - playOn.height/3 - 10, playOn.width/3, playOn.height/3)
        }

    }
    control() {
        let _self = this
        let moveRightSetInterval
        let moveLeftSetInterval
        let lbtnPlay = false
        let rbtnPlay = false

        function creatBtn(type) {
            let btn = document.createElement('canvas')
            let btnCtx = btn.getContext('2d')
            document.querySelector('.index').appendChild(btn)
            switch(type) {
                case 'left':
                    btn.width = _self.playOn.width/3
                    btn.height = _self.playOn.height/3
                    btn.style = 'position: absolute; bottom: 10px; left: 10px; z-index: 1'
                    btn.id = 'leftbtn'
                    break
                case 'right':
                    btn.width = _self.playOff.width/3
                    btn.height = _self.playOff.height/3
                    btn.style = 'position: absolute; bottom: 10px; right: 10px; z-index: 1'
                    btn.id = 'rightbtn'
                    break
                default:
                    break
            }
            // btnCtx.fillRect(0,0,btn.width,btn.height)
            btn.addEventListener('touchstart', handleStart, false)
            // btn.addEventListener('touchcancel', handleEnd, false)
            // btn.addEventListener('touchmove', handleStart, false)
            btn.addEventListener('touchend', handleEnd, false)
        }

        creatBtn('left')
        creatBtn('right')

        function handleStart(el) {
            // console.log(this)
            el.preventDefault()
            let type = this.id
            // btnPlay = true
            switch(type) {
                case 'rightbtn':
                    moveRightSetInterval = setInterval(()=> {
                        _self.maincarX += 2
                    },30)
                    if(_self.maincarX >= _self.canvas.width - _self.mainCar.width/2) {
                        _self.maincarX = _self.canvas.width - _self.mainCar.width/2
                    }
                    // console.log(_self.maincarX)
                    break
                case 'leftbtn':
                    moveLeftSetInterval = setInterval(()=> {
                        _self.maincarX -= 2
                    },30)
                    if(_self.maincarX <= 0) {
                        _self.maincarX = 0
                    }
                    // console.log(_self.maincarX)
                    break
                default:
                    break
            }
            
        }

        function handleEnd(el) {
            el.preventDefault()
            // btnPlay = false
            clearInterval(moveRightSetInterval)
            clearInterval(moveLeftSetInterval)
        }
    }
}