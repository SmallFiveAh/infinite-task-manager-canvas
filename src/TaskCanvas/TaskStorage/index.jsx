import React from 'react'
import LeftSidebar from './LeftSidebar'
import AboveSidebar from './AboveSidebar'
import './index.css'


function TaskStorage({
  zoomPercent,
  onZoomChange,
  onZoomReset,
  activeTool,
  onActiveToolChange,
  onSelectShape,
  onSelectNote,
}) {
  return (
    <div className="task-storage-container">
      <div className="task-storage-navbar">
        {/* 这里存储所有导航栏组件 */}
        {/* 左侧导航栏 */}
        <LeftSidebar onSelectShape={onSelectShape} onSelectNote={onSelectNote} />
        {/* 顶部导航栏 */}
        <AboveSidebar
          zoomPercent={zoomPercent}
          onZoomChange={onZoomChange}
          onZoomReset={onZoomReset}
          activeTool={activeTool}
          onActiveToolChange={onActiveToolChange}
        />
      </div>
      {/* 所有任务卡片都存储在这里 */}
    </div>
  )
}
export default TaskStorage
