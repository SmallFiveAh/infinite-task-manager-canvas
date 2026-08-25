import React, { memo } from 'react'
import HoverText from 'utils/HoverText'

/* =========================================================
   便签单元格（memo 优化：props 均为稳定引用，
   点击时仅 selected 变化的单元格重渲染）
   - 使用 HoverText 悬停提示（与图形库单元格交互保持一致）
   ========================================================= */

// 矩形便签单元格
export const RectNoteCell = memo(function RectNoteCell({ color, aspectRatio, selected, onClick }) {
  return (
    <HoverText text={color.name} className="np-cell-hover-trigger">
      <button
        className={`np-cell np-cell--rect ${selected ? 'selected' : ''}`}
        style={{
          '--note-color': color.color,
          '--note-border': color.border,
          aspectRatio,
        }}
        onClick={onClick}
        aria-label={color.name}
      >
        <span className="np-cell-shine" />
      </button>
    </HoverText>
  )
})

// 异形便签单元格
export const IrregularNoteCell = memo(function IrregularNoteCell({ color, shape, selected, onClick }) {
  const hoverText = `${shape.label} · ${color.name}`
  return (
    <HoverText text={hoverText} className="np-cell-hover-trigger">
      <button
        className={`np-cell np-cell--irregular ${shape.extraClass || ''} ${selected ? 'selected' : ''}`}
        style={{
          '--note-color': color.color,
          '--note-border': color.border,
        }}
        onClick={onClick}
        aria-label={hoverText}
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
    </HoverText>
  )
})
