#!/usr/local/bin/node
var nativeMessage = require('./lib/nativeIO.js');
var webdriver = require('selenium-webdriver');
var moment = require('moment');
var events = require('events');
var path = require("path");

var logger = require("./lib/config.js").logger;

var input = new nativeMessage.Input();
var transform = new nativeMessage.Transform(messageHandler);
var output = new nativeMessage.Output();

//黑魔法将chromeDriver的bin path加入到环境变量中
process.env["PATH"] = "/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin";
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
event.on('playback', function(driver, sequence, tCase, callBack) {
    driver.get(tCase.url);
    var tArrays = tCase.tArray;
    var dealRes = new DealResult();
    for(var n in tArrays) {
        for (var i in tArrays[n]) {
            // 解决node异步io处理速度太快
            var tObj = tArrays[n][i];
            if (tObj.isFormEl) {
                fromElement(driver, sequence, tObj, dealRes);
                driver.sleep(1000);
            } else {
                actionElement(driver, sequence, tObj, dealRes);
                driver.sleep(1000);
            }
        }
    }

    driver.quit().then(function(){
        callBack(dealRes);
    });
});

function DealResult(){
    this.pass = true;
    this.error = [];
    this.expectResult = [];
    this.start = moment().format('YYYY-MM-DD HH:mm:ss');

    // 系统执行时的error日志
    this.sysError = function(error){
        this.error.push(error);
    };

    //pass = false时会存在error
    this.expectRes = function(pass, error){
        if(!pass){
            this.pass = false;
        }
        this.expectResult.push({"pass": pass, "error": error, "date": moment().format('YYYY-MM-DD HH:mm:ss')});
    };
}

function messageHandler(msg, push, done) {
    try{
        logger.info(msg);
        switch(msg.method){
            case "play":
                var driver = new webdriver.Builder().forBrowser("chrome").build();
                var sequence = new webdriver.ActionSequence(driver);

                event.emit('playback', driver, sequence, msg.data, function(result){
                    push(result);
                    done();
                    //先做回归结束后直接结束,防止driver无法关闭问题(后期更改)
                    process.exit();
                });
                break;
            default:
                logger.error("Undefined with method "+msg.method);
        }

    }catch (e){
        logger.error(e.stack);
    }
}

//先处理方式：默认校验验证对象是否存在
function expectPath(expect){
    var re_xPath = null;
    if(expect.xPath){
        //定位元素&文字一起确认结果
        if(expect.text){
            // //*[@class='note' and contains(text(), '5到25位，只能包含数字、字母、中文和下划线，首字母不能是数字')]
            re_xPath = expect.xPath.substring(0 , expect.xPath.length - 1) + " and contains(text(), '" + expect.text + "')]";
        }else{
            re_xPath = expect.xPath;
        }
    }else{
        if(expect.text){
            // //*[contains(text(), '密码不匹配')]
            re_xPath = "//*[contains(text(), '" + expect.text + "')]";
        }
    }
    return re_xPath;
}

/**
 * 处理结果查询
 */
var expectEl = (function expect(){
    return function(driver , expect, dealRes){
        var xPath = expectPath(JSON.parse(expect));
        logger.info(xPath);
        driver.wait(function() {
            return driver.findElement(webdriver.By.xpath(xPath)).then(function (webElement) {
                dealRes.expectRes(true);
                return true;
            }, function (err) {
                // 为查找到元素继续等待
                if (err.name && err.name === "NoSuchElementError") {
                    return false;
                }
            });
        }, 2000).catch(function(err){
            //元素查找失败(在设定时间未找到元素,将结果返回给Client端)
            dealRes.expectRes(false, err.stack);
            logger.error(err);
        });
    };
})();

/**
 * form表单元素处理
 */
var fromElement = (function sendValue(){
    return function(driver , sequence, tObj, dealRes){
        driver.wait(function() {
            return driver.findElement(webdriver.By.xpath(tObj.xPath)).then(function (webElement) {
                webElement.sendKeys(tObj.value).then(function(obj){
                    if(tObj.expect){
                        //表单元素大多是失去焦点后触发，因此增加处理方式
                        sequence.sendKeys(webdriver.Key.TAB).perform();
                        expectEl(driver, tObj.expect, dealRes);
                    }
                });
                return true;
            }, function (err) {
                // 为查找到元素继续等待
                if (err.name && err.name === "NoSuchElementError") {
                    return false;
                }
            });
        }, 1000).catch(function(err){
            //元素查找失败(在设定时间未找到元素,将结果返回给Client端)
            dealRes.sysError(err.stack);
            logger.error(err);
        });
    };
})();

/**
 * action动作元素处理
 */
var actionElement = (function actionV(){
    return function(driver , sequence, tObj, dealRes){
        driver.wait(function() {
            return driver.findElement(webdriver.By.xpath(tObj.xPath)).then(function (webElement) {
                webElement.click().then(function(obj){
                    if(tObj.expect){
                        expectEl(driver, tObj.expect, dealRes);
                    }
                });
                return true;
            }, function (err) {
                // 为查找到元素继续等待
                if (err.name && err.name === "NoSuchElementError") {
                    return false;
                }
            });
        }, 1000).catch(function(err){
            //元素查找失败(在设定时间未找到元素,将结果返回给Client端)
            dealRes.sysError(err.stack);
            logger.error(err);
        });
    };
})();
