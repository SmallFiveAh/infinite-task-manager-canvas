/* =========================================================
   便签样式数据与选择构建
   ========================================================= */

// 便签颜色调色板（浅色调，适合便签风格）
export const noteColors = [
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
export const rectangularGroups = [
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
export const irregularShapes = [
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

// 异形便签可选颜色
export const irregularColors = noteColors.slice(0, 8)

/* =========================================================
   选择构建（纯函数，供画布创建便签时复用）
   ========================================================= */

export const buildRectSelection = (group, color) => ({
  groupKey: group.key,
  colorKey: color.key,
  color: color.color,
  border: color.border,
  shapeType: 'rect',
  aspectRatio: group.aspectRatio,
})

export const buildIrregularSelection = (shape, color) => ({
  shapeKey: shape.key,
  colorKey: color.key,
  color: color.color,
  border: color.border,
  shapeType: 'irregular',
  innerStyle: shape.innerStyle,
  extraClass: shape.extraClass,
})

/* =========================================================
   单元格 key → 选择对象 映射（供事件委托 O(1) 反查）
   ========================================================= */

const rectEntries = rectangularGroups.flatMap((group) =>
  group.colors.map((color) => ({
    key: `${group.key}-${color.key}`,
    selection: buildRectSelection(group, color),
  }))
)

const irregularEntries = irregularShapes.flatMap((shape) =>
  irregularColors.map((color) => ({
    key: `${shape.key}-${color.key}`,
    selection: buildIrregularSelection(shape, color),
  }))
)

export const rectByKey = new Map(rectEntries.map((entry) => [entry.key, entry]))
export const irregularByKey = new Map(irregularEntries.map((entry) => [entry.key, entry]))
