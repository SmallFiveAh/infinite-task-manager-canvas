import React, { useCallback, useRef, useState } from 'react'
import HoverText from 'utils/HoverText'
import SelectionOverlay from './SelectionOverlay'
import TaskStorage from './TaskStorage'
import useCanvasRenderer from 'utils/hooks/useCanvasRenderer'
import useCanvasViewport from 'utils/hooks/useCanvasViewport'
import useCanvasInteractions from 'utils/hooks/useCanvasInteractions'
import useCanvasShortcuts from 'utils/hooks/useCanvasShortcuts'
import './index.css'

function TaskCanvas() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  // 视口：平移 offset + 缩放 scale（由渲染器与视口 hook 共享）
  const viewportRef = useRef({ offsetX: 0, offsetY: 0, scale: 1 })
  // 当前激活的工具：'select' 框选任务（默认）/ 'navigate' 平移画布
  const [activeTool, setActiveTool] = useState('select')

  // 渲染器：负责点阵网格绘制与 rAF 合并调度
  const { scheduleDraw } = useCanvasRenderer(canvasRef, containerRef, viewportRef)

  // 视口状态：暴露 scale 与缩放相关操作
  const { scale, setScale, handleResetZoom, handleZoomChangeFromMenu } =
    useCanvasViewport({ viewportRef, canvasRef, scheduleDraw })

  // 画布交互：wheel 缩放 + navigate 平移
  useCanvasInteractions({
    containerRef,
    canvasRef,
    viewportRef,
    setScale,
    scheduleDraw,
    activeTool,
  })

  // 键盘快捷键：V=选择 / H=移动
  useCanvasShortcuts(setActiveTool)

  // 键盘可达性：role="button" 元素响应 Enter / Space 触发重置
  const handleHudKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleResetZoom()
      }
    },
    [handleResetZoom]
  )

  // 选择工具框选结束：SelectionOverlay 把屏幕矩形换算成世界坐标矩形后回调
  // TODO: 目前还没有任务卡片图层，先打印选区；后续接入卡片后做矩形相交命中检测
  const handleSelectionEnd = useCallback((worldRect) => {
    console.log('selection end (world):', worldRect)
  }, [])

  // 便签样式选择（NotePanel 回调）：
  // TODO: 目前还没有任务卡片图层，先记录选择结果；后续接入卡片创建时在此消费
  const handleSelectNote = useCallback((selection) => {
    console.log('note style selected:', selection)
  }, [])

  // 图形库选择（GraphicsLibraryMenu 回调）：
  // TODO: 目前还没有任务卡片图层，先记录选择结果；后续接入卡片创建时在此消费
  const handleSelectShape = useCallback((item) => {
    console.log('shape selected:', item)
  }, [])

  return (
    <div className="task-canvas-container" ref={containerRef}>
      {/* 画布组件 */}
      <canvas ref={canvasRef} className="task-canvas" />
      {/* 选择覆盖层：activeTool === 'select' 时激活，左键拖拽框选；其它工具事件透传给 canvas */}
      <SelectionOverlay
        activeTool={activeTool}
        viewportRef={viewportRef}
        onSelectionEnd={handleSelectionEnd}
        onRedraw={scheduleDraw}
      />
      {/* HUD 组件 */}
      <HoverText text="点击恢复到 100%" className="infinite-canvas-hud-wrapper">
        <div
          className="infinite-canvas-hud"
          onClick={handleResetZoom}
          onKeyDown={handleHudKeyDown}
          role="button"
          tabIndex={0}
        >
          <i className="hud-icon bi bi-arrows-fullscreen" aria-hidden="true" />
          <span className="hud-text">{(scale * 100).toFixed(0)}%</span>
        </div>
      </HoverText>
      {/* 任务存储组件：传入缩放百分比与回调，实现双向联动 */}
      <TaskStorage
        zoomPercent={Math.round(scale * 100)}
        onZoomChange={handleZoomChangeFromMenu}
        onZoomReset={handleResetZoom}
        activeTool={activeTool}
        onActiveToolChange={setActiveTool}
        onSelectShape={handleSelectShape}
        onSelectNote={handleSelectNote}
      />
    </div>
  )
}

export default TaskCanvas
