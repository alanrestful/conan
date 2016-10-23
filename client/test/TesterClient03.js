/**
 * Created by MichaelZhao on 9/14/16.
 */
var webdriver = require('selenium-webdriver');
var until = webdriver.until;

var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
console.log(numCPUs);

//new WebDriver().manage().window().maximize();
// var driver = new webdriver.Builder().forBrowser("chrome").build();

// driver.manage().window().setPosition(0, 0);
// driver.manage().window().setSize(640, 773);

// var tCase = JSON.parse('{"domain":"http://mallt.jidd.com.cn:8888","path":"/","tArray":[{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"loginId","name":"loginBy","placeholder":"请输入用户名","tagName":"INPUT","type":"text","value":"滦县鹏大商贸有限公司","xPath":"//*[@id=\'loginId\']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"password","name":"password","placeholder":"请输入密码","tagName":"INPUT","type":"password","value":"123456","xPath":"//*[@id=\'password\']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"btn","innerText":"登录","tagName":"BUTTON","type":"submit","xPath":"//*[@class=\'user-login-form\']/button[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"配送地址","tagName":"A","xPath":"//*[@class=\'address-select\']/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"天津","tagName":"A","xPath":"//*[@class=\'address-content clearfix\']/li[2]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"天津市","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[2]/li[1]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"河东区","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[3]/li[2]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"大直沽街道","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[4]/li[2]/a[1]"}],"url":"http://mallt.jidd.com.cn:8888/"}');
// driver.get(tCase.url);


// var driver2 = new webdriver.Builder().forBrowser("chrome").build();

// driver2.manage().window().setPosition(640, 0);
// driver2.manage().window().setSize(640, 773);

// var tCase = JSON.parse('{"domain":"http://mallt.jidd.com.cn:8888","path":"/","tArray":[{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"loginId","name":"loginBy","placeholder":"请输入用户名","tagName":"INPUT","type":"text","value":"滦县鹏大商贸有限公司","xPath":"//*[@id=\'loginId\']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"password","name":"password","placeholder":"请输入密码","tagName":"INPUT","type":"password","value":"123456","xPath":"//*[@id=\'password\']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"btn","innerText":"登录","tagName":"BUTTON","type":"submit","xPath":"//*[@class=\'user-login-form\']/button[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"配送地址","tagName":"A","xPath":"//*[@class=\'address-select\']/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"天津","tagName":"A","xPath":"//*[@class=\'address-content clearfix\']/li[2]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"天津市","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[2]/li[1]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"河东区","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[3]/li[2]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"大直沽街道","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[4]/li[2]/a[1]"}],"url":"http://mallt.jidd.com.cn:8888/"}');
// driver2.get(tCase.url);

// driver.quit();
// driver2.quit();

if (cluster.isMaster) {
    console.log("master start...");

    // Fork workers.
    // 默认单线程跑
    for (var i = 0; i < 5; i++) {
        var wk = cluster.fork();
        wk.send([i%2*640 , Math.floor(i/2)*386]);
    }

    cluster.on('listening',function(worker, address){
        console.log('listening: worker ' + worker.process.pid +', Address: '+address.address+":"+address.port);
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    console.log("fork 进程跑程序");
    
    process.on('message', function(msg) {
        console.log('[worker] '+msg);
        // process.send('[worker] worker'+cluster.worker.id+' received!');
        var driver = new webdriver.Builder().forBrowser("chrome").build();

		driver.manage().window().setPosition(msg[0], msg[1]);
		driver.manage().window().setSize(640, 386);

		var tCase = JSON.parse('{"domain":"http://mallt.jidd.com.cn:8888","path":"/","tArray":[{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"loginId","name":"loginBy","placeholder":"请输入用户名","tagName":"INPUT","type":"text","value":"滦县鹏大商贸有限公司","xPath":"//*[@id=\'loginId\']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"password","name":"password","placeholder":"请输入密码","tagName":"INPUT","type":"password","value":"123456","xPath":"//*[@id=\'password\']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"btn","innerText":"登录","tagName":"BUTTON","type":"submit","xPath":"//*[@class=\'user-login-form\']/button[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"配送地址","tagName":"A","xPath":"//*[@class=\'address-select\']/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"天津","tagName":"A","xPath":"//*[@class=\'address-content clearfix\']/li[2]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"天津市","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[2]/li[1]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"河东区","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[3]/li[2]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"大直沽街道","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[4]/li[2]/a[1]"}],"url":"http://mallt.jidd.com.cn:8888/"}');
		driver.get(tCase.url);
		driver.quit().then(function(){
	        process.exit();
	    });
    });
}