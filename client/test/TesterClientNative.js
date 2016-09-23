#!/usr/local/bin/node
//process.stdin.setEncoding('utf8').pipe(process.stdout);
var webdriver = require('selenium-webdriver');
var through2  = require('through2');
var stream = through2(write);

//var nativeMessage = require('./index');
//var input = new nativeMessage.Input();
//var transform = new nativeMessage.Transform(messageHandler);
//var output = new nativeMessage.Output();

var log4js = require("log4js");
var path = require("path");

log4js.configure({
    appenders: [
        { type: "file", filename: "../logs/test.log", "maxLogSize": 2048000, "backups":3}
    ]
});
var logger = log4js.getLogger(path.basename(__filename));

//黑魔法将chromeDriver的bin path加入到环境变量中
process.env["PATH"] = "/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin";
logger.info(process.env);
//process.stdin
//    .pipe(input)
//    .pipe(transform)
//    .pipe(output)
//    .pipe(process.stdout)
//;


process.stdin.setEncoding('utf8').pipe(stream).pipe(process.stdout);

function write(line,_,next){
    //console.log(line.toString());
    //this.push(JSON.parse(line.toString())["message"]);;
    //try{
    //    var driver = new webdriver.Builder().forBrowser("chrome").build();
    //    logger.info("build ok");
    //}catch (e){
    //    logger.error(e);
    //}
    logger.info(line);
    this.push(line.toString());
    //driver.get("http://mallt.jidd.com.cn:8888").then(function(deal){
    //    this.push("deal");
    //}, function(err){
    //    this.push(err);
    //});
    next();
}

//function messageHandler(msg, push, done) {
//    //try{
//    //    var driver = new webdriver.Builder().forBrowser("chrome1").build();
//    //}catch (e){
//    //    push(e);
//    //}
//    console.log(msg);
//    logger.info(msg);
//    push(msg);
//    done();
//    //if (msg.readdir) {
//    //    fs.readdir(msg.readdir, function(err, files) {
//    //        if (err) {
//    //            push({ error: err.message || err });
//    //        } else {
//    //            files.forEach(function(file) {
//    //                push({ file: file });
//    //            });
//    //        }
//    //
//    //        done();
//    //    });
//    //} else if (msg.subscribe) {
//    //    subscriptions[msg.subscribe] = true;
//    //    push({ subscribed: msg.subscribe });
//    //    done();
//    //} else if (msg.unsubscribe) {
//    //    delete subscriptions[msg.unsubscribe];
//    //    push({ unsubscribed: msg.unsubscribe });
//    //    done();
//    //} else {
//    //    // Just echo the message:
//    //    push(msg);
//    //    done();
//    //}
//}

//process.stdin.resume();
//process.stdin.setEncoding('utf8');
//
//process.stdin.on('data', function (chunk) {
//    process.stdout.write('data: ' + chunk);
//});
//
//process.stdin.on('end', function () {
//    process.stdout.write('end');
//});