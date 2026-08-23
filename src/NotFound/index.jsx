import { Link } from 'react-router-dom'
import './index.css'

function NotFound() {
  return (
    <div className="page page-enter notfound">
      <div className="container notfound-inner">
        <div className="notfound-code" aria-hidden="true">
          <span>4</span>
          <span className="notfound-zero">0</span>
          <span>4</span>
        </div>
        <h1>页面走丢了</h1>
        <p>
          你访问的页面不存在，或者已经被移动到别的地方了。
          <br />
          不如回到首页，继续探索 Infinite Task Manager Canvas 的画布与方案。
        </p>

        {/* Infinite Task Manager Canvas 标志性的手绘箭头，指向下方操作按钮 */}
        <svg
          className="notfound-arrow"
          width="64"
          height="48"
          viewBox="0 0 64 48"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6 C 16 4, 22 20, 30 22 S 48 18, 56 34"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M56 34 L 48 30 M56 34 L 54 24"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
