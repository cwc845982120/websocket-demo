var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var ejs = require('ejs')
var io = require('socket.io')(http);

//初始化变量
var port = process.env.port || 3000;


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
app.get('/login',function(req,res) {
    res.render('login');
});
app.get('/index',function(req,res) {
    res.render('index');
});

//服务器监听3000端口
http.listen(port, function() {
    console.log('listening on port:' + port);
});

//监听websocket连接
io.on('connection', function(socket) {
    console.log('a user connected');
});
