#!/usr/local/bin/node
var webdriver = require('selenium-webdriver');
var moment = require('moment');
var events = require('events');
var path = require("path");

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var logger = require("../lib/config.js").logger;


//黑魔法将chromeDriver的bin path加入到环境变量中
process.env["PATH"] = "/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin";

if (cluster.isMaster) {
    logger.info("master start...");

    // Fork workers.
    // 默认单线程跑
    // for (var i = 0; i < 5; i++) {
    //     var wk = cluster.fork();
    //     wk.send([i%2*640 , Math.floor(i/2)*386]);
    // }
    process.stdin.on('data', function (chunk) {  
         var wk = cluster.fork();
         var size = chunk.toString().split(",");
         wk.send(size);
         // console.log(chunk.toString());
    }); 

    cluster.on('listening',function(worker, address){
        logger.info('listening: worker ' + worker.process.pid +', Address: '+address.address+":"+address.port);
    });

    cluster.on('exit', function(worker, code, signal) {
        logger.info('worker ' + worker.process.pid + ' died');
    });
} else {
    logger.info("fork 进程跑程序");
    
    process.on('message', function(msg) {
        logger.info('msg[0] '+msg[0]+"msg[1]"+msg[1]);
        // process.send('[worker] worker'+cluster.worker.id+' received!');
        var driver = new webdriver.Builder().forBrowser("chrome").build();

        driver.manage().window().setPosition(parseInt(msg[0]), parseInt(msg[1]));
        driver.manage().window().setSize(640, 386);

        var tCase = JSON.parse('{"domain":"http://mallt.jidd.com.cn:8888","path":"/","tArray":[{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"loginId","name":"loginBy","placeholder":"请输入用户名","tagName":"INPUT","type":"text","value":"滦县鹏大商贸有限公司","xPath":"//*[@id=\'loginId\']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"password","name":"password","placeholder":"请输入密码","tagName":"INPUT","type":"password","value":"123456","xPath":"//*[@id=\'password\']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"btn","innerText":"登录","tagName":"BUTTON","type":"submit","xPath":"//*[@class=\'user-login-form\']/button[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"配送地址","tagName":"A","xPath":"//*[@class=\'address-select\']/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"天津","tagName":"A","xPath":"//*[@class=\'address-content clearfix\']/li[2]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"天津市","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[2]/li[1]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"河东区","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[3]/li[2]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"大直沽街道","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[4]/li[2]/a[1]"}],"url":"http://mallt.jidd.com.cn:8888/"}');
        driver.get(tCase.url);
        driver.quit().then(function(){
            process.exit();
        });
    });
}