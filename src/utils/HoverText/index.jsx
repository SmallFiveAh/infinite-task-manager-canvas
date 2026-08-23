import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import './index.css'

const DIRECTION_MAP = {
  top: 'hover-text-top',
  bottom: 'hover-text-bottom',
  left: 'hover-text-left',
  right: 'hover-text-right',
}

function HoverText({
  children,
  text,
  direction = 'top',
  delay = 700,
  className = '',
  tooltipClassName = '',
}) {
  const [visible, setVisible] = useState(false)
  const [showing, setShowing] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const timerRef = useRef(null)
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const show = useCallback(() => {
    clearTimer()
    timerRef.current = setTimeout(() => {
      setVisible(true)
      requestAnimationFrame(() => setShowing(true))
    }, delay)
  }, [delay, clearTimer])

  const hide = useCallback(() => {
    clearTimer()
    setShowing(false)
    setTimeout(() => setVisible(false), 150)
  }, [clearTimer])

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    const tooltip = tooltipRef.current
    if (!trigger || !tooltip) return

    const triggerRect = trigger.getBoundingClientRect()
    // 用 offsetWidth/offsetHeight 取未变换前的真实尺寸，
    // 避免 transform: scale(0.92) 影响 getBoundingClientRect 返回的宽高
    const tooltipWidth = tooltip.offsetWidth || tooltip.getBoundingClientRect().width
    const tooltipHeight = tooltip.offsetHeight || tooltip.getBoundingClientRect().height

    // 计算 tooltip 左上角的实际坐标（视口坐标系）
    let top = triggerRect.top - tooltipHeight - 8
    let left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2

    // 防止超出视口
    if (top < 8) top = triggerRect.bottom + 8
    if (left < 8) left = 8
    if (left + tooltipWidth > window.innerWidth - 8) {
      left = window.innerWidth - tooltipWidth - 8
    }

    setPosition({ top, left })
  }, [])

  useEffect(() => {
    if (!visible) return
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [visible, updatePosition])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  const directionClass = DIRECTION_MAP[direction] || DIRECTION_MAP.top

  return (
    <span
      ref={triggerRef}
      className={`hover-text-trigger ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onClick={hide}
    >
      {children}
      {visible && text && createPortal(
        <span
          ref={tooltipRef}
          className={`hover-text-tooltip ${directionClass} ${showing ? 'hover-text-show' : ''} ${tooltipClassName}`}
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          onMouseEnter={show}
          onMouseLeave={hide}
          onClick={hide}
        >
          {text}
        </span>,
        document.body
      )}
    </span>
  )
}

export default HoverText
