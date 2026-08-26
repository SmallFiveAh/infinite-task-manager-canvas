import { useEffect, useRef, useState } from 'react'

// 便签拖拽数据 MIME 类型（由左侧工具栏 dragstart 时写入）
const NOTE_DND_TYPE = 'application/x-canvas-note'

// 判断 dataTransfer 是否携带便签数据（兼容 DOMStringList）
const hasNoteData = (types) => {
  if (!types) return false
  return [].indexOf.call(types, NOTE_DND_TYPE) !== -1
}

// 画布拖放：按住左侧工具栏「便签」按钮拖入画布，
// 在落点处回调 onAddNote(worldX, worldY) 创建便签
export default function useStickyNoteDnD({ containerRef, viewportRef, onAddNote }) {
  const [isDragging, setIsDragging] = useState(false)
  // dragenter/dragleave 会嵌套触发，用计数器判断真正离开
  const enterCountRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 必须阻止默认行为，画布才能成为 drop 目标
    const onDragOver = (e) => {
      if (!hasNoteData(e.dataTransfer && e.dataTransfer.types)) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }

    const onDragEnter = (e) => {
      if (!hasNoteData(e.dataTransfer && e.dataTransfer.types)) return
      enterCountRef.current += 1
      setIsDragging(true)
    }

    const onDragLeave = (e) => {
      if (!hasNoteData(e.dataTransfer && e.dataTransfer.types)) return
      enterCountRef.current = Math.max(0, enterCountRef.current - 1)
      if (enterCountRef.current === 0) setIsDragging(false)
    }

    const onDrop = (e) => {
      if (!hasNoteData(e.dataTransfer && e.dataTransfer.types)) return
      e.preventDefault()
      enterCountRef.current = 0
      setIsDragging(false)

      // 屏幕坐标 → 世界坐标（视口逆变换）
      const rect = container.getBoundingClientRect()
      const screenX = e.clientX - rect.left
      const screenY = e.clientY - rect.top
      const vp = viewportRef.current
      const worldX = (screenX - vp.offsetX) / vp.scale
      const worldY = (screenY - vp.offsetY) / vp.scale
      onAddNote(worldX, worldY)
    }

    container.addEventListener('dragover', onDragOver)
    container.addEventListener('dragenter', onDragEnter)
    container.addEventListener('dragleave', onDragLeave)
    container.addEventListener('drop', onDrop)

    return () => {
      container.removeEventListener('dragover', onDragOver)
      container.removeEventListener('dragenter', onDragEnter)
      container.removeEventListener('dragleave', onDragLeave)
      container.removeEventListener('drop', onDrop)
    }
  }, [containerRef, viewportRef, onAddNote])

  return { isDragging }
}
