#!/usr/local/bin/node
var webdriver = require('selenium-webdriver');
var events = require('events');
var log4js = require("log4js");
var path = require("path");

log4js.configure({
    appenders: [
        { type: "file", filename: "/var/log/conan/conan.log", "maxLogSize": 2048000, "backups":3}
    ]
});
var logger = log4js.getLogger(path.basename(__filename));
//黑魔法将chromeDriver的bin path加入到环境变量中
process.env["PATH"] = "/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin";

logger.info("loading....");

var event = new events.EventEmitter();
// 测试回归(貌似event.on会冲突)
event.on('playback', function(driver, tCase, callBack) {
    driver.get(tCase.url);
    for(var i in tCase.tArray){
        // 解决node异步io处理速度太快
        var tObj = tCase.tArray[i];
        if(tObj.isFormEl){
            fromElement(driver , tObj);
            driver.sleep(1000);
        }else{
            actionElement(driver , tObj);
            driver.sleep(1000);
        }
    }

    callBack();
    driver.quit();
});

process.stdin.setEncoding('utf8').on("data", function(data){
    try{
        /**
         * fuck
         * Chrome浏览器扩展与客户端的本地应用之间的双向通信采用消息机制，
         * 该消息以JSON格式，UTF-8编码，带32位（操作系统本地字节序）的消息长度作为前缀(4个字节)。
         * 从本地应用发送到Chrome浏览器扩展的消息，最大尺寸是1M字节。从Chrome浏览器扩展发送到本地应用的消息，最大尺寸是4G字节。
         */
        var obj_data = JSON.parse(data.slice(4));
        logger.info(obj_data);
        var driver = new webdriver.Builder().forBrowser("chrome").build();

        event.emit('playback', driver, obj_data, function(){
            process.stdout.write({"result":"good show"});
        });
    }catch (e){
        logger.error(e.stack);
    }
});

/**
 * form表单元素处理
 */
var fromElement = (function sendValue(){
    return function(driver , tObj){
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
            logger.info(tObj);
            logger.error(err);
        });
    }
})();

/**
 * action动作元素处理
 */
var actionElement = (function actionV(){
    return function(driver , tObj){
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
            logger.info(tObj);
            logger.error(err);
        });
    }
})();