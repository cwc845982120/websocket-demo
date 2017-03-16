var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var ejs = require('ejs')
var io = require('socket.io')(http);

app.set('views', __dirname + '/tpls');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//使用中间件 引用静态资源
app.use('/',express.static(path.join(__dirname, './assets')));
app.use('/',express.static(path.join(__dirname, './js')));
app.use('/',express.static(path.join(__dirname, './lib')));

//配置路由
app.get('/login_1',function(req,res) {
    res.render('login_1');
});
app.get('/index_1',function(req,res) {
    res.render('index_1');
});
app.get('/login_2',function(req,res) {
    res.render('login_2');
});
app.get('/index_2',function(req,res) {
    res.render('index_2');
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});

io.on('connection', function(socket) {
    console.log('a user connected');
});
