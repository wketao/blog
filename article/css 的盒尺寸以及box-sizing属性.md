## css 的盒尺寸以及box-sizing属性

### 盒尺寸的4个盒子

盒尺寸分别由4个盒子组成，分别是 `content-box`、`border-box`、`padding-box`、`margin-box`，分别对应着以下几种情况

![CSS box-model](https://www.runoob.com/images/box-model.gif)

其中，`margin-box `是最惨的，全线不支持，`padding-box`曾经火狐支持过。最常用的就是`content-box`和`border-box`了

用法如下：

```css
.box1 { box-sizing: content-box }
.box2 { box-sizing: border-box }
```

### `box-sizing`的用法以及`content-box`和`border-box`之间的差异

`box-sizing`最主要的用法主要是规定容器元素最终的计算方式。

比如说，你定义了一个div，并且设置了**width: 100px; height: 120px; border: 10px solid red;padding: 20px**，如果你**没有**把`box-sizing`设置成`border-box`，那么会默认是`content-box`，那么这个div元素最终的宽高分别是：

宽度：内容宽度 + 左右内边距 + 左右边框 

```
100px(width)+2*20px*(padding)+2*10px(border)=160px
```

高度：内容高度 + 上下内边距 + 上下边框 

```
120px(height)+2*20px*(padding)+2*10px(border)=180px
```

所以，你会得到一个比你预期要大的容器。

**如果，你设置了`box-sizing`:`border-box`，那么其容器的宽度和高度始终都是100px，那么他的内容宽高分别就是：**

宽度：内容宽度 - 左右内边距 - 左右边框 

```
100px(width)-2*20px*(padding)-2*10px(border)=40px
```

高度：内容高度 - 上下内边距 +、- 上下边框 

```
120px(height)-2*20px*(padding)-2*10px(border)=60px
```

所以，你会得到一个和你预期差不多的一个容器，只是它的内容区域会被压缩而已。

### 其他废话：

border-box IE8 才开始支持

boostrap从3开始，往后的版本都设置了 * {    box-sizing: border-box }

合理利用好这个属性，会对于整体布局而言益处颇多。

