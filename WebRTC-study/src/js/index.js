var index_view = new Vue({
    el: "#app",
    data: {
        ie11: false,
        deScore: 0,
        sec: 0
    },
    methods: {
        handleSuccess(stream) {
            var vm = this;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            // var player = document.getElementById('player');
            var s = document.getElementById('s');
            var p = document.getElementById('p');
            var d = document.getElementById('d');
            for(var i=0; i<16; i++){
                d.innerHTML += '<div></div>';
            }
            var dd = document.querySelectorAll('#d div');

            var context = new AudioContext();
            var microphone = context.createMediaStreamSource(stream);

            var recorder = new Recorder(microphone);
            recorder.record();

            var analyser = context.createAnalyser();
            microphone.connect(analyser);
            analyser.connect(context.destination);
            analyser.fftSize = 32;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Uint8Array(analyser.fftSize);


            update();
            var timer;
            var total = 0;
            var cun = 0;
            function update(){
                console.log(dataArray);
                analyser.getByteFrequencyData(dataArray);
                timer = setTimeout(update, 200);
                var sum = 0;
                for(var j=0; j<16; j++){
                    dd[j].style.width = dataArray[j]+'px';
                    dd[j].style.background = 'rgba('+(255-j)+','+j*2+',0,1)';
                    sum += dataArray[j];
                }
                console.log("sum", sum);
                total += sum;
                console.log("total",total);
                if(sum < vm.deScore) {
                    // cun += 1;
                    vm.sec += 1;
                } else {
                    // cun = 0;
                    vm.sec = 0;
                }
                if(vm.sec >= 25) {
                    alert("失敗");
                    stream.getTracks().forEach(function(track){
                        track.stop();
                    });
                    clearTimeout(timer);
                    for(var j=0; j<16; j++){
                        dd[j].style.width = 0 +'px';
                        dd[j].style.transition = "0.6s";
                        d.innerHTML = "";
                    }
                    dd = [];
                    recorder.stop();
                    recorder.clear();
                }
            };

            function stopGame() {
                stream.getTracks().forEach(function(track){
                    track.stop();
                });
                clearTimeout(timer);
                for(var j=0; j<16; j++){
                    dd[j].style.width = 0 +'px';
                    dd[j].style.transition = "0.6s";
                    d.innerHTML = "";
                }
                dd = [];
                recorder.stop();
                createDownloadLink();
                recorder.clear();
            };

            s.onclick = function(){
                stopGame();
                // shouldStop = true;
            };

            function createDownloadLink(){
                recorder.exportWAV(function(blob) {
                    var url = URL.createObjectURL(blob);
                    var li = document.createElement('li');
                    var au = document.createElement('audio');
                    var hf = document.createElement('a');
                    
                    au.controls = true;
                    au.src = url;
                    hf.href = url;
                    hf.download = new Date().toISOString() + '.wav';
                    hf.innerHTML = hf.download;
                    li.appendChild(au);
                    li.appendChild(hf);
                    recordingslist.appendChild(li);
                });
            }
        },

        mediaTest(stream) {
            var vm = this;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            // var player = document.getElementById('player');
            var d = document.getElementById('d');
            for(var i=0; i<16; i++){
                d.innerHTML += '<div></div>';
            }
            var dd = document.querySelectorAll('#d div');

            var context = new AudioContext();
            var microphone = context.createMediaStreamSource(stream);

            var analyser = context.createAnalyser();
            microphone.connect(analyser);
            analyser.connect(context.destination);
            analyser.fftSize = 32;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Uint8Array(analyser.fftSize);


            update();
            var timer;
            var total = 0;
            var cun = 0;
            function update(){
                console.log(dataArray);
                analyser.getByteFrequencyData(dataArray);
                timer = setTimeout(update, 200);
                
                var sum = 0;
                for(var j=0; j<16; j++){
                    dd[j].style.width = dataArray[j]+'px';
                    dd[j].style.background = 'rgba('+(255-j)+','+j*2+',0,1)';
                    sum += dataArray[j];
                }
                cun++;
                console.log("sum", sum);
                total += sum;
                console.log("total",total);
                vm.deScore = Math.round(total/cun);
            };

            setTimeout(function(){
                stream.getTracks().forEach(function(track){
                    track.stop();
                });
                clearTimeout(timer);
                for(var j=0; j<16; j++){
                    dd[j].style.width = 0 +'px';
                    dd[j].style.transition = "0.6s";
                    d.innerHTML = "";
                }
                dd = [];
            },3000)
        },

        startGame() {
            var vm = this;
            navigator.mediaDevices.getUserMedia({ audio: true, video: false, muted: true })
            .then(vm.handleSuccess)
            .catch(function(err){
                console.log(err.name + ": " + err.message);
            })
        },

        testStart() {
            var vm = this;
            navigator.mediaDevices.getUserMedia({ audio: true, video: false, muted: true })
            .then(vm.mediaTest)
            .catch(function(err){
                console.log(err.name + ": " + err.message);
            })
        }
    },
    mounted: function() {
        var vm = this;
        // vm.getIe();
    }
})
