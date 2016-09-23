var log4js = require("log4js");
var path = require("path");

log4js.configure({
   appenders: [
       { type: "file", filename: "../logs/test.log", "maxLogSize": 2048000, "backups":3}
   ]
});

var logger = log4js.getLogger(path.basename(__filename));
var otherLogger = log4js.getLogger("other");

var i = 0;
while(i < 10000){
    logger.info("alan ");
    i++;
}