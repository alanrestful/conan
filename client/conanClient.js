#!/usr/local/bin/node
var nativeMessage = require('./lib/nativeIO.js');
var engine = require('./lib/engine.js');
var path = require("path");
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var logger = require("./lib/config.js").logger;
var through2 = require('through2');

//黑魔法将chromeDriver的bin path加入到环境变量中
process.env["PATH"] = "/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin";

if (cluster.isMaster) {
    logger.info("master start...");

    var input = new nativeMessage.Input();
    var transform = new nativeMessage.Transform(messageHandler);

    // 作为nativeMessage的数据输入端
    process.stdin.pipe(input).pipe(transform);

    cluster.on('listening',function(worker, address){
        logger.info('listening: worker ' + worker.process.pid +', Address: '+address.address+":"+address.port);
    });

    cluster.on('exit', function(worker, code, signal) {
        logger.info('worker ' + worker.process.pid + ' died');
    });
} else {
    logger.info("fork a new worker for webDriver");

    process.on('message', function(msg) {
        try{
            var driver = new engine.DriverEngine(msg.driver, msg.position, msg.size);

            driver.play(msg.data, function(result){
                process.send(result);
                process.exit();
            });
        }catch(err){
            logger.error(err);
        }
    });
}

function windowLocation(driverNum){
    var widthNum = Math.floor(Math.sqrt(driverNum));
    var heightNum = driverNum/widthNum;
    var sqrtWidth = 1280/heightNum;
    var sqrtHeight = 773/widthNum;

    var locations = [];
    for (var i = 0; i < driverNum; i++) {
        var heightLoc = Math.floor(i/heightNum)*sqrtHeight;
        locations.push({"position":[i%heightNum*sqrtWidth , heightLoc > 0 ? heightLoc+21 : heightLoc], "size":[sqrtWidth, sqrtHeight]});
    }

    return locations;
}

function messageHandler(msg, push, done) {
    try{
        logger.info(msg);
        switch(msg.method){
            case "play":
                logger.info("fork");

                var driverLoc = windowLocation(msg.webDrivers.length);
                for(var i in msg.webDrivers){
                    var worker = cluster.fork();
                    worker.send({"data": msg.data, "driver": msg.webDrivers[i], "position": driverLoc[i].position, "size": driverLoc[i].size});

                    // 作为master的输出端到master
                    var output = new nativeMessage.Output();
                    var objectStream = through2.obj(function(chunk, encoding, callback) {
                        this.push(chunk);
                        callback();
                    });
                    objectStream.pipe(output).pipe(process.stdout);

                    // master作为数据处理
                    worker.on('message', function(message) {
                        objectStream.write(message);
                    });
                }
                break;
            default:
                logger.error("Undefined with method "+msg.method);
        }

    }catch (e){
        logger.error(e.stack);
    }
}

