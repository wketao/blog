最近公司项目有个需求，有一个列表页面，点击列表中的某一项进入到详情页面，详情页面点击返回后要返回到列表页面的原来的位置，并且是列表页面无刷新的，不在请求数据。

问题一、返回到列表页面，并且无刷新。

使用 keep-alive 缓存列表组件，这样就解决了不在重复请求的问题了。

记录下 kee-alive 的坑: 没详情看文档，一直以为 include 存的是路由的 name，实际上 include 这个参数匹配的是组件的 name，而不是路由的 name。

App.vue:

```jsx
<template>
  <div id="app">
    <keep-alive :include="aliveComponents">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 需要keep-alive的组件,存的是组件的name，而不是路由的name
      aliveComponents: ["page1", "page2"]
    };
  }
};
</script>
```

page1.vue:

```jsx
<template>
  <div class="page1" style="padding:20px">
    <div
      style="border: 1px solid #cecece;padding: 10px;margin-bottom:10px"
      v-for="i in 20"
      :key="i"
    >
      <router-link to="/page2">{{i}}、{{Math.random()}}</router-link>
    </div>
    <router-link to="/page2">page to page2</router-link>
  </div>
</template>

<script>
export default {
  name: "page1",

  created() {
    console.log("page1");
  },

  mounted() {}
};
</script>
```

page2.vue:

```jsx
<template>
  <div class="page2">
    <p>page2</p>
    <router-link to="/page1">page to page2</router-link>
  </div>
</template>

<script>
export default {
  name: "page2",
  created() {
    console.log("page2");
  }
};
</script>
```

问题二、详情页面点击返回后要返回到列表页面的原来的位置。

想法是当离开了列表页面，进入到详情页面时，在路由守卫记录下列表页面的滚动高度，存到 vuex。

我这里为了做 demo，把滚动条高度存到了 localStorage，而且代码会相对简陋。

```jsx
import router from "./router/";

router.beforeEach((to, from, next) => {
  // 如果目标路由是详情页面，并且离开的路由是列表页面，那么记录下当前的列表页面的滚动条高度
  if (to.name === "page2" && from.name === "page1") {
    const scrollTop = document.querySelector("#app").scrollTop;
    localStorage.setItem("scrollTop", scrollTop);
  }
  // 如果不是，那么设置容器app的滚动条高度。
  // 加个setTimeout定时器的原因是想让线程往后执行，因为当前路由还没进入到page1，缓存的组件还未被激活，设置的滚动是无效的。
  else {
    const scrollTop = localStorage.getItem("scrollTop");
    setTimeout(() => {
      document.querySelector("#app").scrollTop = scrollTop;
      localStorage.removeItem("scrollTop");
    }, 0);
  }
  //...
  next();
});
```

效果图如下：

![很模糊的gif图](https://user-images.githubusercontent.com/19338152/81415124-97615f00-917a-11ea-88af-6208f4822a14.gif)
