// 全局组件类型声明，让 TS/编辑器识别 globalThis 上的全局组件
declare global {
  interface Window {
    HoverText: React.ComponentType<{
      children: React.ReactNode
      text: string
      direction?: 'top' | 'bottom' | 'left' | 'right'
      delay?: number
      className?: string
      tooltipClassName?: string
    }>
  }
}

export {}
