import React, { useState, useRef, useCallback } from 'react'
import './index.css'


function SelectionOverlay({ activeTool, viewportRef, onSelectionEnd }) {
  // 矩形 state：屏幕坐标系下的起点和终点
  const [rect, setRect] = useState(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const startRef = useRef({ x: 0, y: 0 })

  const isActive = activeTool === 'select'

  const handlePointerDown = useCallback((e) => {
    // 只响应左键；中键/右键交给画布层处理平移等
    if (e.button !== 0) return
    const overlay = e.currentTarget
    const box = overlay.getBoundingClientRect()
    const x = e.clientX - box.left
    const y = e.clientY - box.top
    startRef.current = { x, y }
    setRect({ startX: x, startY: y, endX: x, endY: y })
    setIsSelecting(true)
    try {
      overlay.setPointerCapture(e.pointerId)
    } catch (err) {
      /* 忽略 pointer 捕获失败 */
    }
  }, [])

  const handlePointerMove = useCallback(
    (e) => {
      if (!isSelecting) return
      const overlay = e.currentTarget
      const box = overlay.getBoundingClientRect()
      const x = e.clientX - box.left
      const y = e.clientY - box.top
      setRect((prev) => (prev ? { ...prev, endX: x, endY: y } : prev))
    },
    [isSelecting]
  )

  const handlePointerUp = useCallback(
    (e) => {
      if (!isSelecting) return
      setIsSelecting(false)
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch (err) {
        /* 忽略未捕获的 pointer */
      }

      // 把屏幕坐标矩形换算成世界坐标矩形，交给外部做命中检测
      const vp = viewportRef && viewportRef.current
      if (rect && vp && onSelectionEnd) {
        const worldStartX = (rect.startX - vp.offsetX) / vp.scale
        const worldStartY = (rect.startY - vp.offsetY) / vp.scale
        const worldEndX = (rect.endX - vp.offsetX) / vp.scale
        const worldEndY = (rect.endY - vp.offsetY) / vp.scale
        onSelectionEnd({
          x: Math.min(worldStartX, worldEndX),
          y: Math.min(worldStartY, worldEndY),
          width: Math.abs(worldEndX - worldStartX),
          height: Math.abs(worldEndY - worldStartY),
        })
      }
      // 松手后清掉矩形；若后续要保留"选区高亮"，可改为保留 rect
      setRect(null)
    },
    [isSelecting, rect, viewportRef, onSelectionEnd]
  )

  // 矩形样式（屏幕坐标系下绘制）
  const boxStyle = rect
    ? {
        left: Math.min(rect.startX, rect.endX),
        top: Math.min(rect.startY, rect.endY),
        width: Math.abs(rect.endX - rect.startX),
        height: Math.abs(rect.endY - rect.startY),
      }
    : null

  return (
    <div
      className={`selection-overlay ${isActive ? 'active' : ''}`}
      onPointerDown={isActive ? handlePointerDown : undefined}
      onPointerMove={isActive ? handlePointerMove : undefined}
      onPointerUp={isActive ? handlePointerUp : undefined}
    >
      {boxStyle && <div className="selection-box" style={boxStyle} />}
    </div>
  )
}

export default SelectionOverlay
