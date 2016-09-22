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

function dealEngine(driver, tCase, callBack) {
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
}

//process.stdin.setEncoding('utf8').pipe(stream).pipe(process.stdout);
process.stdin.on("data", function(data){
    try{
        var obj_data = JSON.parse(data.slice(4));
        //console.log(obj_data);
        logger.info(obj_data);
        var driver = new webdriver.Builder().forBrowser("chrome").build();

        //logger.info(typeof(data)+",result=="+(typeof(data)=="string"));
        event.emit('playback', driver, obj_data, function(){
            //try{
            //    var driver = new webdriver.Builder().forBrowser("chrome").build();
            //    dealEngine(driver, JSON.parse(data.slice(4)), function(){
            //        logger.info("end");
            //    });
            //    process.stdout.write(data);
            //}catch(e){
            //    logger.error(e);
            //}
            process.stdout.write(data);
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
            console.log(tObj);
            console.log(err);
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
            console.log(tObj);
            console.log(err);
        });
    }
})();