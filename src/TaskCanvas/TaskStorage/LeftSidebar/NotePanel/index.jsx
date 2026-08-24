import React, { useState } from 'react'
import './index.css'

/* =========================================================
   便签样式数据
   ========================================================= */

// 便签颜色调色板（浅色调，适合便签风格）
const noteColors = [
  { key: 'yellow', name: '柠檬黄', color: '#FEF3C7', border: '#FDE68A' },
  { key: 'amber', name: '琥珀', color: '#FED7AA', border: '#FDBA74' },
  { key: 'orange', name: '橘色', color: '#FECACA', border: '#FCA5A5' },
  { key: 'red', name: '粉红', color: '#FBCFE8', border: '#F9A8D4' },
  { key: 'pink', name: '樱粉', color: '#FCE7F3', border: '#FBCFE8' },
  { key: 'purple', name: '丁香紫', color: '#EDE9FE', border: '#DDD6FE' },
  { key: 'indigo', name: '鸢尾', color: '#DBEAFE', border: '#BFDBFE' },
  { key: 'blue', name: '天蓝', color: '#BAE6FD', border: '#7DD3FC' },
  { key: 'cyan', name: '薄荷青', color: '#A5F3FC', border: '#67E8F9' },
  { key: 'teal', name: '青绿', color: '#CCFBF1', border: '#99F6E4' },
  { key: 'green', name: '嫩绿', color: '#BBF7D0', border: '#86EFAC' },
  { key: 'lime', name: '青柠', color: '#ECFCCB', border: '#D9F99D' },
  { key: 'yellow-green', name: '豆绿', color: '#FEF9C3', border: '#FEF08A' },
  { key: 'cream', name: '奶白', color: '#FEFCE8', border: '#FEF9C3' },
  { key: 'lavender', name: '薰衣草', color: '#F3E8FF', border: '#E9D5FF' },
  { key: 'rose', name: '玫瑰', color: '#FFE4E6', border: '#FECDD3' },
]

/* ---------- 矩形便签分组 ---------- */
const rectangularGroups = [
  {
    key: 'square',
    label: '正方形 (1:1)',
    aspectRatio: '1 / 1',
    colors: noteColors.slice(0, 12),
  },
  {
    key: 'rectangle',
    label: '长方形 (2:1)',
    aspectRatio: '2 / 1',
    colors: noteColors.slice(0, 12),
  },
]

/* ---------- 异形便签分组 ---------- */
// 异形便签使用不同的 borderRadius / clipPath 形状
// style 对象直接传给 React inline style
const irregularShapes = [
  {
    key: 'rounded-corners',
    label: '圆角',
    innerStyle: { borderRadius: '18px' },
  },
  {
    key: 'super-ellipse',
    label: '超圆',
    innerStyle: { borderRadius: '30px' },
  },
  {
    key: 'leaf',
    label: '叶形',
    innerStyle: { borderRadius: '50% 8px 50% 8px' },
  },
  {
    key: 'ribbon',
    label: '飘带',
    innerStyle: { borderRadius: '8px 30px 8px 30px' },
  },
  {
    key: 'cloud',
    label: '云朵',
    innerStyle: { borderRadius: '50%' },
    extraClass: 'shape-cloud',
  },
  {
    key: 'wave',
    label: '波浪',
    innerStyle: {},
    extraClass: 'shape-wave',
  },
  {
    key: 'tag',
    label: '标签',
    innerStyle: {},
    extraClass: 'shape-tag',
  },
  {
    key: 'pencil',
    label: '铅笔头',
    innerStyle: {},
    extraClass: 'shape-pencil',
  },
]

const irregularColors = noteColors.slice(0, 8)

/* =========================================================
   单元格组件
   ========================================================= */

// 矩形便签单元格
function RectNoteCell({ color, aspectRatio, shapeType, selected, onClick }) {
  return (
    <button
      className={`np-cell np-cell--rect ${selected ? 'selected' : ''}`}
      style={{
        '--note-color': color.color,
        '--note-border': color.border,
        aspectRatio: aspectRatio,
      }}
      onClick={onClick}
      title={color.name}
    >
      <span className="np-cell-shine" />
    </button>
  )
}

// 异形便签单元格
function IrregularNoteCell({ color, shape, selected, onClick }) {
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
}

/* =========================================================
   Tab 切换
   ========================================================= */

function TabBar({ activeTab, onChange }) {
  return (
    <div className="np-tab-bar">
      <button
        className={`np-tab ${activeTab === 'rect' ? 'active' : ''}`}
        onClick={() => onChange('rect')}
      >
        矩形
      </button>
      <button
        className={`np-tab ${activeTab === 'irregular' ? 'active' : ''}`}
        onClick={() => onChange('irregular')}
      >
        异形
      </button>
    </div>
  )
}

/* =========================================================
   主组件
   ========================================================= */

function NotePanel({ onSelectNote }) {
  const [activeTab, setActiveTab] = useState('rect')
  const [selectedRect, setSelectedRect] = useState(null) // { groupKey, colorKey }
  const [selectedIrregular, setSelectedIrregular] = useState(null) // { shapeKey, colorKey }

  const handleRectSelect = (group, color) => {
    const selection = { groupKey: group.key, colorKey: color.key, color: color.color, border: color.border, shapeType: 'rect', aspectRatio: group.aspectRatio }
    setSelectedRect(`${group.key}-${color.key}`)
    onSelectNote && onSelectNote(selection)
  }

  const handleIrregularSelect = (shape, color) => {
    const selection = { shapeKey: shape.key, colorKey: color.key, color: color.color, border: color.border, shapeType: 'irregular', innerStyle: shape.innerStyle, extraClass: shape.extraClass }
    setSelectedIrregular(`${shape.key}-${color.key}`)
    onSelectNote && onSelectNote(selection)
  }

  return (
    <div className="note-panel">
      <div className="np-header">
        <span className="np-title">便签样式</span>
      </div>

      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      <div className="np-content">
        {activeTab === 'rect' && (
          <div className="np-rect-view">
            {rectangularGroups.map((group) => (
              <div key={group.key} className="np-group">
                <div className="np-group-title">{group.label}</div>
                <div className="np-grid">
                  {group.colors.map((color) => (
                    <RectNoteCell
                      key={`${group.key}-${color.key}`}
                      color={color}
                      aspectRatio={group.aspectRatio}
                      selected={selectedRect === `${group.key}-${color.key}`}
                      onClick={() => handleRectSelect(group, color)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'irregular' && (
          <div className="np-irregular-view">
            {irregularShapes.map((shape) => (
              <div key={shape.key} className="np-group">
                <div className="np-group-title">{shape.label}</div>
                <div className="np-grid np-grid--irregular">
                  {irregularColors.map((color) => (
                    <IrregularNoteCell
                      key={`${shape.key}-${color.key}`}
                      color={color}
                      shape={shape}
                      selected={selectedIrregular === `${shape.key}-${color.key}`}
                      onClick={() => handleIrregularSelect(shape, color)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotePanel
