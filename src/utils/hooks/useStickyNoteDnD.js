import { useCallback, useEffect, useRef, useState } from 'react'
import { createNoteDragImage } from '../drawNote'

// 跟随鼠标的虚拟便签预览尺寸（px）
const GHOST_SIZE = 96
// 指针位移超过该值才判定为「拖拽」，否则视为普通点击（避免误添加便签 / 误触发点击副作用）
const DRAG_THRESHOLD = 4

// 判断指针是否位于「画布区域」内：
// 落在画布容器内，且不在侧边栏 / 顶栏 / 悬浮面板 / HUD 等 UI 组件上。
// 虚拟便签预览只应在拖入画布的过程中显示，侧边栏内不显示。
function isPointerOverCanvas(clientX, clientY) {
  const el = document.elementFromPoint(clientX, clientY)
  if (!el) return false
  const insideCanvasContainer = !!el.closest('.task-canvas-container')
  const overChrome = !!el.closest('.task-storage-container, .infinite-canvas-hud-wrapper')
  return insideCanvasContainer && !overChrome
}

// 便签拖拽：按住左侧工具栏「便签」按钮拖入画布，
// 仅当指针进入画布区域时显示跟随鼠标的虚拟便签预览（幽灵元素），
// 在画布内松手时于落点回调 onAddNote(worldX, worldY)。
// 用 Pointer Events + setPointerCapture 替代原生 HTML5 DnD，
// 以获得实时、稳定的鼠标跟随效果。
export default function useStickyNoteDnD({ containerRef, viewportRef, onAddNote, noteStyle }) {
  const [isDragging, setIsDragging] = useState(false)
  // 幽灵预览元素（DOM 直操作，避免拖拽过程中 React 高频重渲染）
  const ghostRef = useRef(null)
  // 当前拖拽会话：{ pointerId, startX, startY, moved }
  const dragRef = useRef(null)
  // 供外部（便签按钮 onClick）判断本次指针操作是否已构成拖拽，从而抑制“打开面板”等点击副作用
  const didDragRef = useRef(false)

  // 移除幽灵预览元素
  const removeGhost = useCallback(() => {
    if (ghostRef.current) {
      ghostRef.current.remove()
      ghostRef.current = null
    }
  }, [])

  // 确保幽灵元素存在并移动到指定屏幕坐标（不存在则创建）。
  // 复用 drawNote 的 canvas 绘制，视觉与真实便签一致。
  const ensureGhost = useCallback(
    (clientX, clientY) => {
      if (!ghostRef.current) {
        const ghost = createNoteDragImage(noteStyle, GHOST_SIZE)
        ghost.className = 'sticky-note-drag-ghost'
        ghost.style.left = '0px'
        ghost.style.top = '0px'
        document.body.appendChild(ghost)
        ghostRef.current = ghost
      }
      ghostRef.current.style.left = `${clientX}px`
      ghostRef.current.style.top = `${clientY}px`
    },
    [noteStyle]
  )

  // 按住便签按钮：开始拖拽会话。
  // 此时指针仍在侧边栏内，不创建虚拟预览，待进入画布区域后再显示。
  // 注意：不能在 pointerdown 里 preventDefault，否则 Chrome 会抑制后续 click，
  // 导致“点击便签按钮打开面板”失效；拖拽后的多余 click 由 didDragRef 抑制
  const handlePointerDown = useCallback((e) => {
    if (e.button !== 0) return
    didDragRef.current = false
    const el = e.currentTarget
    try {
      // 捕获指针，保证移出按钮后仍能持续收到 pointermove / pointerup
      el.setPointerCapture(e.pointerId)
    } catch {
      /* 忽略捕获失败 */
    }
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    }
    setIsDragging(true)
  }, [])

  // 拖拽中：仅当指针进入画布区域时显示虚拟预览并跟随鼠标，离开画布（如回到侧边栏）则隐藏
  const handlePointerMove = useCallback(
    (e) => {
      const drag = dragRef.current
      if (!drag || e.pointerId !== drag.pointerId) return
      if (
        !drag.moved &&
        Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > DRAG_THRESHOLD
      ) {
        drag.moved = true
        didDragRef.current = true
      }
      if (isPointerOverCanvas(e.clientX, e.clientY)) {
        ensureGhost(e.clientX, e.clientY)
      } else {
        removeGhost()
      }
    },
    [ensureGhost, removeGhost]
  )

  // 松手：结束拖拽，仅当落点在画布区域内时添加便签
  const handlePointerUp = useCallback(
    (e) => {
      const drag = dragRef.current
      if (!drag || e.pointerId !== drag.pointerId) return
      dragRef.current = null
      removeGhost()
      setIsDragging(false)
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        /* 忽略未捕获的 pointer */
      }
      // 未发生实际位移 = 点击按钮，不添加便签
      if (!drag.moved) return
      // 在侧边栏等 UI 上松手也不添加便签
      if (!isPointerOverCanvas(e.clientX, e.clientY)) return

      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      // 屏幕坐标 → 世界坐标（视口逆变换）
      const vp = viewportRef.current
      const worldX = (e.clientX - rect.left - vp.offsetX) / vp.scale
      const worldY = (e.clientY - rect.top - vp.offsetY) / vp.scale
      onAddNote(worldX, worldY)
    },
    [containerRef, viewportRef, onAddNote, removeGhost]
  )

  // 拖拽被系统打断（如移出窗口、手势冲突）：清理拖拽会话与幽灵元素
  const handlePointerCancel = useCallback(
    (e) => {
      const drag = dragRef.current
      if (!drag || e.pointerId !== drag.pointerId) return
      dragRef.current = null
      removeGhost()
      setIsDragging(false)
    },
    [removeGhost]
  )

  // 组件卸载时清理幽灵元素
  useEffect(() => removeGhost, [removeGhost])

  return {
    isDragging,
    didDragRef,
    // 透传给便签按钮的指针事件处理器
    stickyDragHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
  }
}
