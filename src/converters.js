const {compoundProperties} = require('./constants')

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

  return 'vw'
}

// 合并或替换属性数组
exports.processProperties = (defaultProps, userProps, mode) => {
  if (!userProps) {
    return defaultProps
  }

  if (mode === 'replace') {
    return userProps
  } else {
    return [...new Set([...defaultProps, ...userProps])]
  }
}

exports.pxToViewport = (data, property, options, valueIndex = null) => {
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

// 处理transform属性的特殊情况
exports.processTransform = (value, options) => {
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
