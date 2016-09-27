var webdriver = require('selenium-webdriver');
var logger = require("./config.js").logger;

/**
 * 初始化DriverEngine
 * @param browser   浏览器名称
 * @param position  浏览器位置
 * @param size      浏览器尺寸
 */
function DriverEngine(browser, position, size){
    this.driver = new webdriver.Builder().forBrowser(browser).build();

    this.driver.manage().window().setPosition(position[0], position[1]);
    this.driver.manage().window().setSize(size[0], size[1]);

    this.play = function(tCase, callback){
        /**
         * 解决Node的异步io问题,需要将设置element的等待时间和每次执行处理时的driver的sleep时间相同
         */
        this.driver.get(tCase.url);
        var tArrays = tCase.tArray;
        for(var n in tArrays) {
            for (var i in tArrays[n]) {
                // 解决node异步io处理速度太快
                var tObj = tArrays[n][i];
                if (tObj.isFormEl) {
                    __formElement(this.driver, tObj);
                    this.driver.sleep(1000);
                } else {
                    __actionElement(this.driver, tObj);
                    this.driver.sleep(1000);
                }
            }

            // action处理后跳转到一个新页面
            this.driver.sleep(1000);
            __currentWin(this.driver);
        }

        driver.quit().then(function(){
            callback();
        });
    };

    /**
     * 输入元素操作
     * @returns {Function}
     */
    function __formElement(){
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
        };
    }

    /**
     * 动作元素操作
     * @returns {Function}
     */
    function __actionElement(){
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
        };
    }

    /**
     * 焦点到当前操作的页面(页面跳转后)
     * @returns {Function}
     */
    function __currentWin(){
        return function (driver) {
            driver.getAllWindowHandles().then(function (handles) {
                console.log(handles[handles.length - 1]);
                driver.switchTo().window(handles[handles.length - 1]);
            });
        }
    }
}

var engine = new DriverEngine("chrome" , [0, 0], [1280, 1024]);
engine.play({"domain":"http://mallt.jidd.com.cn:8888","path":"/","tArray":[[{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"loginId","isFormEl":true,"name":"loginBy","placeholder":"请输入用户名","tagName":"INPUT","type":"text","value":"滦县鹏大商贸有限公司","xPath":"//*[@id='loginId']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"password","isFormEl":true,"name":"password","placeholder":"请输入密码","tagName":"INPUT","type":"password","value":"123456","xPath":"//*[@id='password']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"btn","innerText":"登录","isFormEl":false,"tagName":"BUTTON","type":"submit","xPath":"//*[@class='user-login-form']/button[1]"}]],"url":"http://mallt.jidd.com.cn:8888/"});
