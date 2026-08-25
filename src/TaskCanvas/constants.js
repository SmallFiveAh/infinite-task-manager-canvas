// 风格点阵网格参数
export const GRID_SIZE = 22 // 基础世界网格间距（100% 时 = 22px 屏幕间距）
export const DOT_RADIUS_MAIN = 1.2 // 主点阵半径（CSS 像素，屏幕上永远这么大）
export const DOT_RADIUS_MINOR = 0.6 // 次级点阵半径（CSS 像素，屏幕上永远这么大）
export const MINOR_DIV = 5 // 每个主格子细分为 5×5 小格

export const LOD_MIN_SCREEN_GAP = 16 // LOD 下限：屏幕间距 < 16px 就 step×2 跳变（保证不密集）
export const LOD_MAX_STEP = 64 // 最大跳变层级，超过则视为远景不渲染
export const MINOR_APPEAR_SCREEN_GAP = 50 // 放大到此屏幕间距时开始出现次级点阵
export const MINOR_MIN_SCREEN_GAP = 6 // 次级点阵至少要 6px 屏幕间距才画

export const MIN_SCALE = 0.2 // 最小缩放比例
export const MAX_SCALE = 4 // 最大缩放比例
export const ZOOM_INTENSITY = 0.0015 // 缩放强度

// 画布颜色：读取设计 token 失败时的兜底值
export const DEFAULT_CANVAS_BG = '#fafafa'
export const DEFAULT_GRID_DOT = '#d4d7de'

// 滚轮事件需要放行给浏览器原生滚动的面板类名
export const SCROLLED_PANEL_CLASSES = [
  'graphics-library-menu',
  'graphics-library-panel',
  'task-storage-left-sidebar',
  'hud-menu',
]
