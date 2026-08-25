import React, { useState, useRef, useCallback, useEffect } from 'react'

/* =========================================================
   自定义滚动条容器
   - 完全隐藏原生滚动条（含箭头）
   - 鼠标进入面板时显示自定义滚动条
   - 拖动 thumb 也可滚动
   ========================================================= */
function CustomScrollContainer({ children, className }) {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const thumbRef = useRef(null)
  const dragRef = useRef({ active: false, startY: 0, startScrollTop: 0 })
  const [thumbVisible, setThumbVisible] = useState(false)
  const [thumbStyle, setThumbStyle] = useState({ height: 0, top: 0 })

  // 计算滚动条 thumb 的位置和大小
  // 注意：thumb 的尺寸和位置应基于 track 元素的真实高度（已扣除 CSS top/bottom 内缩），
  // 而非视口高度，否则 CSS 中设置的 top/bottom 内缩对 thumb 不起作用
  const updateThumb = useCallback(() => {
    const el = viewportRef.current
    const trackEl = trackRef.current
    if (!el || !trackEl) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const trackHeight = trackEl.clientHeight
    const contentHeight = scrollHeight
    if (contentHeight <= clientHeight) {
      setThumbStyle((s) => ({ ...s, height: 0, top: 0 }))
      return
    }
    const thumbHeight = Math.max(24, (clientHeight * trackHeight) / contentHeight)
    const maxThumbTop = trackHeight - thumbHeight
    const thumbTop = (scrollTop / (contentHeight - clientHeight)) * maxThumbTop
    setThumbStyle({ height: thumbHeight, top: thumbTop })
  }, [])

  // 监听内容变化（折叠/展开）→ 重新计算
  useEffect(() => {
    const el = viewportRef.current
    const trackEl = trackRef.current
    if (!el || !trackEl) return
    const ro = new ResizeObserver(() => updateThumb())
    ro.observe(el)
    ro.observe(trackEl)
    // 观察内容变化
    Array.from(el.children).forEach((child) => ro.observe(child))
    updateThumb()
    return () => ro.disconnect()
  }, [updateThumb])

  // 拖动 thumb
  const onThumbMouseDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragRef.current = {
      active: true,
      startY: e.clientY,
      startScrollTop: viewportRef.current.scrollTop,
    }
    document.body.style.userSelect = 'none'
  }

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.active) return
      const el = viewportRef.current
      const trackEl = trackRef.current
      if (!el || !trackEl) return
      const { startY, startScrollTop } = dragRef.current
      const trackHeight = trackEl.clientHeight
      const thumbHeight = Math.max(24, (el.clientHeight * trackHeight) / el.scrollHeight)
      const maxThumbTop = trackHeight - thumbHeight
      const deltaY = e.clientY - startY
      const deltaScroll = (deltaY / maxThumbTop) * (el.scrollHeight - el.clientHeight)
      el.scrollTop = startScrollTop + deltaScroll
    }
    const onUp = () => {
      if (dragRef.current.active) {
        dragRef.current.active = false
        document.body.style.userSelect = ''
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  // 点击轨道跳转
  const onTrackMouseDown = (e) => {
    if (e.target === thumbRef.current) return
    const el = viewportRef.current
    if (!el) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const thumbH = thumbStyle.height
    const thumbT = thumbStyle.top
    // 点击在 thumb 上方 → 上翻一页；下方 → 下翻一页
    const pageDelta = clickY < thumbT ? -el.clientHeight : el.clientHeight
    el.scrollTop += pageDelta
  }

  return (
    <div
      className={`glm-scroll-root ${className || ''}`.trim()}
      onMouseEnter={() => setThumbVisible(true)}
      onMouseLeave={() => setThumbVisible(false)}
    >
      <div
        ref={viewportRef}
        className="glm-scroll-viewport"
        onScroll={updateThumb}
      >
        {children}
      </div>
      <div
        ref={trackRef}
        className={`glm-scroll-track ${thumbVisible ? 'visible' : ''}`}
        onMouseDown={onTrackMouseDown}
      >
        <div
          ref={thumbRef}
          className="glm-scroll-thumb"
          style={{
            height: thumbStyle.height,
            transform: `translateY(${thumbStyle.top}px)`,
          }}
          onMouseDown={onThumbMouseDown}
        />
      </div>
    </div>
  )
}

export default CustomScrollContainer
