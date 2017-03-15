var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var cwc = express.Router();

cwc.get('/hello', function(req, res){
    res.send('<h1>Welcome Realtime Server</h1>');
});

app.use('/cwc',cwc);

http.listen(3000, function(){
    console.log('listening on *:3000');
});