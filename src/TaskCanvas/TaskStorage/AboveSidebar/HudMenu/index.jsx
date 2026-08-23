import React from 'react'
import './index.css'

const ZOOM_OPTIONS = [50, 75, 100, 150, 200, 300, 400]

function HudMenu({ zoom, onZoomChange }) {
  return (
    <div className="hud-menu">
      {ZOOM_OPTIONS.map((level) => (
        <button
          key={level}
          className={`hud-menu-item ${zoom === level ? 'active' : ''}`}
          onClick={() => onZoomChange(level)}
        >
          <span className="hud-menu-label">{level}%</span>
          {zoom === level && <i className="bi bi-check2 hud-menu-check" />}
        </button>
      ))}
    </div>
  )
}

export default HudMenu
