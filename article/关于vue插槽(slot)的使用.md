最近在做公司业务，在封装一个公用的弹框，就用到了插槽，但是插槽好久没用了，就忘记了它是怎么用的，写一篇笔记来记录一下它的用法。

### 插槽是什么

一个公共组件为了满足不同业务场景下的业务需求，可以使用插槽最大化的实现组件公用。可以理解为“占坑”，当我们需要使用的时候去“补坑”。

### 插槽内容、后备（默认）内容

先来看看基本使用：

child.vue 子组件

```vue
<template>
  <div>
    <slot></slot>
  </div>
</template>
```

index.vue 父组件

```vue
<template>
  <div class="home">
    <child>
      这里可以是文本
      <div>也可以是任意的html</div>
      <!-- 也可以是其他的组件 -->
      <other-components />
      <!-- 这里可以使用当前组件的 data 数据 -->
      <div>{{message}}</div>
    </child>
  </div>
</template>
```

渲染后：

```html
<div data-v-078753dd class="home">
  <div>
    这里可以是文本
    <div>也可以是任意的html</div>
    <div data-v-078753sd>也可以是其他的组件</div>
  </div>
</div>
```

**也可以设置一个默认的内容，简称后备内容，或者默认内容**

child.vue 子组件

```vue
<template>
  <div>
    <slot>
      <div>默认内容</div>
    </slot>
  </div>
</template>
```

index.vue 父组件

```vue
<template>
  <div class="home">
    <child />
  </div>
</template>
```

渲染后：

```html
<div data-v-078753dd class="home">
  <div>
    <div>默认内容</div>
  </div>
</div>
```



### 具名插槽、具名插槽缩写

有时候，一个公共组件里面需要有多个“坑位”，不同的父组件调用就使用不同的“坑位”，例如对于一个带有如下模板的组件：

```html
<template>
  <div class="container">
    <header>
    <!-- 我们希望把页头放这里 -->
    </header>
    <main>
    <!-- 我们希望把主要内容放这里 -->
    </main>
    <footer>
    <!-- 我们希望把页脚放这里 -->
    </footer>
  </div>
</template>
```

对于这种情况，我们可以使用具名插槽。`<slot>`标签有一个特殊的属性：`name`，这个`name`就是用来定义“坑位”的名字的。**注意：如果不写`name`的话，会默认是一个`default`**

然后，在父组件，要使用“坑位”的话，就带上指定的`name`。如果没有带上`name`，会使用默认的“坑位”。

child.vue 子组件

```vue
<template>
  <div class="container">
    <header>
      <!-- 我们希望把页头放这里 -->
      <slot name="header" />
    </header>
    <main>
      <!-- 我们希望把主要内容放这里 -->
      <slot />     <!-- 等价于  <slot name="default" /> -->
    </main>
    <footer>
      <!-- 我们希望把页脚放这里 -->
      <slot name="footer" />
    </footer>
  </div>
</template>
```

index.vue 父组件

在向具名插槽提供内容的时候，我们可以在`<template>`元素上使用`v-slot`指令，并以参数的形式提供其名称，如下：

```vue
<template>
  <div class="home">
    <child>
      <template v-slot:header>
        <p>header</p>
      </template>
      <p>default</p>
      <template v-slot:footer>
        <p>footer</p>
      </template>
    </child>
  </div>
</template>
```

渲染后：

```html
<div data-v-078753dd class="home">
  <div class="container">
    <header>
      <p>header</p>
    </header>
    <main>
      <p>default</p>
    </main>
    <footer>
      <p>footer</p>
    </footer>
  </div>
</div>
```

**`v-slot` 和 `v-on`和`v-bind`一样也有缩写，即把参数之前的所有内容 (`v-slot:`) 替换为字符 `#`。例如 `v-slot:header` 可以被重写为 `#header`：**

index.vue

```vue
<template>
  <div class="home">
    <child>
      <template #header>
        <p>header</p>
      </template>
      <p>default</p>
      <template #footer>
        <p>footer</p>
      </template>
    </child>
  </div>
</template>
```

### 作用域插槽

插槽可以访问相同实例的属性（可以理解成当前组件的属性是可以访问的到的），但是，要访问子组件的实例属性，却是访问不到的。如果要让插槽中的内容也能访问子组件的数据，可以给子组件添加绑定一个属性：

child.vue 子组件

```vue
<template>
  <div class="container">
    <header>
      <!-- 我们希望把页头放这里 -->
      <!-- <slot name="header" /> -->
      <slot name="header" :user="user" />
    </header>
    <main>
      <!-- 我们希望把主要内容放这里 -->
      <slot />     <!-- 等价于  <slot name="default" /> -->
    </main>
    <footer>
      <!-- 我们希望把页脚放这里 -->
      <slot name="footer" />
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        firstName: 'Fan',
        lastName: 'Jun'
      }
    }
  }
}
</script>
```

绑定在 `<slot>` 元素上的 attribute（属性） 被称为**插槽 prop**。

然后在父组件中可以使用**带值的 `v-slot`** 来定义我们提供的插槽 prop 的名字：

```vue
<template>
  <div class="home">
    <child>
      <!-- <template v-slot:header> -->
      <!-- 不简写的写法 -->
      <!-- <template v-slot:header="slotProps"> -->
      <!-- 简写的写法 -->
      <template #header="slotProps">
        <p>header</p>
        <p>数据：{{ slotProps }}</p>
      </template>
      <p>default</p>
      <template #footer>
        <p>footer</p>
      </template>
    </child>
  </div>
</template>
```





