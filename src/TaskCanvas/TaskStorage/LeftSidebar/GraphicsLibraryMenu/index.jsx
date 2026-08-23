import React, { useEffect, useRef, useState, useCallback } from 'react'
import './index.css'

/* =========================================================
   单个图形 SVG（统一使用 40x40 viewBox，stroke 黑色，无填充）
   ========================================================= */
const strokeProps = {
  fill: 'none',
  stroke: '#1f2937',
  strokeWidth: 1.5,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
}

/* ---------- 流程图 ---------- */
// 1. 矩形
const SRectangle = () => <rect x="6" y="10" width="28" height="20" rx="0" {...strokeProps} />
// 2. 圆角矩形
const SRoundedRect = () => <rect x="6" y="10" width="28" height="20" rx="4" {...strokeProps} />
// 3. 菱形
const SDiamond = () => (
  <polygon points="20,5 35,20 20,35 5,20" {...strokeProps} />
)
// 4. 缺角矩形（文档）
const SDocNotch = () => (
  <path d="M6 10 L28 10 L34 16 L34 30 L6 30 Z" {...strokeProps} />
)
// 5. 平行四边形（左倾斜）
const SParallelogramLeft = () => (
  <polygon points="12,10 34,10 28,30 6,30" {...strokeProps} />
)
// 6. 椭圆
const SEllipse = () => <ellipse cx="20" cy="20" rx="14" ry="9" {...strokeProps} />
// 7. 胶囊（长椭圆）
const SCapsule = () => <rect x="4" y="12" width="32" height="16" rx="8" {...strokeProps} />
// 8. 圆
const SCircle = () => <circle cx="20" cy="20" r="11" {...strokeProps} />
// 9. 数据库（三横线圆柱正视图）
const SDatabase = () => (
  <>
    <rect x="8" y="10" width="24" height="20" {...strokeProps} />
    <path d="M8 16 a12 4 0 0 0 24 0" {...strokeProps} />
    <path d="M8 24 a12 4 0 0 0 24 0" {...strokeProps} />
  </>
)
// 10. 数据/输入输出（斜平行四边形 右倾）
const SParallelogramRight = () => (
  <polygon points="10,10 34,10 30,30 6,30" {...strokeProps} />
)
// 11. 圆柱（存储）
const SCylinder = () => (
  <>
    <path d="M8 12 a12 4 0 0 0 24 0 L32 28 a12 4 0 0 1 -24 0 Z" {...strokeProps} />
    <path d="M8 28 a12 4 0 0 0 24 0" {...strokeProps} />
  </>
)
// 12. 文档（上折角）
const SDocFold = () => (
  <path d="M8 8 L26 8 L32 14 L32 32 L8 32 Z" {...strokeProps} />
)
// 13. 多文档
const SMultiDoc = () => (
  <>
    <path d="M10 14 L24 14 L28 18 L28 32 L10 32 Z" {...strokeProps} />
    <path d="M14 8 L28 8 L32 12 L32 26" {...strokeProps} />
  </>
)
// 14. 预定义过程（双竖线）
const SPredefined = () => (
  <>
    <rect x="5" y="10" width="30" height="20" rx="2" {...strokeProps} />
    <line x1="9" y1="10" x2="9" y2="30" {...strokeProps} />
    <line x1="31" y1="10" x2="31" y2="30" {...strokeProps} />
  </>
)
// 15. 环形/循环
const SLoop = () => (
  <path d="M10 20 a10 10 0 1 1 14 8" {...strokeProps} />
)
// 16. 磁带/顺序存取
const STape = () => (
  <path d="M6 12 L34 12 L30 28 L10 28 Z" {...strokeProps} />
)
// 17. 穿孔卡
const SPunchedCard = () => (
  <>
    <rect x="4" y="10" width="32" height="20" {...strokeProps} />
    <path d="M14 10 L10 18" {...strokeProps} />
  </>
)
// 18. 手动操作（不规则上凹）
const SManualOp = () => (
  <path d="M6 30 L6 14 L34 14 L34 30 Z M10 14 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0" {...strokeProps} />
)
// 19. 排序（梯形 下窄）
const STrapBottom = () => (
  <polygon points="10,10 30,10 34,30 6,30" {...strokeProps} />
)
// 20. 数据存储（圆柱侧）其实复用，先不同：梯形上窄
const STrapTop = () => (
  <polygon points="6,10 34,10 30,30 10,30" {...strokeProps} />
)
// 21. 准备/六边形
const SHexagon = () => (
  <polygon points="10,10 30,10 36,20 30,30 10,30 4,20" {...strokeProps} />
)
// 22. 注释/三点
const SAnnotation = () => (
  <>
    <path d="M6 10 L30 10 L30 30 L6 30 Z" {...strokeProps} />
    <circle cx="14" cy="20" r="1.4" fill="#1f2937" />
    <circle cx="20" cy="20" r="1.4" fill="#1f2937" />
    <circle cx="26" cy="20" r="1.4" fill="#1f2937" />
  </>
)
// 23. 半闭合（终止 半圆）
const SSemiClosed = () => (
  <path d="M8 10 a12 12 0 0 1 0 24 L8 10" {...strokeProps} />
)
// 24. 决策OR（菱形内OR）
const SOr = () => (
  <>
    <polygon points="20,5 35,20 20,35 5,20" {...strokeProps} />
    <path d="M12 26 L28 14 M12 14 L28 26" {...strokeProps} />
  </>
)
// 25. 数据合并（箭头向下的漏斗-ish）
const SMerge = () => (
  <>
    <rect x="6" y="10" width="28" height="10" {...strokeProps} />
    <polygon points="8,20 32,20 20,32" {...strokeProps} />
  </>
)
// 26. 显示
const SDisplay = () => (
  <path d="M6 10 L32 10 L36 30 L6 30 Z" {...strokeProps} />
)
// 27. 限制符（括号）
const SBracket = () => (
  <>
    <path d="M10 30 L6 30 L6 10 L10 10" {...strokeProps} />
    <path d="M30 30 L34 30 L34 10 L30 10" {...strokeProps} />
  </>
)
// 28. 终止
const STerminator = () => (
  <path d="M10 30 a10 10 0 0 1 0 -20 h20 a10 10 0 0 1 0 20 z" {...strokeProps} />
)
// 29. 流程卡片
const SFlowCard = () => (
  <>
    <rect x="5" y="10" width="30" height="20" rx="2" {...strokeProps} />
    <circle cx="20" cy="20" r="5" {...strokeProps} />
  </>
)
// 30. 决策等号
const SEqual = () => (
  <>
    <rect x="5" y="10" width="30" height="20" rx="2" {...strokeProps} />
    <line x1="12" y1="17" x2="28" y2="17" {...strokeProps} />
    <line x1="12" y1="23" x2="28" y2="23" {...strokeProps} />
  </>
)
// 31. 半圆
const SSemicircle = () => (
  <path d="M6 27 a14 14 0 0 1 28 0 Z" {...strokeProps} />
)
// 32. 梯形
const STrapezoid = () => <STrapBottom />
// 33. 不规则
const SIrregular = () => (
  <path d="M6 26 Q10 10 20 12 Q32 14 34 26 Q28 32 20 30 Q10 32 6 26 Z" {...strokeProps} />
)
// 34. 圆角五边形
const SPentagon = () => (
  <polygon points="20,6 34,16 30,32 10,32 6,16" {...strokeProps} />
)

/* ---------- 泳道 ---------- */
// 水平泳道
const SLaneHorizontal = () => (
  <>
    <rect x="5" y="8" width="30" height="24" {...strokeProps} />
    <line x1="5" y1="20" x2="35" y2="20" {...strokeProps} />
    <rect x="5" y="8" width="8" height="24" fill="rgba(31,41,55,0.15)" stroke="#1f2937" strokeWidth="1.5" />
  </>
)
// 垂直泳道
const SLaneVertical = () => (
  <>
    <rect x="8" y="5" width="24" height="30" {...strokeProps} />
    <line x1="20" y1="5" x2="20" y2="35" {...strokeProps} />
    <rect x="8" y="5" width="24" height="8" fill="rgba(31,41,55,0.15)" stroke="#1f2937" strokeWidth="1.5" />
  </>
)

/* ---------- 基础图形 ---------- */
const BSquare = () => <rect x="8" y="8" width="24" height="24" {...strokeProps} />
const BRoundedSquare = () => <rect x="8" y="8" width="24" height="24" rx="5" {...strokeProps} />
const BSoftSquare = () => <rect x="8" y="8" width="24" height="24" rx="9" {...strokeProps} />
const BCircle = () => <circle cx="20" cy="20" r="11" {...strokeProps} />
const BRefresh = () => (
  <path d="M30 14 a12 12 0 1 0 -4 9" {...strokeProps} />
)
const BTriangle = () => (
  <polygon points="20,6 34,32 6,32" {...strokeProps} />
)
const BDiamond = () => <SDiamond />
const BParallelogram = () => <SParallelogramRight />
const BStar = () => (
  <polygon points="20,5 24,15 34,16 26,23 29,33 20,28 11,33 14,23 6,16 16,15" {...strokeProps} />
)
const BHalfCircle = () => <SSemicircle />
const BTagCapsule = () => <SCapsule />
const BHouse = () => (
  <>
    <polygon points="20,7 33,18 33,32 7,32 7,18" {...strokeProps} />
    <line x1="20" y1="7" x2="7" y2="18" {...strokeProps} />
  </>
)
const BTrapezoid = () => <STrapBottom />
const BHexagon = () => <SHexagon />
const BPlus = () => (
  <>
    <line x1="8" y1="20" x2="32" y2="20" {...strokeProps} />
    <line x1="20" y1="8" x2="20" y2="32" {...strokeProps} />
  </>
)

/* ---------- 注释 ---------- */
const ALeftBrace = () => (
  <path d="M26 7 Q22 7 22 13 Q22 17 18 20 Q22 23 22 27 Q22 33 26 33" {...strokeProps} />
)
const ARightBracket = () => (
  <>
    <line x1="10" y1="7" x2="26" y2="7" {...strokeProps} />
    <line x1="26" y1="7" x2="26" y2="33" {...strokeProps} />
    <line x1="10" y1="33" x2="26" y2="33" {...strokeProps} />
  </>
)
const ALeftBracket = () => (
  <>
    <line x1="30" y1="7" x2="14" y2="7" {...strokeProps} />
    <line x1="14" y1="7" x2="14" y2="33" {...strokeProps} />
    <line x1="30" y1="33" x2="14" y2="33" {...strokeProps} />
  </>
)
const ARightBrace = () => (
  <path d="M14 7 Q18 7 18 13 Q18 17 22 20 Q18 23 18 27 Q18 33 14 33" {...strokeProps} />
)
const AEqualSign = () => (
  <>
    <line x1="8" y1="16" x2="32" y2="16" {...strokeProps} />
    <line x1="8" y1="24" x2="32" y2="24" {...strokeProps} />
    <line x1="28" y1="16" x2="32" y2="22" {...strokeProps} />
    <line x1="28" y1="24" x2="32" y2="18" {...strokeProps} />
  </>
)
const AThreeHoriz = () => (
  <>
    <line x1="8" y1="14" x2="32" y2="14" {...strokeProps} />
    <line x1="8" y1="20" x2="32" y2="20" {...strokeProps} />
    <line x1="8" y1="26" x2="32" y2="26" {...strokeProps} />
  </>
)
const AThreeWavy = () => (
  <>
    <path d="M8 14 q4 -4 8 0 t8 0 t8 0" {...strokeProps} />
    <path d="M8 20 q4 -4 8 0 t8 0 t8 0" {...strokeProps} />
    <path d="M8 26 q4 -4 8 0 t8 0 t8 0" {...strokeProps} />
  </>
)
const AEquals = () => (
  <>
    <path d="M8 16 Q14 12 20 16 Q26 20 32 16" {...strokeProps} />
    <path d="M8 24 Q14 20 20 24 Q26 28 32 24" {...strokeProps} />
  </>
)

/* ---------- 方向 ---------- */
const DRightArrow = () => (
  <path d="M7 20 L30 20 M22 12 L30 20 L22 28" {...strokeProps} />
)
const DLeftArrow = () => (
  <path d="M33 20 L10 20 M18 12 L10 20 L18 28" {...strokeProps} />
)
const DDoubleArrow = () => (
  <path d="M13 20 L27 20 M6 20 L14 14 M6 20 L14 26 M34 20 L26 14 M34 20 L26 26" {...strokeProps} />
)
const DCurvedArrow = () => (
  <>
    <path d="M8 28 Q8 10 28 10" {...strokeProps} />
    <path d="M26 10 L32 14 L30 20" {...strokeProps} />
  </>
)
const DLeftChevron = () => (
  <path d="M26 10 L14 20 L26 30" {...strokeProps} />
)
const DRightChevron = () => (
  <path d="M14 10 L26 20 L14 30" {...strokeProps} />
)
const DRightThick = () => (
  <path d="M8 12 L22 12 L22 8 L34 20 L22 32 L22 28 L8 28 Z" {...strokeProps} />
)
const DLeftThick = () => (
  <path d="M32 12 L18 12 L18 8 L6 20 L18 32 L18 28 L32 28 Z" {...strokeProps} />
)

/* ---------- 多边形 ---------- */
const PHexagon = () => (
  <polygon points="20,6 33,13 33,27 20,34 7,27 7,13" {...strokeProps} />
)
/* ---------- 直线 ---------- */
const LHorizontal = () => <line x1="4" y1="20" x2="36" y2="20" {...strokeProps} />
const LVertical = () => <line x1="20" y1="4" x2="20" y2="36" {...strokeProps} />

/* =========================================================
   图形数据定义
   ========================================================= */
const categories = [
  {
    key: 'flowchart',
    label: '流程图',
    subGroups: [
      {
        key: 'flowchart-main',
        label: '流程图',
        items: [
          { key: 'rect', name: '矩形', Comp: SRectangle },
          { key: 'round-rect', name: '圆角矩形', Comp: SRoundedRect },
          { key: 'diamond', name: '菱形', Comp: SDiamond },
          { key: 'doc-notch', name: '文档（缺角）', Comp: SDocNotch },
          { key: 'para-left', name: '平行四边形（左）', Comp: SParallelogramLeft },
          { key: 'ellipse', name: '椭圆', Comp: SEllipse },
          { key: 'capsule', name: '胶囊', Comp: SCapsule },
          { key: 'circle', name: '圆', Comp: SCircle },
          { key: 'database', name: '数据库', Comp: SDatabase },
          { key: 'para-right', name: '平行四边形（右）', Comp: SParallelogramRight },
          { key: 'cylinder', name: '圆柱', Comp: SCylinder },
          { key: 'doc-fold', name: '文档（折角）', Comp: SDocFold },
          { key: 'multi-doc', name: '多文档', Comp: SMultiDoc },
          { key: 'predefined', name: '预定义过程', Comp: SPredefined },
          { key: 'loop', name: '循环', Comp: SLoop },
          { key: 'tape', name: '磁带', Comp: STape },
          { key: 'punched-card', name: '穿孔卡', Comp: SPunchedCard },
          { key: 'manual-op', name: '手动操作', Comp: SManualOp },
          { key: 'trap-bottom', name: '排序（下窄梯形）', Comp: STrapBottom },
          { key: 'trap-top', name: '上窄梯形', Comp: STrapTop },
          { key: 'hexagon', name: '准备/六边形', Comp: SHexagon },
          { key: 'annotation', name: '注释', Comp: SAnnotation },
          { key: 'semi-closed', name: '终止（半闭合）', Comp: SSemiClosed },
          { key: 'or', name: '决策OR', Comp: SOr },
          { key: 'merge', name: '合并', Comp: SMerge },
          { key: 'display', name: '显示', Comp: SDisplay },
          { key: 'bracket', name: '限制符', Comp: SBracket },
          { key: 'terminator', name: '终止符', Comp: STerminator },
          { key: 'flow-card', name: '流程卡片', Comp: SFlowCard },
          { key: 'equal', name: '决策等号', Comp: SEqual },
          { key: 'semicircle', name: '半圆', Comp: SSemicircle },
          { key: 'trapezoid', name: '梯形', Comp: STrapezoid },
          { key: 'irregular', name: '不规则', Comp: SIrregular },
          { key: 'pentagon', name: '五边形', Comp: SPentagon },
        ],
      },
      {
        key: 'swimlane',
        label: '泳道',
        items: [
          { key: 'lane-h', name: '水平泳道', Comp: SLaneHorizontal },
          { key: 'lane-v', name: '垂直泳道', Comp: SLaneVertical },
        ],
      },
    ],
  },
  {
    key: 'basic',
    label: '基础图形',
    subGroups: [
      {
        key: 'basic-main',
        label: '基础图形',
        items: [
          { key: 'b-square', name: '正方形', Comp: BSquare },
          { key: 'b-r-square', name: '圆角正方形', Comp: BRoundedSquare },
          { key: 'b-soft-sq', name: '超圆角正方形', Comp: BSoftSquare },
          { key: 'b-circle', name: '圆形', Comp: BCircle },
          { key: 'b-triangle', name: '三角形', Comp: BTriangle },
          { key: 'b-diamond', name: '菱形', Comp: BDiamond },
          { key: 'b-para', name: '平行四边形', Comp: BParallelogram },
          { key: 'b-star', name: '星形', Comp: BStar },
          { key: 'b-half', name: '半圆', Comp: BHalfCircle },
          { key: 'b-tag', name: '胶囊', Comp: BTagCapsule },
          { key: 'b-house', name: '房子（五边形）', Comp: BHouse },
          { key: 'b-trap', name: '梯形', Comp: BTrapezoid },
          { key: 'b-hex', name: '六边形', Comp: BHexagon },
          { key: 'b-plus', name: '加号', Comp: BPlus },
        ],
      },
      {
        key: 'annotation',
        label: '注释',
        items: [
          { key: 'a-lbrace', name: '左花括号', Comp: ALeftBrace },
          { key: 'a-rbracket', name: '右方括号', Comp: ARightBracket },
          { key: 'a-lbracket', name: '左方括号', Comp: ALeftBracket },
          { key: 'a-rbrace', name: '右花括号', Comp: ARightBrace },
          { key: 'a-equal-sign', name: '等号（特殊）', Comp: AEqualSign },
          { key: 'a-three-horiz', name: '三条横线', Comp: AThreeHoriz },
          { key: 'a-three-wavy', name: '三条波浪', Comp: AThreeWavy },
          { key: 'a-equals', name: '等号（弯）', Comp: AEquals },
        ],
      },
      {
        key: 'direction',
        label: '方向',
        items: [
          { key: 'd-right', name: '向右箭头', Comp: DRightArrow },
          { key: 'd-left', name: '向左箭头', Comp: DLeftArrow },
          { key: 'd-double', name: '双向箭头', Comp: DDoubleArrow },
          { key: 'd-curved', name: '弯曲箭头', Comp: DCurvedArrow },
          { key: 'd-left-ch', name: '左尖括号', Comp: DLeftChevron },
          { key: 'd-right-ch', name: '右尖括号', Comp: DRightChevron },
          { key: 'd-right-tk', name: '粗箭头右', Comp: DRightThick },
          { key: 'd-left-tk', name: '粗箭头左', Comp: DLeftThick },
        ],
      },
      {
        key: 'polygon',
        label: '多边形',
        items: [{ key: 'p-hex', name: '六边形', Comp: PHexagon }],
      },
      {
        key: 'line',
        label: '直线',
        items: [
          { key: 'l-h', name: '横线', Comp: LHorizontal },
          { key: 'l-v', name: '竖线', Comp: LVertical },
        ],
      },
    ],
  },
]

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
    <button
      className={`glm-cell ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <HoverText text={name}>
        <svg viewBox="0 0 40 40" className="glm-cell-svg" aria-hidden="true">
          <Comp />
        </svg>
      </HoverText>
    </button>
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
   自定义滚动条容器
   - 完全隐藏原生滚动条（含箭头）
   - 鼠标进入面板时显示自定义滚动条
   - 拖动 thumb 也可滚动
   ========================================================= */
function CustomScrollContainer({ children, className }) {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const thumbRef = useRef(null)
  const dragRef = useRef({ active: false, startY: 0, startScrollTop: 0 })
  const [thumbVisible, setThumbVisible] = useState(false)
  const [thumbStyle, setThumbStyle] = useState({ height: 0, top: 0 })

  // 计算滚动条 thumb 的位置和大小
  // 注意：thumb 的尺寸和位置应基于 track 元素的真实高度（已扣除 CSS top/bottom 内缩），
  // 而非视口高度，否则 CSS 中设置的 top/bottom 内缩对 thumb 不起作用
  const updateThumb = useCallback(() => {
    const el = viewportRef.current
    const trackEl = trackRef.current
    if (!el || !trackEl) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const trackHeight = trackEl.clientHeight
    const contentHeight = scrollHeight
    if (contentHeight <= clientHeight) {
      setThumbStyle((s) => ({ ...s, height: 0, top: 0 }))
      return
    }
    const thumbHeight = Math.max(
      24,
      (clientHeight * trackHeight) / contentHeight,
    )
    const maxThumbTop = trackHeight - thumbHeight
    const thumbTop = (scrollTop / (contentHeight - clientHeight)) * maxThumbTop
    setThumbStyle({ height: thumbHeight, top: thumbTop })
  }, [])

  // 监听内容变化（折叠/展开）→ 重新计算
  useEffect(() => {
    const el = viewportRef.current
    const trackEl = trackRef.current
    if (!el || !trackEl) return
    const ro = new ResizeObserver(() => updateThumb())
    ro.observe(el)
    ro.observe(trackEl)
    // 观察内容变化
    Array.from(el.children).forEach((child) => ro.observe(child))
    updateThumb()
    return () => ro.disconnect()
  }, [updateThumb])

  // 拖动 thumb
  const onThumbMouseDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragRef.current = {
      active: true,
      startY: e.clientY,
      startScrollTop: viewportRef.current.scrollTop,
    }
    document.body.style.userSelect = 'none'
  }

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.active) return
      const el = viewportRef.current
      const trackEl = trackRef.current
      if (!el || !trackEl) return
      const { startY, startScrollTop } = dragRef.current
      const trackHeight = trackEl.clientHeight
      const thumbHeight = Math.max(
        24,
        (el.clientHeight * trackHeight) / el.scrollHeight,
      )
      const maxThumbTop = trackHeight - thumbHeight
      const deltaY = e.clientY - startY
      const deltaScroll =
        (deltaY / maxThumbTop) * (el.scrollHeight - el.clientHeight)
      el.scrollTop = startScrollTop + deltaScroll
    }
    const onUp = () => {
      if (dragRef.current.active) {
        dragRef.current.active = false
        document.body.style.userSelect = ''
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  // 点击轨道跳转
  const onTrackMouseDown = (e) => {
    if (e.target === thumbRef.current) return
    const el = viewportRef.current
    if (!el) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const thumbH = thumbStyle.height
    const thumbT = thumbStyle.top
    // 点击在 thumb 上方 → 上翻一页；下方 → 下翻一页
    const pageDelta = clickY < thumbT ? -el.clientHeight : el.clientHeight
    el.scrollTop += pageDelta
  }

  return (
    <div
      className={`glm-scroll-root ${className || ''}`}
      onMouseEnter={() => setThumbVisible(true)}
      onMouseLeave={() => setThumbVisible(false)}
    >
      <div
        ref={viewportRef}
        className="glm-scroll-viewport"
        onScroll={updateThumb}
      >
        {children}
      </div>
      <div
        ref={trackRef}
        className={`glm-scroll-track ${thumbVisible ? 'visible' : ''}`}
        onMouseDown={onTrackMouseDown}
      >
        <div
          ref={thumbRef}
          className="glm-scroll-thumb"
          style={{
            height: thumbStyle.height,
            transform: `translateY(${thumbStyle.top}px)`,
          }}
          onMouseDown={onThumbMouseDown}
        />
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
