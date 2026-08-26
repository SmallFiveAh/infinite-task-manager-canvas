import React from 'react'
import HoverText from 'utils/HoverText'

// 左侧工具栏的通用图标按钮：HoverText 提示 + 图标 + 主题色
// draggable / onDragStart 用于支持「按住拖到画布」类工具（如便签）
// pointerHandlers 透传 onPointerDown/Move/Up/Cancel，用于自定义拖拽（如便签的虚拟预览）
function ToolButton({ tool, active = false, onClick, draggable = false, onDragStart, pointerHandlers = {} }) {
  return (
    <HoverText text={tool.label} direction="left">
      <button
        type="button"
        className={`sidebar-tool-item ${active ? 'active' : ''}`}
        style={{ '--tool-color': tool.color }}
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
        {...pointerHandlers}
      >
        <i className={`bi ${tool.icon}`} />
      </button>
    </HoverText>
  )
}

export default ToolButton
