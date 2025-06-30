const { vh, vw } = require('./src/utils')
const {
  defaultWidthProperties,
  defaultHeightProperties,
  defaultOptions,
  compoundProperties
} = require('./src/constants')
const { processProperties, pxToViewport, processTransform, processCalcValue } = require('./src/converters')

const postcss = require('postcss')
const semver = require('semver')

const version = postcss().version

// 处理声明值的主函数
function processDeclarationValue(decl, opts) {
  // 如果没有px值，直接返回
  if (!/\d+px/g.test(decl.value)) return

  // 特殊处理transform属性
  if (decl.prop.includes('transform')) {
    decl.value = processTransform(decl.value, opts)
    return
  }

  // 检查是否包含calc函数
  if (decl.value.includes('calc(')) {
    decl.value = processCalcValue(decl.value, decl.prop, opts)
    return
  }

  // 处理普通的空格分隔值
  const transformData = decl.value.split(/\s+/)
  const targetText = transformData.reduce((total, cur, index) => {
    if (/\d+px/g.test(cur)) {
      // 对于复合属性，传入索引
      const converted = pxToViewport(cur, decl.prop, opts, compoundProperties[decl.prop] ? index : null)
      return `${total} ${converted}`
    } else {
      return `${total} ${cur}`
    }
  }, '')

  decl.value = targetText.trim()
}

if (semver.gte(version, '8.0.0')) {
  console.log(version, '我是 >= 8.0.0 的版本')

  module.exports = (options = {}) => {
    const opts = { ...defaultOptions, ...options }

    // 根据模式处理属性配置
    const finalWidthProperties = processProperties(defaultWidthProperties, options.widthProperties, opts.propertyMode)

    const finalHeightProperties = processProperties(
      defaultHeightProperties,
      options.heightProperties,
      opts.propertyMode
    )

    // 更新 opts 中的属性
    opts.widthProperties = finalWidthProperties
    opts.heightProperties = finalHeightProperties

    return {
      postcssPlugin: 'postcss-px-to-vwvh',
      Declaration(decl) {
        processDeclarationValue(decl, opts)
      }
    }
  }
} else {
  console.log('我是 < 8.0.0 的版本')

  // PostCSS 7.x 及以下版本的兼容代码
  module.exports = postcss.plugin('postcss-px-to-vwvh', (options = {}) => {
    const opts = { ...defaultOptions, ...options }

    // 根据模式处理属性配置
    const finalWidthProperties = processProperties(defaultWidthProperties, options.widthProperties, opts.propertyMode)

    const finalHeightProperties = processProperties(
      defaultHeightProperties,
      options.heightProperties,
      opts.propertyMode
    )

    // 更新 opts 中的属性
    opts.widthProperties = finalWidthProperties
    opts.heightProperties = finalHeightProperties

    return (root, result) => {
      root.walkDecls((decl) => {
        processDeclarationValue(decl, opts)
      })
    }
  })
}

module.exports.postcss = true

// 导出默认属性数组供用户参考
module.exports.defaultWidthProperties = defaultWidthProperties
module.exports.defaultHeightProperties = defaultHeightProperties
module.exports.vw = vw
module.exports.vh = vh
