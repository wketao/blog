### 1、Vue3.0 源码组织方式

#### 1.1、源码组织方式的变化

`Vue3.0` 的源码全部采用了`TypeScript`进行了重写，项目的组织方式也发生了变化，全部采用了 `monorepo` 的方式来组织项目的结构，把独立的功能模块都提取到了不同的包中。

#### 1.2、Composition API

虽然 `Vue3.0` 的代码进行了重写，但是大部分的 api 都支持了 vue2.x。并且根据社区的反馈，添加了`Composition API`，翻译过来就是“组合 API”，`Composition API`是用来解决`Vue2.x`在开发大型项目时遇到超大组件，使用`Options API`不好拆分和重用的问题。

#### 1.3、性能提升

在性能方面，Vue3.0 有大幅度的性能提升，Vue3.0 中使用了`proxy`重写了响应式代码，并且对编译器做了优化，重写了虚拟 dom，从而让渲染和`update`的性能都有了大幅度的提升。另外，官方介绍，服务端渲染的性能也提升了 2-3 倍

#### 1.4、Vite

随着 `Vue3.0` 的发布，官方也发布了一个开发工具：`Vite`，一个基于`ES import`的开发服务器。使用`Vite`在开发阶段测试项目的时候，不需要打包可以直接运行项目，服务随启随用，提高了开发的效率。

### 2、Vue3.0 packages 目录结构

packages 目录下的包都是可独立发行、可独立使用的包。

- compiler 开头的包都是和编译相关的代码。
- runtime 开头的包都是运行时相关的代码。

```
└── packages ············································ packages 目录
   ├─ compiler-core ····································· 和平台无关的编译器
   ├─ compiler-dom ······································ 浏览器平台下的编译器，依赖于compiler-core
   ├─ compiler-sfc ······································ sfc是单文件组件的意思，用于编译单文件组件，依赖于compiler-core、compiler-dom
   ├─ compiler-ssr ······································ 服务端渲染的编译器，依赖于compiler-dom
   ├─ reactivity ········································ 数据响应式系统，它可以独立使用
   ├─ runtime-core ······································ 和平台无关的运行时
   ├─ runtime-dom ······································· 针对浏览器的运行时，它处理原生dom api、以及事件等等
   ├─ runtime-test ······································ 一个专门为测试而编写的轻量级运行时，由于这个运行时渲染出来的dom树其实是一个js对象，所以这个运行时可以运行在所有的js环境里。可以用来测试渲染是否正确，它还可以用于序列化dom、触发dom事件，以及记录某次更新中的dom操作
   ├─ server-renderer ··································· 用于服务端渲染
   ├─ shared ············································ vue内部使用的一些公共api
   ├─ size-check ········································ 是一个私有的包，不会发布到npm，作用是，tree shaking之后检查包的大小
   ├─ template-explorer ································· 在浏览器运行的时时编译组件，它会输出render函数，这个包readme中提供了线上访问地址
   ├─ vue ··············································· 用来构建完整版本的vue，依赖于compiler和runtime

```

### 3、不同的构建版本

`Vue3.0` 中不在构建 UMD 模块化的方式，因为 UMD 会让代码有更多的冗余，它要支持多种模块化的方式。`Vue3.0` 中将 CJS、ESModule 和自执行函数分别打包到不同的文件中。在 packages/vue 中有 `Vue3.0` 的不同构建版本。

一共分为四类：

- cjs（两个版本都是完整版本，包含了编译器）
  - vue.cjs.js（开发版本，代码没有被压缩）
  - Vue.cjs.prod.js（生产版本，代码被压缩了）
- global（这四个文件都可以在浏览器中通过 script 标签中导入，导入后会添加一个全局的 vue 对象）
  - vue.global.js（完整版的 vue，包含编译器和运行时，是开发版本，代码没有压缩）
  - vue.global.prod.js（完整版的 vue，包含编译器和运行时，是生产版本，代码被压缩了）
  - vue.runtime.global.js（只包含了运行时的构建版本，是开发版本，代码没有压缩）
  - vue.runtime.global.prod.js（只包含了运行时的构建版本，是生产版本，代码被压缩了）
- browser（这四个版本都使用 ESModule 的方式，浏览器的原生模块化方式，在浏览器中可以直接通过`<script type="module" />`的方式来导入模块）
  - vue.esm-browser.js
  - vue.esm-browser.prod.js
  - vue.runtime.esm-browser.js
  - vue.runtime.esm-browser.prod.js
- bundler（这两个版本没有打包所有的代码，只会打包使用到的代码，需要配合打包工具来使用，会让 vue 代码体积更小）
  - vue.esm-bundler.js
  - bue.runtime.esm-bundler.js

### 4、Composition Api 的设计动机

#### 4.1、Options API 是什么

`Vue2.x` 使用的是 Options API。Options API 包含了一个描述组件选项（data、methods、props 等）的对象。

#### 4.2、Composition API 是什么

它是 vue3.0 中新增的一组 API，一组基于函数的 API，可以更加灵活的组织组件的逻辑。

#### 4.3、Composition API 对比与 Options API 的好处

在开发一些复杂组件的时候，里面有很多非常复杂的逻辑或者有很多交互等等之类的，看代码的时候，就要滚动条拖来拖去，有时候业务可能会很跳跃，这时候就会有点混乱，而且复用率很低。虽然可以使用 mixins 可以实现复用的问题，但是使用 mixins 也会有一些个问题，第一个：命名的问题，可能会与当前组件命名重复。第二个：数据来源不明确。

如果用 Composition API 的话，就可以把公共的函数封装在一起，在需要用的地方导出，然后在组件中 setup 进去。

这个很有用啊，记得之前公司业务有一个部门人员组织架构树组件，里面有一些业务，不同的模块业务都有一些细微的差别，如果使用 Composition API 来写的话，维护起来会更加舒服。

我们再来看看下面的这张图，来感受一下 Options API 和 Composition API 的区别。

[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-HAYUPKDC-1604850238437)(https://user-images.githubusercontent.com/499550/62783026-810e6180-ba89-11e9-8774-e7771c8095d6.png)]

打个比方：同一个色块的代码，代表着同一个功能。

我们先来看看 Options API，绿色的代码块，它有三部分，它被拆分到了不同的位置，当组件的功能比较复杂的时候，我们可能需要不停的拖动滚动条来找到我们需要的代码，而且不方便提取重用的代码。

那 Composition API 这边，我们可以清晰地看到，同一个功能的代码不需要拆分，有利于对代码的提取和重用，绿色这一块代表着是一个逻辑功能，可以把这一块的代码提取到一个模块中，然后在其他的组件中可以重用。

需要注意的是：在 vue3 中，以上两种 API 都可以使用。

学习`Composition API`最好方式，就是查阅官方的`RFC`，`RFC`的全称是`Request For Comments`，`Vue2` 升级到 `Vue3.0` 大的变动都是通过 RFC 进行确认的。这个 RFC 就是官网结合 vue2.x 中的问题以及其周围生态的一些问题（例如：vue-router、vuex 等等），给出一些提案，然后收集社区的反馈并且讨论最终确认。RFC 官方地址：[https://github.com/vuejs/rfcs](https://github.com/vuejs/rfcs)。

Composition API RFC 文档地址：[https://composition-api.vuejs.org/zh/](https://composition-api.vuejs.org/zh/)。文档中介绍了 Composition API 的使用。

### 5、性能的提升

vue3 中的性能提升可以从以下的几个方面来分析

#### 5.1、响应式系统的升级

`Vue2.x` 中的响应式核心使用的是 defineProperty，在组件初始化的时候，需要遍历所有的属性，转换成 getter 和 setter，如果属性是 Object 类型，也要遍历。

而 Vu3 中的响应式使用的是 es6 中的 Proxy 对象，Proxy 的性能会 defineProperty 快很多，另外代理对象可以拦截属性的访问、赋值、删除等操作，不需要初始化的时候遍历所有的属性，另外当某个属性是 Object 类型的时候，只有访问到某个属性的时候，才会递归处理下一级的属性。使用 Proxy 的好处：

- 可监听动态新增的属性
- 可以监听删除的属性
- 可以监听数组的索引和 length 属性

#### 5.2、编译优化

- Vue.js 2.x 中通过标记静态根节点，优化 diff 的过程

- Vue.js 3.0 中标记和提升所有的静态根节点，diff 的时候只需要对比动态节点内容

  - Fragments (升级 vetur 插件)：

    片段特性，组件模板中不在需要创建一个唯一的根节点，这一点和 react 很像啊。模板里面不需要放文本内容，或者多个同级标签。注意：需要升级 vetur 插件，不然它还是会报红的。

  - 静态提升（hoistStatic）

    来看看下面的代码：

    ```html
    <template>
      <div id="app">
        <div>
          static root
          <div>static node</div>
        </div>
        <div>static node</div>
        <div>static node</div>
        <div>static node</div>
        <div :id="id">{{ count }}</div>
      </div>
    </template>
   ```

    有几处代码静态节点（没有数据或者事件绑定的节点），编译后会提升到 render 函数的外面，这些静态节点只有在初始化的时候被创建一次，当再次调用的时候，就不需要再次创建这些静态节点了。

  - Patch flag（标记）

    将来在执行 diff 的时候，会检查 render 里面所有带 Patch flag 的节点，静态节点就直接跳过了，在对比动态节点的时候，根据标记，只会对比指定的类型，比如说“1”就值对比 text 节点。

    并且还记录了动态绑定的属性名称是什么，那将来 diff 的时候只会检查这个动态节点指定的标记。例如：

    ```vue
    <div :id="id">{{ count }}</div>
    ```

    这个 div 只会对比 text 节点和 id 属性，其他的就不会检查。

  - 缓存事件处理函数（cacheHandlers）

#### 5.3、源码体积优化

通过优化源码的体积和更好的 TreeShaking 的支持，减少大打包的体积

- Vue.js 3.0 中移除了一些不常用的 API
  - 例如：inline-template、filter 等
- Tree-shaking
  - 例如：Vue3 中的没用到的模块不会被打包，但是核心模块会打包。Keep-Alive、transition 等都是按需引入的。

### 6、Vite

`Vite`，一个基于`ES import`的开发服务器。使用`Vite`在开发阶段测试项目的时候，不需要打包可以直接运行项目，服务随启随用，提高了开发的效率

#### 6.1、Vite as Vue-CLI

- Vite 在开发模式下不需要打包可以直接运行
- Vue-Cli 开发模式下必须对项目打包才可以运行

#### 6.2、Vite 的特点

- 快速冷启动
- 按需编译
- 模块热更新
- Vite 在生产环境下使用 Rollup 打包
- 基于 ES Module 的方式打包
- Vue-Cli 使用 Webpack 打包

#### 6.3、Vite 创建项目

```shell
 npm init vite-app <project-name>
```

基于模板创建项目

```shell
npm init vite-app --template react
```