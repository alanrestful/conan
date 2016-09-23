//var buf = new Buffer("www.runoob.com", "utf-8");
//console.log(buf);
//console.log(buf.length);
//console.log(buf.toString());
//console.log(buf.toJSON());

//var buf = new Buffer(10);
//var len = buf.write("www.runoob.com");
//
//console.log(buf.toString());
//console.log("写入字节数 : "+  len);

//需要对buffer接收的数据做拼接处理

//var fs = require("fs");
//
//// 创建一个可读流
//var readerStream = fs.createReadStream('input.txt');
//
//// 创建一个可写流
//var writerStream = fs.createWriteStream('output.txt');
//
//// 管道读写操作
//// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
//readerStream.pipe(writerStream);
//
//console.log("程序执行完毕");

//process.stdin.pipe(process.stdout);

var stream = require('stream');
var util = require('util');

function Input() {
    stream.Transform.call(this);

    // Transform bytes...
    this._writableState.objectMode = false;
    // ...into objects.
    this._readableState.objectMode = true;

    // Unparsed data.
    this.buf = new Buffer(0);
    // Parsed length.
    this.len = null;
}

util.inherits(Input, stream.Transform);

Input.prototype._transform = function(chunk, encoding, done) {
    // Save this chunk.
    this.buf = Buffer.concat([ this.buf, chunk ]);

    var self = this;

    function parseBuf() {
        // Do we have a length yet?
        if (typeof self.len !== 'number') {
            // Nope. Do we have enough bytes for the length?
            if (self.buf.length >= 4) {
                // Yep. Parse the bytes.
                self.len = self.buf.readUInt32LE(0);
                // Remove the length bytes from the buffer.
                self.buf = self.buf.slice(4);
            }
        }

        // Do we have a length yet? (We may have just parsed it.)
        if (typeof self.len === 'number') {
            // Yep. Do we have enough bytes for the message?
            if (self.buf.length >= self.len) {
                // Yep. Slice off the bytes we need.
                var message = self.buf.slice(0, self.len);
                // Remove the bytes for the message from the buffer.
                self.buf = self.buf.slice(self.len);
                // Clear the length so we know we need to parse it again.
                self.len = null;
                // Parse the message bytes.
                var obj = JSON.parse(message.toString());
                // Enqueue it for reading.
                self.push(obj);
                // We could have more messages in the buffer so check again.
                parseBuf();
            }
        }
    }

    // Check for a parsable buffer (both length and message).
    parseBuf();

    // We're done.
    done();
};

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

process.stdin.pipe(new Input()).pipe(new Transform(function(msg, push, done){
    push(msg);
    done();
})).pipe();

//process.stdin.on("data",function(data){
//    process.stdout.write(data);
//});

//console.log("process close");
//process.exit();