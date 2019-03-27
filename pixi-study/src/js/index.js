var index_view = new Vue({
    el: "#app",
    data: {
    },
    methods: {
    },
    mounted: function() {
        var vm = this;
    }
})

var canvasWidth;
var canvasHeight;

if(window.innerWidth > 1024) {
    canvasWidth = 800;
    canvasHeight = window.innerHeight;
} else {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
}
//Create a Pixi Application
var app = new PIXI.Application({
    width: canvasWidth,
    height: canvasHeight,
    backgroundColor : 0x1099bb,
});

app.width = screen.width;
app.height = screen.height;

//Add the canvas that Pixi automatically created for you to the HTML document
// document.body.appendChild(app.view);
$(".index").append(app.view);

window.onresize = function (event){
    var w = window.innerWidth;
    var h = window.innerHeight;

    app.renderer.resize(w,h);

    // 將畫面的正中間放在 app.renderer 一半寬高的位置
    app.stage.x = app.renderer.width * 0.5; 
    app.stage.y = app.renderer.height * 0.5;
};

PIXI.loader
    .add('../images/images.jpg')
    .load(init);

function init() {
    var bgimg = new PIXI.Texture.fromImage('../images/images.jpg');

    var background = new PIXI.Sprite(bgimg);
    app.stage.addChild(background);
    // background.x = 0;
    // background.y = 0;
    var proportion = background.width / background.height;
    background.height = window.innerHeight;
    background.width = window.innerHeight * proportion;
    // background.anchor.x = 0.5;
    // background.anchor.y = 0.5;
    background.interactive = true; // 設定可以互動
    background.buttonMode = true; // 當滑鼠滑過時顯示為手指圖示
    background
            .on('mousedown', onDragStart)
            .on('touchstart', onDragStart)
            // events for drag end
            .on('mouseup', onDragEnd)
            .on('mouseupoutside', onDragEnd)
            .on('touchend', onDragEnd)
            .on('touchendoutside', onDragEnd)
            // events for drag move
            .on('mousemove', onDragMove)
            .on('touchmove', onDragMove);
    background.position.x = 0;
    background.position.y = 0;

    var bunnyarea = new PIXI.Container();
    var bunny = PIXI.Sprite.fromImage('http://pixijs.io/examples/required/assets/basics/bunny.png')
    bunny.anchor.set(0.5);
    bunny.scale.set(4);

    bunny.position.x = background.width * 0.10;
    bunny.position.y = background.height * 0.10;
    bunny.interactive = true; // 設定可以互動
    bunny.buttonMode = true; // 當滑鼠滑過時顯示為手指圖示
    bunny.on('pointerdown', onClick);

    background.addChild(bunny);

    function onClick() {
        console.log("123");
    }
}



function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    // this.data = event.data;
    // this.alpha = 0.5;
    // this.dragging = true;

    if (!this.dragging) {
        this.data = event.data;
        this.dragging = true;
        this.dragPoint = event.data.getLocalPosition(this.parent);
        this.dragPoint.x -= this.x;
        this.dragPoint.y -= this.y;
    }
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        // var newPosition = this.data.getLocalPosition(this);
        // this.x = newPosition.x;
        this.x = newPosition.x - this.dragPoint.x;
        // this.y = newPosition.y;
        // console.log(this.dragPoint.x);
        if(this.x < -450) {
            // alert("over");
            // this.dragging = false;
            this.x = -450;
            // this.data = null;
        }
        if(this.x > 0) {
            this.x = 0;
        }
    }
}

// create a texture from an image path
// var texture = PIXI.Texture.fromImage('../images/images.jpg');

// app.ticker.add(function(delta) {
//     var mouseX = app.renderer.plugins.interaction.mouse.global.x;
//     var mouseY = app.renderer.plugins.interaction.mouse.global.y;

//     bunny.x += (mouseX - bunny.x) * 0.0625;
//     bunny.y += (mouseY - bunny.y) * 0.0625;
// });