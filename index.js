import { vh, vw } from './src/utils'
import {
  defaultWidthProperties,
  defaultHeightProperties,
  defaultOptions,
  compoundProperties,
} from './src/constants'
import {
  processProperties,
  pxToViewport,
  processTransform,
} from './src/constants'

module.exports = (options = {}) => {
  const opts = { ...defaultOptions, ...options }

  // 根据模式处理属性配置
  const finalWidthProperties = processProperties(
    defaultWidthProperties,
    options.widthProperties,
    opts.propertyMode
  )

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
      if (/\d+px/g.test(decl.value)) {
        // 特殊处理transform属性
        if (decl.prop.includes('transform')) {
          decl.value = processTransform(decl.value, opts)
          return
        }

        const transformData = decl.value.split(/\s+/)
        const targetText = transformData.reduce((total, cur, index) => {
          if (/\d+px/g.test(cur)) {
            // 对于复合属性，传入索引
            const converted = pxToViewport(
              cur,
              decl.prop,
              opts,
              compoundProperties[decl.prop] ? index : null
            )
            return `${total} ${converted}`
          } else {
            return `${total} ${cur}`
          }
        }, '')

        decl.value = targetText.trim()
      }
    },
  }
}

module.exports.postcss = true

// 导出默认属性数组供用户参考
module.exports.defaultWidthProperties = defaultWidthProperties
module.exports.defaultHeightProperties = defaultHeightProperties
module.exports.vw = vw
module.exports.vh = vh
