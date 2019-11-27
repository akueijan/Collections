var index_view = new Vue({
    el: "#app",
    data: {
        
    },
    methods: {
        canvasLoad() {
            var vm = this;
            var cans = document.getElementById('loadcan');
            var ctx = cans.getContext('2d');
            ctx.font = "30px Arial";
            // ctx.fillStyle = color;
            // ctx.fillRect(0,0,cans.width,cans.height);
            // ctx.fillText(text,50,50)
            ctx.globalCompositeOperation='source-over';
        },
        canvasBg() {
            var vm = this;
            var cans = document.getElementById('loadcan');
            var ctx = cans.getContext('2d');
            var selColor = document.getElementById('canvasbg');
            ctx.globalCompositeOperation='source-over';
            selColor.addEventListener("change", setColor, false);
            function setColor() {
                ctx.fillStyle = selColor.value;
                ctx.fillRect(0,0,cans.width,cans.height);
            }
        },
        canvasText() {
            var vm = this;
            var cans = document.getElementById('loadcan');
            var ctx = cans.getContext('2d');
            var selText = document.getElementById('cantext');
            var img = new Image();
            ctx.font = "30px Arial";
            ctx.globalCompositeOperation='source-over';
            selText.addEventListener("change", setText, false);
            function setText() {
                ctx.save();
                ctx.fillText(selText.value,50,50)
            }
            cans.onmousedown = function(ev){
                var e = ev||event;
                var x = e.clientX;
                var y = e.clientY;
                drag(x,y);
            };
            function drag(x,y){
                // 按下鼠标判断鼠标位置是否在圆上，当画布上有多个路径时，isPointInPath只能判断最后那一个绘制的路径
                if(ctx.isPointInPath(x,y)){
                    //路径正确，鼠标移动事件
                    cans.onmousemove = function(ev){
                        var e = ev||event;
                        var ax = e.clientX;
                        var ay = e.clientY;
                        //鼠标移动每一帧都清楚画布内容，然后重新画圆
                        ctx.clearRect(0,0,can.width,can.height);
                        ctx.fillText(selText.value,ax,ay);
                    };
                    //鼠标移开事件
                    can.onmouseup = function(){
                        can.onmousemove = null;
                        can.onmouseup = null;
                    };
                };
            }
        },
        canvasImg() {
            var vm = this;
            var cans = document.getElementById('loadcan');
            var ctx = cans.getContext('2d');
            var selImg = document.getElementById('canImg');
            var img = new Image();
            var ax,ay,x,y;
            selImg.addEventListener('change', function(event){
                const files = this.files  // 取得所有 file
                const container = this.parentNode // 設定一個preview容器
                
                // 處理每一個檔案
                Array.prototype.forEach.call(files, file => {
                  filePreview(file, container)
                })
            })
            function filePreview(file, container) {
                var url = URL.createObjectURL(file)
                img.addEventListener('load', function(event) {
                    // container.appendChild(this);
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    ctx.beginPath();
                    ctx.stroke();
                    // this.draggable = true;
                })
                img.src = url
            }
            cans.onmousedown=function (e) {

                cans.onmousemove = function(e){
                     x= e.clientX;y=e.clientY;
        
                    //限制移动不能超出画布
                    (x<cans.width)? ax=0 : ax=cans.width;
                    (y<cans.height)? ay=0 : ay=cans.height;
        
                    (x < cans.width && x > 0)? x =e.clientX : x =ax;
        
                    (y > 0 && y < cans.height)? y=e.clientY : y=ay;
        
                    //先清除之前的然后重新绘制
                    ctx.clearRect(0,0,cans.width,cans.height);
        
                    ctx.drawImage(img,(x-img.width)/2,(y-img.height)/2,img.width, img.height);
                };
        
                cans.onmouseup = function(){
                    cans.onmousemove = null;
                    cans.onmouseup = null;
                };
            }
        }
    },
    mounted: function() {
        var vm = this;
        // vm.canvasLoad();
        vm.canvasBg();
        vm.canvasText();
        vm.canvasImg();
    }
})
