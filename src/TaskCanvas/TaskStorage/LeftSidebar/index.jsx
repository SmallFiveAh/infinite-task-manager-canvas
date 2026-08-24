import React, { useState } from 'react'
import GraphicsLibraryMenu from './GraphicsLibraryMenu'
import NotePanel from './NotePanel'
import './index.css'

// 需要弹出面板的工具 ID 列表
const PANEL_TOOLS = ['palette', 'sticky']

function LeftSidebar({ onSelectShape, onSelectNote }) {
  // 默认不选中任何工具；避免一打开就弹出图形库菜单
  const [activeTool, setActiveTool] = useState(null)
  // 当前打开的面板工具 ID（null 表示无面板）
  const [openPanel, setOpenPanel] = useState(null)

  const tools = [
    { id: 'palette', icon: 'bi-circle-square', label: '形状与流程图', color: '#8b5cf6' },
    { id: 'text', icon: 'bi-type', label: '文字', color: '#3b82f6' },
    { id: 'freedraw', icon: 'bi-suit-club-fill', label: '手绘', color: '#f59e0b' },
    { id: 'mindmap', icon: 'bi-diagram-3', label: '思维导图', color: '#10b981' },
    { id: 'sticky', icon: 'bi-sticky-fill', label: '便签', color: '#eab308' },
    { id: 'table', icon: 'bi-grid-3x3-gap-fill', label: '表格', color: '#06b6d4' },
    { id: 'document', icon: 'bi-file-text', label: '文档', color: '#ef4444' },
    { id: 'list', icon: 'bi-list-check', label: '列表', color: '#ec4899' },
    { id: 'card', icon: 'bi-card-text', label: '卡片', color: '#6366f1' },
  ]

  const paletteTool = tools.find((t) => t.id === 'palette')
  const stickyTool = tools.find((t) => t.id === 'sticky')

  const handleToolClick = (toolId) => {
    if (PANEL_TOOLS.includes(toolId)) {
      // 点击带面板的工具：切换面板显示
      if (activeTool === toolId && openPanel === toolId) {
        // 已是激活状态且面板开着 → 再次点击关闭
        setOpenPanel(null)
      } else {
        setActiveTool(toolId)
        setOpenPanel(toolId)
      }
    } else {
      // 点击其它工具：切换 activeTool，并关闭所有面板
      setActiveTool(toolId)
      setOpenPanel(null)
    }
  }

  return (
    <>
      <div className="task-storage-left-sidebar">
        <div className="sidebar-tools">
          {tools.map((tool) => (
            <HoverText key={tool.id} text={tool.label} direction="left">
              <button
                className={`sidebar-tool-item ${activeTool === tool.id ? 'active' : ''}`}
                style={{ '--tool-color': tool.color }}
                onClick={() => handleToolClick(tool.id)}
              >
                <i className={`bi ${tool.icon}`} />
              </button>
            </HoverText>
          ))}
        </div>
        <HoverText text="更多" direction="left">
          <button className="sidebar-tool-item sidebar-tool-item--more">
            <i className="bi bi-three-dots" />
          </button>
        </HoverText>
      </div>

      {/* 图形库面板 */}
      {openPanel === 'palette' && (
        <div
          className="graphics-library-panel"
          style={{ '--accent-color': paletteTool.color }}
        >
          <GraphicsLibraryMenu onSelectShape={onSelectShape} />
        </div>
      )}

      {/* 便签面板 */}
      {openPanel === 'sticky' && (
        <div
          className="graphics-library-panel"
          style={{ '--accent-color': stickyTool.color }}
        >
          <NotePanel onSelectNote={onSelectNote} />
        </div>
      )}
    </>
  )
}

export default LeftSidebar
