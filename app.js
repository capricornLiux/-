var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

// 读取缓存配置信息
var config = require('./config');

var port = 8999;

// 创建http服务
var server = http.createServer(function (request, response) {

    // 获取请求的url
    var pathname = url.parse(request.url).pathname;

    // 请求url拼接资源路径
    var realPath = `assets${pathname}`;

    // 获取请求路径的拓展名
    var ext = path.extname(realPath);

    // 是否匹配缓存策略中的拓展名
    if (ext.match(config.fileMatch)) {
        var expires = new Date();
        expires.setTime(expires.getTime() + config.maxAge * 1000);

        // 设置expires和cache-control
        response.setHeader('Expires', expires.toUTCString());
        response.setHeader('Cache-Control', `max-age= ${config.maxAge}`);
    }

    // 获取文件的最后修改时间
    console.log(realPath);
    if (realPath == 'assets/favicon.ico') {
        return;
    }
    fs.stat(realPath, function (err, stats) {
        console.log(stats);
        // 从fs.stats对象上获取最后修改时间, 并转化为utc时间
        var lastModified = stats.mtime.toUTCString();
        response.setHeader('Last-Modified', lastModified);

        // 判断请求中是不是有if-modified-since头
        if (request.headers['if-modified-since'] && lastModified === request.headers['if-modified-since']) {
            console.log('same')
            response.writeHead(304, 'Not Modified')
            // 直接返回
            response.end()
        } else {
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
        }

            // 判断请求文件是否存在

    })
})

server.listen(port);
console.log(`server is listening at port ${port}`);