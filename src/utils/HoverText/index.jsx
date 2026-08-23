import { useState, useRef, useEffect, useCallback } from 'react'
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
  delay = 200,
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
    const tooltipRect = tooltip.getBoundingClientRect()

    let top = triggerRect.top - tooltipRect.height - 8
    let left = triggerRect.left + triggerRect.width / 2

    // 防止超出视口
    if (top < 8) top = triggerRect.bottom + 8
    if (left - tooltipRect.width / 2 < 8) left = tooltipRect.width / 2 + 8
    if (left + tooltipRect.width / 2 > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width / 2 - 8
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
    >
      {children}
      {visible && text && (
        <span
          ref={tooltipRef}
          className={`hover-text-tooltip ${directionClass} ${showing ? 'hover-text-show' : ''} ${tooltipClassName}`}
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {text}
        </span>
      )}
    </span>
  )
}

export default HoverText
