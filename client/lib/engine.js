/**
 * Created by MichaelZhao on 9/20/16.
 * 回归测试Engine(支持多个用例一起测试)
 */
var webdriver = require('selenium-webdriver');
var until = webdriver.until;

var driver = new webdriver.Builder().forBrowser("chrome").build();

//窗口最大化driver.manage().window().maximize()函数不好用该用设置
driver.manage().window().setPosition(0, 0);
driver.manage().window().setSize(1300, 1000);

driver.manage().window().getPosition().then(function(obj){
    console.log(obj);
});

//selenium-webdriver大量使用了class Promise<T>来处理数据->获取数据方式如下
driver.manage().window().getSize().then(function(obj){
    console.log(obj);
});

var tCase = JSON.parse('{"domain":"http://mallt.jidd.com.cn:8888","path":"/","tArray":[{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"loginId","isFormEl":true,"name":"loginBy","placeholder":"请输入用户名","tagName":"INPUT","type":"text","value":"滦县鹏大商贸有限公司","xPath":"//*[@id=\'loginId\']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"password","isFormEl":true,"name":"password","placeholder":"请输入密码","tagName":"INPUT","type":"password","value":"123456","xPath":"//*[@id=\'password\']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"btn","innerText":"登录","isFormEl":false,"tagName":"BUTTON","type":"submit","xPath":"//*[@class=\'user-login-form\']/button[1]"}],"url":"http://mallt.jidd.com.cn:8888/"}');
driver.get(tCase.url);

/**
 * form表单元素处理
 */
var fromElement = (function sendValue(){
    return function(tObj){
        driver.wait(function() {
            return driver.findElement(webdriver.By.xpath(tObj.xPath)).then(function (webElement) {
                webElement.sendKeys(tObj.value);
                return true;
            }, function (err) {
                // 为查找到元素继续等待
                if (err.name && err.name === "NoSuchElementError") {
                    return false;
                }
            });
        }, 1000).catch(function(err){
            //元素查找失败(在设定时间未找到元素,将结果返回给Client端)
            console.log(tObj);
            console.log(err);
        });
    }
})();

/**
 * action动作元素处理
 */
var actionElement = (function actionV(){
    return function(tObj){
        driver.wait(function() {
            return driver.findElement(webdriver.By.xpath(tObj.xPath)).then(function (webElement) {
                webElement.click();
                return true;
            }, function (err) {
                // 为查找到元素继续等待
                if (err.name && err.name === "NoSuchElementError") {
                    return false;
                }
            });
        }, 1000).catch(function(err){
            //元素查找失败(在设定时间未找到元素,将结果返回给Client端)
            console.log(tObj);
            console.log(err);
        });
    }
})();

/**
 * 解决Node的异步io问题,需要将设置element的等待时间和每次执行处理时的driver的sleep时间相同
 */
for(var i in tCase.tArray){
    // 解决node异步io处理速度太快
    var tObj = tCase.tArray[i];
    if(tObj.isFormEl){
        fromElement(tObj);
        driver.sleep(1000);
    }else{
        actionElement(tObj);
        driver.sleep(1000);
    }
}

// wait函数每隔1000ms执行一次(10000=执行10次)
driver.wait(function() {
    return driver.getTitle().then(function(title) {
        return true;
    });
}, 1000);

driver.quit();