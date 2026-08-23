import { Routes, Route } from 'react-router-dom'
import HomeContainer from './HomeContainer'
import TaskCanvas from './TaskCanvas'
import NotFound from './NotFound'



function App() {
  return (
    <>
      <Routes>
        {/* 首页路由 */}
        <Route path="/" element={<HomeContainer />} />
        {/* 任务画布路由 */}
        <Route path="/task-canvas-container" element={<TaskCanvas />} />
        {/* 404 路由 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
