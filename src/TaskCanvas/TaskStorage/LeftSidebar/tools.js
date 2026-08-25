// 左侧工具栏的工具定义（模块级常量，避免每次渲染重建数组）
export const TOOLS = [
  { id: 'palette', icon: 'bi-circle-square', label: '形状与流程图', color: '#8b5cf6' },
  { id: 'text', icon: 'bi-type', label: '文字', color: '#3b82f6' },
  { id: 'freedraw', icon: 'bi-suit-club-fill', label: '手绘', color: '#f59e0b' },
  { id: 'mindmap', icon: 'bi-diagram-3', label: '思维导图', color: '#10b981' },
  { id: 'sticky', icon: 'bi-sticky-fill', label: '便签', color: '#eab308' },
  { id: 'table', icon: 'bi-grid-3x3-gap-fill', label: '表格', color: '#06b6d4' },
  { id: 'document', icon: 'bi-file-text', label: '文档', color: '#ef4444' },
  { id: 'list', icon: 'bi-list-check', label: '列表', color: '#ec4899' },
  { id: 'card', icon: 'bi-card-text', label: '卡片', color: '#6366f1' },
]

// 需要弹出面板的工具 ID 列表
export const PANEL_TOOLS = ['palette', 'sticky']

// 便捷访问：带面板的工具对象
export const PANEL_TOOL_BY_ID = Object.fromEntries(
  TOOLS.filter((t) => PANEL_TOOLS.includes(t.id)).map((t) => [t.id, t])
)
