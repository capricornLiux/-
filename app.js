var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

// 读取缓存配置信息
var config = require('./config');

var port = 8999;
var server = http.createServer(function (request, response) {

    var pathname = url.parse(request.url).pathname;

    var realPath = `assets${pathname}`;

    var ext = path.extname(realPath);
    console.log(ext);
    console.log(config);

    if (ext.match(config.fileMatch)) {
        console.log(111);
        var expires = new Date();
        expires.setTime(expires.getTime() + config.maxAge * 1000);
        response.setHeader('Expires', expires.toUTCString());
        response.setHeader('Cache-Control', `max-age= ${config.maxAge}`);
    }

    fs.exists(realPath, function (exist) {
        if (!exist) {
            // 不存在
            // 返回 404 状态码
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            })
            response.write('This file not fount');
            response.end()
        } else {
            // 存在
            // 读取文件
            fs.readFile(realPath, 'binary', function (err, data) {
                if (err) {
                    // 返回错误
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    })
                    response.write('Server inner error');
                    response.end();
                } else {
                    // 没有错误
                    // 返回正确的状态码
                    response.writeHead(200, {
                        'Content-Type': 'image/jpeg'
                    })
                    // 将文件输出
                    response.write(data, 'binary')
                    response.end();
                }
            })
        }
    })
})

server.listen(port);
console.log(`server is listening at port ${port}`);