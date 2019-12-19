var index_view = new Vue({
    el: "#app",
    data: {
        fileimg: {
            fimg1: "",
            fimg2: "",
            fimg3: "",
        }
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
                        if(imgObj.width > 500 && imgObj.height > 500) {
                            ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,0,0,canvas.width,canvas.width/rel);
                        } 
                        else if(imgObj.width > 500 && imgObj.height < 500) {
                            ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,0,0,canvas.width,canvas.width/rel);
                        }
                        else if(imgObj.height > 500 && imgObj.width < 500) {
                            ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,0,0,canvas.width*rel,canvas.width);
                        }
                        else {
                            ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height);
                        }
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
                        if(imgObj.width > 500 && imgObj.height > 500) {
                            ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,0,0,canvas.width,canvas.width/rel);
                        } 
                        else if(imgObj.width > 500 && imgObj.height < 500) {
                            ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,0,0,canvas.width,canvas.width/rel);
                        }
                        else if(imgObj.height > 500 && imgObj.width < 500) {
                            ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,0,0,canvas.width*rel,canvas.width);
                        }
                        else {
                            ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height);
                        }
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
                        if(imgObj.width > 500 && imgObj.height > 500) {
                            ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,0,0,canvas.width,canvas.width/rel);
                        } 
                        else if(imgObj.width > 500 && imgObj.height < 500) {
                            ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,0,0,canvas.width,canvas.width/rel);
                        }
                        else if(imgObj.height > 500 && imgObj.width < 500) {
                            ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height,0,0,canvas.width*rel,canvas.width);
                        }
                        else {
                            ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height);
                        }
                    }
                    imgObj.src = e.target.result;
                }
            };
        },
        drawLoop() {
            var vm = this;
            var canvas1 = document.getElementById("canvas");
            var canvas2 = document.getElementById("canvas2");
            var canvas3 = document.getElementById("canvas3");
            // var cc1 = canvas1.getContext("2d");
            // var cc2 = canvas2.getContext("2d");
            // var cc3 = canvas3.getContext("2d");
            var drawimg1 = document.getElementById('drawimg');
            var drawimg2 = document.getElementById('drawimg2');
            var drawimg3 = document.getElementById('drawimg3');
            var dc = drawimg1.getContext('2d');
            var dc2 = drawimg2.getContext('2d');
            var dc3 = drawimg3.getContext('2d');
            var cutcan1 = document.getElementById('cutcan');
            var cutcan2 = document.getElementById('cutcan2');
            var cutcan3 = document.getElementById('cutcan3');
            var ctc1 = cutcan1.getContext('2d');
            var ctc2 = cutcan2.getContext('2d');
            var ctc3 = cutcan3.getContext('2d');
            drawimg1.width = 500;
            drawimg1.height = 500;
            drawimg2.width = 500;
            drawimg2.height = 500;
            drawimg3.width = 500;
            drawimg3.height = 500;
            cutcan1.width = cutcan2.width = cutcan3.width = 200;
            cutcan1.height = cutcan2.height = cutcan3.height = 200;
            ctc1.font = ctc2.font = ctc3.font = "30px Comic Sans MS";
            ctc1.textAlign = ctc2.textAlign = ctc3.textAlign = "center";
            // cutcan1.width = 100;
            // cutcan1.height = 100;
            dc.clearRect(0,0,drawimg1.width,drawimg1.height);
            dc2.clearRect(0,0,drawimg2.width,drawimg2.height);
            dc3.clearRect(0,0,drawimg3.width,drawimg3.height);
            ctc1.clearRect(0,0,ctc1.width,ctc1.height);
            ctc2.clearRect(0,0,ctc2.width,ctc2.height);
            ctc3.clearRect(0,0,ctc3.width,ctc3.height);
            var ctracker = new clm.tracker();
            ctracker.init();
            var ctracker2 = new clm.tracker();
            ctracker2.init();
            var ctracker3 = new clm.tracker();
            ctracker3.init();
            ctracker.start(canvas1);
            ctracker2.start(canvas2);
            ctracker3.start(canvas3);

            document.addEventListener("clmtrackrNotFound", function(event) {
                console.log("照片不符合");
                ctracker.stop();
                ctracker2.stop();
                ctracker3.stop();
                clearInterval(chpo);
            }, false);
            function posloop() {
                // requestAnimationFrame(posloop);
                var pos1 = ctracker.getCurrentPosition();
                var pos2 = ctracker2.getCurrentPosition();
                var pos3 = ctracker3.getCurrentPosition();
                // console.log(pos);
                console.log(pos1[0],pos1[7],pos1[14],pos1[21]);
                var canSX = pos1[1][0];
                var canSY = pos1[21][1]-10;
                var canEX = pos1[14][0];
                var canEY = pos1[7][1];
                var canSX2 = pos2[1][0];
                var canSY2 = pos2[21][1]-10;
                var canEX2 = pos2[14][0];
                var canEY2 = pos2[7][1];
                var canSX3 = pos3[1][0];
                var canSY3 = pos3[21][1]-10;
                var canEX3 = pos3[14][0];
                var canEY3 = pos3[7][1];
                var cW;
                var cH;
                // console.log(canSX,canSY,canEX,canEY);
                if(ctracker.getCurrentPosition() && ctracker2.getCurrentPosition() && ctracker3.getCurrentPosition()) {
                    cW = Math.abs(canEX - canSX);
                    cH = Math.abs(canEY - canSY);
                    if(cW > cH) {
                        cW = cH;
                    } else {
                        cH = cW
                    }
                    ctracker.draw(drawimg1);
                    ctc1.drawImage(canvas1,canSX,canSY,cW,cH,0,0,cutcan1.width,cutcan1.height);
                    // clearInterval(chpo);
                    ctracker.stop();
                    ctracker.reset();

                    cW = Math.abs(canEX2 - canSX2);
                    cH = Math.abs(canEY2 - canSY2);
                    if(cW > cH) {
                        cW = cH;
                    } else {
                        cH = cW
                    }
                    ctracker2.draw(drawimg2);
                    ctc2.drawImage(canvas2,canSX,canSY,cW,cH,0,0,cutcan2.width,cutcan2.height);
                    // clearInterval(chpo);
                    ctracker2.stop();
                    ctracker2.reset();

                    cW = Math.abs(canEX3 - canSX3);
                    cH = Math.abs(canEY3 - canSY3);
                    if(cW > cH) {
                        cW = cH;
                    } else {
                        cH = cW
                    }
                    ctracker3.draw(drawimg3);
                    ctc3.drawImage(canvas3,canSX,canSY,cW,cH,0,0,cutcan3.width,cutcan3.height);
                    clearInterval(chpo);
                    ctracker3.stop();
                    ctracker3.reset();
                }
            }
            var chpo = setInterval(() => {
                posloop();
            }, 1000);
            
            // console.log(ctracker);
            // setTimeout(function() {
            //     ctracker.draw(drawimg1);
            //     ctracker.stop();
            //     ctracker.reset();
            //     ctracker.start(canvas2);
            //     setTimeout(function() {
            //         ctracker.draw(drawimg2);
            //         ctracker.stop();
            //         ctracker.reset();
            //         ctracker.start(canvas3);
            //         setTimeout(function() {
            //             ctracker.draw(drawimg3);
            //             ctracker.stop();
            //             ctracker.reset();
            //         },1000)
            //     },1000);
            // },1000);
            // document.addEventListener("clmtrackrLost", function(event) {
            //     ctracker.stop();
            //     ctracker.reset();
            //     alert("照片不符合");
            // }, false);
            
        },
        game: function() {
            var vm = this;
            var imgObj = new Image();
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            var drawImg = document.getElementById("drawimg");
            var drawImgc = drawImg.getContext("2d");
            canvas.width = 500;
            canvas.height = 500;
            drawImg.width = canvas.width;
            drawImg.height = canvas.height;
            var ctracker = new clm.tracker();
            ctracker.init();
            // imgObj.onload = function() {
            //     ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height);
            //     // ctx.drawImage(imgObj,0,0,imgObj.width,imgObj.height);
            // }
            // imgObj.src = "./images/pic1.jpg";

            // ctracker.start(document.getElementById('canvas'));
            // setTimeout(function(){
            //     ctracker.draw(document.getElementById("drawimg"));
            //     console.log(ctracker);
            //     console.log(drawImg.toDataURL("image/jpeg", 0.7))
            // },1000);
            document.addEventListener("clmtrackrNotFound", function(event) {
                ctracker.stop();
                alert("The tracking had problems with finding a face in this image. Try selecting the face in the image manually.")
            }, false);

            var fileList, fileIndex;
            if (window.File && window.FileReader && window.FileList) {
                function handleFileSelect(evt) {
                    var files = evt.target.files;
                    console.log(files);
                    fileList = [];
                    for (var i = 0;i < files.length;i++) {
                        if (!files[i].type.match('image.*')) {
                            continue;
                        }
                        fileList.push(files[i]);
                    }
                    if (files.length > 0) {
                        fileIndex = 0;
                    }
                    loadImage();
                }
                // document.getElementById('files').addEventListener('change', handleFileSelect, false);
                document.getElementById('files1').addEventListener('change', handleFileSelect, false);
                document.getElementById('files2').addEventListener('change', handleFileSelect, false);
                document.getElementById('files3').addEventListener('change', handleFileSelect, false);
            };

            function loadImage() {
                if (fileList.indexOf(fileIndex) < 0) {
                    var reader = new FileReader();
                    reader.onload = (function(theFile) {
                        return function(e) {
                            // check if positions already exist in storage

                            // Render thumbnail.
                            var canvas = document.getElementById('canvas');
                            var cc = canvas.getContext('2d');
                            var drawimg = document.getElementById('drawimg');
                            var dc = drawimg.getContext('2d');
                            var img = new Image();
                            // img.onload = function() {
                            //     if (img.height > 500 || img.width > 700) {
                            //         var rel = img.height/img.width;
                            //         var neww = 700;
                            //         var newh = neww*rel;
                            //         if (newh > 500) {
                            //             newh = 500;
                            //             neww = newh/rel;
                            //         }
                            //         canvas.setAttribute('width', neww);
                            //         canvas.setAttribute('height', newh);
                            //         cc.drawImage(img,0,0,neww, newh);
                            //         drawimg.width = canvas.width;
                            //         drawimg.height = canvas.height;
                            //         drawImgc.clearRect(0, 0, drawimg.width, drawimg.height);
                            //     } else {
                            //         canvas.setAttribute('width', img.width);
                            //         canvas.setAttribute('height', img.height);
                            //         cc.drawImage(img,0,0,img.width, img.height);
                            //         drawimg.width = canvas.width;
                            //         drawimg.height = canvas.height;
                            //         drawImgc.clearRect(0, 0, drawimg.width, drawimg.height);
                            //     }
                            // }
                            img.onload = function() {
                                var rel = img.width / img.height
                                cc.clearRect(0,0,500,500);
                                cc.drawImage(img,0,0,img.width,img.height);
                                dc.clearRect(0,0,500,500);
                                if(img.width > 500 || img.height > 500) {
                                    cc.clearRect(0,0,canvas.width,canvas.height);
                                    cc.drawImage(img,0,0,img.width,img.height,0,0,canvas.width,canvas.width/rel);
                                    drawimg.width = canvas.width;
                                    drawimg.height = canvas.height;
                                    dc.clearRect(0,0,drawimg.width,drawimg.height);
                                }
                                ctracker.reset();
                                ctracker.start(canvas);
                                setTimeout(function(){
                                    ctracker.draw(drawimg);
                                    console.log(drawImg.toDataURL("image/jpeg", 0.7))
                                },1000);
                            }
                            img.src = e.target.result;
                        };
                    })(fileList[fileIndex]);
                    reader.readAsDataURL(fileList[fileIndex]);
                }
            }
        },
    },
    mounted: function() {
        var vm = this;
        // vm.game();
    }
})

