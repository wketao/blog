## 一、flex 是什么？

flex 是 flexible box的简称，称为弹性布局。目前主流的浏览器都已经支持了这个特性，IE10+以上会全部支持，所以flex布局会成为以后广泛的布局方式。如果还需要兼容低版本的ie浏览器，那么最好还是不要使用了。

## 二、flex 的基本概念

使用flex布局的元素，称为“容器”，它的成员会自动称为容器的成员，称为“项目”。

```html
<style>
  .flex {
    display: flex;
  }

  .flex div {
    width: 100px;
    height: 100px;
    border: 1px solid #cecece;
    margin: 10px;
  }
</style>
<body>
  <div class="flex">
    <div>我被称为“项目”</div>
    <div>我被称为“项目”</div>
    <div>我被称为“项目”</div>
  </div>
</body>
```



flex有两根轴，一个是主轴，一个是交叉轴。

![主轴交叉轴](https://images.gitee.com/uploads/images/2020/1002/155137_ddf2904b_1926555.png)

主轴就是水平这条线

交叉轴就是垂直这条线

## 三、容器属性

分别有6个容器属性：

- flex-direction
- flex-wrap
- flex-flow
- justify-content
- align-items
- align-content

### 3.1 flex-direction

这个属性决定了项目（子元素）的排列方向

有以下4个值

- `row`（默认值）：主轴为水平方向，起点在左端。
- `row-reverse`：主轴为水平方向，起点在右端。
- `column`：主轴为垂直方向，起点在上沿。
- `column-reverse`：主轴为垂直方向，起点在下沿。

### 3.2 flex-wrap

这个属性用来将项目换行。

有以下3个值

- nowrap （默认值）：不换行
- wrap：换行
- wrap-reverse：换行，并且多的那一行在下方，翻转的意思

### 3.3 flex-flow

这个属性是 flex-direction 和 flex-wrap的简写，默认值是 row nowrap

### 3.4 justify-content

这个属性用来定义项目（子元素）在主轴上的对齐方式

有以下5个值：

- flex-start （默认值）​：左对齐
- flex-end：右对齐
- center：居中
- space-between：两端对齐，项目之间的间隔都相等
- space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍

### 3.5 align-items

这个属性用来定义项目（子元素）在交叉轴上的对齐方式

有以下5个值：

- flex-start：起点对齐
- flex-end：终点对齐
- center：交叉轴中心点对齐
- baseline: 项目的第一行文字的基线对齐。
- stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。

### 3.6 align-content

这个属性用来定义，一个容器中有2个以上（包含2个）的主轴线时的对齐方式，如果一个主轴线，那么不起作用。

有以下6个值：

- `flex-start`：与交叉轴的起点对齐。
- `flex-end`：与交叉轴的终点对齐。
- `center`：与交叉轴的中点对齐。
- `space-between`：与交叉轴两端对齐，轴线之间的间隔平均分布。
- `space-around`：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
- `stretch`（默认值）：轴线占满整个交叉轴。

## 四、项目属性

分别有6个项目属性：

- `order`
- `flex-grow`
- `flex-shrink`
- `flex-basis`
- `flex`
- `align-self`

### 4.1 order

用于子元素（项目）成员的排序位置

所有flex子项的默认`order`属性值是0，因此，如果我们想要某一个flex子项在最前面显示，可以设置比0小的整数，如`-1`就可以了。

### 4.2 flex-grow

属性中的grow是扩展的意思，扩展的就是flex子项所占据的宽度，扩展所侵占的空间就是除去元素外的剩余的空白间隙。



还没写完~