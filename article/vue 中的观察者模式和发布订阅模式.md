# 观察者模式是什么？

观察者模式是对象中的一种一对多的依赖关系，当对应的状态发生改变时，执行相应的更新。

观察者模式有两个概念，分别是：

- 目标（发布者），`发布者`它会记录所有的`订阅者`，当状态发生改变时，由`发布者`通知`订阅者`
- 观察者（订阅者） 所有的订阅者都有一个`update`方法，这个方法是用于处理状态发生改变时的业务。

**Vue 响应机制中使用了观察者模式，在 vue 响应机制中，当数据变化的时候会调用观察者的 update 方法，update 方法内部就是更新视图**

在观察者模式中，订阅者的 update 方法是由发布者调用的。

# 实现一个简单的观察者模式

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>观察者模式</title>
  </head>

  <body>
    <script>
      // 目标-发布者
      class Dep {
        constructor() {
          this.subs = [];
        }
        // 添加观察者
        addSub(sub) {
          if (sub && sub.update) {
            this.subs.push(sub);
          }
        }
        // 通知观察者
        notify() {
          this.subs.forEach((sub) => {
            sub.update();
          });
        }
      }

      // 观察者-订阅
      class Watcher {
        update() {
          console.log("update");
        }
      }

      let dep = new Dep();
      let watcher = new Watcher();
      dep.addSub(watcher);
      dep.notify();
    </script>
  </body>
</html>
```

# 发布订阅模式是什么？

发布订阅模式是对象中的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖与它的对象都将得到状态改变的通知。

发布定于模式有三个概念，分别是：

- 订阅者，订阅者的作用是：向调度中心注册一个事件，这个事件的作用是处理状态改变后的业务。
- 发布者，发布者的作用是：向调度中心发起一个状态改变的通知。
- 调度中心，调度中心的作用是：将发布者状态改变时向调度中心发送的通知，告知给订阅者。

看似很陌生，其实在工作中经常会用到。例如:

- node.js 中 EventEmitter 中的 `on` 和 `emit`
- vue.js 中的 `$on` 和 `$emit`

**他们都使用了发布订阅模式**

# 例子

我们就拿微信公众号来举例子，我们很喜欢一个公众号的文章，但是我们不知道这个公众号什么时候发布文章，要不定时的去翻一翻。这个时候我们可以订阅这个公众号，每当这个公众号发布了新的文章的时候，我们就会收到通知。

**这个例子中的发布者就是当前这个`公众号`，我们就是`订阅者`，微信就是`调度中心`**

# 实现一个简单的发布订阅模式

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>发布订阅模式</title>
  </head>

  <body></body>
</html>

<script>
  class EventEmitter {
    constructor() {
      //设置对象的原型
      // { 'click': [fn1, fn2], 'change': [fn] }
      this.subs = Object.create(null);
    }
    // 注册事件
    $on(eventType, handler) {
      this.subs[eventType] = this.subs[eventType] || [];
      this.subs[eventType].push(handler);
    }
    // 触发事件
    $emit(eventType) {
      if (this.subs[eventType]) {
        this.subs[eventType].forEach((handler) => {
          handler();
        });
      }
    }
  }
</script>

<script>
  // 调度中心
  let dispatch = new EventEmitter();

  // 注册事件(订阅消息) ，当调度中心有新的信息过来的时候，会触发相对应的函数
  dispatch.$on("dataChange", () => {
    console.log("dataChange");
  });

  dispatch.$on("dataChange", () => {
    console.log("dataChange1");
  });
  // 触发事件(发布消息)，向调度中心发布信息
  dispatch.$emit("dataChange");
</script>
```

# 发布者模式和观察者模式的区别

## 相同点：

都是对象中的一种一对多的依赖关系，当对应的状态发生改变时，执行相应的更新。

## 不同点：

1、发布者模式有调度中心，观察者模式没有调度中心。
2、发布者模式的更新是由调度中心发起的，而观察者模式的更新是由目标（订阅者）发起的
3、发布者模式，双方并不知道对方的存在，而观察者模式是必须要知道的，基础自定义事件。
4、发布者模式是低耦合的，而观察者是高耦合的。

使用场景：
观察者模式：vue 依赖追踪、原生事件
发布订阅模式：vue 的组件之间的通信 EeventBus，react 合成事件

下面的文章讲的很清楚，可以具体看看：

https://www.jianshu.com/p/594f018b68e7

https://www.cnblogs.com/liuhp/p/12221144.html
