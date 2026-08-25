import React from 'react'
import HoverText from 'utils/HoverText'

// 左侧工具栏的通用图标按钮：HoverText 提示 + 图标 + 主题色
function ToolButton({ tool, active = false, onClick }) {
  return (
    <HoverText text={tool.label} direction="left">
      <button
        type="button"
        className={`sidebar-tool-item ${active ? 'active' : ''}`}
        style={{ '--tool-color': tool.color }}
        onClick={onClick}
      >
        <i className={`bi ${tool.icon}`} />
      </button>
    </HoverText>
  )
}

export default ToolButton
