var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var onlineCount = 0;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

//連線發生時
io.on('connection', function(socket){
    console.log('Hello!');
    onlineCount++;
    io.emit('online', onlineCount);
    // 接收來自前端的 greet 事件
    // 然後回送 greet 事件，並附帶內容
    socket.on('greet', function() {
        socket.emit('greet', onlineCount);
    });

    socket.on('send', function(msg){
        io.emit('msg', msg);
    });
    
    //離線發生時
    socket.on('disconnect', function(){
        onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1;
        io.emit('online', onlineCount);
    });
});

server.listen(3000, function(){
    console.log("Server Started. http://localhost:3000");
});