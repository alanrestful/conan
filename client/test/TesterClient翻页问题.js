/**
 * Created by MichaelZhao on 9/14/16.
 */
var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().
withCapabilities(webdriver.Capabilities.chrome()).
build();

driver.get('http://mallt.jidd.com.cn:8888');

//driver.getWindowHandle().then(function(handle){
//    console.log(handle);
//});
//driver.findElement(webdriver.By.xpath("//*[@class='btn btn-small']")).click();
//driver.sleep(1000);
//
//driver.getWindowHandle().then(function(handle){
//    console.log(handle);
//});
////设置延时用于页面重刷后节点查询的异步问题
//driver.findElement(webdriver.By.xpath("//*[@class=' js-sku-attr sku-attr']")).click();
//driver.sleep(1000);
//driver.findElement(webdriver.By.xpath("//*[@id='choose']/li[2]/div[1]/div[1]/div[1]/a[1]")).click();
//driver.sleep(1000);
//driver.findElement(webdriver.By.xpath("//*[@id='choose']/li[3]/div[1]/div[1]/div[1]/a[1]")).click();
//driver.sleep(1000);
//driver.findElement(webdriver.By.xpath("//*[@id='choose-btns']/button[1]")).click();
//driver.sleep(1000);

driver.getAllWindowHandles().then(function(handles){
    console.log(handles[handles.length - 1]);
    driver.switchTo().window(handles[handles.length - 1]);
});
driver.getWindowHandle().then(function(handle){
    console.log(handle);
});

driver.findElement(webdriver.By.xpath("//*[@class='search-hot-ul']/li[2]/a[1]")).click();

driver.sleep(1000);
driver.getAllWindowHandles().then(function(handles){
    console.log(handles[handles.length - 1]);
    driver.switchTo().window(handles[handles.length - 1]);
});

driver.getWindowHandle().then(function(handle){
    console.log(handle);
});

driver.sleep(1000);
driver.findElement(webdriver.By.xpath("//*[@class='product-image']/a[1]/img[1]")).click();

driver.quit();