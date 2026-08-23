import React, { useState, useRef, useCallback } from 'react'
import './index.css'


function SelectionOverlay({ activeTool, viewportRef, onSelectionEnd, onRedraw }) {
  // 矩形 state：屏幕坐标系下的起点和终点
  const [rect, setRect] = useState(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const startRef = useRef({ x: 0, y: 0 })
  const panLastRef = useRef({ x: 0, y: 0 })

  const isActive = activeTool === 'select'

  const handlePointerDown = useCallback((e) => {
    // 中键：临时平移画布，不影响框选（选择工具下也能用中键拖动画布）
    if (e.button === 1) {
      e.preventDefault() // 阻止浏览器中键自动滚动
      setIsPanning(true)
      panLastRef.current = { x: e.clientX, y: e.clientY }
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch (err) {
        /* 忽略 pointer 捕获失败 */
      }
      return
    }
    // 只响应左键；右键交给画布层处理
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
      if (isPanning) {
        const dx = e.clientX - panLastRef.current.x
        const dy = e.clientY - panLastRef.current.y
        panLastRef.current = { x: e.clientX, y: e.clientY }
        const vp = viewportRef && viewportRef.current
        if (vp) {
          vp.offsetX += dx
          vp.offsetY += dy
          onRedraw && onRedraw()
        }
        return
      }
      if (!isSelecting) return
      const overlay = e.currentTarget
      const box = overlay.getBoundingClientRect()
      const x = e.clientX - box.left
      const y = e.clientY - box.top
      setRect((prev) => (prev ? { ...prev, endX: x, endY: y } : prev))
    },
    [isSelecting, isPanning, viewportRef, onRedraw]
  )

  const handlePointerUp = useCallback(
    (e) => {
      if (isPanning) {
        setIsPanning(false)
        try {
          e.currentTarget.releasePointerCapture(e.pointerId)
        } catch (err) {
          /* 忽略未捕获的 pointer */
        }
        return
      }
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
    [isSelecting, isPanning, rect, viewportRef, onSelectionEnd]
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
      style={isPanning ? { cursor: 'grabbing' } : undefined}
      onPointerDown={isActive ? handlePointerDown : undefined}
      onPointerMove={isActive ? handlePointerMove : undefined}
      onPointerUp={isActive ? handlePointerUp : undefined}
    >
      {boxStyle && <div className="selection-box" style={boxStyle} />}
    </div>
  )
}

export default SelectionOverlay
