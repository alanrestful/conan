#!/usr/local/bin/node

var nativeMessage = require('./lib/nativeIO.js');
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

var input = new nativeMessage.Input();
var transform = new nativeMessage.Transform(messageHandler);
var output = new nativeMessage.Output();

process.stdin
    .pipe(input)
    .pipe(transform)
    .pipe(output)
    .pipe(process.stdout)
;

var subscriptions = {};

var timer = setInterval(function() {
    if (subscriptions.time) {
        output.write({ time: new Date().toISOString() });
    }
}, 1000);

input.on('end', function() {
    clearInterval(timer);
});

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

function messageHandler(msg, push, done) {
    try{
        logger.info(msg);
        var driver = new webdriver.Builder().forBrowser("chrome").build();

        event.emit('playback', driver, msg, function(){
            push(msg);
            done();
        });
    }catch (e){
        logger.error(e.stack);
    }
}

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