import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import TabBar from './TabBar'
import { RectNoteCell, IrregularNoteCell } from './NoteCells'
import { rectangularGroups, irregularShapes, irregularColors, rectByKey, irregularByKey } from './data'
import './index.css'

/* =========================================================
   便签样式面板
   - 矩形 / 异形两种 Tab
   - 单元格使用 memo + 事件委托（data-note-key），
     点击时仅选中态变化的单元格重渲染
   ========================================================= */

function NotePanel({ onSelectNote }) {
  const [activeTab, setActiveTab] = useState('rect')
  const [selectedRect, setSelectedRect] = useState(null) // 选中单元格 key
  const [selectedIrregular, setSelectedIrregular] = useState(null) // 选中单元格 key
  // 内容区固定高度：以矩形视图内容高度为基准，
  // 保证切换 Tab 时面板高度一致（异形内容超出时在内容区内部滚动）
  const [contentHeight, setContentHeight] = useState(null)
  const rectViewRef = useRef(null)

  // 测量矩形视图高度作为内容区固定高度
  // （面板宽度固定，矩形视图高度稳定；用 ResizeObserver 兜底字体加载等引起的尺寸变化）
  useLayoutEffect(() => {
    const node = rectViewRef.current
    if (!node) return
    setContentHeight(node.offsetHeight)
    const observer = new ResizeObserver(() => {
      setContentHeight(node.offsetHeight)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [activeTab])

  // 事件委托：单个稳定处理器，避免为每个单元格创建新回调（保证 memo 生效）
  const handleCellClick = useCallback(
    (e) => {
      const { noteKey } = e.currentTarget.dataset
      const isRect = activeTab === 'rect'
      const entry = isRect ? rectByKey.get(noteKey) : irregularByKey.get(noteKey)
      if (!entry) return
      if (isRect) {
        setSelectedRect(noteKey)
      } else {
        setSelectedIrregular(noteKey)
      }
      onSelectNote?.(entry.selection)
    },
    [activeTab, onSelectNote]
  )

  return (
    <div className="note-panel">
      <div className="np-header">
        <span className="np-title">便签样式</span>
      </div>

      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      <div className="np-content" style={contentHeight ? { height: contentHeight } : undefined}>
        {activeTab === 'rect' && (
          <div className="np-rect-view" ref={rectViewRef}>
            {rectangularGroups.map((group) => (
              <div key={group.key} className="np-group">
                <div className="np-group-title">{group.label}</div>
                <div className="np-grid">
                  {group.colors.map((color) => {
                    const key = `${group.key}-${color.key}`
                    return (
                      <RectNoteCell
                        key={key}
                        data-note-key={key}
                        color={color}
                        aspectRatio={group.aspectRatio}
                        selected={selectedRect === key}
                        onClick={handleCellClick}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'irregular' && (
          <div className="np-irregular-view">
            {irregularShapes.map((shape) => (
              <div key={shape.key} className="np-group">
                <div className="np-group-title">{shape.label}</div>
                <div className="np-grid np-grid--irregular">
                  {irregularColors.map((color) => {
                    const key = `${shape.key}-${color.key}`
                    return (
                      <IrregularNoteCell
                        key={key}
                        data-note-key={key}
                        color={color}
                        shape={shape}
                        selected={selectedIrregular === key}
                        onClick={handleCellClick}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotePanel
