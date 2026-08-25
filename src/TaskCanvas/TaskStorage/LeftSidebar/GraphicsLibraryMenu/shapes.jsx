/* =========================================================
   单个图形 SVG（统一使用 40x40 viewBox，stroke 黑色，无填充）
   ========================================================= */
export const strokeProps = {
  fill: 'none',
  stroke: '#1f2937',
  strokeWidth: 1.5,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
}

/* ---------- 流程图 ---------- */
// 1. 矩形
export const SRectangle = () => <rect x="6" y="10" width="28" height="20" rx="0" {...strokeProps} />
// 2. 圆角矩形
export const SRoundedRect = () => <rect x="6" y="10" width="28" height="20" rx="4" {...strokeProps} />
// 3. 菱形
export const SDiamond = () => (
  <polygon points="20,5 35,20 20,35 5,20" {...strokeProps} />
)
// 4. 缺角矩形（文档）
export const SDocNotch = () => (
  <path d="M6 10 L28 10 L34 16 L34 30 L6 30 Z" {...strokeProps} />
)
// 5. 平行四边形（左倾斜）
export const SParallelogramLeft = () => (
  <polygon points="12,10 34,10 28,30 6,30" {...strokeProps} />
)
// 6. 椭圆
export const SEllipse = () => <ellipse cx="20" cy="20" rx="14" ry="9" {...strokeProps} />
// 7. 胶囊（长椭圆）
export const SCapsule = () => <rect x="4" y="12" width="32" height="16" rx="8" {...strokeProps} />
// 8. 圆
export const SCircle = () => <circle cx="20" cy="20" r="11" {...strokeProps} />
// 9. 数据库（三横线圆柱正视图）
export const SDatabase = () => (
  <>
    <rect x="8" y="10" width="24" height="20" {...strokeProps} />
    <path d="M8 16 a12 4 0 0 0 24 0" {...strokeProps} />
    <path d="M8 24 a12 4 0 0 0 24 0" {...strokeProps} />
  </>
)
// 10. 数据/输入输出（斜平行四边形 右倾）
export const SParallelogramRight = () => (
  <polygon points="10,10 34,10 30,30 6,30" {...strokeProps} />
)
// 11. 圆柱（存储）
export const SCylinder = () => (
  <>
    <path d="M8 12 a12 4 0 0 0 24 0 L32 28 a12 4 0 0 1 -24 0 Z" {...strokeProps} />
    <path d="M8 28 a12 4 0 0 0 24 0" {...strokeProps} />
  </>
)
// 12. 文档（上折角）
export const SDocFold = () => (
  <path d="M8 8 L26 8 L32 14 L32 32 L8 32 Z" {...strokeProps} />
)
// 13. 多文档
export const SMultiDoc = () => (
  <>
    <path d="M10 14 L24 14 L28 18 L28 32 L10 32 Z" {...strokeProps} />
    <path d="M14 8 L28 8 L32 12 L32 26" {...strokeProps} />
  </>
)
// 14. 预定义过程（双竖线）
export const SPredefined = () => (
  <>
    <rect x="5" y="10" width="30" height="20" rx="2" {...strokeProps} />
    <line x1="9" y1="10" x2="9" y2="30" {...strokeProps} />
    <line x1="31" y1="10" x2="31" y2="30" {...strokeProps} />
  </>
)
// 15. 环形/循环
export const SLoop = () => (
  <path d="M10 20 a10 10 0 1 1 14 8" {...strokeProps} />
)
// 16. 磁带/顺序存取
export const STape = () => (
  <path d="M6 12 L34 12 L30 28 L10 28 Z" {...strokeProps} />
)
// 17. 穿孔卡
export const SPunchedCard = () => (
  <>
    <rect x="4" y="10" width="32" height="20" {...strokeProps} />
    <path d="M14 10 L10 18" {...strokeProps} />
  </>
)
// 18. 手动操作（不规则上凹）
export const SManualOp = () => (
  <path d="M6 30 L6 14 L34 14 L34 30 Z M10 14 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0" {...strokeProps} />
)
// 19. 排序（梯形 下窄）
export const STrapBottom = () => (
  <polygon points="10,10 30,10 34,30 6,30" {...strokeProps} />
)
// 20. 数据存储（圆柱侧）其实复用，先不同：梯形上窄
export const STrapTop = () => (
  <polygon points="6,10 34,10 30,30 10,30" {...strokeProps} />
)
// 21. 准备/六边形
export const SHexagon = () => (
  <polygon points="10,10 30,10 36,20 30,30 10,30 4,20" {...strokeProps} />
)
// 22. 注释/三点
export const SAnnotation = () => (
  <>
    <path d="M6 10 L30 10 L30 30 L6 30 Z" {...strokeProps} />
    <circle cx="14" cy="20" r="1.4" fill="#1f2937" />
    <circle cx="20" cy="20" r="1.4" fill="#1f2937" />
    <circle cx="26" cy="20" r="1.4" fill="#1f2937" />
  </>
)
// 23. 半闭合（终止 半圆）
export const SSemiClosed = () => (
  <path d="M8 10 a12 12 0 0 1 0 24 L8 10" {...strokeProps} />
)
// 24. 决策OR（菱形内OR）
export const SOr = () => (
  <>
    <polygon points="20,5 35,20 20,35 5,20" {...strokeProps} />
    <path d="M12 26 L28 14 M12 14 L28 26" {...strokeProps} />
  </>
)
// 25. 数据合并（箭头向下的漏斗-ish）
export const SMerge = () => (
  <>
    <rect x="6" y="10" width="28" height="10" {...strokeProps} />
    <polygon points="8,20 32,20 20,32" {...strokeProps} />
  </>
)
// 26. 显示
export const SDisplay = () => (
  <path d="M6 10 L32 10 L36 30 L6 30 Z" {...strokeProps} />
)
// 27. 限制符（括号）
export const SBracket = () => (
  <>
    <path d="M10 30 L6 30 L6 10 L10 10" {...strokeProps} />
    <path d="M30 30 L34 30 L34 10 L30 10" {...strokeProps} />
  </>
)
// 28. 终止
export const STerminator = () => (
  <path d="M10 30 a10 10 0 0 1 0 -20 h20 a10 10 0 0 1 0 20 z" {...strokeProps} />
)
// 29. 流程卡片
export const SFlowCard = () => (
  <>
    <rect x="5" y="10" width="30" height="20" rx="2" {...strokeProps} />
    <circle cx="20" cy="20" r="5" {...strokeProps} />
  </>
)
// 30. 决策等号
export const SEqual = () => (
  <>
    <rect x="5" y="10" width="30" height="20" rx="2" {...strokeProps} />
    <line x1="12" y1="17" x2="28" y2="17" {...strokeProps} />
    <line x1="12" y1="23" x2="28" y2="23" {...strokeProps} />
  </>
)
// 31. 半圆
export const SSemicircle = () => (
  <path d="M6 27 a14 14 0 0 1 28 0 Z" {...strokeProps} />
)
// 32. 梯形
export const STrapezoid = () => <STrapBottom />
// 33. 不规则
export const SIrregular = () => (
  <path d="M6 26 Q10 10 20 12 Q32 14 34 26 Q28 32 20 30 Q10 32 6 26 Z" {...strokeProps} />
)
// 34. 圆角五边形
export const SPentagon = () => (
  <polygon points="20,6 34,16 30,32 10,32 6,16" {...strokeProps} />
)

/* ---------- 泳道 ---------- */
// 水平泳道
export const SLaneHorizontal = () => (
  <>
    <rect x="5" y="8" width="30" height="24" {...strokeProps} />
    <line x1="5" y1="20" x2="35" y2="20" {...strokeProps} />
    <rect x="5" y="8" width="8" height="24" fill="rgba(31,41,55,0.15)" stroke="#1f2937" strokeWidth="1.5" />
  </>
)
// 垂直泳道
export const SLaneVertical = () => (
  <>
    <rect x="8" y="5" width="24" height="30" {...strokeProps} />
    <line x1="20" y1="5" x2="20" y2="35" {...strokeProps} />
    <rect x="8" y="5" width="24" height="8" fill="rgba(31,41,55,0.15)" stroke="#1f2937" strokeWidth="1.5" />
  </>
)

/* ---------- 基础图形 ---------- */
export const BSquare = () => <rect x="8" y="8" width="24" height="24" {...strokeProps} />
export const BRoundedSquare = () => <rect x="8" y="8" width="24" height="24" rx="5" {...strokeProps} />
export const BSoftSquare = () => <rect x="8" y="8" width="24" height="24" rx="9" {...strokeProps} />
export const BCircle = () => <circle cx="20" cy="20" r="11" {...strokeProps} />
export const BRefresh = () => (
  <path d="M30 14 a12 12 0 1 0 -4 9" {...strokeProps} />
)
export const BTriangle = () => (
  <polygon points="20,6 34,32 6,32" {...strokeProps} />
)
export const BDiamond = () => <SDiamond />
export const BParallelogram = () => <SParallelogramRight />
export const BStar = () => (
  <polygon points="20,5 24,15 34,16 26,23 29,33 20,28 11,33 14,23 6,16 16,15" {...strokeProps} />
)
export const BHalfCircle = () => <SSemicircle />
export const BTagCapsule = () => <SCapsule />
export const BHouse = () => (
  <>
    <polygon points="20,7 33,18 33,32 7,32 7,18" {...strokeProps} />
    <line x1="20" y1="7" x2="7" y2="18" {...strokeProps} />
  </>
)
export const BTrapezoid = () => <STrapBottom />
export const BHexagon = () => <SHexagon />
export const BPlus = () => (
  <>
    <line x1="8" y1="20" x2="32" y2="20" {...strokeProps} />
    <line x1="20" y1="8" x2="20" y2="32" {...strokeProps} />
  </>
)

/* ---------- 注释 ---------- */
export const ALeftBrace = () => (
  <path d="M26 7 Q22 7 22 13 Q22 17 18 20 Q22 23 22 27 Q22 33 26 33" {...strokeProps} />
)
export const ARightBracket = () => (
  <>
    <line x1="10" y1="7" x2="26" y2="7" {...strokeProps} />
    <line x1="26" y1="7" x2="26" y2="33" {...strokeProps} />
    <line x1="10" y1="33" x2="26" y2="33" {...strokeProps} />
  </>
)
export const ALeftBracket = () => (
  <>
    <line x1="30" y1="7" x2="14" y2="7" {...strokeProps} />
    <line x1="14" y1="7" x2="14" y2="33" {...strokeProps} />
    <line x1="30" y1="33" x2="14" y2="33" {...strokeProps} />
  </>
)
export const ARightBrace = () => (
  <path d="M14 7 Q18 7 18 13 Q18 17 22 20 Q18 23 18 27 Q18 33 14 33" {...strokeProps} />
)
export const AEqualSign = () => (
  <>
    <line x1="8" y1="16" x2="32" y2="16" {...strokeProps} />
    <line x1="8" y1="24" x2="32" y2="24" {...strokeProps} />
    <line x1="28" y1="16" x2="32" y2="22" {...strokeProps} />
    <line x1="28" y1="24" x2="32" y2="18" {...strokeProps} />
  </>
)
export const AThreeHoriz = () => (
  <>
    <line x1="8" y1="14" x2="32" y2="14" {...strokeProps} />
    <line x1="8" y1="20" x2="32" y2="20" {...strokeProps} />
    <line x1="8" y1="26" x2="32" y2="26" {...strokeProps} />
  </>
)
export const AThreeWavy = () => (
  <>
    <path d="M8 14 q4 -4 8 0 t8 0 t8 0" {...strokeProps} />
    <path d="M8 20 q4 -4 8 0 t8 0 t8 0" {...strokeProps} />
    <path d="M8 26 q4 -4 8 0 t8 0 t8 0" {...strokeProps} />
  </>
)
export const AEquals = () => (
  <>
    <path d="M8 16 Q14 12 20 16 Q26 20 32 16" {...strokeProps} />
    <path d="M8 24 Q14 20 20 24 Q26 28 32 24" {...strokeProps} />
  </>
)

/* ---------- 方向 ---------- */
export const DRightArrow = () => (
  <path d="M7 20 L30 20 M22 12 L30 20 L22 28" {...strokeProps} />
)
export const DLeftArrow = () => (
  <path d="M33 20 L10 20 M18 12 L10 20 L18 28" {...strokeProps} />
)
export const DDoubleArrow = () => (
  <path d="M13 20 L27 20 M6 20 L14 14 M6 20 L14 26 M34 20 L26 14 M34 20 L26 26" {...strokeProps} />
)
export const DCurvedArrow = () => (
  <>
    <path d="M8 28 Q8 10 28 10" {...strokeProps} />
    <path d="M26 10 L32 14 L30 20" {...strokeProps} />
  </>
)
export const DLeftChevron = () => (
  <path d="M26 10 L14 20 L26 30" {...strokeProps} />
)
export const DRightChevron = () => (
  <path d="M14 10 L26 20 L14 30" {...strokeProps} />
)
export const DRightThick = () => (
  <path d="M8 12 L22 12 L22 8 L34 20 L22 32 L22 28 L8 28 Z" {...strokeProps} />
)
export const DLeftThick = () => (
  <path d="M32 12 L18 12 L18 8 L6 20 L18 32 L18 28 L32 28 Z" {...strokeProps} />
)

/* ---------- 多边形 ---------- */
export const PHexagon = () => (
  <polygon points="20,6 33,13 33,27 20,34 7,27 7,13" {...strokeProps} />
)
/* ---------- 直线 ---------- */
export const LHorizontal = () => <line x1="4" y1="20" x2="36" y2="20" {...strokeProps} />
export const LVertical = () => <line x1="20" y1="4" x2="20" y2="36" {...strokeProps} />
