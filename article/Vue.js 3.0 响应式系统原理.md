# 介绍与回顾

vue.js 响应式回顾

- Proxy 对象实现属性监听
- 多层属性嵌套，在访问属性过程中处理下一层属性
- 默认监听动态添加的属性
- 默认监听属性的删除操作
- 默认监听数组的索引和 length 属性
- 可以作为单独的模块使用

核心方法(模拟实现以下方法)

- reactive/ref/roRefs/computed
- effect
- track
- trigger

# Proxy 对象的回顾

待续~

# 模拟 reactive 的实现

**reactive**

- 接收一个参数，判断这个参数是否是对象，如果不是直接返回。reactive 只能把对象转换成响应式对象
- 创建拦截器对象 `handler`, 设置 `get/set/deleteProperty`
- 返回 `Proxy` 对象

模拟实现 reactive

```javascript
/**
 * 判断是否是对象
 * @param {object} val 代理对象
 */
const isObject = (val) => val !== null && typeof val === 'object'

/**
 * 用来判断Reflect.get获取到的值是否为对象
 * @param {object} target 代理对象
 */
const convert = (target) => (isObject(target) ? reactive(target) : target)

/**
 * 获取Object原型上的hasOwnProperty方法，方便与后期调用
 */
const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * 判断成员是否存在对象中
 * @param {object} target 代理对象
 * @param {string} key 成员名称
 */
const hasOwn = (target, key) => hasOwnProperty.call(target, key)

/**
 *
 * @param {object} target 需要代理的对象
 */
export function reactive(target) {
  // 判断 target上是否是对象
  if (!isObject(target)) return

  // 定义拦截器对象，该对象中包含get/set/deleteProperty
  const handler = {
    get(target, key, receiver) {
      // 收集依赖
      console.log('get', key)
      // 因为如果是获取到的key是对象的话，会在访问这个属性的时候处理下一层属性
      // 这里需要判断获取的“key”属性是否是object，如果是的话，还要调用reactive递归处理。
      // convert这个方法就是用来判断Reflect.get获取到的值是否为对象
      const result = Reflect.get(target, key, receiver)
      return convert(result)
    },
    set(target, key, value, receiver) {
      // 获取旧值，用于判断新值与旧值是否相同，如果相同，不做任何处理
      const oldValue = Reflect.get(target, key, receiver)
      // 定义一个布尔类型的变量，用于返回
      let result = true
      if (oldValue !== value) {
        result = Reflect.set(target, key, value, receiver)
        // 触发更新，后面会讲到
        console.log('set', key, value)
      }
      return result
    },
    deleteProperty(target, key) {
      // 用于接收，成员是否在对象中
      const hadKey = hasOwn(target, key)
      // 用于接收，Reflect.deleteProperty 会返回一个布尔类型的值，成功返回true，失败返回false
      const result = Reflect.deleteProperty(target, key)
      // 判断是否是该成员是否存在对象上，并且是否删除成功，如果都为true，触发更新
      if (hadKey && result) {
        // 触发更新，后面会讲到
        console.log('delete', key)
      }
      return result
    },
  }

  // 返回一个proxy对象
  return new Proxy(target, handler)
}
```

调用如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>
</html>
<script type="module">
  import { reactive } from './reactivity/index.js'
  const obj = reactive({
    name: 'zs',
    age: 18,
  })
  obj.name = 'lisi'
  delete obj.age
  console.log(obj)
</script>
```

输出结果如下：

> set name lisi
> index.js:64 delete age
> Proxy {name: Proxy}

# 收集依赖思路

在 `get` 中收集依赖，收集依赖就是存储当前的这个`属性`和`回调`，而`属性`又与对象相关，所以在代理对象中的 get 方法中，首先会存储 `target` 代理对象，然后是当前这个属性，然后是这个属性所在的`函数`（回调）

用一张图来梳理一下：

![收集依赖](https://img-blog.csdnimg.cn/20201115231305599.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDMzMjEz,size_16,color_FFFFFF,t_70#pic_center)

在依赖收集的时候，会创建三个集合，分别是 `targetMap(new WeakMap())`，`depsMap(new Map())`，`dep new Set()`

其中 `targetMap` 是用来记录目标对象和一个字典，这个字段也就是中间的这个 `depsMap`。`targetMap`使用的类型是 `WeakMap`，`弱引用`的 map。在 `targetMap` 中的 `key` 是目标对象，也就是我们的 `target` 对象。因为是`弱引用`，当目标对象失去引用之后可以销毁。

`targetMap` 的值是 `depsMap`，`depsMap` 又是一个字典，类型是 `map`，这个 `map` 中的 `key` 是目标对象中的 **属性名称**，值是一个`set`集合。

`set`集合中存储的元素不会重复，`set`中存储的是 `effect` 函数。因为我们可以多次调用一个 `effect` ，在 `effect` 中访问同一个属性，那么这个时候，这个属性会收集多次依赖，会有多个 `effect` 函数。

所以通过这种结构，可以存储目标对象，目标对象的属性，以及属性对应的 `effect` 函数。 那么一个属性可能对应的多个函数，那么将来触发更新的时候，我们可以来这个结构（ `dep` ）中，根据目标对象的属性，找到 `effect` 函数，然后执行。

收集依赖的思路总结：

> `track` 函数内部，它内部首先会根据当前的 `targetMap` 这个对象，来找到 `depsMap` ，如果没有找到的话，要给当前的目标对象创建一个 `depsMap` ，并且添加到 `targetMap` 中。如果找到了，在根据当前使用的属性，来 `depsMap` 中找到相对应的 `dep`，`dep` 中存储是 `effect` 函数。如果没有找到的话，会为当前的属性创建 `dep` ,并且存储到 `depsMap` 中。如果找到了当前属性的`dep`集合，那么就把当前 `effect` 函数存储到`dep` 中。

# effect and track 收集依赖

根据上图，我们来实现 `effect` 和 `track` 函数。

`effect` 是用于存储回调函数，到时候触发更新的时候，会调用到这个函数。代码如下：

```javascript
// 记录callback，用于track可返回callback函数
let activeEffect = null

/**
 * 收集依赖，这个主要是dep中的effect的回调函数，在触发更新时需要被调用
 * @param {Function} callback 回调函数
 */
export function effect(callback) {
  activeEffect = callback
  // 反问响应式对象属性，去收集依赖
  callback()
  // 设置为 null ，如果在收集依赖的话，有嵌套属性的话，需要递归处理
  activeEffect = null
}
```

`track` 是用于收集依赖，会去做相对应的 `targetMap`，`depsMap`，`dep` 的处理。代码如下：

```javascript
// 定义 targetMap
let targetMap = new WeakMap()

/**
 * 收集依赖
 * @param {object} target 目标对象
 * @param {string} key 属性
 */
export function track(target, key) {
  // 判断activeEffect是否存储，如果没有直接返回，说明当前没有被收集的依赖
  if (!activeEffect) return
  // 定义 depsMap ，需要寻找的字段，这个 depsMap 存储的是 key(目标对象的属性) 和 value（effect函数）
  let depsMap = targetMap.get(target)
  // 如果没有找到的话，要给当前的目标对象创建一个 depsMap ，并且添加到 targetMap 中。
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  // 定义 dep
  let dep = depsMap.get(key)
  // 如果没有找到当前属性的dep集合，要给当前的属性，所对应的 effect 函数存储到 dep 中。
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  // 如果找到了当前属性的dep集合，那么就把当前 effect 函数存储到dep 中。
  dep.add(activeEffect)
}
```

最后，别忘了，要在代理对象的 `get` 方法中，去调用一下 `track` 这个函数收集依赖

```javascript
  get(target, key, receiver) {
    // 收集依赖
    console.log('get', key)
    track(target, key)
    // ...
  },
```

# trigger 触发更新

我们需要在写一个函数，这个函数主要是用来触发更新的，思路是：根据目标对象（`target`）从 `targetMap` 中找到 `depsMap`，然后根据属性（`key`）找到 `dep`，获取到 `dep` 后，循环执行 `effect` 函数。备注：这个 `effect` 函数是在 `track` 收集依赖函数中 `add` 进去的。

代码如下：

```javascript
/**
 * 触发更新
 * @param {object} target 目标对象
 * @param {string} key 属性
 */
export function trigger(target, key) {
  // 获取 targetMap 中的目标对象
  const depsMap = targetMap.get(target)
  // 如果没有获取到，直接返回
  if (!depsMap) return
  // 如果获取到了，在根据属性名称，获取在depsMap中的effect函数集合
  const dep = depsMap.get(key)
  // 如果存在，循环调用effect函数
  if (dep) {
    dep.forEach((effect) => {
      effect()
    })
  }
}
```

最后，需要在代理对象中的 `set` 和 `deleteProperty` 中调用。

效果如下：

02-effect-demo.html：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module">
      'use strict'
      import { reactive, effect } from './reactivity/index.js'
      const product = reactive({
        name: 'iPhone',
        price: 5000,
        count: 3,
      })
      let total = 0
      effect(() => {
        total = product.price * product.count
      })
      console.log(total)

      product.price = 4000
      console.log(total)

      product.count = 1
      console.log(total)
    </script>
  </body>
</html>
```

输入结果如下：

> 15000
> 12000
> 4000

未完待续~
