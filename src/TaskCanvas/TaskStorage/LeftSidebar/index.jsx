import React, { useCallback, useState } from 'react'
import HoverText from 'utils/HoverText'
import GraphicsLibraryMenu from './GraphicsLibraryMenu'
import NotePanel from './NotePanel'
import ToolButton from './ToolButton'
import { TOOLS, PANEL_TOOLS, PANEL_TOOL_BY_ID } from './tools'

import './index.css'

function LeftSidebar({ onSelectShape, onSelectNote, stickyDragHandlers, stickyDidDragRef }) {
  // 默认不选中任何工具；避免一打开就弹出图形库菜单
  const [activeTool, setActiveTool] = useState(null)
  // 当前打开的面板工具 ID（null 表示无面板）
  const [openPanel, setOpenPanel] = useState(null)

  const handleToolClick = useCallback(
    (toolId) => {
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
    },
    [activeTool, openPanel]
  )

  const paletteTool = PANEL_TOOL_BY_ID.palette
  const stickyTool = PANEL_TOOL_BY_ID.sticky

  // 便签按钮点击：若刚经历过拖拽（浏览器在 pointerup 后仍会触发 click），
  // 则抑制其“打开便签面板”的副作用，只保留添加便签行为。
  // 依赖 handleToolClick，避免持有旧闭包导致“再次点击关闭面板”失效
  const handleStickyClick = useCallback(() => {
    if (stickyDidDragRef && stickyDidDragRef.current) {
      stickyDidDragRef.current = false
      return
    }
    handleToolClick('sticky')
  }, [stickyDidDragRef, handleToolClick])

  return (
    <>
      <div className="task-storage-left-sidebar">
        <div className="sidebar-tools">
          {TOOLS.map((tool) => (
            <ToolButton
              key={tool.id}
              tool={tool}
              active={activeTool === tool.id}
              onClick={tool.id === 'sticky' ? handleStickyClick : () => handleToolClick(tool.id)}
              draggable={false}
              pointerHandlers={tool.id === 'sticky' ? stickyDragHandlers : undefined}
            />
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
