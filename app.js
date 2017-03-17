var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var ejs = require('ejs')
var io = require('socket.io')(http);
var crypto = require('crypto');

//初始化变量
var port = process.env.port || 3000; //默认端口号
var peopleNum = 0; //当前在线人数
var maxOnlineNum = 5;//设置最大在线人数

//定义模板引擎为html 默认视图展示目录为tpls文件下
app.set('views', __dirname + '/tpls');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//使用中间件 引用静态资源
app.use(express.static(path.join(__dirname, './assets')));
app.use(express.static(path.join(__dirname, './js')));
app.use(express.static(path.join(__dirname, './lib')));

//配置路由 默认路由login
app.get('/', function(req, res) {
    res.redirect('login');
});
app.get('/login', function(req, res) {
    res.render('login');
});

//服务器监听3000端口
http.listen(port, function() {
    console.log('listening on port:' + port);
});

//监听websocket连接
io.on('connection', function(socket) {
    peopleNum++;

    //判断是否人数溢出
    if(peopleNum >= maxOnlineNum){
        var remoteObj = { errorMsg: '当前在线人数已满，请稍后重试!' };
        io.sockets.emit('loginError', remoteObj);
        peopleNum--;
        return false;
    };

    //监听消息发送
    socket.on('login', function(obj) {
        var remoteObj = { msg: '第' + peopleNum + '个用户已加入房间,登录名：' + obj.username };
        io.sockets.emit('login', remoteObj);
    });

    //监听用户登出
    socket.on('logout', function(obj) {
        peopleNum--;
        var remoteObj = { msg: '第' + (peopleNum + 1) + '个用户已离开房间,登录名：' + obj.username };
        io.sockets.emit('logout', remoteObj);
    });

    //监听消息发送
    socket.on('message', function(obj) {
        var remoteObj = { username: obj.username, content: obj.content };
        io.sockets.emit('message', remoteObj);
    });
});

//监听断开连接
io.on('disconnect', function(socket) {
    //TODO
});

//监听连接失败
io.on('connect_failed', function(socket) {
    //TODO
});

//监听连接错误
io.on('error', function(socket) {
    //TODO
});

//监听重新连接
io.on('reconnect', function(socket) {
    //TODO
});

//监听重新连接失败
io.on('reconnect_failed', function(socket) {
    //TODO
});
