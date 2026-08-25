import { useEffect, useRef } from 'react'

// 监听元素外部的 mousedown，触发回调（用于点击外部关闭下拉菜单）
export default function useClickOutside(onClickOutside) {
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClickOutside(e)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClickOutside])

  return ref
}
