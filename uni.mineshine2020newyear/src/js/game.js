var game_view = new Vue({
    el: "#app",
    data: {
        fileimg: {
            fimg1: "",
            fimg2: "",
            fimg3: "",
        },
        resWord: {
            sad: [
                [
                    "./images/sad_1.png",
                    "./images/sad_1b.png",
                ],
                [
                    "./images/sad_2.png",
                    "./images/sad_2b.png",
                ],
                [
                    "./images/sad_3.png",
                    "./images/sad_3b.png",
                ],
                [
                    "./images/sad_4.png",
                    "./images/sad_4b.png",
                ],
                [
                    "./images/sad_5.png",
                    "./images/sad_5b.png",
                ],
            ],
            happy: [
                [
                    "./images/happy_1.png",
                    "./images/happy_1b.png",
                ],
                [
                    "./images/happy_2.png",
                    "./images/happy_2b.png",
                ],
                [
                    "./images/happy_3.png",
                    "./images/happy_3b.png",
                ],
                [
                    "./images/happy_4.png",
                    "./images/happy_4b.png",
                ],
                [
                    "./images/happy_5.png",
                    "./images/happy_5b.png",
                ],
                [
                    "./images/happy_6.png",
                    "./images/happy_6b.png",
                ],
                [
                    "./images/happy_7.png",
                    "./images/happy_7b.png",
                ],
                [
                    "./images/happy_8.png",
                    "./images/happy_8b.png",
                ],
                [
                    "./images/happy_9.png",
                    "./images/happy_9b.png",
                ],
                [
                    "./images/happy_10.png",
                    "./images/happy_10b.png",
                ],
                [
                    "./images/happy_11.png",
                    "./images/happy_11b.png",
                ],
                [
                    "./images/happy_12.png",
                    "./images/happy_12b.png",
                ],
                [
                    "./images/happy_13.png",
                    "./images/happy_13b.png",
                ],
                [
                    "./images/happy_14.png",
                    "./images/happy_14b.png",
                ],
                [
                    "./images/happy_15.png",
                    "./images/happy_15b.png",
                ],
                [
                    "./images/happy_16.png",
                    "./images/happy_16b.png",
                ],
                [
                    "./images/happy_17.png",
                    "./images/happy_17b.png",
                ],
                [
                    "./images/happy_18.png",
                    "./images/happy_18b.png",
                ],
                [
                    "./images/happy_19.png",
                    "./images/happy_19b.png",
                ],
            ],
            angry: [
                [
                    "./images/angry_1.png",
                    "./images/angry_1b.png",
                ],
                [
                    "./images/angry_2.png",
                    "./images/angry_2b.png",
                ],
                [
                    "./images/angry_3.png",
                    "./images/angry_3b.png",
                ],
                [
                    "./images/angry_4.png",
                    "./images/angry_4b.png",
                ],
                [
                    "./images/angry_5.png",
                    "./images/angry_5b.png",
                ],
                [
                    "./images/angry_6.png",
                    "./images/angry_6b.png",
                ],
                [
                    "./images/angry_7.png",
                    "./images/angry_7b.png",
                ],
                [
                    "./images/angry_8.png",
                    "./images/angry_8b.png",
                ],
                [
                    "./images/angry_9.png",
                    "./images/angry_9b.png",
                ],
                [
                    "./images/angry_10.png",
                    "./images/angry_10b.png",
                ],
            ],
            all: [
                [
                    "./images/sad_1.png",
                    "./images/sad_1b.png",
                ],
                [
                    "./images/sad_2.png",
                    "./images/sad_2b.png",
                ],
                [
                    "./images/sad_3.png",
                    "./images/sad_3b.png",
                ],
                [
                    "./images/sad_4.png",
                    "./images/sad_4b.png",
                ],
                [
                    "./images/sad_5.png",
                    "./images/sad_5b.png",
                ],
                [
                    "./images/happy_1.png",
                    "./images/happy_1b.png",
                ],
                [
                    "./images/happy_2.png",
                    "./images/happy_2b.png",
                ],
                [
                    "./images/happy_3.png",
                    "./images/happy_3b.png",
                ],
                [
                    "./images/happy_4.png",
                    "./images/happy_4b.png",
                ],
                [
                    "./images/happy_5.png",
                    "./images/happy_5b.png",
                ],
                [
                    "./images/happy_6.png",
                    "./images/happy_6b.png",
                ],
                [
                    "./images/happy_7.png",
                    "./images/happy_7b.png",
                ],
                [
                    "./images/happy_8.png",
                    "./images/happy_8b.png",
                ],
                [
                    "./images/happy_9.png",
                    "./images/happy_9b.png",
                ],
                [
                    "./images/happy_10.png",
                    "./images/happy_10b.png",
                ],
                [
                    "./images/happy_11.png",
                    "./images/happy_11b.png",
                ],
                [
                    "./images/happy_12.png",
                    "./images/happy_12b.png",
                ],
                [
                    "./images/happy_13.png",
                    "./images/happy_13b.png",
                ],
                [
                    "./images/happy_14.png",
                    "./images/happy_14b.png",
                ],
                [
                    "./images/happy_15.png",
                    "./images/happy_15b.png",
                ],
                [
                    "./images/happy_16.png",
                    "./images/happy_16b.png",
                ],
                [
                    "./images/happy_17.png",
                    "./images/happy_17b.png",
                ],
                [
                    "./images/happy_18.png",
                    "./images/happy_18b.png",
                ],
                [
                    "./images/happy_19.png",
                    "./images/happy_19b.png",
                ],
                [
                    "./images/angry_1.png",
                    "./images/angry_1b.png",
                ],
                [
                    "./images/angry_2.png",
                    "./images/angry_2b.png",
                ],
                [
                    "./images/angry_3.png",
                    "./images/angry_3b.png",
                ],
                [
                    "./images/angry_4.png",
                    "./images/angry_4b.png",
                ],
                [
                    "./images/angry_5.png",
                    "./images/angry_5b.png",
                ],
                [
                    "./images/angry_6.png",
                    "./images/angry_6b.png",
                ],
                [
                    "./images/angry_7.png",
                    "./images/angry_7b.png",
                ],
                [
                    "./images/angry_8.png",
                    "./images/angry_8b.png",
                ],
                [
                    "./images/angry_9.png",
                    "./images/angry_9b.png",
                ],
                [
                    "./images/angry_10.png",
                    "./images/angry_10b.png",
                ],
            ]
        },
        agree: false,
        fbData: {
            fbToken: "",
            fbId: "",
            fbName: "",
            fbPic: "",
        },
        mbId: "",
        fblink: "",
        canvas: {
            fcan: "",
            ccan1: "",
            ccan2: "",
            ccan3: "",
        },
        keyWord: {
            word1: "",
            word2: "",
            word3: ""
        },
        errW: "",
        // face: false,
        gamesec: "0%",
    },
    methods: {
        readpoto(e) {      //input file onchange event
            var vm = this;
            var file = e.target.files.item(0);
            var id = e.target.id;
            // console.log(e);
            // console.log(e.target.id);
            // console.log(file);
            var reader = new FileReader();
            reader.addEventListener('load',imgLoad);
            reader.readAsDataURL(file);
            function imgLoad(e) {
                if(id == "files1") {
                    vm.fileimg.fimg1 = e.target.result;
                    var canvas = document.getElementById("canvas");
                    var ctx = canvas.getContext("2d");
                    var imgObj = new Image();
                    canvas.width = 500;
                    canvas.height = 500;
                    imgObj.onload = function() {
                        var rel = imgObj.width / imgObj.height
                        ctx.clearRect(0,0,500,500);
                        ctx.fillStyle = "rgb(248,244,237)";
                        ctx.fillRect(0,0,canvas.width,canvas.height);
                        EXIF.getData(imgObj, function () {
                            var orientation = EXIF.getTag(this, 'Orientation');
                            console.log('orientation', orientation);
                            if (orientation) {
                                // canvas.width = orientation > 4 ? targetHeight : targetWidth
                                // canvas.height = orientation > 4 ? targetWidth : targetHeight
                                var x = canvas.width / 2;
                                var y = canvas.height / 2;
                                var rotateAngle = 0;
                                switch (orientation) {
                                    case 3:
                                    case 4:
                                        rotateAngle = 180;
                                        ctx.translate(x, y);
                                        ctx.rotate(rotateAngle * Math.PI / 180);
                                        // if (orientation > 4) {
                                        //     ;[x, y] = [y, x]
                                        // }
                                        ctx.drawImage(imgObj, -x, -y, canvas.height*rel, canvas.height);
                                        break;
                                    case 5:
                                    case 6:
                                        rotateAngle = 90;
                                        ctx.translate(x, y);
                                        ctx.rotate(rotateAngle * Math.PI / 180);
                                        // if (orientation > 4) {
                                        //     ;[x, y] = [y, x]
                                        // }
                                        ctx.drawImage(imgObj, -x, -y, canvas.height*rel, canvas.height);
                                        break;
                                    case 7:
                                    case 8:
                                        rotateAngle = -90;
                                        ctx.translate(x, y);
                                        ctx.rotate(rotateAngle * Math.PI / 180);
                                        // if (orientation > 4) {
                                        //     ;[x, y] = [y, x]
                                        // }
                                        ctx.drawImage(imgObj, -x, -y, canvas.height*rel, canvas.height);
                                        break;
                                }
        
                                switch (orientation) {
                                    case 2:
                                    case 4:
                                    case 5:
                                    case 7:
                                        ctx.scale(-1, 1)
                                        ctx.translate(x, y);
                                        ctx.rotate(rotateAngle * Math.PI / 180);
                                        // if (orientation > 4) {
                                        //     ;[x, y] = [y, x]
                                        // }
                                        ctx.drawImage(imgObj, -x, -y, canvas.height*rel, canvas.height);
                                        break
                                }
                                switch (orientation) {
                                    case 1:
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,(canvas.width-canvas.height*rel)/2,0,canvas.height*rel,canvas.height);
                                        break
                                }
                                
                            }
                            else {
                                // 來源canvas繪製 疑問處
                                if(rel > 1) { //橫照片
                                    if(imgObj.width < 500) {
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,(canvas.width-imgObj.width)/2,(canvas.height-imgObj.height)/2,imgObj.width,imgObj.height);
                                    } else {
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,0,(canvas.height-canvas.width/rel)/2,canvas.width,canvas.width/rel);
                                    }
                                } else { //直照片
                                    if(imgObj.height < 500) {
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,(canvas.width-imgObj.width)/2,(canvas.height-imgObj.height)/2,imgObj.width,imgObj.height);
                                    } else {
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,(canvas.width-canvas.height*rel)/2,0,canvas.height*rel,canvas.height);
                                    }
                                }
                            }
                        });
                    }
                    imgObj.src = e.target.result;
                }
                if(id == "files2") {
                    vm.fileimg.fimg2 = e.target.result;
                    var canvas = document.getElementById("canvas2");
                    var ctx = canvas.getContext("2d");
                    var imgObj = new Image();
                    canvas.width = 500;
                    canvas.height = 500;
                    imgObj.onload = function() {
                        var rel = imgObj.width / imgObj.height
                        ctx.clearRect(0,0,500,500);
                        ctx.fillStyle = "rgb(248,244,237)";
                        ctx.fillRect(0,0,canvas.width,canvas.height);
                        EXIF.getData(imgObj, function () {
                            var orientation = EXIF.getTag(this, 'Orientation');
                            console.log('orientation', orientation);
                            if (orientation) {
                                // canvas.width = orientation > 4 ? targetHeight : targetWidth
                                // canvas.height = orientation > 4 ? targetWidth : targetHeight
                                var x = canvas.width / 2;
                                var y = canvas.height / 2;
                                var rotateAngle = 0;
                                switch (orientation) {
                                    case 3:
                                    case 4:
                                        rotateAngle = 180;
                                        ctx.translate(x, y);
                                        ctx.rotate(rotateAngle * Math.PI / 180);
                                        // if (orientation > 4) {
                                        //     ;[x, y] = [y, x]
                                        // }
                                        ctx.drawImage(imgObj, -x, -y, canvas.height*rel, canvas.height);
                                        break;
                                    case 5:
                                    case 6:
                                        rotateAngle = 90;
                                        ctx.translate(x, y);
                                        ctx.rotate(rotateAngle * Math.PI / 180);
                                        // if (orientation > 4) {
                                        //     ;[x, y] = [y, x]
                                        // }
                                        ctx.drawImage(imgObj, -x, -y, canvas.height*rel, canvas.height);
                                        break;
                                    case 7:
                                    case 8:
                                        rotateAngle = -90;
                                        ctx.translate(x, y);
                                        ctx.rotate(rotateAngle * Math.PI / 180);
                                        // if (orientation > 4) {
                                        //     ;[x, y] = [y, x]
                                        // }
                                        ctx.drawImage(imgObj, -x, -y, canvas.height*rel, canvas.height);
                                        break;
                                }
        
                                switch (orientation) {
                                    case 2:
                                    case 4:
                                    case 5:
                                    case 7:
                                        ctx.scale(-1, 1)
                                        ctx.translate(x, y);
                                        ctx.rotate(rotateAngle * Math.PI / 180);
                                        // if (orientation > 4) {
                                        //     ;[x, y] = [y, x]
                                        // }
                                        ctx.drawImage(imgObj, -x, -y, canvas.height*rel, canvas.height);
                                        break
                                }
                                switch (orientation) {
                                    case 1:
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,(canvas.width-canvas.height*rel)/2,0,canvas.height*rel,canvas.height);
                                        break
                                }
                                
                            }
                            else {
                                // 來源canvas繪製 疑問處
                                if(rel > 1) { //橫照片
                                    if(imgObj.width < 500) {
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,(canvas.width-imgObj.width)/2,(canvas.height-imgObj.height)/2,imgObj.width,imgObj.height);
                                    } else {
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,0,(canvas.height-canvas.width/rel)/2,canvas.width,canvas.width/rel);
                                    }
                                } else { //直照片
                                    if(imgObj.height < 500) {
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,(canvas.width-imgObj.width)/2,(canvas.height-imgObj.height)/2,imgObj.width,imgObj.height);
                                    } else {
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,(canvas.width-canvas.height*rel)/2,0,canvas.height*rel,canvas.height);
                                    }
                                }
                            }
                        });
                    }
                    imgObj.src = e.target.result;
                }
                if(id == "files3") {
                    vm.fileimg.fimg3 = e.target.result;
                    var canvas = document.getElementById("canvas3");
                    var ctx = canvas.getContext("2d");
                    var imgObj = new Image();
                    canvas.width = 500;
                    canvas.height = 500;
                    imgObj.onload = function() {
                        var rel = imgObj.width / imgObj.height
                        ctx.clearRect(0,0,500,500);
                        ctx.fillStyle = "rgb(248,244,237)";
                        ctx.fillRect(0,0,canvas.width,canvas.height);
                        EXIF.getData(imgObj, function () {
                            var orientation = EXIF.getTag(this, 'Orientation');
                            console.log('orientation', orientation);
                            if (orientation) {
                                // canvas.width = orientation > 4 ? targetHeight : targetWidth
                                // canvas.height = orientation > 4 ? targetWidth : targetHeight
                                var x = canvas.width / 2;
                                var y = canvas.height / 2;
                                var rotateAngle = 0;
                                switch (orientation) {
                                    case 3:
                                    case 4:
                                        rotateAngle = 180;
                                        ctx.translate(x, y);
                                        ctx.rotate(rotateAngle * Math.PI / 180);
                                        // if (orientation > 4) {
                                        //     ;[x, y] = [y, x]
                                        // }
                                        ctx.drawImage(imgObj, -x, -y, canvas.height*rel, canvas.height);
                                        break;
                                    case 5:
                                    case 6:
                                        rotateAngle = 90;
                                        ctx.translate(x, y);
                                        ctx.rotate(rotateAngle * Math.PI / 180);
                                        // if (orientation > 4) {
                                        //     ;[x, y] = [y, x]
                                        // }
                                        ctx.drawImage(imgObj, -x, -y, canvas.height*rel, canvas.height);
                                        break;
                                    case 7:
                                    case 8:
                                        rotateAngle = -90;
                                        ctx.translate(x, y);
                                        ctx.rotate(rotateAngle * Math.PI / 180);
                                        // if (orientation > 4) {
                                        //     ;[x, y] = [y, x]
                                        // }
                                        ctx.drawImage(imgObj, -x, -y, canvas.height*rel, canvas.height);
                                        break;
                                }
        
                                switch (orientation) {
                                    case 2:
                                    case 4:
                                    case 5:
                                    case 7:
                                        ctx.scale(-1, 1)
                                        ctx.translate(x, y);
                                        ctx.rotate(rotateAngle * Math.PI / 180);
                                        // if (orientation > 4) {
                                        //     ;[x, y] = [y, x]
                                        // }
                                        ctx.drawImage(imgObj, -x, -y, canvas.height*rel, canvas.height);
                                        break
                                }
                                switch (orientation) {
                                    case 1:
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,(canvas.width-canvas.height*rel)/2,0,canvas.height*rel,canvas.height);
                                        break
                                }
                                
                            }
                            else {
                                // 來源canvas繪製 疑問處
                                if(rel > 1) { //橫照片
                                    if(imgObj.width < 500) {
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,(canvas.width-imgObj.width)/2,(canvas.height-imgObj.height)/2,imgObj.width,imgObj.height);
                                    } else {
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,0,(canvas.height-canvas.width/rel)/2,canvas.width,canvas.width/rel);
                                    }
                                } else { //直照片
                                    if(imgObj.height < 500) {
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,(canvas.width-imgObj.width)/2,(canvas.height-imgObj.height)/2,imgObj.width,imgObj.height);
                                    } else {
                                        ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,(canvas.width-canvas.height*rel)/2,0,canvas.height*rel,canvas.height);
                                    }
                                }
                            }
                        });
                    }
                    imgObj.src = e.target.result;
                }
            };
        },
        drawLoop() {
            var vm = this;

            return new Promise(function(resolve) {
                //來源 canvas
                var canvas1 = document.getElementById("canvas");
                var canvas2 = document.getElementById("canvas2");
                var canvas3 = document.getElementById("canvas3");

                //分析圖 canvas
                var drawimg1 = document.getElementById('drawimg');
                var drawimg2 = document.getElementById('drawimg2');
                var drawimg3 = document.getElementById('drawimg3');
                var dc = drawimg1.getContext('2d');
                var dc2 = drawimg2.getContext('2d');
                var dc3 = drawimg3.getContext('2d');

                //剪裁 canvas
                var cutcan1 = document.getElementById('cutcan1');
                var cutcan2 = document.getElementById('cutcan2');
                var cutcan3 = document.getElementById('cutcan3');
                var ctc1 = cutcan1.getContext('2d');
                var ctc2 = cutcan2.getContext('2d');
                var ctc3 = cutcan3.getContext('2d');
                cutcan1.width = cutcan2.width = cutcan3.width = 500;
                cutcan1.height = cutcan2.height = cutcan3.height = 500;

                //大頭貼合成 canvas
                var ucan1 = document.getElementById('ucan1');
                var ucan2 = document.getElementById('ucan2');
                var ucan3 = document.getElementById('ucan3');
                var utc1 = ucan1.getContext('2d');
                var utc2 = ucan2.getContext('2d');
                var utc3 = ucan3.getContext('2d');
                ucan1.width = ucan2.width = ucan3.width = 300;
                ucan1.height = ucan2.height = ucan3.height = 426;

                //合成 canvas
                var fCan = document.getElementById('fcan');
                var fcc = fCan.getContext('2d');
                fCan.width = 1200;
                fCan.height = 628;
                fcc.font = "bold 17px 微軟正黑體";
                fcc.textAlign = "center";
                fcc.fillStyle = "#e2007d";
                
                //分析圖大小與來源同尺寸
                drawimg1.width = 500;
                drawimg1.height = 500;
                drawimg2.width = 500;
                drawimg2.height = 500;
                drawimg3.width = 500;
                drawimg3.height = 500;

                //清除畫布
                dc.clearRect(0,0,drawimg1.width,drawimg1.height);
                dc2.clearRect(0,0,drawimg2.width,drawimg2.height);
                dc3.clearRect(0,0,drawimg3.width,drawimg3.height);
                ctc1.clearRect(0,0,cutcan1.width,cutcan1.height);
                ctc2.clearRect(0,0,cutcan2.width,cutcan2.height);
                ctc3.clearRect(0,0,cutcan3.width,cutcan3.height);
                utc1.clearRect(0,0,utc1.width,utc1.height);
                utc2.clearRect(0,0,utc2.width,utc2.height);
                utc3.clearRect(0,0,utc3.width,utc3.height);
                fcc.clearRect(0,0,fCan.width,fCan.height);

                //載入合成canvasBg
                var fcanBg = new Image();
                var prbg = new Promise(function(resolve){
                    fcanBg.addEventListener("load", function(){
                        resolve();
                    })
                    fcanBg.src = "./images/resultBg.jpg";
                });
                
                var keyWord = new Image();
                var keyWord_b = new Image();
                var keyWord2 = new Image();
                var keyWord2_b = new Image();
                var keyWord3 = new Image();
                var keyWord3_b = new Image();
                var tempw;
                var tempw2;
                var tempw3;

                //開始執行臉部辨識
                var ctracker = new clm.tracker();
                ctracker.init();

                // 另開視窗秀圖
                function openWin(obj) {
                    var baseimg = new Image();
                    var wO = window.open("");
                    for(var i=0; i<obj.length; i++) {
                        baseimg.src = obj[i].toDataURL("image/jpeg", 0.7);
                        wO.document.write(baseimg.outerHTML);
                    }
                };

                // 開始分析第1張
                ctracker.start(canvas1);
                function posloop() {
                    var pos = ctracker.getCurrentPosition();
                    if(ctracker.getCurrentPosition()) {
                        // console.log(pos[0],pos[7],pos[14],pos[21]);
                        var canSX = pos[1][0]-30;
                        var canSY = pos[20][1]-30;
                        var canEX = pos[13][0]+30;
                        var canEY = pos[7][1]+30;
                        var cW;
                        var cH;
                        var resW;
                        if(canSX <=0 ) {
                            canSX = 0;
                        }
                        if(canSY <=0 ) {
                            canSY = 0;
                        }
                        if(canEX >= canvas1.width) {
                            canEX = canvas1.width
                        }
                        if(canEY >= canvas1.height) {
                            canEY = canvas1.height
                        }
                        cW = Math.abs(canEX - canSX);
                        cH = Math.abs(canEY - canSY);
                        if(cW > cH) {
                            cW = cH;
                        } else {
                            cH = cW
                        }
                        var reultN = ((pos[19][1]+pos[20][1]+pos[15][1]+pos[16][1])-(pos[21][1]+pos[22][1]+pos[17][1]+pos[18][1]))/4;
                        var reultM = ((pos[44][1]+pos[50][1])/2)-((pos[57][1]+pos[60][1])/2);
                        
                        // 餘弦公式
                        var b = Math.sqrt(Math.abs(pos[44][0] - pos[50][0]) * Math.abs(pos[44][0] - pos[50][0]) + Math.abs(pos[44][1] - pos[50][1]) * Math.abs(pos[44][1] - pos[50][1]));
                        var a = Math.sqrt(Math.abs(pos[44][0] - pos[57][0]) * Math.abs(pos[44][0] - pos[57][0]) + Math.abs(pos[44][1] - pos[57][1]) * Math.abs(pos[44][1] - pos[57][1]));
                        var c = Math.sqrt(Math.abs(pos[57][0] - pos[50][0]) * Math.abs(pos[57][0] - pos[50][0]) + Math.abs(pos[57][1] - pos[50][1]) * Math.abs(pos[57][1] - pos[50][1]));

                        var aArc = Math.acos((c * c + a * a - b * b) /( 2 * c * a)) * 180 / Math.PI;
                        console.log("aArc", aArc);
                        // end 
                        
                        if(reultM < -0.5) {
                            resW = vm.resWord.happy;
                        }
                        if(reultM > 0.5) {
                            if(reultN > 0.5) {
                                resW = vm.resWord.sad;
                                // document.getElementById("result").innerHTML= "結果: 9"
                            }
                            if(reultN < -0.5) {
                                resW = vm.resWord.angry;
                                // document.getElementById("result").innerHTML= "結果: 7"
                            }
                            if(reultN < 0.499 && reultN > -0.499) {
                                resW = vm.resWord.angry;
                                // document.getElementById("result").innerHTML= "結果: 8"
                            }
                        }
                        if(reultM < 0.499 && reultM > -0.499) {
                            if(reultN > 0.5) {
                                resW = vm.resWord.sad;
                                // document.getElementById("result").innerHTML= "結果: 6"
                            }
                            if(reultN < -0.5) {
                                resW = vm.resWord.angry;
                                // document.getElementById("result").innerHTML= "結果: 4"
                            }
                            if(reultN < 0.499 && reultN > -0.499) {
                                resW = vm.resWord.sad;
                                // document.getElementById("result").innerHTML= "結果: 5"
                            }
                        }
                        // document.getElementById("picfir").innerHTML= "pos19: " + pos[19][1] + "<br>" + "pos20: " + pos[20][1] + "<br>" + "pos21: " + pos[21][1] + "<br>" + "pos22: " + pos[22][1] + "<br><br>"
                        //                                             + "pos15: " + pos[15][1] + "<br>" + "pos16: " + pos[16][1] + "<br>" + "pos17: " + pos[17][1] + "<br>" + "pos18: " + pos[18][1] + "<br><br>"
                        //                                             + "pos50: " + pos[50][1] + "<br>" + "pos60: " + pos[60][1] + "<br>" + "pos57: " + pos[57][1] + "<br>" + "pos44: " + pos[44][1] + "<br><br>"
                        //                                             + "眉毛: " + reultN + "<br>" + "嘴巴: " + reultM + "<br>" + "嘴巴角度: " + aArc;
                        ctracker.draw(drawimg1);
                        ctc1.drawImage(canvas1,canSX,canSY,cW,cH,0,0,cutcan1.width,cutcan1.height);
                        utc1.drawImage(cutcan1,0,0,cutcan1.width,cutcan1.height,0,0,300,300);
                        var i = Math.floor(Math.random()*resW.length);
                        tempw = vm.shuffle(resW)[i];
                        vm.keyWord.word1 = tempw[0];
                        // console.log(tempw[0]);
                        var prkw1 = new Promise(function(resolve){
                            keyWord.addEventListener("load", function(){
                                resolve();
                            });
                            keyWord.src = tempw[0];
                        });
                        var prkwb1 = new Promise(function(resolve){
                            keyWord_b.addEventListener("load", function(){
                                resolve();
                            });
                            keyWord_b.src = tempw[1];
                        });
                        resW.splice(i,1);
                        clearInterval(chpo);
                        ctracker.stop();
                        ctracker.reset();

                        // 開始分析第2張
                        ctracker.start(canvas2);
                        function posloop2() {
                            var pos = ctracker.getCurrentPosition();
                            if(ctracker.getCurrentPosition()) {
                                // console.log(pos[0],pos[7],pos[14],pos[21]);
                                var canSX = pos[1][0]-30;
                                var canSY = pos[20][1]-30;
                                var canEX = pos[13][0]+30;
                                var canEY = pos[7][1]+30;
                                // console.log(canSX,canSY,canEX,canEY);
                                if(canSX <=0 ) {
                                    canSX = 0;
                                }
                                if(canSY <=0 ) {
                                    canSY = 0;
                                }
                                if(canEX >= canvas2.width) {
                                    canEX = canvas2.width
                                }
                                if(canEY >= canvas2.height) {
                                    canEY = canvas2.height
                                }
                                cW = Math.abs(canEX - canSX);
                                cH = Math.abs(canEY - canSY);
                                if(cW > cH) {
                                    cW = cH;
                                } else {
                                    cH = cW
                                }
                                var reultN = ((pos[19][1]+pos[20][1]+pos[15][1]+pos[16][1])-(pos[21][1]+pos[22][1]+pos[17][1]+pos[18][1]))/4;
                                var reultM = ((pos[44][1]+pos[50][1])/2)-((pos[57][1]+pos[60][1])/2);
                                var b = Math.sqrt(Math.abs(pos[44][0] - pos[50][0]) * Math.abs(pos[44][0] - pos[50][0]) + Math.abs(pos[44][1] - pos[50][1]) * Math.abs(pos[44][1] - pos[50][1]));
                                var a = Math.sqrt(Math.abs(pos[44][0] - pos[57][0]) * Math.abs(pos[44][0] - pos[57][0]) + Math.abs(pos[44][1] - pos[57][1]) * Math.abs(pos[44][1] - pos[57][1]));
                                var c = Math.sqrt(Math.abs(pos[57][0] - pos[50][0]) * Math.abs(pos[57][0] - pos[50][0]) + Math.abs(pos[57][1] - pos[50][1]) * Math.abs(pos[57][1] - pos[50][1]));

                                var aArc = Math.acos((c * c + a * a - b * b) /( 2 * c * a)) * 180 / Math.PI;
                                if(reultM < -0.5) {
                                    resW = vm.resWord.happy;
                                }
                                if(reultM > 0.5) {
                                    if(reultN > 0.5) {
                                        resW = vm.resWord.sad;
                                    }
                                    if(reultN < -0.5) {
                                        resW = vm.resWord.angry;
                                    }
                                    if(reultN < 0.499 && reultN > -0.499) {
                                        resW = vm.resWord.angry;
                                    }
                                }
                                if(reultM < 0.499 && reultM > -0.499) {
                                    if(reultN > 0.5) {
                                        resW = vm.resWord.sad;
                                    }
                                    if(reultN < -0.5) {
                                        resW = vm.resWord.angry;
                                    }
                                    if(reultN < 0.499 && reultN > -0.499) {
                                        resW = vm.resWord.sad;
                                    }
                                }
                                ctracker.draw(drawimg2);
                                ctc2.drawImage(canvas2,canSX,canSY,cW,cH,0,0,cutcan2.width,cutcan2.height);
                                utc2.drawImage(cutcan2,0,0,cutcan2.width,cutcan2.height,0,0,300,300);
                                var i = Math.floor(Math.random()*resW.length);
                                tempw2 = vm.shuffle(resW)[i];
                                vm.keyWord.word2 = tempw2[0];
                                var prkw2 = new Promise(function(resolve){
                                    keyWord2.addEventListener("load", function(){
                                        resolve();
                                    });
                                    keyWord2.src = tempw2[0];
                                });
                                var prkwb2 = new Promise(function(resolve){
                                    keyWord2_b.addEventListener("load", function(){
                                        resolve();
                                    });
                                    keyWord2_b.src = tempw2[1];
                                });
                                resW.splice(i,1);
                                clearInterval(chpo2);
                                ctracker.stop();
                                ctracker.reset();

                                // 開始分析第3張
                                ctracker.start(canvas3);
                                function posloop3() {
                                    var pos = ctracker.getCurrentPosition();
                                    if(ctracker.getCurrentPosition()) {
                                        // console.log(pos[0],pos[7],pos[14],pos[21]);
                                        var canSX = pos[1][0]-30;
                                        var canSY = pos[20][1]-30;
                                        var canEX = pos[13][0]+30;
                                        var canEY = pos[7][1]+30;
                                        // console.log(canSX,canSY,canEX,canEY);
                                        if(canSX <=0 ) {
                                            canSX = 0;
                                        }
                                        if(canSY <=0 ) {
                                            canSY = 0;
                                        }
                                        if(canEX >= canvas3.width) {
                                            canEX = canvas3.width
                                        }
                                        if(canEY >= canvas3.height) {
                                            canEY = canvas3.height
                                        }
                                        cW = Math.abs(canEX - canSX);
                                        cH = Math.abs(canEY - canSY);
                                        if(cW > cH) {
                                            cW = cH;
                                        } else {
                                            cH = cW
                                        }
                                        var reultN = ((pos[19][1]+pos[20][1]+pos[15][1]+pos[16][1])-(pos[21][1]+pos[22][1]+pos[17][1]+pos[18][1]))/4;
                                        var reultM = ((pos[44][1]+pos[50][1])/2)-((pos[57][1]+pos[60][1])/2);
                                        var b = Math.sqrt(Math.abs(pos[44][0] - pos[50][0]) * Math.abs(pos[44][0] - pos[50][0]) + Math.abs(pos[44][1] - pos[50][1]) * Math.abs(pos[44][1] - pos[50][1]));
                                        var a = Math.sqrt(Math.abs(pos[44][0] - pos[57][0]) * Math.abs(pos[44][0] - pos[57][0]) + Math.abs(pos[44][1] - pos[57][1]) * Math.abs(pos[44][1] - pos[57][1]));
                                        var c = Math.sqrt(Math.abs(pos[57][0] - pos[50][0]) * Math.abs(pos[57][0] - pos[50][0]) + Math.abs(pos[57][1] - pos[50][1]) * Math.abs(pos[57][1] - pos[50][1]));

                                        var aArc = Math.acos((c * c + a * a - b * b) /( 2 * c * a)) * 180 / Math.PI;
                                        if(reultM < -0.5) {
                                            resW = vm.resWord.happy;
                                        }
                                        if(reultM > 0.5) {
                                            if(reultN > 0.5) {
                                                resW = vm.resWord.sad;
                                            }
                                            if(reultN < -0.5) {
                                                resW = vm.resWord.angry;
                                            }
                                            if(reultN < 0.499 && reultN > -0.499) {
                                                resW = vm.resWord.angry;
                                            }
                                        }
                                        if(reultM < 0.499 && reultM > -0.499) {
                                            if(reultN > 0.5) {
                                                resW = vm.resWord.sad;
                                            }
                                            if(reultN < -0.5) {
                                                resW = vm.resWord.angry;
                                            }
                                            if(reultN < 0.499 && reultN > -0.499) {
                                                resW = vm.resWord.sad;
                                            }
                                        }
                                        ctracker.draw(drawimg3);
                                        ctc3.drawImage(canvas3,canSX,canSY,cW,cH,0,0,cutcan3.width,cutcan3.height);
                                        utc3.drawImage(cutcan3,0,0,cutcan3.width,cutcan3.height,0,0,300,300);
                                        var i = Math.floor(Math.random()*resW.length);
                                        tempw3 = vm.shuffle(resW)[i];
                                        vm.keyWord.word3 = tempw3[0];
                                        var prkw3 = new Promise(function(resolve){
                                            keyWord3.addEventListener("load", function(){
                                                resolve();
                                            });
                                            keyWord3.src = tempw3[0];
                                        });
                                        var prkwb3 = new Promise(function(resolve){
                                            keyWord3_b.addEventListener("load", function(){
                                                resolve();
                                            });
                                            keyWord3_b.src = tempw3[1];
                                        });
                                        Promise.all([prbg,prkw1,prkwb1,prkw2,prkwb2,prkw3,prkwb3]).then(function(){
                                            // vm.face = true;
                                            fcc.drawImage(fcanBg,0,0,fcanBg.width,fcanBg.height,0,0,fCan.width,fCan.height);
                                            fcc.drawImage(cutcan1,0,0,cutcan1.width,cutcan1.height,61,284,163,157);
                                            fcc.drawImage(cutcan2,0,0,cutcan2.width,cutcan2.height,302,312,163,157);
                                            fcc.drawImage(cutcan3,0,0,cutcan3.width,cutcan3.height,518,293,163,157);
                                            fcc.rotate(-10 * Math.PI / 180);
                                            fcc.drawImage(keyWord,0,0,keyWord.width,keyWord.height,15,180,keyWord.width*0.7,keyWord.height*0.7);
                                            fcc.rotate(10 * Math.PI / 180);
                                            fcc.rotate(-4 * Math.PI / 180);
                                            fcc.drawImage(keyWord2,0,0,keyWord2.width,keyWord2.height,275,195,keyWord2.width*0.7,keyWord2.height*0.7);
                                            fcc.rotate(4 * Math.PI / 180);
                                            fcc.rotate(9 * Math.PI / 180);
                                            fcc.drawImage(keyWord3,0,0,keyWord3.width,keyWord3.height,530,55,keyWord3.width*0.7,keyWord3.height*0.7);
                                            fcc.rotate(-9 * Math.PI / 180);
                                            utc1.drawImage(keyWord_b,0,0,keyWord_b.width,keyWord_b.height,0,ucan1.height-126,300,126);
                                            utc2.drawImage(keyWord2_b,0,0,keyWord2_b.width,keyWord2_b.height,0,ucan2.height-126,300,126);
                                            utc3.drawImage(keyWord3_b,0,0,keyWord3_b.width,keyWord3_b.height,0,ucan3.height-126,300,126);
                                            vm.canvas.ccan1 = ucan1.toDataURL("image/jpeg", 0.8);
                                            vm.canvas.ccan2 = ucan2.toDataURL("image/jpeg", 0.8);
                                            vm.canvas.ccan3 = ucan3.toDataURL("image/jpeg", 0.8);
                                            vm.canvas.fcan = fCan.toDataURL("image/jpeg", 0.8);
                                            vm.gamesec = "20%";
                                            document.getElementById("progress").style.transform = "translateX(20%)";
                                            vm.getToken().then(function(){
                                                vm.gamesec = "40%";
                                                document.getElementById("progress").style.transform = "translateX(40%)";
                                                vm.grecaptcha("game").then(function(){
                                                    vm.gamesec = "60%";
                                                    document.getElementById("progress").style.transform = "translateX(60%)";
                                                    vm.saveImg();
                                                })
                                            });
                                            resolve();
                                        });
                                        resW.splice(i,1);
                                        clearInterval(chpo3);
                                        ctracker.stop();
                                        ctracker.reset();

                                        // TODO 合成為一張canvas
                                        // fcc.drawImage(cutcan1,0,0,cutcan1.width,cutcan1.height,61,284,163,157);
                                        // fcc.drawImage(cutcan2,0,0,cutcan2.width,cutcan2.height,302,312,163,157);
                                        // fcc.drawImage(cutcan3,0,0,cutcan3.width,cutcan3.height,518,293,163,157);
                                        
                                        // 另開視窗秀圖
                                        var canS = [cutcan1,cutcan2,cutcan3];
                                        // openWin(canS);
                                    } else {
                                        // clearInterval(chpo3);
                                        // console.log("第三張");
                                        ctc3.drawImage(canvas3,0,0,canvas3.width,canvas3.height,0,0,cutcan3.width,cutcan3.height);
                                        utc3.drawImage(cutcan3,0,0,cutcan3.width,cutcan3.height,0,0,300,300);
                                        resW = vm.resWord.all;
                                        var i = Math.floor(Math.random()*resW.length);
                                        tempw3 = vm.shuffle(resW)[i];
                                        vm.keyWord.word3 = tempw3[0];
                                        var prkw3 = new Promise(function(resolve){
                                            keyWord3.addEventListener("load", function(){
                                                resolve();
                                            });
                                            keyWord3.src = tempw3[0];
                                        });
                                        var prkwb3 = new Promise(function(resolve){
                                            keyWord3_b.addEventListener("load", function(){
                                                resolve();
                                            });
                                            keyWord3_b.src = tempw3[1];
                                        });
                                        Promise.all([prbg,prkw1,prkwb1,prkw2,prkwb2,prkw3,prkwb3]).then(function(){
                                            // vm.face = true;
                                            fcc.drawImage(fcanBg,0,0,fcanBg.width,fcanBg.height,0,0,fCan.width,fCan.height);
                                            fcc.drawImage(cutcan1,0,0,cutcan1.width,cutcan1.height,61,284,163,157);
                                            fcc.drawImage(cutcan2,0,0,cutcan2.width,cutcan2.height,302,312,163,157);
                                            fcc.drawImage(cutcan3,0,0,cutcan3.width,cutcan3.height,518,293,163,157);
                                            fcc.rotate(-10 * Math.PI / 180);
                                            fcc.drawImage(keyWord,0,0,keyWord.width,keyWord.height,15,180,keyWord.width*0.7,keyWord.height*0.7);
                                            fcc.rotate(10 * Math.PI / 180);
                                            fcc.rotate(-4 * Math.PI / 180);
                                            fcc.drawImage(keyWord2,0,0,keyWord2.width,keyWord2.height,275,195,keyWord2.width*0.7,keyWord2.height*0.7);
                                            fcc.rotate(4 * Math.PI / 180);
                                            fcc.rotate(9 * Math.PI / 180);
                                            fcc.drawImage(keyWord3,0,0,keyWord3.width,keyWord3.height,530,55,keyWord3.width*0.7,keyWord3.height*0.7);
                                            fcc.rotate(-9 * Math.PI / 180);
                                            utc1.drawImage(keyWord_b,0,0,keyWord_b.width,keyWord_b.height,0,ucan1.height-126,300,126);
                                            utc2.drawImage(keyWord2_b,0,0,keyWord2_b.width,keyWord2_b.height,0,ucan2.height-126,300,126);
                                            utc3.drawImage(keyWord3_b,0,0,keyWord3_b.width,keyWord3_b.height,0,ucan3.height-126,300,126);
                                            vm.canvas.ccan1 = ucan1.toDataURL("image/jpeg", 0.8);
                                            vm.canvas.ccan2 = ucan2.toDataURL("image/jpeg", 0.8);
                                            vm.canvas.ccan3 = ucan3.toDataURL("image/jpeg", 0.8);
                                            vm.canvas.fcan = fCan.toDataURL("image/jpeg", 0.8);
                                            vm.gamesec = "20%";
                                            document.getElementById("progress").style.transform = "translateX(20%)";
                                            vm.getToken().then(function(){
                                                vm.gamesec = "40%";
                                                document.getElementById("progress").style.transform = "translateX(40%)";
                                                vm.grecaptcha("game").then(function(){
                                                    vm.gamesec = "60%";
                                                    document.getElementById("progress").style.transform = "translateX(60%)";
                                                    vm.saveImg();
                                                })
                                            });
                                            resolve();
                                        });
                                        resW.splice(i,1);
                                        console.log("PPPI");

                                        // vm.popup = true;
                                        // vm.loading = false;
                                        // vm.popEvent = "type";
                                        // vm.popPage = "err";
                                        // vm.errW = "第三張";
                                        // return
                                    }
                                }
                                var chpo3 = setInterval(function() {
                                    posloop3();
                                }, 1000);
                            } else {
                                // clearInterval(chpo2);
                                // console.log("第二張");
                                ctc2.drawImage(canvas2,0,0,canvas2.width,canvas2.height,0,0,cutcan2.width,cutcan2.height);
                                utc2.drawImage(cutcan2,0,0,cutcan2.width,cutcan2.height,0,0,300,300);
                                resW = vm.resWord.all;
                                var i = Math.floor(Math.random()*resW.length);
                                tempw2 = vm.shuffle(resW)[i];
                                vm.keyWord.word2 = tempw2[0];
                                var prkw2 = new Promise(function(resolve){
                                    keyWord2.addEventListener("load", function(){
                                        resolve();
                                    });
                                    keyWord2.src = tempw2[0];
                                });
                                var prkwb2 = new Promise(function(resolve){
                                    keyWord2_b.addEventListener("load", function(){
                                        resolve();
                                    });
                                    keyWord2_b.src = tempw2[1];
                                });
                                resW.splice(i,1);

                                // vm.popup = true;
                                // vm.loading = false;
                                // vm.popEvent = "type";
                                // vm.popPage = "err";
                                // vm.errW = "第二張";
                                // return
                            }
                        }
                        var chpo2 = setInterval(function() {
                            posloop2();
                        }, 1000);
                    } else {
                        // clearInterval(chpo);
                        // console.log("第一張");
                        ctc1.drawImage(canvas1,0,0,canvas1.width,canvas1.height,0,0,cutcan1.width,cutcan1.height);
                        utc1.drawImage(cutcan1,0,0,cutcan1.width,cutcan1.height,0,0,300,300);
                        resW = vm.resWord.all;
                        var i = Math.floor(Math.random()*resW.length);
                        tempw = vm.shuffle(resW)[i];
                        vm.keyWord.word1 = tempw[0];
                        // console.log(tempw[0]);
                        var prkw1 = new Promise(function(resolve){
                            keyWord.addEventListener("load", function(){
                                resolve();
                            });
                            keyWord.src = tempw[0];
                        });
                        var prkwb1 = new Promise(function(resolve){
                            keyWord_b.addEventListener("load", function(){
                                resolve();
                            });
                            keyWord_b.src = tempw[1];
                        });
                        resW.splice(i,1);
                        ctracker.start(canvas2);
                        var chpo2 = setInterval(function() {
                            posloop2();
                        }, 1000);
                        
                        // vm.popup = true;
                        // vm.loading = false;
                        // vm.popEvent = "type";
                        // vm.popPage = "err";
                        // vm.errW = "第一張";
                        // return
                    }
                }
                var chpo = setInterval(function() {
                    posloop();
                }, 1000);

                // document.addEventListener("clmtrackrNotFound", function(event) {
                //     // console.log(event);
                //     console.log("照片不符合");
                //     // ctracker.stop();
                //     // clearInterval(chpo);
                // }, false);
            });
            
        },
        long_text(word,cxt,x,y) { //canvas 文字斷行
            var vm = this;
            // console.log(word,cxt,x,y);
            var linelenght = 35;
            var text = "";
            var count = 0;
            var txtx = x;
            var txty = y;
            var stringLenght = word.length;
            var newtext = word.split("");
            var context = cxt;
            for(var i=0; i<stringLenght+1; i++) {
                if(count >= 8) {
                    context.fillText(text,x,y);
                    y = y + linelenght;
                    text = "";
                    count = 0;
                }
                else {
                    context.fillText(text,x,y);
                }
                var text = text + newtext[0];
                count ++;
                newtext.shift();
            }
        },
        shuffle(arr) { //洗牌
            var vm = this;
            var i,j,temp;
            for(i = arr.length-1; i > 0; i--) {
                j = Math.floor(Math.random()*(i+1));
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
            return arr;
        },
        playAgain() {
            window.location = "./game.html";
        },
        fbLogin() {
            var vm = this;
            if(vm.fileimg.fimg1 == "" || vm.fileimg.fimg2 == "" || vm.fileimg.fimg3 == "" || vm.agree == false) {
                vm.popup = true;
                vm.popEvent = "type";
                vm.popPage = "picerr";
                return
            }
            FB.login(function(res){
                console.log(res);
                if (res.status === 'connected') {
                    vm.popup = true;
                    vm.loading = true;
                    vm.fbData.fbtoken = res.authResponse.accessToken;
                    vm.fbData.fbId = res.authResponse.userID;
                    FB.api('/me','GET',{"fields":"id,name,picture"},
                        function(apires) {
                            console.log(apires);
                            vm.fbData.fbName = apires.name;
                            vm.fbData.fbPic = 'http://graph.facebook.com/'+ apires.id +'/picture?width=140&height=140';
                            vm.drawLoop().then(function(){
                                // vm.saveImg();
                            });
                        }
                    );
                }
            })
        },
        saveImg() {
            var vm = this;
            vm.gamesec = "80%";
            document.getElementById("progress").style.transform = "translateX(80%)";
            var post_data = new FormData();
            post_data.append("fbId",vm.fbData.fbId);
            post_data.append("fbName",vm.fbData.fbName);
            post_data.append("fbPicture",vm.fbData.fbPic);
            post_data.append("shareImg",vm.canvas.fcan);
            post_data.append("userImg1",vm.canvas.ccan1);
            post_data.append("userImg2",vm.canvas.ccan2);
            post_data.append("userImg3",vm.canvas.ccan3);
            post_data.append("keyword1",vm.keyWord.word1);
            post_data.append("keyword2",vm.keyWord.word2);
            post_data.append("keyword3",vm.keyWord.word3);
            post_data.append("reCaptcha",vm.reCaptcha);
            return $.ajax({
                url: `${friendo_url}MineShine/image`,
                headers: {
                    "Authorization": "Bearer "+ vm.gToken,
                },
                data: post_data,
                method: "POST",
                processData: false,
                contentType: false,
                // dataType: "json"
            }).done(function(res) {
                console.log("saveImg:",res);
                if(res.success) {
                    vm.gamesec = "100%";
                    document.getElementById("progress").style.transform = "translateX(100%)";
                    window.location.href = "./result.html?user=" + res.data.code;
                } else {
                    alert("資料錯誤");
                    vm.loading = false;
                    vm.popup = false;
                }
            });
        },
    },
    mounted: function() {
        var vm = this;
        $("body").loadpage("init",{async : false});
        // fb sdk引用
        window.fbAsyncInit = function () {
            FB.init({
                appId: '2287821511516890',
                status:true,
                cookie: true,
                xfbml: false,
                version: 'v5.0'
            });
        };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
})

