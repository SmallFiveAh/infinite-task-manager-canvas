import React from 'react'
import HoverText from 'utils/HoverText'

// 左侧工具栏的通用图标按钮：HoverText 提示 + 图标 + 主题色
// draggable / onDragStart 用于支持「按住拖到画布」类工具（如便签）
function ToolButton({ tool, active = false, onClick, draggable = false, onDragStart }) {
  return (
    <HoverText text={tool.label} direction="left">
      <button
        type="button"
        className={`sidebar-tool-item ${active ? 'active' : ''}`}
        style={{ '--tool-color': tool.color }}
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
      >
        <i className={`bi ${tool.icon}`} />
      </button>
    </HoverText>
  )
}

export default ToolButton
