import { useCallback, useState } from 'react'
import { MIN_SCALE, MAX_SCALE } from '../constants'

// 管理画布视口（平移 offset + 缩放 scale）状态，并暴露缩放相关操作
export default function useCanvasViewport({ viewportRef, canvasRef, scheduleDraw }) {
  // HUD 缩放百分比展示：仅 scale 变化时同步到 state
  const [scale, setScale] = useState(1)

  // 点击 HUD：恢复到 100%（scale=1，offset 归零）
  const handleResetZoom = useCallback(() => {
    const vp = viewportRef.current
    vp.offsetX = 0
    vp.offsetY = 0
    vp.scale = 1
    setScale(1)
    scheduleDraw()
  }, [viewportRef, scheduleDraw])

  // HUD 菜单选择缩放百分比：接收百分比整数（如 50、100、400），以画布中心为锚点进行缩放
  const handleZoomChangeFromMenu = useCallback(
    (percentInt) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const vp = viewportRef.current
      const targetScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, percentInt / 100)
      )
      if (targetScale === vp.scale) return
      const rect = canvas.getBoundingClientRect()
      const px = rect.width / 2
      const py = rect.height / 2
      const k = targetScale / vp.scale
      vp.offsetX = px - (px - vp.offsetX) * k
      vp.offsetY = py - (py - vp.offsetY) * k
      vp.scale = targetScale
      setScale(targetScale)
      scheduleDraw()
    },
    [viewportRef, canvasRef, scheduleDraw]
  )

  return { scale, setScale, handleResetZoom, handleZoomChangeFromMenu }
}
