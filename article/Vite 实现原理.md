# Vite 介绍

## Vite 概念

- `Vite` 是一个面向现代化浏览器的一个更轻、更快的 web 应用应用开发工具
- 它基于 `ECMAScript` 标准原生模块系统（`ES Module`）实现的

它的出现是为了解决 `Webpack` 在开发阶段，使用 `webpack-dev-server` 冷启动时间过长和 `Webpack MHR` 热更新反应慢的问题。

使用 `Vite` 创建的项目，默认就是一个普通的 `Vue3 `应用，相比于 `Vue CLI` 创建的项目，会少了很多文件和依赖。

## Vite 项目依赖

`Vite` 创建的默认项目，开发依赖很少也很简单，只包含了：

- Vite
- @vue/compiler-sfc（用来编译.vue 结尾的单文件文件）

需要注意的是，`Vite` 目前创建的 `Vue` 项目只支持 3.0 的版本。在创建项目的时候，通过指定不同的模板，也可以创建其他框架的项目。

## Vite 提供的命令

- ### vite serve

  ##### 工作原理

  用于启动一个开发的 web 服务器，在启动服务器的时候不需要编译所有的模块启动速度非常的快。

  我们来看看下面这张图：

  ![vite serve web serve执行过程](https://img-blog.csdnimg.cn/20201109211121867.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDMzMjEz,size_16,color_FFFFFF,t_70#pic_center)

  在运行 `vite serve` 的时候，不需要打包，直接开启了一个 web 服务器。当浏览器请求服务器时，例如是一个 css，或者是一个单文件组件，这个时候在服务器会把这个浏览器请求的文件先编译，然后直接把编译后的结果返回给浏览器。

  **这里的编译是在服务器端，并且，模块的处理是在请求到服务器端处理的。**

  我们来回顾一下，`Vue CLI` 创建的应用

  ![vue-cli-service serve](https://img-blog.csdnimg.cn/20201109212528976.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDMzMjEz,size_16,color_FFFFFF,t_70#pic_center)

  `Vue CLI` 创建的项目启动 web 服务器用的是 `vue-cli-service`，当运行它的时候，它内部会使用 `Webpack` 去打包所有的模块（如果模块很多的情况下，编译的速度会很慢），打包完成后会将编译好的模块存储到内存中，然后启动一个 web 服务器，浏览器请求 web 服务器，最后才会从内存中把编译好的内容，返回到浏览器。

  像 `Webpack` 这样的工具，它的做法是将所有的模块提前都编译打包进内存里，不管模块是否被执行是否被调用，它会都打包编译，随着项目越来越大，打包后的内容也会越来越大，打包的速度也会越来越慢。

  而 `Vite` 使用现代化浏览器原生支持的 ES Module 模块化的特性，省略了模块的打包环节。对于需要编译的文件，例如样式模块和单文件组件等，vite 采用了即时编译，也就是说当加载到这个文件的时候，才会去服务端编译好这个文件。

  所有，这种即时编译的好处体现在按需编译，速度会更快。

  ##### HMR

  - Vite HMR

    立即编译当前所修改的文件

  - Webpack HMR

    会自动以这个文件为入口重新编译一次，所有的涉及到的依赖也会被加载一次

  `Vite` 默认也支持 HMR 模块热更新，相对于 `Webpack` 中的 HMR 效果会更好，因为 `Webpack` 的 HMR 模块热跟新会从你修改的文件开始全部在编译一遍

- ### vite build

  - Rollup
  - Dynamic import
    - Polyfill

  Vite 创建的项目使用 `Vite` build 进行生产模式的打包，这个命令内部使用过的是 Rollup 打包，最终也是把文件都打包编译在一起。对于代码切割的需求，Vite 内部采用的是原生的动态导入的方式实现的，所以打包的结果只能支持现代化的浏览器（不支持 ie）。不过相对应的 Polyfill 可以解决

## 是否还需要打包？

随着 `Vite` 的出现，我们需要考虑一个问题，是否还必要打包应用。之前我们使用 `Webpack` 进行打包，会把所有的模块都打包进 bundle.js 中，主要有两个原因：

- 浏览器环境对原生 ES Module 的支持
- 零零散散的模块文件会产生大量的 HTTP 请求

但是，现在目前大部分的浏览器都已经支持了 ES Module。并且我们也可以使用 HTTP2 长链接去解决大量的 HTTP 请求。**那是否还需要对应用进行打包，取决于你的团队和项目应用的运行环境。**

个人觉得这以后会是一个趋势。

## 开箱即用

- TypeScript - 内置支持
- less/sass/stylus/postcss - 内置支持（需要单独安装）
- JSX
- Web Assemby

## Vite 的特性

- 快速冷启动
- 模块热更新
- 按需编译
- 开箱即用

# 实现一个简易版的 vite

接下来，我们来实现一个简易版本的 vite，来深入理解 `vite` 的工作原理，分为以下五个步骤：

- 静态 web 服务器
- 修改第三方模块的路径
- 加载第三方模块
- 编译单文件组件
- HMR（通过 WebSocket 实现，跳过）

## 静态 web 服务器

`vite` 内部使用过的是 `koa` 来开启静态服务器的，这里我们也使用 `koa` 来开启一个静态服务器，把当前运行的目录作为静态服务器的根目录

创建一个名为 `vite-cli` 的空文件夹，进入该文件夹初始化 `package.json`，并且安装 `koa` 和 `koa-send`

```shell
mkdir vite-cli
cd vite-cli
npm init --yes
npm i koa koa-send
```

在 `package.json` 来配置 bin 字段：

```javascript
"bin": "index.js",
```

新建 index.js 文件，并且在第一行配置 node 的运行环境（因为我们要开发的是一个基于 node 的命令行工具，所以要指定运行 node 的位置）

```javascript
#!/usr/bin/env node

```

接下来，基于 `koa` 启动一个 web 静态服务器：

```javascript
#!/usr/bin/env node
const Koa = require("koa");
const send = require("koa-send");

const app = new Koa();

// 1.开启静态文件服务器
app.use(async (ctx, next) => {
  await send(ctx, ctx.path, { root: process.cwd(), index: "index.html" });
  next();
});

app.listen(3000);
console.log("Serve running @ http://localhost:3000");
```

接着，使用 `npm link` 到全局，然后打开一个使用 vue3 写的项目（可以用 `vite` 创建一个默认项目），进入命令行终端，输入 `vite-cli`。如果没有报错的话，会打印出"Serve running @ http://localhost:3000"这句话，我们打开浏览器，打开这个网址。

不过是一片空白的，接着我们打开 F12，会看到一个报错，报错的信息的意思是，解析 vue 模块的时候失败了，使用 import 导入模块的时候，模块的开头必须是 `"/", "./", or "../"` 这三种其中的一个。

![单文件组件报错信息](https://img-blog.csdnimg.cn/20201110214521211.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDMzMjEz,size_16,color_FFFFFF,t_70#pic_center)

我们来做一个对比，我们把使用 `vite` 创建的项目启动后， `vite-cli` 创建的项目启动后的 main.js 在浏览器响应中的区别：

vite:

![vite的main.js](https://img-blog.csdnimg.cn/20201110215143946.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDMzMjEz,size_16,color_FFFFFF,t_70#pic_center)

vite-cli:

![vite-cli的main.js](https://img-blog.csdnimg.cn/20201110215242987.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDMzMjEz,size_16,color_FFFFFF,t_70#pic_center)

通过上面两幅图的对比，你会发现，vite 它会处理这个模块引入的路径，它会加载一个不存在的路径 @modules，并且请求这个路径的 js 文件也是可以请求成功的。

这是 `vite` 创建的项目启动后的 vue.js 的请求，观察响应头中的 Content-Type 字段，他是 application/javascript;所以我们可以通过这个类型，在返回的时候去处理这个 js 中的第三方路劲问题。

![vite中的vue.js的请求](https://img-blog.csdnimg.cn/2020111021593793.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDMzMjEz,size_16,color_FFFFFF,t_70#pic_center)

## 修改第三方模块的路径

通过上面的观察和理解，我们得出一个思路，可以把不是 `"/", "./", or "../"` 开头的引用，全部替换成 "/@modules/"。

我们创建多一个中间件，用来做这件事情。

```javascript
// 2.修改第三方模块的路径
app.use(async (ctx, next) => {
  // 判断浏览器请求的文件类型，如果是js文件，在这里进行解析。
  if (ctx.type === "application/javascript") {
    //将流转化成字符串
    const contents = await streamToString(ctx.body);
    // 在js的import当中，只会出现以下的几种情况：
    // 1、import vue from 'vue'
    // 2、import App from '/App.vue'
    // 3、import App from './App.vue'
    // 4、import App from '../App.vue'
    // 2、3、4这三种情况，现代化浏览器都可以识别，只有第一种情况不能识别，这里只处理第一种情况
    // 思路是用正则匹配到 (from ') 或者 是 (from ") 开头，替换成"/@modules/"

    /**
     * 这里进行分组的全局匹配
     * 第一个分组匹配以下内容：
     *  from 匹配 from
     *  \s+ 匹配空格
     *  ['"]匹配单引号或者是双引号
     * 第二个分组匹配以下内容：
     *  ?! 不匹配这个分组的结果
     *  \.\/ 匹配 ./
     *  \.\.\/ 匹配 ../
     * $1表示第一个分组的结果
     */
    ctx.body = contents.replace(
      /(from\s+['"])(?![\.\/\.\.\\/])/g,
      "$1/@modules/"
    );
  }
});

// 将流转化成字符串，是一个异步线程，返回一个promise
const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    // 用于存储读取到的buffer
    const chunks = [];
    //监听读取到buffer，并存储到chunks数组中
    stream.on("data", (chunk) => chunks.push(chunk));
    //当数据读取完毕之后，把结果返回给resolve，这里需要把读取到的buffer合并并且转换为字符串
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    //如果读取buffer失败，返回reject
    stream.on("error", reject);
  });
```

未完待续~
