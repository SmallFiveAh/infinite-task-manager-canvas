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
      <button
        className={`above-tool-item ${locked ? 'active' : ''}`}
        onClick={() => setLocked(!locked)}
      >
        <HoverText text={locked ? '已锁定' : '锁定画布'}>
          <i className={`bi ${locked ? 'bi-lock-fill' : 'bi-unlock'}`} />
        </HoverText>
      </button>

      <div className="above-divider" />

      <button
        className={`above-tool-item ${activeTool === 'select' ? 'active' : ''}`}
        onClick={() => handleToolChange('select')}
      >
        <HoverText text='选择(V)'>
          <i className="bi bi-cursor-fill" />
        </HoverText>
      </button>

      <button
        className={`above-tool-item ${activeTool === 'navigate' ? 'active' : ''}`}
        onClick={() => handleToolChange('navigate')}
      >
        <HoverText text='移动(H)'>
          <i className="bi bi-hand-index-thumb-fill" />
        </HoverText>
      </button>

      <div className="above-divider" />

      <button
        className="above-tool-item"
        onClick={handleZoomOut}
      >
        <HoverText text='缩小'>
          <i className="bi bi-dash-lg" />
        </HoverText>
      </button>

      <div className="above-zoom-wrapper" ref={hudMenuRef}>
        <div
          className={`above-zoom-label ${hudMenuOpen ? 'active' : ''}`}
          onClick={() => setHudMenuOpen(!hudMenuOpen)}
        >
          <HoverText text="缩放比例">
            {zoomPercent}%
          </HoverText>
        </div>
        {hudMenuOpen && (
          <div className="above-zoom-dropdown">
            <HudMenu zoom={zoomPercent} onZoomChange={handleSelectZoom} />
          </div>
        )}
      </div>

      <button
        className="above-tool-item"
        onClick={handleZoomIn}
      >
        <HoverText text='放大'>
          <i className="bi bi-plus-lg" />
        </HoverText>
      </button>

      <div className="above-divider" />

      <button
        className="above-tool-item"
      >
        <HoverText text='撤销(Z)'>
          <i className="bi bi-arrow-counterclockwise" />
        </HoverText>
      </button>

      <button
        className="above-tool-item"
      >
        <HoverText text='重做(Y)'>
          <i className="bi bi-arrow-clockwise" />
        </HoverText>
      </button>
    </div>
  )
}

export default AboveSidebar
