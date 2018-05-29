//mesage事件的處理
self.addEventListener('message', function(e) {
  var count = 0; //個數計數器
  //1～target之間有幾個能以num切割的數值
  for (var i = 1, len = e.data.target; i < len; i++) {
    if (i % e.data.num === 0) { count++; }
  }
  //將計數結果丟給主要執行緒
  postMessage(count);
});

