### setup

setup 会在组件创建实例，初始化`props`后，马上被调用，如果从生命周期的角度看，它会在`beforeCreate`钩子前调用。

`setup`返回一个对象或者返回一个函数。

如果是返回一个对象，那么这个对象的所有的属性会被合并到当前模板的渲染上下文。

如果是返回一个函数，函数中也能使用当前 `setup` 函数作用域中的响应式数据，经过实验发现，`setup`返回的`vnode`会覆盖当前 `template` 中的所有的节点。

setup 它有两个参数：

- `props`： 组件参数，需要注意的是：
  - `props`是响应式的，不要进行结构，结构后的数据就不是响应式的了。
  - `watchEffect` 和 `watch` 会监听和响应`props`的更新。
- `context`：上下文对象，可进行结构其中包含以下属性
  - `attrs`
  - `emit`
  - `slots`

```html
<template>
  <h2>setup</h2>
  <p>props name:{{ name }}</p>
  <p>{{ object.foo }}</p>
  <slot />
</template>
<script>
import { h, ref, reactive, watchEffect } from "vue";
export default {
  props: {
    name: String,
  },

  /**
   * setup返回一个对象，这个对象的所有属性会被到当前组件模板
   * 它有两个参数，
   * 第一个是 props
   * 第二个是 content 上下文对象(attrs,emit,slots)
   * 注意 props 对象是响应式的，watchEffect 或 watch 会观察和响应 props 的更新：
   * 然而不要解构 props 对象，那样会使其失去响应性：
   */
  setup(props, context) {
    console.log("context.attrs:", context.attrs);
    console.log("context.emit:", context.emit);
    console.log("context.slots:", context.slots);
    watchEffect(() => {
      console.log(`更新后的props.name: ${props.name}`);
    });

    return {
      count: ref(0),
      object: reactive({ foo: "bar" }),
    };
  },

  //   //   setup 也可以返回一个函数，函数中也能使用当前 setup 函数作用域中的响应式数据，经过实验发现，setup返回的vnode会覆盖当前 template 中的所有的节点。
  //   setup() {
  //     const count = ref(0);
  //     const object = reactive({ foo: "bar" });
  //     return () => h("div", [count.value, object.foo]);
  //   },
};
</script>
```

### reactive

接收一个普通对象返回一个响应式代理对象，等同于`vue2.x`中的`vue.observable()`

```html
<template>
  <p>{{ object.foo }}</p>
</template>

<script>
import { reactive } from "vue";
export default {
  setup() {
    const object = reactive({ foo: "bar" });
    return {
      object,
    };
  },
};
</script>
```

### ref

接收一个普通的值返回一个响应式且可改变的 ref 对象，ref 对象拥有一个指向内部值的单一属性 `.value`。

模板中访问：当 `ref` 作为渲染上下文的属性返回（即在`setup()`返回的对象中）并在模板中使用时，它会自动解套，无需在模板内额外书写` .value`

作为响应式对象的属性访问:当 `ref` 作为 `reactive` 对象的 `property` 被访问或修改时，也将自动解套 `value` 值，其行为类似普通属性：

注意当嵌套在 reactive `Object` 中时，`ref` 才会解套。从 `Array` 或者 `Map` 等原生集合类中访问 ref 时，不会自动解套。

```html
<template>
  <span>
    {{ count }}
  </span>
</template>
<script>
import { reactive, ref } from "vue";
const staticCount = ref(0);
export default {
  setup() {
    /**
     * ref
     * 接收一个普通的值返回一个响应式且可改变的ref对象，ref 对象拥有一个指向内部值的单一属性 .value。
     * 模板中访问:当 ref 作为渲染上下文的属性返回（即在setup() 返回的对象中）并在模板中使用时，它会自动解套，无需在模板内额外书写 .value
     * 作为响应式对象的属性访问:当 ref 作为 reactive 对象的 property 被访问或修改时，也将自动解套 value 值，其行为类似普通属性：
     * 注意当嵌套在 reactive Object 中时，ref 才会解套。从 Array 或者 Map 等原生集合类中访问 ref 时，不会自动解套
     */
    const count = ref(0);
    const array = reactive([ref(0)]);
    console.log(count.value); // 结果：0
    console.log(array[0].value); // 结果：0
    return {
      count,
      array,
    };
  },
};
</script>
```

### computed

有两种用法：

1、传入一个`getter`函数，返回一个不可修改的`ref`对象

2、传入一个拥有`get`和`set`函数的对象，返回一个可修改的状态（或者说 ref）

```html
<template>
  <p>{{ comput1 }}</p>
</template>

<script>
import { ref, computed } from "vue";
export default {
  setup() {
    const computCount = ref(100);
    const comput1 = computed(() => computCount.value * 3);
    const comput2 = computed({
      get: () => computCount.value * 2,
      set: (val) => {
        computCount.value = val;
      },
    });
    comput2.value = 300;
    console.log(comput2.value); // 结果：600
    return {
      comput1,
    };
  },
};
</script>
```

### watch

`watch`的用法和`vue2.x`一致。

- 第一个参数是侦听的数据源（一个拥有返回值的`getter`函数，也可以是`ref`）。
- 第二个参数是数据变化处理函数。
- 第三个参数是侦听选项，deep（深度监听）和 immediate（立即执行函数）。

`watch` 返回一个函数，用来取消监听。

```html
<template>
  {{ count }}
  <br />
  {{ obj.count }}
</template>

<script>
import { ref, reactive, watch } from "vue";
export default {
  setup() {
    const count = ref(0),
      obj = reactive({ count: 10 });

    // //侦听单个数据源
    // watch(count, (newVal, oldVal) => {
    //   console.log("newVal:", newVal);
    //   console.log("oldVal:", oldVal);
    // });
    // setTimeout(() => {
    //   count.value++;
    // }, 1000);

    //侦听多个数据源
    const stopWatch = watch(
      [count, obj],
      ([newCount, newObj], [oldCount, oldObj]) => {
        debugger;
        console.log(`newCount: ${newCount}`);
        console.log(`newObj: ${newObj}`);
        console.log(`newObj.count: ${newObj.count}`);
        console.log(`oldCount: ${oldCount}`);
        console.log(`oldObj: ${oldObj}`);
        console.log(`oldObj.count: ${oldObj.count}`);
      },
      //深度监听，
      {
        deep: true,
      }
    );

    setTimeout(() => {
      count.value++;
      obj.count++;
    }, 1000);

    //会执行，但是不会进入到watch handler函数里面了
    setTimeout(() => {
      count.value++;
      obj.count++;
      stopWatch(); // 取消监听
    }, 2000);

    return {
      count,
      obj,
    };
  },
};
</script>
```

### watchEffect

`watchEffect`其内部的代码和`watch`是一样的，不同的是，`watchEffect`它会立即执行，并且他会侦听`setup`中所有的发生变化的数据（不管数据源是否是响应式的），`watchEffect`和`watch`一样，它的返回值也是一个函数，用来停止侦听。

```html
<script>
import { ref, reactive, watchEffect } from "vue";
export default {
  setup() {
    const count = ref(0),
      obj = reactive({ count: 10 });
    let test = 100;
    watchEffect((a) =>
      console.log("watchEffect 追踪依赖:", count.value, obj.count, test)
    );
    setTimeout(() => {
      count.value++;
      obj.count++;
      test++;
    }, 1000);
  },
};
</script>
```

关于`watchEffect`更多的信息，查看官方文档：[https://composition-api.vuejs.org/zh/api.html#watcheffect](https://composition-api.vuejs.org/zh/api.html#watcheffect)

### 生命周期

这里说的生命周期，是 `Vue3.0` 中的`Composition API`生命周期。

可以直接导入 `onXXX` 一族的函数来注册生命周期钩子

需要注意的是：原本的生命周期中的`destroy`对应的是`onUnmounted`。

`Composition API`也新增了两个钩子用于调试的钩子函数，这两个钩子函数都接收一个`DebuggerEvent`调试事件参数：

- `onRenderTracked`
- `onRenderTriggered`

```html
<template>
  {{ count }}
</template>

<script>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onRenderTracked,
  onRenderTriggered,
} from "vue";
export default {
  setup() {
    console.log("初始化");
    const count = ref(0);

    onBeforeMount(() => {
      console.log("挂载前");
    });
    onMounted(() => {
      console.log("挂载时");
    });
    onBeforeUpdate(() => {
      console.log("更新前");
    });
    onUpdated(() => {
      console.log("更新时");
    });
    onBeforeUnmount(() => {
      console.log("摧毁前");
    });
    onUnmounted(() => {
      console.log("摧毁后");
    });
    onRenderTracked((e) => {
      console.log(e);
    });
    onRenderTriggered((e) => {
      console.log(e);
    });

    setTimeout(() => {
      count.value++;
    }, 1000);

    return { count };
  },
};
</script>
```

### 参考资料：

[Vue 组合式 API](https://composition-api.vuejs.org/zh/)