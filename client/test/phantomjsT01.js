#!/usr/local/bin/node
var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().forBrowser("phantomjs").build();
driver.get('http://mallt.jidd.com.cn:8888').then(function(value){
	console.log(value);
});

driver.findElement(webdriver.By.xpath("//*[@class='search-hot-ul']/l[2]/a[1]")).click();

driver.quit();