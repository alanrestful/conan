// - Input - 针对native message的(object)数据转换成object
// - Output - 将object数据转换成native message数据
// - Transform - 提供的数据转换入口
var stream = require('stream');
var util = require('util');

/**
 * 输入流处理
 */
function Input() {
    stream.Transform.call(this);

    this._writableState.objectMode = false;
    //只读处理
    this._readableState.objectMode = true;

    this.buf = new Buffer(0);
    this.len = null;
}

util.inherits(Input, stream.Transform);

Input.prototype._transform = function(chunk, encoding, done) {
    this.buf = Buffer.concat([ this.buf, chunk ]);

    var self = this;

    /**
     * Chrome浏览器扩展与客户端的本地应用之间的双向通信采用消息机制，
     * 该消息以JSON格式，UTF-8编码，带32位（操作系统本地字节序）的消息长度作为前缀(4个字节)。
     * 从本地应用发送到Chrome浏览器扩展的消息，最大尺寸是1M字节。从Chrome浏览器扩展发送到本地应用的消息，最大尺寸是4G字节。
     */
    function parseBuf() {
        if (typeof self.len !== 'number') {
            if (self.buf.length >= 4) {
                self.len = self.buf.readUInt32LE(0);
                self.buf = self.buf.slice(4);
            }
        }

        if (typeof self.len === 'number') {
            if (self.buf.length >= self.len) {
                var message = self.buf.slice(0, self.len);
                self.buf = self.buf.slice(self.len);
                self.len = null;
                var obj = JSON.parse(message.toString());
                self.push(obj);
                parseBuf();
            }
        }
    }

    parseBuf();

    done();
};


/**
 * 输出流处理(提供native message数据格式信息)
 */
function Output() {
    stream.Transform.call(this);

    this._writableState.objectMode = true;
    this._readableState.objectMode = false;
}

util.inherits(Output, stream.Transform);

Output.prototype._transform = function(chunk, encoding, done) {
    var len = new Buffer(4);
    var buf = new Buffer(JSON.stringify(chunk));

    //增加native message头部信息长度识别
    len.writeUInt32LE(buf.length, 0);

    this.push(len);
    this.push(buf);

    done();
};

/**
 * 消息处理
 * @param handler 处理function
 */
function Transform(handler) {
    stream.Transform.call(this);

    this._writableState.objectMode = true;
    this._readableState.objectMode = true;

    this.handler = handler;
}

util.inherits(Transform, stream.Transform);

Transform.prototype._transform = function(msg, encoding, done) {
    this.handler(msg, this.push.bind(this), done);
};


exports.Input = Input;
exports.Output = Output;
exports.Transform = Transform;
