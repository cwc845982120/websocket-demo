$(function() {

    //初始化数据
    var ws = ""; //预先定义socket连接
    var current_userName = ""; //当前用户名
    var outTimes = 60; //超时时间 默认60s
    var i = 0; //时间从0秒开始
    var history = ""; //历史记录

    //加密函数，依赖GibberishAES、JSEncrypt
    var RSA = function() {
        // 获取公钥KEY(获取后端KEY)
        var publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7X71YhlfLw5c+0OMsUbr8LQz2XpH8NtqCZo1lacIV7a7XtrtdWOE9L8HPim4nB8UD9gCn5raCPf4OopaPbb25UEVfOm6WC11aDwxOkNnK7pUr2qNri/qBR7CQOhQr0pjGfIqKNznoADwrS8TosE08xMgQtP8S8Cuxcll0Oe3FxQIDAQAB';
        // REA加密组件JS方法
        var RSAUtils = new JSEncryptObj();
        var RSAUtils = new RSAUtils();
        // 设置公钥
        RSAUtils.setPublicKey(publicKey);
        var GibberishAES = GibberishAESObj();
        return {
            generateMixed: function() {
                var jschars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                var key = "";
                for (var i = 0; i < 16; i++) {
                    var id = Math.ceil(Math.random() * 35);
                    key += jschars[id];
                }
                return key;
            },
            AES_Encode: function(plain_text, key) {
                GibberishAES.size(128);
                return GibberishAES.aesEncrypt(plain_text, key);
            },
            RSA_Encode: function(key) {
                return RSAUtils.encrypt(key);
            }
        };
    };

    //加密函数
    var encrypt = function (params) {
        params = _.extend({}, params);
        var rsa = new RSA();
        var _key = rsa.generateMixed();
        _params = {
            "creditPay": rsa.AES_Encode(JSON.stringify(params), _key),
            "encodeKey": rsa.RSA_Encode(_key)
        };
        return _params;
    };

    $('.submit_talk').click(function() {
        i = 0;
        var content = $('textarea').val();
        if (content != '') {
            var params = {
                //userid: this.userid,
                username: current_userName,
                content: content
            };
            params = encrypt(params);
            ws.emit('message', params);
            $('textarea').val('');
        } else {
            return false;
        }
    });


    //点击登陆确认按钮
    $('.submit').click(function() {

        //连接本地socket服务器
        ws = io.connect('ws://localhost:3000');

        //监听断开连接
        ws.on('disconnect', function(socket) {
            var reconnect = setInterval(function() {
                socket.reconnect();
                //监听重新连接
                ws.on('reconnect', function(socket) {
                    alert("重连成功！");
                    clearInterval(reconnect);
                });
            }, 60000);
        });

        //监听连接失败
        ws.on('connect_failed', function(socket) {
            var reconnect = setInterval(function() {
                socket.reconnect();
                //监听重新连接
                ws.on('reconnect', function(socket) {
                    alert("重连成功！");
                    clearInterval(reconnect);
                });
            }, 60000);
        });

        //监听重新连接失败
        ws.on('reconnect_failed', function(socket) {
            var reconnect = setInterval(function() {
                socket.reconnect();
                //监听重新连接
                ws.on('reconnect', function(socket) {
                    alert("重连成功！");
                    clearInterval(reconnect);
                });
            }, 60000);
        });

        current_userName = $('.nameVal').val();

        //设置定时器 超时自动登出
        var timer = setInterval(function() {
            i++;
            if (i === outTimes) {
                var params = { username: current_userName };
                params = encrypt(params);
                ws.emit('logout', params);
                window.location.reload();
            }
        }, 1000);

        //监听服务器端登陆
        ws.on('loginErroe', function(data) {
            alert(data.errorMsg);
            return false;
        });

        //监听服务器端登陆
        ws.on('login', function(data) {
            history = history + "<div class = 'robotMsg'>" + data.msg + "</div>";
            $('.dialog').html(history);
            $('.dialog')[0].scrollTop = $('.dialog')[0].scrollHeight;
            var sonHeight = $('.self').height() + 10;
            $('.msgBox').css('height', sonHeight);
            $('.dialog')[0].scrollTop = $('.dialog')[0].scrollHeight;
        });

        //监听服务器端登出
        ws.on('logout', function(data) {
            history = history + "<div class = 'robotMsg'>" + data.msg + "</div>";
            $('.dialog').html(history);
            $('.dialog')[0].scrollTop = $('.dialog')[0].scrollHeight;
            var sonHeight = $('.self').height() + 10;
            $('.msgBox').css('height', sonHeight);
            $('.dialog')[0].scrollTop = $('.dialog')[0].scrollHeight;
        });


        //监听服务器端登出
        ws.on('message', function(data) {
            if (data.username === current_userName) {
                history = history + "<div class = 'msgBox'>" + "<div class = 'self'>" + data.content + "</div>" + "</div>";
            } else {
                history = history + "<div class = 'msgBox'>" + "<div class = 'other'>" + data.username + "说：" + "<span>" + data.content + "</span>" + "</div>" + "</div>";
            }
            $('.dialog').html(history);
            var sonHeight = $('.self').height() + 10;
            $('.msgBox').css('height', sonHeight);
            $('.dialog')[0].scrollTop = $('.dialog')[0].scrollHeight;
        });

        //告诉服务器端有用户登录
        var params = { username: current_userName };
        params = encrypt(params);
        ws.emit('login', params);
        if ($('.nameVal').val()) {
            $('.login').css('display', 'none');
            $('.talkTime').css('display', 'block');
            $('#title').html('会话页');
        } else {
            alert('请输入用户名！');
        }
    });

    //点击登出按钮
    $('.logout').click(function() {
        i = 0;
        var params = { username: current_userName };
        params = encrypt(params);
        ws.emit('logout', params);
        //简单的刷新页面
        window.location.reload();
    });
});
