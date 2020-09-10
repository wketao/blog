```javaScript
module.exports:{
    proxy: {
        "/api": {
            //代理地址
            target: "http://127.0.0.1:3000",
            //路径重写
            pathRewrite: {
                "^/api": ""
            }
            // 如果是https接口，需要配置这个参数，并且为true。
            secure: false,
             //是否跨域
            changeOrigin: true,
        },
    },
}
```

### 参数说明:

#### **'/api'** 和 **'target'** 是什么？

这个是做匹配用的，匹配项目中所有接口都是以**'/api'**开头的，重定向到 **http://localhost**。

比如说，有一个接口的格式为 **'/api/user/getUserInfo'**，它等价于 **http://localhost/user/getUserInfo**

所以，我们写 ajax 请求的时候，就可以写成下面这样子

```javaScript
$.ajax({
    // 不使用代理
    // url: 'http://localhost/user/getUserInfo',
    //使用代理
    url: '/api/user/getUserInfo',
});

```

**注意：这个/api 是自定义。**

#### **'pathRewrite'** 是什么？

这个是路径重写，可以修改最终的请求地址。

比如说，后端有一个接口的路由名为 **/module/user/getSbZqt**,就可以设置为

```javaScript
pathRewrite: {
    "^/api": "/module"
}
```

最终访问的地址就是：**http://localhost/module/user/getUserInfo**

你可能会想到，那接写 **/module** 不就可以了吗？为什么还要写 **/api**?

这个问题的话，看公司项目项目规范吧，有些项目会涉及会用到多个代理。又或者有些公司为了区分是接口。

多个代理的场景最通常的情况就是，你和多个后端的同事在对接口。a 同事和 b 同事的 ip 都不一样，这个时候就可以用的上啦。

#### **'secure'** 是什么？

可以这么来理解，如果是 https 接口，需要配置这个参数，并且为 true。如果不是 https，设置为 false。

#### **'changeOrigin'** 是什么？

这个参数，一开始不知道什么意思？我去 github 上查阅了[官方文档](https://github.com/chimurai/http-proxy-middleware)，是英文的，翻译了一下

原文：

rue/false, Default: false - changes the origin of the host header to the target URL

译文：

true/false，默认值:false——将主机标头的来源更改为目标 URL

后来查了资料，在加上我的理解。可以这样理解：

后端在接收到前端的请求的时候，是可以获取到 host 的，**host 就是请求的 ip 来源**,这个默认值是**false**。

如果 **changeOrigin 为 false** , 就是请求中的 host 就是你本地的 host，比如 localshost。

如果 **changeOrigin 为 true** , 就是把 host 替换为代理的域名，比如 xxx.com。

<p style='color:red'>主要看后端的服务器有没有做host和referrer的判断,服务端可能判断如果host和referrer不对的话，就不提供服务。</p>

#### 参考资料

http-proxy-middleware：[ https://github.com/chimurai/http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

vue cli 官网：[https://cli.vuejs.org/zh/config/#devserver-proxy](https://cli.vuejs.org/zh/config/#devserver-proxy)
