const { compoundProperties } = require('./constants')

function pxToVw(pxValue, designWidth, precision) {
  const result = (pxValue / designWidth) * 100
  return `${parseFloat(result.toFixed(precision))}vw`
}

function pxToVh(pxValue, designHeight, precision) {
  const result = (pxValue / designHeight) * 100
  return `${parseFloat(result.toFixed(precision))}vh`
}

function getTargetUnit(property, widthProperties, heightProperties) {
  // 是否高度相关
  if (heightProperties.some((prop) => property.includes(prop) || property === prop)) {
    return 'vh'
  }

  // 是否宽度相关
  if (widthProperties.some((prop) => property.includes(prop) || property === prop)) {
    return 'vw'
  }

  return 'vh'
}

function pxToViewport(data, property, options, valueIndex = null) {
  const transformData = Number(data.slice(0, -2))

  if (transformData < options.minPixelValue) {
    return data
  }

  let targetUnit

  // 处理复合属性
  if (compoundProperties[property] && valueIndex !== null) {
    targetUnit = compoundProperties[property][valueIndex % compoundProperties[property].length]
  } else {
    targetUnit = getTargetUnit(property, options.widthProperties, options.heightProperties)
  }

  if (targetUnit === 'vh') {
    return pxToVh(transformData, options.designHeight, options.unitPrecision)
  } else {
    return pxToVw(transformData, options.designWidth, options.unitPrecision)
  }
}

// 合并或替换属性数组
function processProperties(defaultProps, userProps, mode) {
  if (!userProps) {
    return defaultProps
  }

  if (mode === 'replace') {
    return userProps
  } else {
    return [...new Set([...defaultProps, ...userProps])]
  }
}

// 处理transform属性的特殊情况
function processTransform(value, options) {
  return value.replace(/translate[XY]?\([^)]+\)/g, (transformMatch) => {
    return transformMatch.replace(/(\d+(?:\.\d+)?)px/g, (match, pxValue) => {
      const numericValue = parseFloat(pxValue)
      // translateX 用vw, translateY 用vh
      if (transformMatch.includes('translateX')) {
        return pxToVw(numericValue, options.designWidth, options.unitPrecision)
      } else if (transformMatch.includes('translateY')) {
        return pxToVh(numericValue, options.designHeight, options.unitPrecision)
      } else {
        // translate() 的第一个参数是X，第二个是Y
        const values = transformMatch.match(/(\d+(?:\.\d+)?)px/g)
        if (values && values.length >= 2) {
          return transformMatch.includes('translateX')
            ? pxToVw(numericValue, options.designWidth, options.unitPrecision)
            : pxToVh(numericValue, options.designHeight, options.unitPrecision)
        }
        return pxToVw(numericValue, options.designWidth, options.unitPrecision)
      }
    })
  })
}

// 处理calc函数的辅助函数
function processCalcValue(value, prop, opts) {
  return value.replace(/calc\(([^)]+)\)/g, (match, calcContent) => {
    // 在calc内容中查找px值并转换
    const processedCalcContent = calcContent.replace(/(\d+(?:\.\d+)?)px/g, (pxMatch, pxValue) => {
      return pxToViewport(pxMatch, prop, opts)
    })
    return `calc(${processedCalcContent})`
  })
}

// 特殊处理包含CSS函数的值
function processFn(value, prop, opts) {
  return value.replace(/(\w+)\(([^)]*)\)/g, (match, funcName, params) => {
    const processedParams = params.replace(/(\d+(?:\.\d+)?)px/g, (pxMatch, num) => {
      return pxToViewport(pxMatch, prop, opts)
    })
    return `${funcName}(${processedParams})`
  })
}

// 处理包含负数px值的函数
function processMinus(value, prop, opts) {
  // 使用全局正则替换所有负数px值
  return value.replace(/-(\d+(?:\.\d+)?)px/g, (match, pxValue) => {
    const numericValue = parseFloat(pxValue)
    // 创建正数的px字符串用于转换
    const positivePxString = `${numericValue}px`
    // 转换后添加负号
    const converted = pxToViewport(positivePxString, prop, opts)
    return `-${converted}`
  })
}

// 处理普通的空格分隔值
function processSpacing(value, prop, opts) {
  const transformData = value.split(/\s+/)
  const targetText = transformData.reduce((total, cur, index) => {
    if (/\d+px/g.test(cur)) {
      // 对于复合属性，传入索引
      const converted = pxToViewport(cur, prop, opts, compoundProperties[prop] ? index : null)
      return `${total} ${converted}`
    } else {
      return `${total} ${cur}`
    }
  }, '')

  return targetText
}

module.exports = {
  pxToViewport,
  processProperties,
  processTransform,
  processCalcValue,
  processFn,
  processMinus,
  processSpacing
}
