var log4js = require("log4js");
var path = require("path");

// 设置log管理
// 重置config的默认路径
process.env["NODE_CONFIG_DIR"] = path.resolve(__dirname, '..')+"/config";

var config = require('config');
log4js.configure({
    appenders: [
        { type: "file", filename: config.get("log.path"), maxLogSize: config.get("log.maxLogSize"), backups:3}
    ]
});
var logger = log4js.getLogger(path.basename(__filename));

process.env["PATH"] = process.env["PATH"] + ":" + config.get("webDriver.default_driver");

exports.logger = logger;