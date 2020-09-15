**## 使用 plop 模板生成工具，自动生成基础模板**

在平时的开发中，要经常创建文件，以 vue 为例，要创建.vue 文件，.vue 文件里面又要写\<template\>、\<script\>、\<style\> 很繁琐，可以使用 plop 来帮助我们自动生成模板

**### 安装**

按照[官方文档](https://github.com/plopjs/plop#installation)，在项目控制台中输入:

```
$ npm install --save-dev plop 
```

或者

```
$ yarn add plop --dev
```

安装完成后，在项目根目录下新建一个 `plopfile.js` 文件，这个文件是 plop 的执行入口文件。

在 `plopfile.js` 中，需要导出一个函数，使用 CJS 的语法：

```javascript
module.exports = function (plop) {

}
```

**## setGenerator**

这个方法是官方提供的注册事件的方法，官方也不止提供了这一个，但是我只用到这个呢。

主要用法如下：

```javascript
module.exports = function (plop) {
  plop.setGenerator("view", {// 这里 description 字段是自定义的名字
    description: "new-view", // 对该功能的描述
    // 向控制台发出给用户的提问
    prompts: [
      {
        type: "input", // 交互类型，input:输入类型
        name: "name",  // 问题对应得到答案的变量名，可以在actions中使用该变量
        message: "view name please", // 在命令行中给于客户的提示
      },
      {
        type: "checkbox",
        name: "blocks",
        message: "Blocks:",
        choices: [
          {
            name: "<template>",
            value: "template",
            checked: true,
          },
          {
            name: "<script>",
            value: "script",
            checked: true,
          },
          {
            name: "style",
            value: "style",
            checked: true,
          },
        ],
        validate(value) {
          if (
            value.indexOf("script") === -1 &&
            value.indexOf("template") === -1
          ) {
            return "View require at least a <script> or <template> tag.";
          }
          return true;
        },
      },
    ],
    actions: (data) => {
      const name = "{{name}}";
      const actions = [
        {
          type: "add",  // 操作类型，这里是添加文件
          path: `views/${name}/index.vue`,  // 添加的文件的路径
          templateFile: "plop-templates/view/index.hbs", // 模板文件的路径
          data: { // 变量数据
            name: name,
            template: data.blocks.includes("template"),
            script: data.blocks.includes("script"),
            style: data.blocks.includes("style"),
          },
        },
      ];
      return actions;
    },
  });
};
```

