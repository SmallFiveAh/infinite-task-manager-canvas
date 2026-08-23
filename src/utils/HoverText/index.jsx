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
  const [actualDirection, setActualDirection] = useState(direction)
  const timerRef = useRef(null)
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)

  useEffect(() => {
    setActualDirection(direction)
  }, [direction])

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

    const GAP = 8
    let dir = direction
    let top
    let left

    if (direction === 'top' || direction === 'bottom') {
      // 垂直方向：tooltip 在触发元素上方或下方
      if (direction === 'top') {
        top = triggerRect.top - tooltipHeight - GAP
        if (top < GAP) {
          // 上方放不下，翻转到下方
          top = triggerRect.bottom + GAP
          dir = 'bottom'
        }
      } else {
        top = triggerRect.bottom + GAP
        if (top + tooltipHeight > window.innerHeight - GAP) {
          // 下方放不下，翻转到上方
          top = triggerRect.top - tooltipHeight - GAP
          dir = 'top'
        }
      }
      left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2
      if (left < GAP) left = GAP
      if (left + tooltipWidth > window.innerWidth - GAP) {
        left = window.innerWidth - tooltipWidth - GAP
      }
    } else {
      // 水平方向：tooltip 在触发元素左侧或右侧
      if (direction === 'left') {
        left = triggerRect.left - tooltipWidth - GAP
        if (left < GAP) {
          // 左侧放不下，翻转到右侧
          left = triggerRect.right + GAP
          dir = 'right'
        }
      } else {
        left = triggerRect.right + GAP
        if (left + tooltipWidth > window.innerWidth - GAP) {
          // 右侧放不下，翻转到左侧
          left = triggerRect.left - tooltipWidth - GAP
          dir = 'left'
        }
      }
      top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2
      if (top < GAP) top = GAP
      if (top + tooltipHeight > window.innerHeight - GAP) {
        top = window.innerHeight - tooltipHeight - GAP
      }
    }

    setPosition({ top, left })
    setActualDirection(dir)
  }, [direction])

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

  const directionClass = DIRECTION_MAP[actualDirection] || DIRECTION_MAP.top

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
