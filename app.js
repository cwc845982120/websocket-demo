var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var ejs = require('ejs');
var io = require('socket.io')(http);
var AES = require('./lib/encrypt/gibberish-aesObj');
var RSA = require('./lib/encrypt/jsencryptObj');
var crypto = require('crypto');

//初始化变量
var isEncrypt = false;//是否加密
var isDecrypt = false;//是否解密
var port = process.env.PORT || 3000; //默认端口号
var peopleNum = 0; //当前在线人数
var maxOnlineNum = 5;//设置最大在线人数
var RSA_privateKey = 'MIICXAIBAAKBgQC7X71YhlfLw5c+0OMsUbr8LQz2XpH8NtqCZo1lacIV7a7XtrtdWOE9L8HPim4nB8UD9gCn5raCPf4OopaPbb25UEVfOm6WC11aDwxOkNnK7pUr2qNri/qBR7CQOhQr0pjGfIqKNznoADwrS8TosE08xMgQtP8S8Cuxcll0Oe3FxQIDAQABAoGAVog+b3WLckTfwljBsSQFkJRVminOjYXfn70wq5cN1Qaxalmvacq0Koe1n900Rb4m1E91uhSoULnEbInVsmNh7Dkemmn5NhkHfncQOyZyAATbTpi4kFNlgFQPCvG+nZkWlUWDfKFCMBr+ZrfFNa/ZufaqLyThgg3G+AHvO5eauIECQQD41ZbIwaUqLVypLsvPkzTgFPCpkdQ8/DdKmNbgGVPZ+9RCZ6tiuuobc1bpi38j6kNWESuO6nv2boYfqe8kJaiRAkEAwMUQWhjNEKRl0d9RrIsG7zGfwtRyAfTNFGRqbbVbApv6mZuE2A796uMaiSIbEB8oL9V7aRlI4JeVC2e6wS3D9QJAVLM/lC52LhkqxVvsfEe7Y9s84DuHZwrjNz03RyjX5gdWhRQMvpqpPZbRKsYVDQCc0xsdHJSshYGxne2WPVOkQQJAIL8ZOQTviP00YsOZ/0KayfVXG2S1fUmVsPoh7kMZk8blekSl+4IIdmdf8Z2+lS2FySJt1Xu7GpQFeKuFWR2qJQJBALb0l/Y+s9TEKroNHBzPNnrO4OHqsnoLT1bcUB5BTrSMk7PHhcLNie7iuG00VKuEEzICRXVi2WLagl6NRTsCXN0=';//RSA私钥

//设置RSA加密算法私钥
RSA.setPrivateKey(RSA_privateKey);

//用AES密钥解密数据流
var AESDecrypt = function(obj) {
    //RSA解密AES密钥
    var AESCode = function(obj) {
        return RSA.decrypt(obj.encodeKey);
    };
    return AES.aesDecrypt(obj.creditPay,AESCode(obj));
};

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
        if(isEncrypt){
            //TODO 数据加密发送给客户端
            remoteObj = remoteObj;
        }else{
            //对数据不作处理 即不用加密
            remoteObj = remoteObj;
        }
        io.sockets.emit('loginError', remoteObj);
        peopleNum--;
        return false;
    };

    //监听消息发送
    socket.on('login', function(obj) {
        var _obj = {};
        var _remoteObj = {};
        if(isDecrypt){
            //数据解密
            _obj = AESDecrypt(obj);
        }else{
            //对数据不作处理 即不用解密
            _obj = obj;
        }
        var remoteObj = { msg: '第' + peopleNum + '个用户已加入房间,登录名：' + _obj.username };
        if(isEncrypt){
            //TODO 数据加密发送给客户端
            _remoteObj = remoteObj;
        }else{
            //对数据不作处理 即不用加密
            _remoteObj = remoteObj;
        }
        io.sockets.emit('login', _remoteObj);
    });

    //监听用户登出
    socket.on('logout', function(obj) {
        peopleNum--;
        var _obj = {};
        var _remoteObj = {};
        if(isDecrypt){
            //数据解密
            _obj = AESDecrypt(obj);
        }else{
            //对数据不作处理 即不用解密
            _obj = obj;
        }
        var remoteObj = { msg: '第' + (peopleNum + 1) + '个用户已离开房间,登录名：' + _obj.username };
        if(isEncrypt){
            //TODO 数据加密发送给客户端
            _remoteObj = remoteObj;
        }else{
            //对数据不作处理 即不用加密
            _remoteObj = remoteObj;
        }
        io.sockets.emit('logout', _remoteObj);
    });

    //监听消息发送
    socket.on('message', function(obj) {
        var _obj = {};
        var _remoteObj = {};
        if(isDecrypt){
            //数据解密
            _obj = AESDecrypt(obj);
        }else{
            //对数据不作处理 即不用解密
            _obj = obj;
        }
        var remoteObj = { username: _obj.username, content: _obj.content };
        if(isEncrypt){
            //TODO 数据加密发送给客户端
            _remoteObj = remoteObj;
        }else{
            //对数据不作处理 即不用加密
            _remoteObj = remoteObj;
        }
        io.sockets.emit('message', _remoteObj);
    });
});
