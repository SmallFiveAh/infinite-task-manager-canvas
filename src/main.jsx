import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import HoverText from './utils/HoverText'
import App from './App.jsx'
import '@fontsource-variable/caveat'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './utils/global.d.ts'
import './index.css'

// 将全局组件挂载到 globalThis，任意组件无需导入即可使用
globalThis.HoverText = HoverText

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
