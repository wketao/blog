### monorepo 是什么？

monorepo 是管理项目代码的一种方式，指的是一个项目中或者一个仓库中里面包含了多个模块或者多个包。例如Vue3、React等这些前端很火的框架都采用了这种方式来管理项目代码。

我们先来看看Vue3的项目目录：

![vue3项目目录](https://user-images.githubusercontent.com/19791710/95672403-05e79480-0bd3-11eb-8e45-e0fac3303013.png)

再来看看react的项目目录：

![react目录结构](https://user-images.githubusercontent.com/19791710/95672429-40513180-0bd3-11eb-8cb2-2fddb8c4b753.png)

我们可以看到，在根目录下有一个packages的目录，在这个目录里面的每一个文件夹，就是一个模块或者包，这些模块或者包都会独自发布到NPM上的，这样就可以按需引入使用。当然，这个名字不一定要是packages，可以自定义，后面会说到。

在根目录下，只放脚手架或者一些相同的配置，如果多个包拥有相同的依赖，那么这个依赖也只会存在**根目录下的node_modules**中。

使用monorepo这种方式管理代码的好处是：
- 统一构建
- 统一测试
- 统一发布

使用这种方式，对于框架的开发或者组件库的开发比较方便。

每一个包中都有一个`package.json`和`node-modules`

### monorepo 的解决方案 yarn workspaces

目前常见的monorepo解决方案是使用`yarn`的`workspaces`特性。

只需要在根目录下的`package.json`中设置`"private": true,`，并且设置`workspaces`指定的目录，yarn就会以monorepo的方式管理项目。一般我们简称`workspaces`为`工作区`

例如，我们来看看Vue3的根目录下的`package.json`：

![vue3 yarn workspaces](https://user-images.githubusercontent.com/19791710/95672436-5e1e9680-0bd3-11eb-9fcf-902cbba9afd6.png)

#### yarn workspaces 的使用

- 给工作区中所有的包都安装相同的依赖，到根目录下的node_modules中
  - yarn add 包名 -D -W

- 给指定的工作区安装依赖
  - yarn workspace 工作区名 add 包名
- **备注：工作区名指的是，包当中的`package.json`中的name，例如，packages文件夹下有一个名为`button`的文件夹，表示这是一个需要发布到npm的一个模块或者一个包，其中在这个`button`文件夹下有一个`package.json`,这里的工作区名指的是这个`package.json`中的`name`**
  
- 给每个工作区执行命令
  - yarn workspaces run 命令

- 显示当前项目的工作区依赖关系
  - yarn workspaces info

- 给所有的工作区安装依赖
  - yarn install

### lerna

`lerna`是一个`babel`自己维护自己的monorepo项目所开源出来的一个工具。它优化了使用git和npm管理多包存储库的工作流，用于管理具有多个包的JavaScript项目，它还可以一键把代码提交到git和npm仓库。

`lerna`也是一种monorepo的解决方案，对于node_modules包重复安装的问题，lerna提供了`--hoist选项`，相同的依赖，会「提升」到 repo 根目录下安装，但……太鸡肋了。目前社区大部分的方案还是使用yarn workspaces。

我们可以使用`lerna`工具来统一发布所有的工作区。

要使用lerna，首先需要全局安装

```shell
yarn global add lerna
```

安装成功后，到项目根目录下，初始化`lerna`，输入：

```shell
lerna init
```

如果当前项目没有被git管理，那么此时，`lerna`在初始化的时候，会帮你创建一个本地的git仓库，并且会生成`packages/`、`package.json`、`lerna.json`。如果有了指定目录或者文件，那么就不会再继续生成。

接下来，打开`lerna.json`来看看，这个文件是`lerna`的配置文件，

```json
{
  "packages": [
    "packages/*"
  ],
  "version": "0.0.0"
}
```

这个文件中记录了当前项目的初始化的版本，以及要管理的包的路径，这里的路径默认是`packages`文件夹下的所有的目录，如果当前目录下没有`packages`这个目录，它会自动创建的。

`lerna`在初始化的时候，也在根目录下的`package.json`中添加了`lerna`的开发依赖。

```json
"lerna": "^3.22.1"
```

#### monoreps 发布

使用命令`lerna publish`对所有的包统一发布。

有几个需要注意的地方：

- 首先在项目根目录下输入`npm whoami`来确定是否登录，如果登录会显示用户名，如果没有登录，输入`npm adduser`进行登录，按照要求依次输入Username`、`Password`、`Email

- 还需要确定，npm源一定要是官方源，不能是淘宝源。使用`npm config set registry https://registry.npmjs.org/ `切换回官方源。

- 如果在发布的时候，提示发布失败的情况，如果是提示的错误中包含了`registry.npm.taobao.org`等字眼，说明没有切换到官方源，但是你已经切换成了官方源了，还提示这个错误的话，可以输入以下命令，重新进行发布。

  `npm login --registry http://registry.npmjs.org`

  `npm publish --registry http://registry.npmjs.org`

