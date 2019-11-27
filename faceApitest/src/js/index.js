var index_view = new Vue({
    el: "#app",
    data: {
        faceData: {},
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
            if (input.files && input.files[0]) {
              var reader = new FileReader();
              reader.onload = function(e) {
                $('#blah').attr('src', e.target.result);
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
            imageObj.src = "http://data.whicdn.com/images/159997508/large.jpg";
            imageObj.onload = function() {
            // draw cropped image
            var sourceX = 0; //座標X
            var sourceY = 0; //座標Y
            var sourceWidth = canvas.width;
            var sourceHeight = canvas.height;
            var destWidth = sourceWidth;
            var destHeight = sourceHeight;
            var destX = canvas.width / 2 - destWidth / 2;
            var destY = canvas.height / 2 - destHeight / 2;
            var rectCenterPoint = {x: sourceWidth/2, y: sourceHeight/2};
            context.save();
            context.translate(rectCenterPoint.x, rectCenterPoint.y); //中心定位設定
            // context.rotate(10*(Math.PI/180)); //設定旋轉角度
            context.translate(-rectCenterPoint.x, -rectCenterPoint.y); //中心定位設定
            context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            };
            // cutimg //
            vm.cutImg(can,faceRectangle.x,faceRectangle.y)
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
                vm.lineAni(eyebrowLeft);
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
                vm.lineAni(eyebrowRight);
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
                vm.lineAni(eyeLeft);
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
                vm.lineAni(eyeRight);
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
                vm.lineAni(nose);
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
            var t = 1;
            var vertices = [];
            points.forEach(function(obj){
                vertices.push(obj);
            })
            // vertices.push({x:0,y:0});
            // vertices.push({x:300,y:100});
            // vertices.push({x:80,y:200});
            ctx.lineWidth = 1;
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
                t+=5;
            };
        },
        cutImg(can, a, b) {
            // var canvas = document.getElementById("showcanvas");
            var ctx = canvas.getContext('2d');
            var imageData = ctx.getImageData(a.x, a.y, b.x, b.y);
            var newCan = document.createElement('canvas');
            newCan.width = b.x - a.x;
            newCan.height = b.y - a.y;
            var newCtx = newCan.getContext('2d');
        
            // put the clipped image on the new canvas.
            newCtx.putImageData(imageData, 0, 0);
            return newCan;
        }
    }, 
    mounted: function() {
        var vm = this;
        vm.checkUpimg();
        // vm.loadcanvas();
        // EXIF.getData(document.getElementsByTagName('img'), function(){ 
        //     EXIF.getAllTags(this); 
        //     EXIF.getTag(this, 'Orientation'); 
        // });
        // $("#userpic").change(function() {
        //     vm.readURL(this);
        // });
    }
})
