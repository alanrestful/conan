/**
 * Created by MichaelZhao on 9/14/16.
 */
var webdriver = require('selenium-webdriver');
var until = webdriver.until;

//new WebDriver().manage().window().maximize();
var driver = new webdriver.Builder().forBrowser("opera").build();

console.log(driver instanceof webdriver.WebDriver);

//driver.manage().window().maximize().then(function(obj){
//    console.log(obj);
//});
driver.manage().window().setPosition(0, 0);
driver.manage().window().setSize(1500, 200);
driver.manage().window().maximize();

console.log("getPosition");
driver.manage().window().getPosition().then(function(obj){
    console.log(obj);
});
console.log("getSize");

//selenium-webdriver大量使用了class Promise<T>来处理数据->获取数据方式如下cd
driver.manage().window().getSize().then(function(obj){
    console.log(obj);
});

var tCase = JSON.parse('{"domain":"http://mallt.jidd.com.cn:8888","path":"/","tArray":[{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"loginId","name":"loginBy","placeholder":"请输入用户名","tagName":"INPUT","type":"text","value":"滦县鹏大商贸有限公司","xPath":"//*[@id=\'loginId\']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"password","name":"password","placeholder":"请输入密码","tagName":"INPUT","type":"password","value":"123456","xPath":"//*[@id=\'password\']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"btn","innerText":"登录","tagName":"BUTTON","type":"submit","xPath":"//*[@class=\'user-login-form\']/button[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"配送地址","tagName":"A","xPath":"//*[@class=\'address-select\']/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"天津","tagName":"A","xPath":"//*[@class=\'address-content clearfix\']/li[2]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"天津市","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[2]/li[1]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"河东区","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[3]/li[2]/a[1]"},{"baseURI":"http://mallt.jidd.com.cn:8888/","href":"javascript:;","innerText":"大直沽街道","tagName":"A","xPath":"//*[@class=\'address-contents\']/ul[4]/li[2]/a[1]"}],"url":"http://mallt.jidd.com.cn:8888/"}');
driver.get(tCase.url);

driver.quit();