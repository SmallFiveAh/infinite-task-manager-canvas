import { useEffect, useRef } from 'react'
import { ZOOM_INTENSITY, MIN_SCALE, MAX_SCALE, SCROLLED_PANEL_CLASSES } from '../constants'

// 画布交互：wheel 缩放 + pointer 平移（navigate 工具下）
export default function useCanvasInteractions({
  containerRef,
  canvasRef,
  viewportRef,
  setScale,
  scheduleDraw,
  activeTool,
}) {
  const isPanningRef = useRef(false)
  const lastPointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const onWheel = (e) => {
      // 如果滚轮发生在"自身需要滚动的面板/输入控件"内（如图形库菜单），
      // 则不拦截，交给浏览器执行原生滚动，防止面板内容无法翻页。
      let el = e.target
      while (el && el !== container && el !== document.body) {
        if (el instanceof HTMLElement) {
          const matchesClass = SCROLLED_PANEL_CLASSES.some((c) =>
            el.classList && el.classList.contains(c)
          )
          let canScroll = false
          if (!matchesClass) {
            const style = window.getComputedStyle(el)
            const overflowY = style.overflowY
            const hasOverflowScroll = overflowY === 'auto' || overflowY === 'scroll'
            const heightOk = el.clientHeight > 0 && el.scrollHeight > el.clientHeight + 1
            canScroll = hasOverflowScroll && heightOk
          }
          if (matchesClass || canScroll) return
        }
        el = el.parentElement
      }

      e.preventDefault()
      const vp = viewportRef.current
      const delta = -e.deltaY * ZOOM_INTENSITY
      const newScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, vp.scale * Math.exp(delta))
      )
      const rect = container.getBoundingClientRect()
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
      }
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    return () => {
      container.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
    }
  }, [containerRef, canvasRef, viewportRef, setScale, scheduleDraw, activeTool])
}
