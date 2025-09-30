import { useState } from 'react'
import SimpleGridDemo from './components/SimpleGridDemo'
import SimpleKanbanDemo from './components/SimpleKanbanDemo'
import Overview from './components/Overview'

type DemoPage = 'overview' | 'grid' | 'kanban'

function App() {
  const [activePage, setActivePage] = useState<DemoPage>('overview')

  const renderPage = () => {
    switch (activePage) {
      case 'grid':
        return <SimpleGridDemo />
      case 'kanban':
        return <SimpleKanbanDemo />
      default:
        return <Overview onNavigate={setActivePage} />
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Grid Table Kanban Demo</h1>
        <p>高性能的基于 Canvas 的表格和看板系统演示</p>
      </header>

      <nav className="nav">
        <button
          className={`nav-button ${activePage === 'overview' ? 'active' : ''}`}
          onClick={() => setActivePage('overview')}
        >
          概览
        </button>
        <button
          className={`nav-button ${activePage === 'grid' ? 'active' : ''}`}
          onClick={() => setActivePage('grid')}
        >
          Grid 表格
        </button>
        <button
          className={`nav-button ${activePage === 'kanban' ? 'active' : ''}`}
          onClick={() => setActivePage('kanban')}
        >
          Kanban 看板
        </button>
      </nav>

      {renderPage()}
    </div>
  )
}

export default App
