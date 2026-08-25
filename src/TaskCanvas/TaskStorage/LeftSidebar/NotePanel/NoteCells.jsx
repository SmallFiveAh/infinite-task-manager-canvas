import React, { memo } from 'react'

/* =========================================================
   便签单元格（memo 优化：props 均为稳定引用，
   点击时仅 selected 变化的单元格重渲染）
   ========================================================= */

// 矩形便签单元格
export const RectNoteCell = memo(function RectNoteCell({ color, aspectRatio, selected, onClick }) {
  return (
    <button
      className={`np-cell np-cell--rect ${selected ? 'selected' : ''}`}
      style={{
        '--note-color': color.color,
        '--note-border': color.border,
        aspectRatio,
      }}
      onClick={onClick}
      title={color.name}
    >
      <span className="np-cell-shine" />
    </button>
  )
})

// 异形便签单元格
export const IrregularNoteCell = memo(function IrregularNoteCell({ color, shape, selected, onClick }) {
  return (
    <button
      className={`np-cell np-cell--irregular ${shape.extraClass || ''} ${selected ? 'selected' : ''}`}
      style={{
        '--note-color': color.color,
        '--note-border': color.border,
      }}
      onClick={onClick}
      title={`${shape.label} · ${color.name}`}
    >
      <span
        className="np-cell-inner"
        style={{
          background: color.color,
          borderColor: color.border,
          ...shape.innerStyle,
        }}
      />
    </button>
  )
})
