/**
 * Created by MichaelZhao on 9/14/16.
 */
var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().
withCapabilities(webdriver.Capabilities.chrome()).
build();

process.env["webdriver.chrome.driver"] = "/usr/local/bin/chromedriver";

//driver.getCapabilities().then(function(value){
//    console.log(value);
//});
var sequence = new webdriver.ActionSequence(driver);

// 通过and做不同样式的提示信息确认
driver.get('http://mall.jidd.com.cn/register');
driver.findElement(webdriver.By.xpath("//*[@class='input-medium']")).sendKeys("alan");
sequence.sendKeys(webdriver.Key.TAB).perform();
driver.sleep(5000);
//*[@class='note-error' and contains(text(), '× 5到25位，只能包含数字、字母、中文和下划线，首字母不能是数字')]
//*[@class='note-error' and contains(text(), '5到25位，只能包含数字、字母、中文和下划线，首字母不能是数字')]
driver.findElement(webdriver.By.xpath("//*[@class='note-error' and contains(text(), '× 5到25位，只能包含数字、字母、中文和下划线，首字母不能是数字')]"));
//driver.get('http://mallt.jidd.com.cn:8888/login');
//driver.findElement(webdriver.By.xpath("//*[@id='loginId']")).sendKeys("alan");
//driver.findElement(webdriver.By.xpath("//*[@id='password']")).sendKeys("1232378237");
//driver.findElement(webdriver.By.xpath("//*[@class='form-control btn']")).click().then(function(obj){
//    //TODO 如何处理异步加载显示短暂时间问题
//    driver.sleep(1000);
//    driver.getPageSource().then(function(value){
//        //console.log(value);
//        if(value.indexOf("密码不匹配") > 0 ){
//            console.log("测试ok");
//        }
//    });
//    //element = driver.findElement(webdriver.By.xpath("//*[contains(.,.)]"));
//    //[contains(text(), 'Assign Rate')]
//    //console.log(element);
//
//    //通过xpath校验页面是否存在字符串
//    //*[@class='note' and contains(text(), '5到25位，只能包含数字、字母、中文和下划线，首字母不能是数字')]
//    element = driver.findElement(webdriver.By.xpath("//*[contains(text(), '密码不匹配')]"));
//    console.log(element.getText());
//    //console.log(element.getText());
//});


////selenium-webdriver的xpath路径查找最开始为dev所以无法以html为根节点查询,只能从根节点的body下的第一个div之后查找.????
////driver.findElement(webdriver.By.xpath("//html[1]/body[1]/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/form[1]/div[@id='login-name']/input[@id='loginId']")).sendKeys('jdsncgf2');
////只能这么查(webdriver在nodejs中没有设置cssSelector的方式)
////driver.findElement(webdriver.By.xpath("//div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/form[1]/div[@id='login-name']/input[@class='form-control']")).sendKeys('jdsncgf2');
//////*[@id="password"]
////driver.findElement(webdriver.By.xpath("/input[@class='input-radio'][2]")).click();
////xpath使用了@class|@id之类的查询后无法再用[2]来指定元素了(只能通过下面这种方式来指定)
//new webdriver.ActionSequence(driver).mouseMove(driver.findElement(webdriver.By.xpath('//*[@class=\'address-select\']/a[1]'))).perform();
////driver.actions().mouseMove(driver.findElement(webdriver.By.xpath('//*[@class=\'address-select\']/a[1]')));
//driver.findElement(webdriver.By.xpath('//*[@class=\'table item-manage-table\']/tbody[1]/tr[8]/td[4]/a[1]')).click();
//
////driver.findElement(webdriver.By.xpath("//*[@class='address-select']/a[1]")).click();
////driver.findElement(webdriver.By.xpath("//*[@class='address-content clearfix']/li[19]/a[1]")).click();
//
//driver.findElement(webdriver.By.xpath("//input[@id='loginId'][1]")).sendKeys("alan");
//// css selector:css选择器. 具体可以根据元素+css的集合查询
//// //*[@id="login-channel"]/label[1]/input
//// //*[@id="login-channel"]/label[2]/input
//driver.findElement(webdriver.By.css("i.iconfont.input-icon.icon-dengluyonghuming"));
//// 多个元素查询访问
//driver.findElements(webdriver.By.className("input-radio")).then(function(elements){
//    console.log(elements);
//    elements[1].click();
//});
////console.log(radios);
////for(var index in radios){
////    if(index == 1){
////        console.log(index);
////        radios[index].click();
////    }
////}
//driver.findElement(webdriver.By.xpath('//input[@id="loginId"]')).sendKeys('jdsncgf2');
////driver.findElement(webdriver.By.id('loginId')).sendKeys('jdsncgf2');
////检验元素是否存在
//driver.findElement(webdriver.By.id('password')).then(function(webElement) {
//    console.log('Element exists');
//    webElement.sendKeys("123456");
//}, function(err) {
//    if (err.state && err.state === 'no such element') {
//        console.log('Element not found');
//    } else {
//        webdriver.promise.rejected(err);
//    }
//});
//
/////html/body/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/form[1]/button[1]
////driver.findElement(webdriver.By.xpath("//html[1]/body[1]/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/form[1]/button[1]")).click();
//driver.wait(function() {
//    return driver.getTitle().then(function(title) {
//        return title === 'webdriver - Google Search';
//    });
//}, 1000);

driver.quit();