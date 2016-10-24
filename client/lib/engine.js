var webdriver = require('selenium-webdriver');
var logger = require("./config.js").logger;
var moment = require('moment');
/**
 * 初始化DriverEngine
 * @param browser   浏览器名称
 * @param position  浏览器位置
 * @param size      浏览器尺寸
 */
function DriverEngine(browser, position, size){
    this.driver = new webdriver.Builder().forBrowser(browser).build();
    this.sequence = new webdriver.ActionSequence(this.driver);

    this.driver.manage().window().setPosition(position[0], position[1]);
    this.driver.manage().window().setSize(size[0], size[1]);

    this.play = function(tCase, callback){
        /**
         * 解决Node的异步io问题,需要将设置element的等待时间和每次执行处理时的driver的sleep时间相同
         */
        var dealRes = new DealResult();
        this.driver.get(tCase.url).then(function(value){
            logger.info(value);
        }, function (err) {
            dealRes.sysError(err.stack);
            logger.error(err);
        });
        var tArrays = tCase.tArray;
        for(var n in tArrays) {
            for (var i in tArrays[n]) {
                // 解决node异步io处理速度太快
                var tObj = tArrays[n][i];
                if (tObj.isFormEl) {
                    __formElement()(this.driver, this.sequence, tObj, dealRes);
                    this.driver.sleep(1000);
                } else {
                    __actionElement()(this.driver, this.sequence, tObj, dealRes);
                    this.driver.sleep(1000);
                }
            }

            // action处理后跳转到一个新页面
            this.driver.sleep(1000);
            __currentWin()(this.driver);
        }

        // 处理结束后返回结果数据信息
        this.driver.quit().then(function(){
            dealRes["browser"] = browser;
            callback(dealRes);
        });
    };

    /**
     * 输入元素操作
     * @returns {Function}
     */
    function __formElement(){
        return function(driver , sequence, tObj, dealRes){
            driver.wait(function() {
                return driver.findElement(webdriver.By.xpath(tObj.xPath)).then(function (webElement) {
                    webElement.sendKeys(tObj.value).then(function(obj){
                        if(tObj.expect){
                            //表单元素大多是失去焦点后触发，因此增加处理方式
                            sequence.sendKeys(webdriver.Key.TAB).perform();
                            __expectEl()(driver, tObj.expect, dealRes);
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
    }

    /**
     * 动作元素操作
     * @returns {Function}
     */
    function __actionElement(){
        return function(driver , sequence, tObj, dealRes){
            driver.wait(function() {
                return driver.findElement(webdriver.By.xpath(tObj.xPath)).then(function (webElement) {
                    webElement.click().then(function(obj){
                        if(tObj.expect){
                            __expectEl()(driver, tObj.expect, dealRes);
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
    }

    /**
     * 处理结果查询
     */
    function __expectEl(){
        return function(driver , expect, dealRes){
            var xPath = __expectPath(JSON.parse(expect));
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
    }

    //先处理方式：默认校验验证对象是否存在
    function __expectPath(expect){
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
     * 焦点到当前操作的页面(页面跳转后)
     * @returns {Function}
     */
    function __currentWin(){
        return function (driver) {
            driver.getAllWindowHandles().then(function (handles) {
                logger.info(handles[handles.length - 1]);
                driver.switchTo().window(handles[handles.length - 1]);
            });
        };
    }
}

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

exports.DriverEngine = DriverEngine;

// var engine = new DriverEngine("chrome" , [0, 0], [1280, 1024]);
// engine.play({"domain":"http://mallt.jidd.com.cn:8888","path":"/","tArray":[[{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"loginId","isFormEl":true,"name":"loginBy","placeholder":"请输入用户名","tagName":"INPUT","type":"text","value":"滦县鹏大商贸有限公司","xPath":"//*[@id='loginId']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"password","isFormEl":true,"name":"password","placeholder":"请输入密码","tagName":"INPUT","type":"password","value":"123456","xPath":"//*[@id='password']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"btn","innerText":"登录","isFormEl":false,"tagName":"BUTTON","type":"submit","xPath":"//*[@class='user-login-form']/button[1]"}]],"url":"http://mallt.jidd.com.cn:8888/"}, 
//     function(dealResult){
//         console.log(dealResult);
// });
