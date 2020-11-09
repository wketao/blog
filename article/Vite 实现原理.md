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

- vite build

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

未完待续~