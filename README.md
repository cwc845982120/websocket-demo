# websocket-demo
Learning for websocket!<br/>
##首先安装bower依赖和node依赖<br/>
1.node依赖：npm install(速度更快的淘宝镜像:cnpm install)；<br/>
2.bower依赖：bower install(其实也就是安装一个jquery 嘿嘿o_o...)；<br/>

##启动服务<br/>
起服务可以使用(直接在命令行输入以下代码即可)：<br/>
1.node app.js（利用nodejs起一个小型服务器 供socket连接);<br/>
2.现在利用socket协议即可实现两个页面之间之间的即时聊天通讯。<br/>

#开发日志<br/>
##2017.3.16<br/>
逻辑整理及项目目录结构完善。<br/>
##2017.3.17<br/>
大部分逻辑已完成 小型demo已可运行。<br/>
加上加密传输 保障信息安全。<br/>
##2017.3.18<br/>
添加 加解密总开关，方便对加解密统一控制，减轻产品迭代 代码维护成本。<br/>
##2017.3.2<br/>
根据不同用户展示不同信息。<br/>