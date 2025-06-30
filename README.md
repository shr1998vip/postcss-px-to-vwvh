# postcss-px-to-vwvh

## 安装

```bash
npm install postcss postcss-px-to-vwvh --save-dev
```

或者

```bash
yarn add postcss postcss-px-to-vwvh --dev
```

## 使用方法

### PostCSS 配置

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-px-to-vwvh')()
  ]
}
```

### Webpack 配置

```javascript
// webpack.config.js
module.exports = {
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require('postcss-px-to-vwvh')()
        ]
      }
    }
  }
}
```

## 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|:----:|:----:|:------:|:----:|
| `designWidth` | `Number` | `1920` | 设计稿的宽度，用于计算 vw |
| `designHeight` | `Number` | `1080` | 设计稿的高度，用于计算 vh |
| `unitPrecision` | `Number` | `5` | 转换后保留的小数位数 |
| `minPixelValue` | `Number` | `1` | 小于此值的 px 不会被转换 |
| `widthProperties`  |   `String[]`    | `defaultWidthProperties`  |       有关宽度属性        |
| `heightProperties` |   `String[]`    | `defaultHeightProperties` |       有关高度属性        |
|   `propertyMode`   | `merge|replace` |          `merge`          |       规则添加模式        |

```js
// 默认宽度相关的CSS属性
const defaultWidthProperties = [
  'width',
  'min-width',
  'max-width',
  'left',
  'right',
  'padding-left',
  'padding-right',
  'margin-left',
  'margin-right',
  'border-left-width',
  'border-right-width',
  'text-indent',
  'letter-spacing',
  'column-gap',
  'column-width'
]

// 默认高度相关的CSS属性
const defaultHeightProperties = [
  'height',
  'min-height',
  'max-height',
  'line-height',
  'top',
  'bottom',
  'padding-top',
  'padding-bottom',
  'margin-top',
  'margin-bottom',
  'border-top-width',
  'border-bottom-width',
  'font-size',
  'vertical-align',
  'row-gap'
]
```

## 转换规则

### 宽度相关属性 → vw
- `width`
- `min-width`
- `max-width`
- `padding-left`
- `padding-right`
- `margin-left`
- `margin-right`
- `left`
- `right`
- `border-left-width`
- `border-right-width`

### 高度相关属性 → vh
- `height`
- `min-height`
- `max-height`
- `padding-top`
- `padding-bottom`
- `margin-top`
- `margin-bottom`
- `top`
- `bottom`
- `border-top-width`
- `border-bottom-width`

### 混合属性处理
对于 `padding`、`margin` 等简写属性，插件会智能识别各个方向的值：
- `padding: 10px 20px` → `padding: 0.926vh 1.042vw`
- `margin: 10px 20px 30px 40px` → `margin: 0.926vh 1.042vw 2.778vh 2.083vw`

## 转换示例

### 输入
```css
.container {
  width: 1920px;
  height: 1080px;
  padding: 20px 40px;
  margin-left: 100px;
  font-size: 16px;
}

.box {
  width: 300px;
  height: 200px;
  top: 50px;
  left: 80px;
}
```

### 输出
```css
.container {
  width: 100vw;
  height: 100vh;
  padding: 1.852vh 2.083vw;
  margin-left: 5.208vw;
  font-size: 1.5vh;
}

.box {
  width: 15.625vw;
  height: 18.519vh;
  top: 4.630vh;
  left: 4.167vw;
}
```

## 高级用法

### 属性扩展

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-px-to-vwvh')({
      widthProperties: ['xx'] // 会把这个属性添加到规则列表中
    })
  ]
}
```

## 许可证

[MIT](LICENSE)