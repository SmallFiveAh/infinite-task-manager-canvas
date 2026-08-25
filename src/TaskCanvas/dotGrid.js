// 点阵网格绘制的纯函数工具：与 React 生命周期解耦，便于复用与测试

// 颜色按比例与背景混合，得到更淡的次级点阵色
export function lightenColor(dotHex, bgHex, ratio = 0.45) {
  const h2d = (h) => parseInt(h, 16)
  const mix = (a, b) => Math.round(a + (b - a) * ratio)
  const r = mix(h2d(dotHex.slice(1, 3)), h2d(bgHex.slice(1, 3)))
  const g = mix(h2d(dotHex.slice(3, 5)), h2d(bgHex.slice(3, 5)))
  const b = mix(h2d(dotHex.slice(5, 7)), h2d(bgHex.slice(5, 7)))
  const d2h = (n) => n.toString(16).padStart(2, '0')
  return `#${d2h(r)}${d2h(g)}${d2h(b)}`
}

// 点阵瓦片缓存：同尺寸/颜色只生成一次 canvas，降低内存与 GC 压力
const tileCache = new Map()
function getDotTile(screenGap, radius, color) {
  const key = `${screenGap}|${radius}|${color}`
  let tile = tileCache.get(key)
  if (tile) return tile
  const cssSize = Math.max(1, Math.round(screenGap))
  tile = document.createElement('canvas')
  tile.width = cssSize
  tile.height = cssSize
  const tctx = tile.getContext('2d')
  tctx.fillStyle = color
  tctx.beginPath()
  tctx.arc(cssSize / 2, cssSize / 2, radius, 0, Math.PI * 2)
  tctx.fill()
  tileCache.set(key, tile)
  return tile
}

// 在世界坐标系中画一层点阵：基于视口偏移计算图案平铺偏移，实现无限滚动
export function drawDotLayerWorld(ctx, worldGap, radius, color, vp, width, height) {
  const screenGap = worldGap * vp.scale
  if (screenGap < 1) return
  const tile = getDotTile(screenGap, radius, color)
  const pattern = ctx.createPattern(tile, 'repeat')
  if (!pattern) return

  const cssGap = Math.max(1, Math.round(screenGap))

  const dx = (((vp.offsetX - cssGap / 2) % cssGap) + cssGap) % cssGap
  const dy = (((vp.offsetY - cssGap / 2) % cssGap) + cssGap) % cssGap

  try {
    pattern.setTransform(new DOMMatrix([1, 0, 0, 1, dx, dy]))
  } catch (error) {
    // 老环境无 setTransform 时直接退化
    console.error('drawDotLayerWorld: setTransform not supported', error)
  }
  ctx.fillStyle = pattern
  ctx.fillRect(0, 0, width, height)
}
