import { useEffect } from 'react'

// 键盘快捷键：V=选择 / H=移动
export default function useCanvasShortcuts(setActiveTool) {
  useEffect(() => {
    const onKeyDown = (e) => {
      // 忽略在输入控件中的按键
      const tag = (e.target && e.target.tagName) || ''
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return
      const key = e.key.toLowerCase()
      if (key === 'v') {
        setActiveTool('select')
      } else if (key === 'h') {
        setActiveTool('navigate')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setActiveTool])
}
