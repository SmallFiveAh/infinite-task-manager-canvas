/* =========================================================
   便签绘制工具（canvas 2D，世界坐标系）
   调用方负责应用视口变换（translate + scale）
   ========================================================= */

// 圆角矩形路径
export function roundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2))
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

// 绘制一张便签（note 字段：x, y, width, height, color, border）
export function drawStickyNote(ctx, note) {
  const { x, y, width, height, color, border } = note
  const radius = Math.min(10, width * 0.08, height * 0.08)
  const fold = Math.min(16, width * 0.1, height * 0.1)

  // 投影（轻微向下偏移，先画在便签下层）
  ctx.fillStyle = 'rgba(15, 23, 42, 0.12)'
  roundedRectPath(ctx, x + 2, y + 3, width, height, radius)
  ctx.fill()

  // 便签主体
  ctx.fillStyle = color
  roundedRectPath(ctx, x, y, width, height, radius)
  ctx.fill()

  // 边框
  ctx.strokeStyle = border
  ctx.lineWidth = 1
  roundedRectPath(ctx, x, y, width, height, radius)
  ctx.stroke()

  // 顶部高光
  const shine = ctx.createLinearGradient(0, y, 0, y + height * 0.35)
  shine.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
  shine.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = shine
  roundedRectPath(ctx, x, y, width, height * 0.35, radius)
  ctx.fill()

  // 右上角折角
  ctx.fillStyle = 'rgba(15, 23, 42, 0.08)'
  ctx.beginPath()
  ctx.moveTo(x + width - fold, y)
  ctx.lineTo(x + width, y + fold)
  ctx.lineTo(x + width, y)
  ctx.closePath()
  ctx.fill()

  // 折角下的高光三角，让折角更有立体感
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
  ctx.beginPath()
  ctx.moveTo(x + width - fold, y)
  ctx.lineTo(x + width - fold, y + fold)
  ctx.lineTo(x + width, y + fold)
  ctx.closePath()
  ctx.fill()
}

// 生成便签拖拽预览图（HTML5 drag image），默认柠檬黄
export function createNoteDragImage(
  style = { color: '#FEF3C7', border: '#FDE68A' },
  size = 96
) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const pad = Math.round(size * 0.06)
  drawStickyNote(ctx, {
    x: pad,
    y: pad,
    width: size - pad * 2,
    height: size - pad * 2,
    ...style,
  })
  return canvas
}
