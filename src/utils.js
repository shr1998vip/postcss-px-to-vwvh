function vw(size, defaultWidth = 1920) {
  let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return size
  let scale = clientWidth / defaultWidth
  return Number((size * scale).toFixed(3))
}

function vh(size, defaultHeight = 1080) {
  const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  if (!clientHeight) return size
  const scale = clientHeight / defaultHeight
  return Number((size * scale).toFixed(3))
}

module.exports = {
  vw,
  vh
}
