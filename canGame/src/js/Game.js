class canGame {
    constructor(speed=10) {
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
            }
        }
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
        let gameBgimg2

        gameBgimg.onload = () => {
            gameBgY1 = -((gameBgimg.height/_self.rot)-canvas.height)
            gameBgY2 = -(gameBgimg.height/_self.rot - gameBgY1)
            // gameBgimg2 = gameBgimg
            ctx.drawImage(gameBgimg,0,0,gameBgimg.width,gameBgimg.height,0,gameBgY1,canvas.width,gameBgimg.height/_self.rot)
            ctx.drawImage(gameBgimg,0,0,gameBgimg.width,gameBgimg.height,0,gameBgY2,canvas.width,gameBgimg.height/_self.rot)
            // let gameBgSei = setInterval(drawBg, 20)
            _self.control()
        }
        gameBgimg.src = _self.imgs.gameBg.src

        function drawBg() {
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

            // _self.control().drawBtn()
        }

    }
    control() {
        let _self = this
        let playOn = new Image()
        let playOff = new Image()
        let prplayOn = new Promise((resolve) => {
            playOn.onload = () => {
                resolve()
            }
            playOn.src = _self.imgs.playBtn_on.src
        })
        let prplayOff = new Promise((resolve) => {
            playOff.onload = () => {
                resolve()
            }
            playOff.src = _self.imgs.playBtn_off.src
        })
        Promise.all([prplayOn,prplayOff]).then(() => {
            _self.ctx.drawImage(playOff, 0, 0, playOff.width, playOff.height, _self.canvas.width - playOff.width/2 - 10, canvas.height - playOff.height/2 - 10, playOff.width/2, playOff.height/2)
            // let controlSei = setInterval(drawBtn, 20)
            _self.playOn = playOn
            _self.playOff = playOff
        })
        // function drawBtn() {
        //     _self.ctx.clearRect(0,0,_self.canvas.width,_self.canvas.height)
        //     _self.ctx.drawImage(playOff, 0, 0, playOff.width, playOff.height, _self.canvas.width - playOff.width/2 - 10, canvas.height - playOff.height/2 - 10, playOff.width/2, playOff.height/2)
        // }
    }
}