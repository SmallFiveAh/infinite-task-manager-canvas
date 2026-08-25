import React, { useState } from 'react'
import HoverText from 'utils/HoverText'
import CustomScrollContainer from 'utils/CustomScrollContainer'
import { categories } from './data'
import './index.css'

/* =========================================================
   折叠面板组件
   ========================================================= */
function CollapsibleSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="glm-section">
      <button
        className="glm-section-header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="glm-section-title">{title}</span>
        <i className={`bi ${open ? 'bi-chevron-down' : 'bi-chevron-right'} glm-section-icon`} />
      </button>
      {open && <div className="glm-section-body">{children}</div>}
    </div>
  )
}

/* =========================================================
   图形单元格
   ========================================================= */
function ShapeCell({ item, selected, onClick }) {
  const { Comp, name } = item
  return (
    <HoverText text={name}>
      <button
        className={`glm-cell ${selected ? 'selected' : ''}`}
        onClick={onClick}
      >
        <svg viewBox="0 0 40 40" className="glm-cell-svg" aria-hidden="true">
          <Comp />
        </svg>
      </button>
    </HoverText>
  )
}

/* =========================================================
   子分组（子标题 + 6列网格）
   ========================================================= */
function SubGroup({ subGroup, selectedKey, onSelect }) {
  return (
    <div className="glm-subgroup">
      <div className="glm-subgroup-title">{subGroup.label}</div>
      <div className="glm-grid">
        {subGroup.items.map((it) => (
          <ShapeCell
            key={it.key}
            item={it}
            selected={selectedKey === it.key}
            onClick={() => onSelect(it)}
          />
        ))}
      </div>
    </div>
  )
}

/* =========================================================
   主组件
   ========================================================= */
function GraphicsLibraryMenu({ onSelectShape }) {
  const [selectedKey, setSelectedKey] = useState('rect')

  const handleSelect = (item) => {
    setSelectedKey(item.key)
    onSelectShape && onSelectShape(item)
  }

  return (
    <CustomScrollContainer className="graphics-library-menu">
      {categories.map((cat) => (
        <CollapsibleSection key={cat.key} title={cat.label}>
          {cat.subGroups.map((sg) => (
            <SubGroup
              key={sg.key}
              subGroup={sg}
              selectedKey={selectedKey}
              onSelect={handleSelect}
            />
          ))}
        </CollapsibleSection>
      ))}
    </CustomScrollContainer>
  )
}

export default GraphicsLibraryMenu
