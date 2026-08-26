import { useCallback, useEffect, useRef } from 'react'
import { drawDotLayerWorld, lightenColor } from '../dotGrid'
import {
  GRID_SIZE,
  DOT_RADIUS_MAIN,
  DOT_RADIUS_MINOR,
  MINOR_DIV,
  LOD_MIN_SCREEN_GAP,
  LOD_MAX_STEP,
  MINOR_APPEAR_SCREEN_GAP,
  MINOR_MIN_SCREEN_GAP,
} from '../constants'

// 负责画布点阵网格的绘制与重绘调度（rAF 合并），与视口/交互解耦。
// 画布上的元素（便签等）由 NotesLayer 等真实 DOM 层渲染，不在 canvas 上绘制。
export default function useCanvasRenderer(canvasRef, containerRef, viewportRef) {
  const colorsRef = useRef({ bg: '#fafafa', dot: '#d4d7de' })
  const rafIdRef = useRef(0)
  const dirtyRef = useRef(false)

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
    const baseScreenGap = GRID_SIZE * vp.scale // 100% 时 = 22px

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [scheduleDraw, canvasRef, containerRef])

  return { scheduleDraw }
}
