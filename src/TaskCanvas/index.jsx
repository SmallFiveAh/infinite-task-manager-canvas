import React, { useRef, useEffect, useCallback, useState } from 'react'
import SelectionOverlay from './SelectionOverlay'
import TaskStorage from './TaskStorage'
import './index.css'

// 风格点阵网格参数
const GRID_SIZE = 22                     // 基础世界网格间距（100% 时 = 22px 屏幕间距）
const DOT_RADIUS_MAIN = 1.2              // 主点阵半径（CSS 像素，屏幕上永远这么大）
const DOT_RADIUS_MINOR = 0.6             // 次级点阵半径（CSS 像素，屏幕上永远这么大）
const MINOR_DIV = 5                      // 每个主格子细分为 5×5 小格

const LOD_MIN_SCREEN_GAP = 16            // LOD 下限：屏幕间距 < 16px 就 step×2 跳变（保证不密集）
const LOD_MAX_STEP = 64                  // 最大跳变层级，超过则视为远景不渲染
const MINOR_APPEAR_SCREEN_GAP = 50       // 放大到此屏幕间距时开始出现次级点阵
const MINOR_MIN_SCREEN_GAP = 6           // 次级点阵至少要 6px 屏幕间距才画

const MIN_SCALE = 0.2                     // 最小缩放比例
const MAX_SCALE = 4                     // 最大缩放比例
const ZOOM_INTENSITY = 0.0015           // 缩放强度

// 颜色按比例与背景混合，得到更淡的次级点阵色
function lightenColor(dotHex, bgHex, ratio = 0.45) {
  const h2d = (h) => parseInt(h, 16)
  const mix = (a, b) => Math.round(a + (b - a) * ratio)
  const r = mix(h2d(dotHex.slice(1, 3)), h2d(bgHex.slice(1, 3)))
  const g = mix(h2d(dotHex.slice(3, 5)), h2d(bgHex.slice(3, 5)))
  const b = mix(h2d(dotHex.slice(5, 7)), h2d(bgHex.slice(5, 7)))
  const d2h = (n) => n.toString(16).padStart(2, '0')
  return `#${d2h(r)}${d2h(g)}${d2h(b)}`
}

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

function drawDotLayerWorld(ctx, worldGap, radius, color, vp, width, height) {
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
    /* 老环境无 setTransform 时直接退化 */
    console.error('drawDotLayerWorld: setTransform not supported', error);
  }
  ctx.fillStyle = pattern
  ctx.fillRect(0, 0, width, height)
}

function TaskCanvas() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const viewportRef = useRef({ offsetX: 0, offsetY: 0, scale: 1 })
  const isPanningRef = useRef(false)
  const lastPointerRef = useRef({ x: 0, y: 0 })
  const colorsRef = useRef({ bg: '#fafafa', dot: '#d4d7de' })
  const rafIdRef = useRef(0)
  const dirtyRef = useRef(false)
  // HUD 缩放百分比展示：仅 scale 变化时同步到 state
  const [scale, setScale] = useState(1)
  // 当前激活的工具：'select' 框选任务（默认）/ 'navigate' 平移画布
  const [activeTool, setActiveTool] = useState('select')

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (width <= 0 || height <= 0) {
      dirtyRef.current = false
      setTimeout(scheduleDraw, 0)
      return
    }
    if (
      canvas.width !== Math.round(width * dpr) ||
      canvas.height !== Math.round(height * dpr)
    ) {
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const { bg, dot } = colorsRef.current
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)

    const vp = viewportRef.current
    const baseScreenGap = GRID_SIZE * vp.scale  // 100% 时 = 22px

    let step = 1
    while (baseScreenGap * step < LOD_MIN_SCREEN_GAP && step < LOD_MAX_STEP) {
      step *= 2
    }
    if (step < LOD_MAX_STEP) {
      const mainWorldGap = GRID_SIZE * step
      // 层级越高，点阵略放大一点，避免远景太小看不见
      const lod = Math.log2(step) | 0
      const mainRadius = DOT_RADIUS_MAIN + lod * 0.15
      drawDotLayerWorld(ctx, mainWorldGap, mainRadius, dot, vp, width, height)
    }

    // 当主点阵屏幕间距 > 50px
    if (baseScreenGap > MINOR_APPEAR_SCREEN_GAP) {
      const minorWorldGap = GRID_SIZE / MINOR_DIV
      const minorScreenGap = minorWorldGap * vp.scale
      if (minorScreenGap >= MINOR_MIN_SCREEN_GAP) {
        const minorColor = lightenColor(dot, bg)
        drawDotLayerWorld(ctx, minorWorldGap, DOT_RADIUS_MINOR, minorColor, vp, width, height)
      }
    }
  }, [])

  // 调度一次重绘：若本帧已排过则跳过，下一帧只会画一次
  const scheduleDraw = useCallback(() => {
    if (dirtyRef.current) return
    dirtyRef.current = true
    rafIdRef.current = requestAnimationFrame(() => {
      dirtyRef.current = false
      rafIdRef.current = 0
      draw()
    })
  }, [draw])

  // 点击 HUD：恢复到 100%（scale=1，offset 归零）
  const handleResetZoom = useCallback(() => {
    const vp = viewportRef.current
    vp.offsetX = 0
    vp.offsetY = 0
    vp.scale = 1
    setScale(1)
    scheduleDraw()
  }, [scheduleDraw])

  // 键盘可达性：role="button" 元素响应 Enter / Space 触发重置
  const handleHudKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleResetZoom()
      }
    },
    [handleResetZoom]
  )

  // HUD 菜单选择缩放百分比：接收百分比整数（如 50、100、400），以画布中心为锚点进行缩放
  const handleZoomChangeFromMenu = useCallback(
    (percentInt) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const vp = viewportRef.current
      const targetScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, percentInt / 100)
      )
      if (targetScale === vp.scale) return
      const rect = canvas.getBoundingClientRect()
      const px = rect.width / 2
      const py = rect.height / 2
      const k = targetScale / vp.scale
      vp.offsetX = px - (px - vp.offsetX) * k
      vp.offsetY = py - (py - vp.offsetY) * k
      vp.scale = targetScale
      setScale(targetScale)
      scheduleDraw()
    },
    [scheduleDraw]
  )

  // 选择工具框选结束：SelectionOverlay 把屏幕矩形换算成世界坐标矩形后回调
  // TODO: 目前还没有任务卡片图层，先打印选区；后续接入卡片后做矩形相交命中检测
  const handleSelectionEnd = useCallback((worldRect) => {
    console.log('selection end (world):', worldRect)
  }, [])

  // 读取设计 token + 监听容器尺寸变化
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const styles = getComputedStyle(document.documentElement)
    colorsRef.current = {
      bg: styles.getPropertyValue('--canvas-bg-color').trim() || '#fafafa',
      dot: styles.getPropertyValue('--grid-dot-color').trim() || '#d4d7de',
    }

    scheduleDraw()
    // 兜底：浏览器完成布局后再调度一次，避免首帧时 canvas 尚无尺寸
    const retryTimer = setTimeout(scheduleDraw, 0)

    const ro = new ResizeObserver(() => scheduleDraw())
    ro.observe(container)
    return () => {
      clearTimeout(retryTimer)
      ro.disconnect()
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      // StrictMode 双周期：unmount 时 rAF 被取消但 dirtyRef 可能仍为 true，
      // 若不重置会导致下次 mount 的 scheduleDraw 被短路，draw 永不执行
      dirtyRef.current = false
      rafIdRef.current = 0
    }
  }, [scheduleDraw])

  // 键盘快捷键：V=选择 / H=移动 / Z=撤销 / Y=重做
  useEffect(() => {
    const onKeyDown = (e) => {
      // 忽略在输入控件中的按键
      const tag = (e.target && e.target.tagName) || ''
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return
      const key = e.key.toLowerCase()
      if (key === 'v') {
        setActiveTool('select')
      } else if (key === 'h') {
        setActiveTool('navigate')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // 交互：wheel / pointer（所有 draw 替换为 scheduleDraw 合并到下一帧）
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onWheel = (e) => {
      // 仅当左键按下时（含 shift+左键）才拦截滚轮做平移；中键完全忽略，交由浏览器默认行为处理
      if (e.button !== 0) return
      e.preventDefault()
      const vp = viewportRef.current
      const delta = -e.deltaY * ZOOM_INTENSITY
      const newScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, vp.scale * Math.exp(delta))
      )
      const rect = canvas.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      const k = newScale / vp.scale
      vp.offsetX = px - (px - vp.offsetX) * k
      vp.offsetY = py - (py - vp.offsetY) * k
      vp.scale = newScale
      setScale(newScale) // 同步 HUD 百分比显示
      scheduleDraw()
    }

    const onPointerDown = (e) => {
      // 仅在 navigate 工具且左键按下时才启用平移
      if (activeTool !== 'navigate' || e.button !== 0) return
      isPanningRef.current = true
      lastPointerRef.current = { x: e.clientX, y: e.clientY }
      canvas.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e) => {
      if (!isPanningRef.current) return
      const dx = e.clientX - lastPointerRef.current.x
      const dy = e.clientY - lastPointerRef.current.y
      lastPointerRef.current = { x: e.clientX, y: e.clientY }
      const vp = viewportRef.current
      vp.offsetX += dx
      vp.offsetY += dy
      scheduleDraw()
    }
    const onPointerUp = (e) => {
      isPanningRef.current = false
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch (error) {
        /* 忽略未捕获的 pointer */
        console.error('未捕获的 pointer 事件', error);
      }
    }

    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    return () => {
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      dirtyRef.current = false
      rafIdRef.current = 0
    }
  }, [scheduleDraw, activeTool])

  return (
    <div className="task-canvas-container" ref={containerRef}>
      {/* 画布组件 */}
      <canvas ref={canvasRef} className="task-canvas" />
      {/* 选择覆盖层：activeTool === 'select' 时激活，左键拖拽框选；其它工具事件透传给 canvas */}
      <SelectionOverlay
        activeTool={activeTool}
        viewportRef={viewportRef}
        onSelectionEnd={handleSelectionEnd}
      />
      {/* HUD 组件 */}
      <div
        className="infinite-canvas-hud" 
        onClick={handleResetZoom} 
        onKeyDown={handleHudKeyDown} 
        role="button" tabIndex={0} 
        title="点击恢复到 100%">
          <i className="hud-icon bi bi-arrows-fullscreen" aria-hidden="true" />
          <span className="hud-text">{(scale * 100).toFixed(0)}%</span>
      </div>
      {/* 任务存储组件：传入缩放百分比与回调，实现双向联动 */}
      <TaskStorage
        zoomPercent={Math.round(scale * 100)}
        onZoomChange={handleZoomChangeFromMenu}
        onZoomReset={handleResetZoom}
        activeTool={activeTool}
        onActiveToolChange={setActiveTool}
      />
    </div>
  )
}

export default TaskCanvas
