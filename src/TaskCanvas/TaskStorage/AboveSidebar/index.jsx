import React, { useState, useRef, useEffect } from 'react'
import HudMenu from './HudMenu'
import './index.css'

function AboveSidebar({ zoomPercent = 100, onZoomChange, onZoomReset, activeTool = 'select', onActiveToolChange }) {
  const [locked, setLocked] = useState(false)
  const [hudMenuOpen, setHudMenuOpen] = useState(false)
  // 工具切换交给父组件控制；onActiveToolChange 缺省时退化为本组件内不可变状态
  const handleToolChange = (tool) => {
    if (onActiveToolChange) onActiveToolChange(tool)
  }
  const hudMenuRef = useRef(null)

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (hudMenuRef.current && !hudMenuRef.current.contains(e.target)) {
        setHudMenuOpen(false)
      }
    }
    if (hudMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [hudMenuOpen])

  return (
    <div className="task-storage-above-sidebar">
      <HoverText text={locked ? '已锁定' : '锁定画布'}>
        <button
          className={`above-tool-item ${locked ? 'active' : ''}`}
          onClick={() => setLocked(!locked)}
        >
          <i className={`bi ${locked ? 'bi-lock-fill' : 'bi-unlock'}`} />
        </button>
      </HoverText>

      <div className="above-divider" />

      <HoverText text='选择(V)'>
        <button
          className={`above-tool-item ${activeTool === 'select' ? 'active' : ''}`}
          onClick={() => handleToolChange('select')}
        >
          <i className="bi bi-cursor-fill" />
        </button>
      </HoverText>

      <HoverText text='移动(H)'>
        <button
          className={`above-tool-item ${activeTool === 'navigate' ? 'active' : ''}`}
          onClick={() => handleToolChange('navigate')}
        >
          <i className="bi bi-hand-index-thumb-fill" />
        </button>
      </HoverText>

      <div className="above-divider" />

      <HoverText text='缩小'>
        <button
          className="above-tool-item"
          onClick={handleZoomOut}
        >
          <i className="bi bi-dash-lg" />
        </button>
      </HoverText>

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

      <HoverText text='放大'>
        <button
          className="above-tool-item"
          onClick={handleZoomIn}
        >
          <i className="bi bi-plus-lg" />
        </button>
      </HoverText>

      <div className="above-divider" />

      <HoverText text='撤销(Z)'>
        <button
          className="above-tool-item"
        >
          <i className="bi bi-arrow-counterclockwise" />
        </button>
      </HoverText>

      <HoverText text='重做(Y)'>
        <button
          className="above-tool-item"
        >
          <i className="bi bi-arrow-clockwise" />
        </button>
      </HoverText>
    </div>
  )
}

export default AboveSidebar
