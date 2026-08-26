import React, { useRef } from 'react'
import './index.css'

// 画布上的便签 DOM 层：每个便签都是真实 DOM 元素，可悬停、拖拽操作。
// viewport 为父级同步的视口快照 { offsetX, offsetY, scale }，本层据此做世界坐标 → 屏幕定位。
function NotesLayer({ notes, viewport, activeTool, onMoveNote }) {
  // 拖拽会话表（事件委托共享）：pointerId → 拖拽快照
  // 便签 pointerdown 时写入；容器层的 pointermove / pointerup / pointercancel 统一消费。
  const dragsRef = useRef(new Map())

  const handlePointerDown = (e, note) => {
    if (e.button !== 0) return
    e.preventDefault()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* 忽略 pointer 捕获失败（如元素已卸载） */
    }
    e.currentTarget.classList.add('canvas-note--dragging')
    dragsRef.current.set(e.pointerId, {
      el: e.currentTarget,
      id: note.id,
      startScreenX: e.clientX,
      startScreenY: e.clientY,
      startWorldX: note.x,
      startWorldY: note.y,
    })
  }

  // 事件委托：容器层统一处理所有便签拖拽中的 pointermove。
  // setPointerCapture 会把事件重定向到被拖拽的便签，并沿 DOM 冒泡至本容器，
  // 因此这里只需按 pointerId 取会话，无需为每张便签各自注册监听。
  const handlePointerMove = (e) => {
    const drag = dragsRef.current.get(e.pointerId)
    if (!drag) return
    // 屏幕位移 → 世界坐标位移（除以缩放，保证任意缩放下拖拽跟手）
    const dx = (e.clientX - drag.startScreenX) / viewport.scale
    const dy = (e.clientY - drag.startScreenY) / viewport.scale
    onMoveNote(drag.id, drag.startWorldX + dx, drag.startWorldY + dy)
  }

  const endDrag = (e) => {
    const drag = dragsRef.current.get(e.pointerId)
    if (!drag) return
    dragsRef.current.delete(e.pointerId)
    drag.el.classList.remove('canvas-note--dragging')
    try {
      drag.el.releasePointerCapture(e.pointerId)
    } catch {
      /* 忽略未捕获的 pointer */
    }
  }

  return (
    <div
      className={`notes-layer ${activeTool === 'navigate' ? 'notes-layer--panning' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} vp={viewport} onPointerDown={handlePointerDown} />
      ))}
    </div>
  )
}

// 单张便签：世界坐标 → 屏幕定位（translate + scale 应用视口变换）。
// 只保留 pointerdown 用于识别命中并建立拖拽会话，move/up/cancel 由容器层事件委托统一处理。
function NoteCard({ note, vp, onPointerDown }) {
  const transform = `translate3d(${note.x * vp.scale + vp.offsetX}px, ${
    note.y * vp.scale + vp.offsetY
  }px, 0) scale(${vp.scale})`

  return (
    <div
      className="canvas-note"
      style={{
        width: note.width,
        height: note.height,
        backgroundColor: note.color,
        borderColor: note.border,
        transform,
      }}
      onPointerDown={(e) => onPointerDown(e, note)}
    />
  )
}

export default NotesLayer
