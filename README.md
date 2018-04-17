# 浏览器缓存策略
浏览器缓存策略

---

### cache-control
* 可以出现在```request header```中, 也可以出现在```response header```中
* 属性
  * ```max-age```
    * 最大过期时间, 在这个时间内, 浏览器不会再发起请求 
    * 例如: ```cache-control: max-age=315360000```
    * 优先级高于```expires```
    * 在缓存时间内, 状态码```200(from memory cache)```
  * ```s-maxage```
    * 优先级高于```max-age```
    * 只能指定```public```的缓存
    * 请求的时候浏览器去公共缓存位置读取, 返回```304```状态码; 超过指定时间的时候, 会去服务器读取(回源读取)
    * ```private``` 比如本机的缓存
    * ```public``` 比如 ```cdn```
  * ```private```
  * ```public```
  * ```no-cache```
    * 浏览器会发起请求, 到服务端查看缓存信息, 比如last-modify...查看是否过期, 从而知道缓存策略
    * ```Cache-Control: private, max-age=0, no-cache```
  * ```no-store```
    * 完全不使用任何缓存

---
### expires
* 缓存过期时间, 用来指定资源到期的时间, 是服务器端的具体时间点
* 告诉浏览器在过期时间前可以直接从浏览器缓存中读取数据, 而无需再次请求
* HTTP1.0提出来的
* max-age HTTP1.1提出来的, 优先级大于expires

---
### 强浏览器缓存
* 浏览器不发起请求, 直接使用浏览器中缓存的数据
* 强浏览器缓存存在的问题
  * 文件在服务器端被更新之后, 浏览器无法知道

---
## 协商缓存机制
* 浏览器发起请求
* 服务器响应, 带上 ```if-modified-since``` header

### last-modified

### if-modified-since
