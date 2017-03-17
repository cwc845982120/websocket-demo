$(function() {

    //初始化数据
    var ws = ""; //预先定义socket连接
    var current_userName = ""; //当前用户名
    var outTimes = 60; //超时时间 默认60s
    var i = 0; //时间从0秒开始
    var history = ""; //历史记录

    $('.submit_talk').click(function() {
        i = 0;
        var content = $('textarea').val();
        if (content != '') {
            var obj = {
                //userid: this.userid,
                username: current_userName,
                content: content
            };
            ws.emit('message', obj);
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
                ws.emit('logout', { username: current_userName });
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
        ws.emit('login', { username: current_userName });
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
        //TODO 监听用户退出
        ws.emit('logout', { username: current_userName });
        //简单的刷新页面
        window.location.reload();
    });
});
