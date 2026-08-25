import React from 'react'
import HoverText from 'utils/HoverText'

// 顶部工具栏的通用图标按钮：HoverText 提示 + 图标
function ToolButton({ text, icon, active = false, onClick, className = '' }) {
  return (
    <HoverText text={text}>
      <button
        type="button"
        className={`above-tool-item ${active ? 'active' : ''} ${className}`.trim()}
        onClick={onClick}
      >
        <i className={`bi ${icon}`} />
      </button>
    </HoverText>
  )
}

export default ToolButton
