# 使用 webpack 实现一个简易版的 vue 项目打包

## 目标

使用 webpack 实现一个使用 Vue CLI 创建出来的 Vue 项目的打包，有所不同的是，我删除了一些关于 webpack 的配置，还有路由等。模板已经放到[github](https://github.com/Aisen60/webpack-vue-template)上了。

目标是要实现，开发服务器（实现热加载）、ESlint 检查、打包编译。

思路是，先安装、编写所需要用到的 loader，以及相关的插件，然后安装 webpack-dev-serve 并且 配合 webpack.HotModuleReplacementPlugin 来实现热更新，最后处理 copy 文件，完成最后的打包编译。

## webpack 是什么

webpack 是一个前端的打包工具，它的思想主要是模块化，它把所有的静态文件都视为模块，最终会按照配置文件中的规则，生成优化过后的代码。

## 准备工作

去 github 上把这个项目模板下载到本地[webpack-vue-template](https://github.com/Aisen60/webpack-vue-template)。

下载完后，我们先在控制台安装 webpack、webpack-cli 这两个包，进入项目命令行终端，输入 `yarn add webpack webpack-cli --dev` ，安装完成后，我们打开 webpack.common.js ，来编写一些基础的配置。

我们先指定 webpack 的打包入口文件，以及打包完成后输出的文件名，代码如下：

```diff
+ module.exports = {
+   entry: "./src/main.js",
+   output: {
+     filename: "js/bundle.js",
+   },
+   module: {}
+   plugins: []
+ }
```

在接着，我们打开目录观察一下项目，有下面这几个文件目录：

- public 静态资源文件夹
- src 源文件目录
- package.json package file
- README.md
- webpack.common.js webpack 配置 通用文件
- webpack.dev.js 开发环境配置
- webpack.prod.js 生产环境配置

## loader

loader 机制，是 webpack 的核心，webpack 它不知道如何处理 js 文件以外的文件，所有我们借助 loader 来帮助我们实现除了 js 文件以外的文件的转换编译等。

我们观察一下 src 目录，src 目录下一共有这几种类型的文件：png、less、vue、js。明白了该处理什么文件类型后，我们就可以开始编写 相关的 loader 了。

### file-loader 处理 .png 文件

我们首先来处理一下 png 文件，我们需要 file-loader 来帮我们进行编译。[file-loader 官方文档：https://webpack.js.org/loaders/file-loader/](https://webpack.js.org/loaders/file-loader/)。

在控制台输入 `yarn add file-loader --dev` 来安装 file-loader 这个 loader，安装完成后，我们打开 webpack.common.js 来编写以下 file-loader 这个任务，其实，你通过官方文档的介绍，可能已经明白了 file-loader 的使用了。我们在 module 中写入配置，代码如下：

webpack.common.js:

```diff
module: {
+    rules:[
+        {
+            test: /\.(png|jpg|gif)$/, // 处理文件后缀名以png、jpg、gif结尾的文件
+            use: [
+                {
+                loader: "file-loader", // 使用 file-loader 这个 loader
+                options: { // 选项配置
+                    name: "[hash].[ext]", // 处理过后的文件名
+                    esModule: false, // 是否开启模块化
+                },
+                },
+            ],
+        },
+    ]
}
```

当然我们还可以使用 url-loader 来处处理，url-loader 用法请查看官网，这里不做讲解。[url-loader 文档](https://webpack.js.org/loaders/url-loader/)

**这里需要注意的一个点是，在最新版本中的 file-loader 已经默认启动了模块化，我们需要把 esModule 设置成 false， 不然呢，打包过后的结果就会变成下面这个样子。**

```html
<img alt="Vue logo" src="[object Module]" />
```

### less-loader 处理 .less 文件

接下来，我们处理一下以 less 文件。同样，官网有提供相应的 loader 。[less-loader 官方文档：https://webpack.js.org/loaders/less-loader/](https://webpack.js.org/loaders/less-loader/)。但是光只有 less-loader 是不够的，因为 less-loader 只会帮助我们把 less 转换成 css ，并不会帮我们挂载在页面中 head 中。所以我们还需要 css-loader style-loader 这两个 loader 来帮助我们实现。

我们在控制台输入 `yarn add less-loader less css-loader style-loader --dev`来安装这几个 loader

安装完成后，我们在 module 中编写规则，代码如下：

webpack.common.js:

```diff
module: {
    rules:[
+       {
+           test: /\.less$/,
+           use: [
+               {
+                   loader: "style-loader",
+               },
+               {
+                   loader: "css-loader",
+               },
+               {
+                   loader: "less-loader",
+               },
+           ],
+       },
    ]
}
```

这里需要注意的是，**loader 是从下往上，从右往左执行的**。我们需要先执行 less-loader ，要把 less 转换成 css 给 css-loader 去处理，然后 css-loader 处理完后，交给 style-loader 处理，style-loader 会把处理后的结果，帮我们挂载到页面的 head 中。

### vue-lodaer 处理 .vue 文件

接下来，我们来处理 .vue 类型的文件。我们需要用到一个 vue-loader 它是 vue/cli 官方提供的一个 loader ，专门处理以一种名为[单文件组件 (SFCs)](https://vue-loader.vuejs.org/zh/spec.html)的格式撰写的 Vue 组件。[Vue Loader 官方文档](https://vue-loader.vuejs.org/zh/)

首先，我们需要安装 vue-loader ，同时还要安装一个插件 vue-template-compiler 。在命令行终端输入：`yarn add vue-loadervue-template-compiler --dev`。

安装完成后，我们来编写相应的规则，代码如下：

webpack.common.js:

```diff
+ const VueLoaderPlugin = require("vue-loader/lib/plugin");
module: {
    rules:[
+       {
+           test: /\.vue$/,
+           loader: "vue-loader",
+       },
   ]
},
plugins: [
+   new VueLoaderPlugin(),
],
```

编写完 loader 后，根据官方文档的提示，我们还需要在 配置文件中引入 vue-loader/lib/plugin ，并且在把这个插件添加到 plugins 中，代码如下：

```diff
+ const VueLoaderPlugin = require("vue-loader/lib/plugin");
plugins: [
+   new VueLoaderPlugin(),
],
```

**官方文档声明，必须要引入这个插件，否则无法正常处理 .vue 文件。**

根据官方文档的事例中，我们发现，还需要对 .vue 模板中的 css 做处理，需要使用到一个 loader 叫做 vue-style-loader。我们来安装这个 loader。在命令终端输入 `yarn add vue-style-loader --dev` 来安装。

安装完成后，我们来编写相关的规则，代码如下：

```diff
module: {
    rules:[
+     // 它会应用到普通的 `.css` 文件
+     // 以及 `.vue` 文件中的 `<style>` 块
+     {
+       test: /\.css$/,
+       use: ["vue-style-loader", "css-loader"],
+     },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
          },
        ],
      },
    ]
}
```

### babel-loader 处理 js 文件

接下来，我们需要处理 .vue 文件 和 js 文件中 js 的代码，我们可以使用 babel-loader 这个 loader 来帮助我们处理 ，官方文档：https://webpack.docschina.org/loaders/babel-loader/ 官方文档中提到，还需要安装 @babel/core @babel/preset-env 这两个包。我们根据官网文档的要求，在命令行终端输入 `yarn add babel-loader @babel/core @babel/preset-env --dev`。

安装完成后，开始编写 loader 规则 ，代码如下：

webpack.common.js:

```diff
module: {
    rules:[
+       // 它会应用到普通的 `.js` 文件
+       // 以及 `.vue` 文件中的 `<script>` 块
+       {
+           test: /\.js$/,
+           loader: "babel-loader",
+       },
    ]
}
```

### eslint-loader 检查代码规范

接下来，我们需要安装 eslint-loader 来帮我们进行代码的检查，官方文档：https://webpack.js.org/loaders/eslint-loader/ 。 我们根据官方文档，我们需要安装 eslint 和 eslint-loader 。在命令行输入 `yarn add eslint eslint-loader --dev` 来安装。

完成安装后，我们写入规则，代码如下：

webpack.common.js:

```diff
module: {
    rules:[
     // 它会应用到普通的 `.js` 文件
     // 以及 `.vue` 文件中的 `<script>` 块
     {
       test: /\.js$/,
       loader: "babel-loader",
     },
+     {
+       test: /\.(vue|js)$/, // 需要检查代码的文件类型
+       exclude: /node_modules/, // 不需要检查的目录文件
+       loader: "eslint-loader", // 使用 eslint-loader
+       enforce: "pre",
+       include: [__dirname + "/src"], // 要检查的目录
+     },
    ]
}
```

至此，我们所有的 loader 已经写完了。

配置 eslint 有两种方法

- 通过 `yarn eslint --init`来初始化一个配置文件
- 在 package.json 中的 eslintConfig 编写规则

模板中已经提供了一个简答的校验规则了，所以我们这里只需要安装相关 loader 就行了。

或许你可能有疑问，要如何校验这些 loader 是否写的真确？我们可以在启动开发服务器时，去校验这些 loader 和 plugins 是否正确。

## plugins

下面，我们来安装几个 plugins 让我们打包更加便捷。

### HtmlWebpackPlugin

我们首先打开 public 下的 index.html 文件，可以看到 title 和 strong 标签中使用了一个叫做 htmlWebpackPlugin.options.title 的内容。这个是 HtmlWebpackPlugin 插件的作用之一。

![image](https://user-images.githubusercontent.com/19791710/87243714-d2c62580-c46a-11ea-8b2e-c49f3e3d463b.png)

HtmlWebpackPlugin 插件的作用是，在打包完成之后，自动生成一个 html 文件到输出目录中，并且还会自动引入打包编译之后的 js 主文件，可以看到这个插件的 github[官网](https://github.com/jantimon/html-webpack-plugin#configuration)上有文档说明，我们也可以指定一个模板生成 html 文件。在 HtmlWebpackPlugin 配置中，我们还可以设置一些参数，供 index.html 使用，webpack 会一同把它编译。

我们在命令行终端输入 `yarn add html-webpack-plugin --dev`来安装这个插件。

安装完成后，在 webpack.common.js 文件中，先引入这个插件，并且在把这个插件添加到 plugins 中，代码如下：

webpack.common.js:

```diff
+ const HtmlWebpackPlugin = require("html-webpack-plugin");
plugins: [
    new VueLoaderPlugin(),
+   new HtmlWebpackPlugin({
+       title: "webpack-vue-template", // 网站 title
+       template: "./public/index.html", // 使用指定的模板
+   }),
]
```

### webpack.DefinePlugin

我们打开到 public 下的 index.html 文件，我们看到 link 标签中，有一个 <%= BASE_URL %> 这是个什么东东？

![image](https://user-images.githubusercontent.com/19791710/87243885-3ac93b80-c46c-11ea-996b-d1bd1fd0b1db.png)

其实这是一个全局变量，这是 webpack.DefinePlugin 提供的功能，它可以用来定义全局变量，在 webpack 打包的时候会对这些变量做替换。

它不需要引入而外的插件，只需要引入 webpack 就可以了，代码如下：

webpack.common.js:

```diff
+ const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
```

再接着，写入 plugins , 代码如下：

```diff
plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
        title: "webpack-vue-template",
        template: "./public/index.html",
    }),
+   new webpack.DefinePlugin({
+       BASE_URL: JSON.stringify("./"),
+   }),
],
```

至此，我们第一步的工作就完成了，我们已经编写完 loader 和 plugins 了。

## webpack-dev-server

接下来，我们需要安装 webpack-dev-serve 并且 配合 webpack.HotModuleReplacementPlugin 来启动一个开发服务器并且实现热更新。

我们在命令行终端输入：`yarn add webpack-dev-server --dev` ，安装完成后，我们还需要安装 webpack-merge，它的作用主要是帮助我们合拼覆盖原有的配置。在终端输入 `yarn add webpack-merge --dev`完成安装。

其实我们之前的所有的工作，都是在 webpack.common.js 中编写的，我们把通用的部分，抽离出了一个文件，接着，我们可以通过 merge 在指定的环境帮我们合拼覆盖原有的配置。

我们打开 webpack.dev.js 文件，开始编写启动服务器这个任务，代码如下：

webpack.dev.js

```javaScript
// 引入这个插件，在最新版本中，它不在返回一个函数，而是返回一个对象，我们需要进行结构操作。
const { merge } = require("webpack-merge");
// 引入我们抽离出来的公共模块
const common = require("./webpack.common");
// 合拼 common ，并且编写新的内容，覆盖原基础文件
module.exports = merge(common, {
  mode: "development", // 设置为 development 觅食
  devtool: "cheap-eval-module-source-map", // 开启source-map
  devServer: { // 启动服务器
    host: "localhost", // 主机地址
    port: "6060", // 端口
    open: true, // 是否自动打开浏览器
    contentBase: "public", // 告诉服务器从public目录提供静态文件
  },
});
```

好了，编写完后，我们在命令行终端，输入 `yarn webpack-dev-server --open --config webpack.dev.js` 来启动我们的服务器。**在这个启动服务器的时，我们可以校验，我们之前写的 loader 和 plugins 是否有问题。**启动的过程需要稍等一会，因为 eslint 会去校验代码，如果我们的代码写的不规范，控制台会给出提示。

如果一切顺利，系统会打开默认浏览器并且帮我打开 http://localhost:6060/，效果如下：

<img  alt="https://user-images.githubusercontent.com/19791710/87244963-f3df4400-c473-11ea-975c-0dfcd400962a.png" src="https://user-images.githubusercontent.com/19791710/87244963-f3df4400-c473-11ea-975c-0dfcd400962a.png">

接下来，我们来实现热更新的功能，实现热更新，需要配合 webpack 提供的一个 叫 HotModuleReplacementPlugin 的模块，我们需要在 devServer 中配置 hot 为 true 、并且引入 webpack，然后在 plugins 中实例化这个函数。代码如下：

```diff
+ const webpack = require("webpack");
// 引入这个插件，在最新版本中，它不在返回一个函数，而是返回一个对象，我们需要进行结构操作。
const { merge } = require("webpack-merge");
// 引入我们抽离出来的公共模块
const common = require("./webpack.common");
// 合拼 common ，并且编写新的内容，覆盖原基础文件
module.exports = merge(common, {
  mode: "development", // 设置为 development 觅食
  devtool: "cheap-eval-module-source-map", // 开启source-map
  devServer: {
    // 启动服务器
    host: "localhost", // 主机地址
    port: "6060", // 端口
    open: true, // 是否自动打开浏览器
+   hot: true, // 开启热更新
    contentBase: "public", // 告诉服务器从public目录提供静态文件
  },
+ plugins: [new webpack.HotModuleReplacementPlugin()],
});
```

接着，我们重新启动服务，输入 `yarn webpack-dev-server --open --config webpack.dev.js`，服务启动后，我们修改一下 App.vue 这个文件，修改一下 msg 这个属性，我们点击保存，回到浏览器，页面内容已经修改成了我们修改后的内容了，这就证明热更新是没有问题的。 效果如下：

<video src="https://raw.githubusercontent.com/Aisen-cai/Test/master/webpack-dev-server.mov" controls="controls" width="1000" height="600">您的浏览器不支持播放该视频！</video>

视频的地址是：https://raw.githubusercontent.com/Aisen-cai/Test/master/webpack-dev-server.mov

## 处理打包上线

接下来，我们来处理最后的任务，编写打包上线的编译模块的内容。这个流程我们需要用到 clean-webpack-plugin、copy-webpack-plugin 这两个插件，clean-webpack-plugin 帮助我们自动清除目录，copy-webpack-plugin 帮助我们拷贝一些文件到指定目录。

在控制台输入 `yarn add clean-webpack-plugin copy-webpack-plugin --dev`来安装。安装完成后，编写以下代码：

webpack.prod.js

```javascript
const path = require("path");
// 引入这个插件，在最新版本中，它不在返回一个函数，而是返回一个对象，我们需要进行结构操作。
const { merge } = require("webpack-merge");
// 引入我们抽离出来的公共模块
const commmon = require("./webpack.common");
// 引入 clean-webpack-plugin，它的实例方法是个对象，我们需要结构操作。
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 引入 copy-webpack-plugin
const copyPlugin = require("copy-webpack-plugin");
// 合拼 common ，并且编写新的内容，覆盖原基础文件
module.exports = merge(commmon, {
  mode: "production", // 设置为production模式
  output: {
    filename: "bundle.js", // 打包过后的js文件名
    path: path.resolve(__dirname, "dist"), // 输出的目录
  },
  plugins: [new CleanWebpackPlugin(), new copyPlugin(["public"])],
});
```

编写完毕过后，我们在终端输入 `yarn webpack --config webpack.prod.js`进行编译，稍等一会，编译完成后，我们在根目录下会出现一个 dist 目录，我们打开 dist 目录下的每个文件，来看看编译过后是什么样子的。我们打开到 bundle.js，我们可以看到代码已经被压缩了，我们可以启动一个服务器，来看看是否打包过后的内容是否可运行。

## 优化

至此，我们所有的任务都已经完成了。我们接下来，来优化一下，我们每当启动服务器或者打包的时候，都要输入一大串命令，闲得很麻烦，我们可以在 package.json 中写 script 脚本。代码如下：

package.json

```diff
+ "scripts": {
+   "serve": "webpack-dev-server --open --config webpack.dev.js",
+   "build": "webpack --config webpack.prod.js",
+   "lint": "eslint --ext .js,.vue src"
+ },
```

这样，我们就不需要输入这么多繁琐的命令了。

至此，所有的任务都已经完成了，有错误或者不明白的地方，可以在下面提出，欢迎纠正，谢谢~
