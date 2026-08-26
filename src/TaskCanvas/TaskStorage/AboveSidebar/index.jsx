import React, { useState } from 'react'
import HoverText from 'utils/HoverText'
import HudMenu from './HudMenu'
import ToolButton from './ToolButton'
import useClickOutside from './useClickOutside'
import './index.css'

function AboveSidebar({
  zoomPercent = 100,
  onZoomChange,
  onZoomReset: _onZoomReset,
  activeTool = 'select',
  onActiveToolChange,
}) {
  const [locked, setLocked] = useState(false)
  const [hudMenuOpen, setHudMenuOpen] = useState(false)
  const hudMenuRef = useClickOutside(() => setHudMenuOpen(false))

  const handleToolChange = (tool) => {
    if (onActiveToolChange) onActiveToolChange(tool)
  }

  const handleZoomIn = () => {
    if (onZoomChange) onZoomChange(Math.min(400, zoomPercent + 10))
  }

  const handleZoomOut = () => {
    if (onZoomChange) onZoomChange(Math.max(20, zoomPercent - 10))
  }

  const handleSelectZoom = (level) => {
    if (onZoomChange) onZoomChange(level)
    setHudMenuOpen(false)
  }

  return (
    <div className="task-storage-above-sidebar">
      <ToolButton
        text={locked ? '已锁定' : '锁定画布'}
        icon={locked ? 'bi-lock-fill' : 'bi-unlock'}
        active={locked}
        onClick={() => setLocked(!locked)}
      />

      <div className="above-divider" />

      <ToolButton
        text="选择(V)"
        icon="bi-cursor-fill"
        active={activeTool === 'select'}
        onClick={() => handleToolChange('select')}
      />

      <ToolButton
        text="移动(H)"
        icon="bi-hand-index-thumb-fill"
        active={activeTool === 'navigate'}
        onClick={() => handleToolChange('navigate')}
      />

      <div className="above-divider" />

      <ToolButton text="缩小" icon="bi-dash-lg" onClick={handleZoomOut} />

      <div className="above-zoom-wrapper" ref={hudMenuRef}>
        <HoverText text="缩放比例">
          <div
            className={`above-zoom-label ${hudMenuOpen ? 'active' : ''}`}
            onClick={() => setHudMenuOpen(!hudMenuOpen)}
          >
            {zoomPercent}%
          </div>
        </HoverText>
        {hudMenuOpen && (
          <div className="above-zoom-dropdown">
            <HudMenu zoom={zoomPercent} onZoomChange={handleSelectZoom} />
          </div>
        )}
      </div>

      <ToolButton text="放大" icon="bi-plus-lg" onClick={handleZoomIn} />

      <div className="above-divider" />

      <ToolButton text="撤销(Z)" icon="bi-arrow-counterclockwise" />
      <ToolButton text="重做(Y)" icon="bi-arrow-clockwise" />
    </div>
  )
}

export default AboveSidebar
