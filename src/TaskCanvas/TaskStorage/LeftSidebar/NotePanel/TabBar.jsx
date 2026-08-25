import React from 'react'

/* =========================================================
   Tab 切换（矩形 / 异形）
   ========================================================= */

const TABS = [
  { id: 'rect', label: '矩形' },
  { id: 'irregular', label: '异形' },
]

function TabBar({ activeTab, onChange }) {
  return (
    <div className="np-tab-bar" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`np-tab ${activeTab === tab.id ? 'active' : ''}`}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default TabBar
