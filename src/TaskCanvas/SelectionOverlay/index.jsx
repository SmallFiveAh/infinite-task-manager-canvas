import React from 'react'
import useSelectionInteraction from './useSelectionInteraction'
import './index.css'

function SelectionOverlay({ activeTool, viewportRef, onSelectionEnd, onRedraw }) {
  const isActive = activeTool === 'select'
  const {
    boxStyle,
    isPanning,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useSelectionInteraction({ viewportRef, onSelectionEnd, onRedraw })

  return (
    <div
      className={`selection-overlay ${isActive ? 'active' : ''}`}
      style={isPanning ? { cursor: 'grabbing' } : undefined}
      onPointerDown={isActive ? handlePointerDown : undefined}
      onPointerMove={isActive ? handlePointerMove : undefined}
      onPointerUp={isActive ? handlePointerUp : undefined}
    >
      {boxStyle && <div className="selection-box" style={boxStyle} />}
    </div>
  )
}

export default SelectionOverlay
