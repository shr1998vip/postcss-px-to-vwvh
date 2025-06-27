// 默认宽度相关的CSS属性
export const defaultWidthProperties = [
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
  'column-width',
]

// 默认高度相关的CSS属性
export const defaultHeightProperties = [
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
  'row-gap',
]

// 默认配置
export const defaultOptions = {
  designWidth: 1920, // 设计稿宽度
  designHeight: 1080, // 设计稿高度
  unitPrecision: 5, // 转换精度
  minPixelValue: 1, // 最小转换值
  widthProperties: defaultWidthProperties, // 有关宽度属性
  heightProperties: defaultHeightProperties, // 有关高度属性
  propertyMode: 'merge', // 属性配置模式: 'merge' | 'replace'
}

// 复合属性处理
export const compoundProperties = {
  padding: ['vh', 'vw', 'vh', 'vw'],
  margin: ['vh', 'vw', 'vh', 'vw'],
  'border-width': ['vh', 'vw', 'vh', 'vw'],
  'border-radius': ['vw', 'vh', 'vw', 'vh'],
}
