目前主流的浏览器都兼容 `ES Module` 了，但是，可恶的 `IE` 在最新的版本中还不支持，为了兼容，我们可以通过下面这个三个包来解决，主要的代码如下：

**Index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>ES Module 浏览器环境 Polyfill</title>
  </head>

  <body>
    <!-- 
        引用下面这三个包，解决浏览器对 ES Module 的兼容
        最新的ie还是不兼容 prmise 要引入 promise-polyfill 这个插件来兼容
        然后要引入下面两个包就可可以了
        思路是：browser-es-module-loader 会去读取 ES Module 的代码，然后通过babel去转换

        如果在支持 ES Module 的浏览器中，代码会被执行两次，我们可以在 script 标签上，加一个 nomodule 来表示，只在不支持 ES Module 的浏览器上加载下面的这三个包
     -->
    <script
      nomodule
      src="https://unpkg.com/promise-polyfill@8.1.3/dist/polyfill.min.js"
    ></script>
    <script
      nomodule
      src="https://unpkg.com/browser-es-module-loader@0.4.1/dist/babel-browser-build.js"
    ></script>
    <script
      nomodule
      src="https://unpkg.com/browser-es-module-loader@0.4.1/dist/browser-es-module-loader.js"
    ></script>
    <script type="module">
      import { foo } from "./module.js";
      console.log(foo);
    </script>
  </body>
</html>
```

**module.js**

```javascript
export var foo = "bar";
```

**这种方案，只适合在开发阶段使用。在生产阶段不要使用这种方案，因为它的原理都是在运行阶段动态的解析脚本，那效率会非常的差！！！在生产阶段，我们应该预先把这些代码编译好，让这些代码可以直接在浏览器上工作。**
