import React, { useState } from 'react'
import './index.css'

function LeftSidebar() {
  const [activeTool, setActiveTool] = useState('palette')

  const tools = [
    { id: 'palette', icon: 'bi-circle-square', label: '形状与流程图', color: '#8b5cf6' },
    { id: 'text', icon: 'bi-type', label: '文字', color: '#3b82f6' },
    { id: 'freedraw', icon: 'bi-suit-club-fill', label: '手绘', color: '#f59e0b' },
    { id: 'mindmap', icon: 'bi-diagram-3', label: '思维导图', color: '#10b981' },
    { id: 'sticky', icon: 'bi-sticky-fill', label: '便利贴', color: '#eab308' },
    { id: 'table', icon: 'bi-grid-3x3-gap-fill', label: '表格', color: '#06b6d4' },
    { id: 'document', icon: 'bi-file-text', label: '文档', color: '#ef4444' },
    { id: 'list', icon: 'bi-list-check', label: '列表', color: '#ec4899' },
    { id: 'card', icon: 'bi-card-text', label: '卡片', color: '#6366f1' },
  ]

  return (
    <div className="task-storage-left-sidebar">
      <div className="sidebar-tools">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`sidebar-tool-item ${activeTool === tool.id ? 'active' : ''}`}
            style={{ '--tool-color': tool.color }}
            onClick={() => setActiveTool(tool.id)}
            title={tool.label}
          >
            <i className={`bi ${tool.icon}`} />
          </button>
        ))}
      </div>
      <button className="sidebar-tool-item sidebar-tool-item--more" title="更多">
        <i className="bi bi-three-dots" />
      </button>
    </div>
  )
}

export default LeftSidebar
