var index_view = new Vue({
    el: "#app",
    data: {
        stepPage: "kv",
        facebase64: "",
        faceData: {},
        faceId: "",
        faceEye: 0,
        faceLip: 0,
        faceNose: 0,
        faceScore: 0,
        picAgree: false,
    },
    methods: {
        checkUpimg() {
            var input = document.querySelector('input');
            var preview = document.querySelector('.preview');
            input.addEventListener('change', updateImageDisplay);
            input.style.opacity = 0;
            var fileTypes = [
                'image/jpeg',
                'image/pjpeg',
                'image/png'
            ]
            function validFileType(file) {
                for(var i = 0; i < fileTypes.length; i++) {
                    if(file.type === fileTypes[i]) {
                    return true;
                    }
                }
                return false;
            }
            function returnFileSize(number) {
                if(number < 1024) {
                    return number + 'bytes';
                } else if(number > 1024 && number < 1048576) {
                    return (number/1024).toFixed(1) + 'KB';
                } else if(number > 1048576) {
                    return (number/1048576).toFixed(1) + 'MB';
                }
            }
            function updateImageDisplay() {
                while(preview.firstChild) {
                    preview.removeChild(preview.firstChild);
                }
                
                var curFiles = input.files;
                if(curFiles.length === 0) {
                    var para = document.createElement('p');
                    para.textContent = 'No files currently selected for upload';
                    preview.appendChild(para);
                } else {
                    var list = document.createElement('ol');
                    preview.appendChild(list);
                    for(var i = 0; i < curFiles.length; i++) {
                    var listItem = document.createElement('li');
                    var para = document.createElement('p');
                    if(validFileType(curFiles[i])) {
                        para.textContent = 'File name ' + curFiles[i].name + ', file size ' + returnFileSize(curFiles[i].size) + '.';
                        var image = document.createElement('img');
                        image.setAttribute("id","blah");
                        // var image = document.getElementById('blah');
                        image.src = window.URL.createObjectURL(curFiles[i]);
                        listItem.appendChild(image);
                        listItem.appendChild(para);
                
                    } else {
                        para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
                        listItem.appendChild(para);
                    }
                
                    list.appendChild(listItem);
                    }
                }
            }
        },
        readURL(input) {
            var vm = this;
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    vm.facebase64 = e.target.result;
                    $('#blah').attr('src', e.target.result);
                    $('.preview').css('display','block');
                    $('.garybg').css('display','none');
                    $('.inputlab').css('opacity','0');
                }
                reader.readAsDataURL(input.files[0]);
            }
        },
        processImage() {
            var vm = this;
            var subscriptionKey = "a33915a3b926473da34474fdca48f3eb";
            var uriBase = "https://eastasia.api.cognitive.microsoft.com/face/v1.0/detect";
        
            // Request parameters.
            var params = {
                "returnFaceId": "true",
                "returnFaceLandmarks": "true",
                "returnFaceAttributes":
                    "age,gender,headPose,smile,facialHair,glasses,emotion," +
                    "hair,makeup,occlusion,accessories,blur,exposure,noise"
            };
        
            // Display the image.
            // var reg = new RegExp("data:image/jpeg;base64,");
            // var sourceImageUrl = document.getElementById("blah").src
            var sourceImageUrl = "http://data.whicdn.com/images/159997508/large.jpg";
            // document.querySelector("#sourceImage").src = sourceImageUrl;
        
            // Perform the REST API call.
            $.ajax({
                url: uriBase + "?" + $.param(params),
        
                // Request headers.
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
                },
        
                type: "POST",
        
                // Request body.
                data: '{"url": ' + '"' + sourceImageUrl + '"}',
            })
        
            .done(function(data) {
                // Show formatted JSON on webpage. ==>成功
                console.log(data);
                vm.faceData = data;
                $("#responseTextArea").val(JSON.stringify(data, null, 2)); // 資料json化
            })
        
            .fail(function(jqXHR, textStatus, errorThrown) {
                // Display error message. ==>失敗
                var errorString = (errorThrown === "") ?
                    "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                errorString += (jqXHR.responseText === "") ?
                    "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                        jQuery.parseJSON(jqXHR.responseText).message :
                            jQuery.parseJSON(jqXHR.responseText).error.message;
                alert(errorString);
            });
        },
        dataURItoBlob(dataURI) {
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {type:mimeString});
        },
        loadcanvas() {
            var vm = this;
            var canvas = document.getElementById("loadcanvas");
            var context = canvas.getContext("2d");
            var imageObj = new Image();
            var start = null;
            var drawFace = vm.faceData.FaceLandmarks;
            var faceobj = vm.faceData.FaceRectangle;
            // var imageData = document.getElementById("blah");
            // imageObj.src = vm.facebase64
            // imageObj.onload = function() {
            //     // draw cropped image
            //     var sourceX = 0; //座標X
            //     var sourceY = 0; //座標Y
            //     var sourceWidth = canvas.width;
            //     var sourceHeight = canvas.height;
            //     var destWidth = sourceWidth;
            //     var destHeight = sourceHeight;
            //     var destX = canvas.width / 2 - destWidth / 2;
            //     var destY = canvas.height / 2 - destHeight / 2;
            //     var rectCenterPoint = {x: sourceWidth/2, y: sourceHeight/2};
            //     context.save();
            //     context.translate(rectCenterPoint.x, rectCenterPoint.y); //中心定位設定
            //     // context.rotate(10*(Math.PI/180)); //設定旋轉角度
            //     context.translate(-rectCenterPoint.x, -rectCenterPoint.y); //中心定位設定
            //     context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            var eyebrowLeft = [
                {
                    // x:drawFace.EyebrowLeftOuter.X,
                    x:drawFace.EyebrowLeftOuter.X,
                    y:drawFace.EyebrowLeftOuter.Y
                },
                {
                    x:drawFace.EyebrowLeftInner.X,
                    y:drawFace.EyebrowLeftInner.Y
                }
            ]
            vm.panPoint(eyebrowLeft);
            var eyebrowRight = [
                {
                    x:drawFace.EyebrowRightOuter.X,
                    y:drawFace.EyebrowRightOuter.Y
                },
                {
                    x:drawFace.EyebrowRightInner.X,
                    y:drawFace.EyebrowRightInner.Y
                }
            ]
            vm.panPoint(eyebrowRight);
            var EyeLeft = [
                {
                    x:drawFace.EyeLeftOuter.X,
                    y:drawFace.EyeLeftOuter.Y
                },
                {
                    x:drawFace.PupilLeft.X,
                    y:drawFace.PupilLeft.Y
                },
                {
                    x:drawFace.EyeLeftInner.X,
                    y:drawFace.EyeLeftInner.Y
                }
            ]
            vm.panPoint(EyeLeft);
            var EyeRight = [
                {
                    x:drawFace.EyeRightOuter.X,
                    y:drawFace.EyeRightOuter.Y
                },
                {
                    x:drawFace.PupilRight.X,
                    y:drawFace.PupilRight.Y
                },
                {
                    x:drawFace.EyeRightInner.X,
                    y:drawFace.EyeRightInner.Y
                }
            ]
            vm.panPoint(EyeRight);
            var Nose = [
                {
                    x:drawFace.NoseLeftAlarTop.X,
                    y:drawFace.NoseLeftAlarTop.Y
                },
                {
                    x:drawFace.NoseRightAlarTop.X,
                    y:drawFace.NoseRightAlarTop.Y
                },
                {
                    x:drawFace.NoseLeftAlarOutTip.X,
                    y:drawFace.NoseLeftAlarOutTip.Y
                },
                {
                    x:drawFace.NoseTip.X,
                    y:drawFace.NoseTip.Y
                },
                {
                    x:drawFace.NoseRightAlarOutTip.X,
                    y:drawFace.NoseRightAlarOutTip.Y
                }
            ]
            vm.panPoint(Nose);
            var Mouth = [
                {
                    x:drawFace.MouthLeft.X,
                    y:drawFace.MouthLeft.Y
                },
                {
                    x:drawFace.UpperLipTop.X,
                    y:drawFace.UpperLipTop.Y
                },
                {
                    x:drawFace.UnderLipBottom.X,
                    y:drawFace.UnderLipBottom.Y
                },
                {
                    x:drawFace.MouthRight.X,
                    y:drawFace.MouthRight.Y
                }
            ]
            vm.panPoint(Mouth);
            // var topline = [
            //     {
            //         x:drawFace.EyebrowLeftOuter.X,
            //         y:drawFace.EyebrowLeftOuter.Y
            //     },
            //     {
            //         x:drawFace.EyebrowRightOuter.X,
            //         y:drawFace.EyebrowRightOuter.Y
            //     }
            // ]
            // vm.lineAni(topline);
            // var straightline = [
            //     {
            //         x:((drawFace.EyebrowRightOuter.X-drawFace.EyebrowLeftOuter.X)/2)+drawFace.EyebrowLeftOuter.X,
            //         y:drawFace.EyebrowLeftInner.Y
            //     },
            //     {
            //         x:drawFace.UnderLipBottom.X,
            //         y:drawFace.UnderLipBottom.Y
            //     },
            // ]
            // vm.lineAni(straightline);
            // ctx.drawImage(imageData,10,10);
            // context.drawImage(imageObj,faceobj.Left,faceobj.Top,faceobj.Width+10,faceobj.Height+10,0,0,canvas.width,canvas.height);
            // };
            // cutimg //
            // vm.cutImg(can,faceRectangle.x,faceRectangle.y)
        },
        drawline() {
            var vm = this;
            var canvas = document.getElementById("loadcanvas");
            if (canvas.getContext) {
                var ctx = canvas.getContext("2d");
                ctx.strokeStyle="#ffffff";
                ctx.lineWidth=2;
                var drawFace = vm.faceData[0].faceLandmarks;
                // ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.save();
                //===左眉===//
                //===需先處理成一包obj===//
                var eyebrowLeft = [
                    {
                        x:drawFace.eyebrowLeftOuter.x,
                        y:drawFace.eyebrowLeftOuter.y
                    },
                    {
                        x:drawFace.eyebrowLeftInner.x,
                        y:drawFace.eyebrowLeftInner.y
                    }
                ]
                vm.panPoint(eyebrowLeft);
                // vm.drawRowline(drawFace.eyebrowLeftOuter.x,drawFace.eyebrowLeftOuter.y,drawFace.eyebrowLeftInner.x,drawFace.eyebrowLeftInner.y,Math.abs(drawFace.eyebrowLeftOuter.x-drawFace.eyebrowLeftInner.x));
                // ctx.moveTo(drawFace.eyebrowLeftOuter.x,drawFace.eyebrowLeftOuter.y);
                // ctx.lineTo(drawFace.eyebrowLeftInner.x,drawFace.eyebrowLeftInner.y);
                //===右眉===//
                var eyebrowRight = [
                    {
                        x:drawFace.eyebrowRightOuter.x,
                        y:drawFace.eyebrowRightOuter.y
                    },
                    {
                        x:drawFace.eyebrowRightInner.x,
                        y:drawFace.eyebrowRightInner.y
                    }
                ]
                vm.panPoint(eyebrowRight);
                // vm.drawRowline(drawFace.eyebrowRightOuter.x,drawFace.eyebrowRightOuter.y,drawFace.eyebrowRightInner.x,drawFace.eyebrowRightInner.y,Math.abs(drawFace.eyebrowRightOuter.x-drawFace.eyebrowRightInner.x));
                // ctx.moveTo(drawFace.eyebrowRightOuter.x,drawFace.eyebrowRightOuter.y);
                // ctx.lineTo(drawFace.eyebrowRightInner.x,drawFace.eyebrowRightInner.y);
                //===左眼===//
                var eyeLeft = [
                    {
                        x:drawFace.eyeLeftTop.x,
                        y:drawFace.eyeLeftTop.y
                    },
                    {
                        x:drawFace.eyeLeftOuter.x,
                        y:drawFace.eyeLeftOuter.y
                    },
                    {
                        x:drawFace.eyeLeftBottom.x,
                        y:drawFace.eyeLeftBottom.y
                    },
                    {
                        x:drawFace.eyeLeftInner.x,
                        y:drawFace.eyeLeftInner.y
                    },
                    {
                        x:drawFace.eyeLeftTop.x,
                        y:drawFace.eyeLeftTop.y
                    },
                ]
                vm.panPoint(eyeLeft);
                // vm.drawRowline(drawFace.eyeLeftTop.x,drawFace.eyeLeftTop.y,drawFace.eyeLeftOuter.x,drawFace.eyeLeftOuter.y,Math.abs(drawFace.eyeLeftTop.x-drawFace.eyeLeftOuter.x));
                // ctx.moveTo(drawFace.eyeLeftTop.x,drawFace.eyeLeftTop.y);
                // ctx.lineTo(drawFace.eyeLeftOuter.x,drawFace.eyeLeftOuter.y);
                // ctx.lineTo(drawFace.eyeLeftBottom.x,drawFace.eyeLeftBottom.y);
                // ctx.lineTo(drawFace.eyeLeftInner.x,drawFace.eyeLeftInner.y);
                // ctx.closePath();
                //===右眼===//
                var eyeRight = [
                    {
                        x:drawFace.eyeRightTop.x,
                        y:drawFace.eyeRightTop.y
                    },
                    {
                        x:drawFace.eyeRightOuter.x,
                        y:drawFace.eyeRightOuter.y
                    },
                    {
                        x:drawFace.eyeRightBottom.x,
                        y:drawFace.eyeRightBottom.y
                    },
                    {
                        x:drawFace.eyeRightInner.x,
                        y:drawFace.eyeRightInner.y
                    },
                    {
                        x:drawFace.eyeRightTop.x,
                        y:drawFace.eyeRightTop.y
                    },
                ]
                vm.panPoint(eyeRight);
                // ctx.moveTo(drawFace.eyeRightTop.x,drawFace.eyeRightTop.y);
                // ctx.lineTo(drawFace.eyeRightOuter.x,drawFace.eyeRightOuter.y);
                // ctx.lineTo(drawFace.eyeRightBottom.x,drawFace.eyeRightBottom.y);
                // ctx.lineTo(drawFace.eyeRightInner.x,drawFace.eyeRightInner.y);
                // ctx.closePath();
                //===鼻子===//
                var nose = [
                    {
                        x:drawFace.noseRootLeft.x,
                        y:drawFace.noseRootLeft.y
                    },
                    {
                        x:drawFace.noseLeftAlarTop.x,
                        y:drawFace.noseLeftAlarTop.y
                    },
                    {
                        x:drawFace.noseLeftAlarOutTip.x,
                        y:drawFace.noseLeftAlarOutTip.y
                    },
                    {
                        x:drawFace.noseTip.x,
                        y:drawFace.noseTip.y
                    },
                    {
                        x:drawFace.noseRightAlarOutTip.x,
                        y:drawFace.noseRightAlarOutTip.y
                    },
                    {
                        x:drawFace.noseRightAlarTop.x,
                        y:drawFace.noseRightAlarTop.y
                    },
                    {
                        x:drawFace.noseRootRight.x,
                        y:drawFace.noseRootRight.y
                    },
                ]
                vm.panPoint(nose);
                // ctx.moveTo(drawFace.noseRootLeft.x,drawFace.noseRootLeft.y);
                // ctx.lineTo(drawFace.noseLeftAlarTop.x,drawFace.noseLeftAlarTop.y);
                // ctx.lineTo(drawFace.noseLeftAlarOutTip.x,drawFace.noseLeftAlarOutTip.y);
                // ctx.lineTo(drawFace.noseTip.x,drawFace.noseTip.y);
                // ctx.lineTo(drawFace.noseRightAlarOutTip.x,drawFace.noseRightAlarOutTip.y);
                // ctx.lineTo(drawFace.noseRightAlarTop.x,drawFace.noseRightAlarTop.y);
                // ctx.lineTo(drawFace.noseRootRight.x,drawFace.noseRootRight.y);
                // ctx.closePath();
                //===嘴巴===//
                // var mouthup = [
                //     {
                //         x:drawFace.upperLipTop.x,
                //         y:drawFace.upperLipTop.y
                //     },
                //     {
                //         x:drawFace.noseLeftAlarTop.x,
                //         y:drawFace.noseLeftAlarTop.y
                //     },
                //     {
                //         x:drawFace.noseLeftAlarOutTip.x,
                //         y:drawFace.noseLeftAlarOutTip.y
                //     },
                //     {
                //         x:drawFace.noseTip.x,
                //         y:drawFace.noseTip.y
                //     },
                //     {
                //         x:drawFace.noseRightAlarOutTip.x,
                //         y:drawFace.noseRightAlarOutTip.y
                //     },
                //     {
                //         x:drawFace.noseRightAlarTop.x,
                //         y:drawFace.noseRightAlarTop.y
                //     },
                //     {
                //         x:drawFace.noseRootRight.x,
                //         y:drawFace.noseRootRight.y
                //     },
                // ]
                // vm.lineAni(mouthup);
                // ctx.moveTo(drawFace.upperLipTop.x,drawFace.upperLipTop.y);
                // ctx.lineTo(drawFace.mouthLeft.x,drawFace.mouthLeft.y);
                // ctx.lineTo(drawFace.underLipBottom.x,drawFace.underLipBottom.y);
                // ctx.lineTo(drawFace.mouthRight.x,drawFace.mouthRight.y);
                // ctx.closePath();
                //===結束===//
                // ctx.stroke();
                window.requestAnimationFrame(vm.drawline);
            }
        },
        drawRowline(startX,startY,endX,endY,length) {
            var vm = this;
            var iLen = 0;
            var flag = 0;
            var canvas = document.getElementById("loadcanvas");
            var ctx = canvas.getContext("2d");
            function rowLine() {
                if(iLen <= length) {
                    iLen += length/10;
                    flag += 0.1;
                    // ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.moveTo(startX,startY);
                    ctx.lineTo(startX + (endX-startX)*flag, startY + (endY-startY)*flag);
                    ctx.stroke();
                }
            }
            var int = setInterval(rowLine,100);
            setTimeout(function(){
                clearInterval(int);
            },2000)
        },

        //=====畫線動畫=====//
        lineAni(points) {
            var canvas = document.getElementById("loadcanvas");
            var ctx = canvas.getContext("2d");
            ctx.lineCap = "round";
            ctx.strokeStyle = "#ffffff";
            var t = 1;
            var vertices = [];
            points.forEach(function(obj){
                vertices.push(obj);
            })
            // vertices.push({x:0,y:0});
            // vertices.push({x:300,y:100});
            // vertices.push({x:80,y:200});
            ctx.lineWidth = 2;
            var points = calcWaypoints(vertices);
            animate(points);

            function calcWaypoints(vertices) {
                var waypoints = [];
                for (var i = 1; i < vertices.length; i++) {
                    var pt0 = vertices[i - 1];
                    var pt1 = vertices[i];
                    var dx = pt1.x - pt0.x;
                    var dy = pt1.y - pt0.y;
                    for (var j = 0; j < 100; j++) {
                        var x = pt0.x + dx * j / 100;
                        var y = pt0.y + dy * j / 100;
                        waypoints.push({
                            x: x,
                            y: y
                        });
                    }
                }
                return (waypoints);
            };
            function animate() {
                if (t < points.length - 1) {
                    requestAnimationFrame(animate);
                }
                // draw a line segment from the last waypoint
                // to the current waypoint
                ctx.beginPath();
                ctx.moveTo(points[t - 1].x, points[t - 1].y);
                ctx.lineTo(points[t].x, points[t].y);
                ctx.stroke();
                // increment "t" to get the next waypoint
                t+=2;
            };
        },
        cutImg() {
            var vm = this;
            var faceobj = vm.faceData.FaceRectangle;
            var canvas = document.getElementById("showcanvas");
            var ctx = canvas.getContext('2d');
            var imageData = document.getElementById("blah");
            // ctx.drawImage(imageData,10,10);
            ctx.drawImage(imageData,faceobj.Left,faceobj.Top,faceobj.Width+10,faceobj.Height+10,0,0,canvas.width,canvas.height);
        },
        cutImg2() {
            var vm = this;
            var faceobj = vm.faceData.FaceRectangle;
            var canvas = document.getElementById("showcanvas2");
            var ctx = canvas.getContext('2d');
            var imageData = document.getElementById("loadcanvas");
            // ctx.drawImage(imageData,10,10);
            ctx.drawImage(imageData,faceobj.Left,faceobj.Top,faceobj.Width+10,faceobj.Height+10,0,0,canvas.width,canvas.height);
        },
        //=====畫漸層=====//
        lineargrad() {
            var canvas = document.getElementById("anicanvas");
            var ctx = canvas.getContext("2d");
            // var grd = ctx.createLinearGradient(canvas.width, canvas.height, canvas.width, canvas.height);
            var animationStartTime;
            var canY = 0;
            
            start();
            function animate(timeStamp){
                if(canY <=canvas.height) {
                    // x = (timeStamp - animationStartTime) % 500;
                    canY+=10;
                    window.requestAnimationFrame(animate);
                    // var grd = ctx.createLinearGradient(canvas.width, canvas.height, canvas.width, canY);
                    var grd = ctx.createLinearGradient(canvas.width, canvas.height, canvas.width, canY);
                    // grd.addColorStop(0, 'transparent');
                    // grd.addColorStop(0.6, 'transparent');
                    grd.addColorStop(0.7, "rgba(255, 255, 255, 0.4)");
                    // grd.addColorStop(1, 'yellow');
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    // console.log(grd);
                    ctx.fillRect(0, 0, canvas.width, canY);
                    ctx.fillStyle=grd;
                } else {
                    // ctx.clearRect(0,0,canvas.width,canvas.height);
                }
            }
            function start(){
                animationStartTime = Date.now();
                window.requestAnimationFrame(animate);
            }
        },
        //=====掃描效果=====//
        scanAni(cun) {
            var vm = this;
            var imgTag = new Image();
            var canvas = document.getElementById('anicanvas');
            var ctx = canvas.getContext("2d");
            var x = 0;
            // var y = -(canvas.height*2);
            var y = -540
            var cun;
            // var xwidth = 
            imgTag.onload = animate;
            imgTag.src = "./images/scaneff.png";
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(imgTag, x, y);
                y += 5;
                if (y < 0) requestAnimationFrame(animate)
                if(cun == "2") {
                    if(y > -200) {
                        // vm.drawline();
                        $("#showcanvas2").css("opacity","1");
                    }
                }
                if(cun == "3") {
                    if(y > -100) {
                        $("#showcanvas3").css("opacity","1");
                        window.open("result.html?id="+vm.faceId+"&type=user","_self");
                    }
                }
            }
        },
        //=====標點=====//
        panPoint(points) {
            var canvas = document.getElementById("loadcanvas");
            var ctx = canvas.getContext("2d");
            points.forEach(function(obj){
                ctx.fillStyle="#FFFFFF";
                ctx.beginPath();
                ctx.arc(obj.x,obj.y,2,0,Math.PI*2,true);
                ctx.closePath();
                ctx.fill();
            })
        },
        scanstep() {
            var vm = this;
            vm.scanAni();
            setTimeout(function(){
                vm.scanAni("2");
                setTimeout(function(){
                    vm.scanAni("3");
                },3000);
            },3000);
        },
    }, 
    mounted: function() {
        var vm = this;
        $("#userpic").change(function() {
            vm.readURL(this);
        });
        vm.grecaptcha("index");
    }
})
