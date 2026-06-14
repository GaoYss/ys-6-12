import { RefreshCw } from 'lucide-react'

export function AppShell({ modules, activeModule, onModuleChange, title, onRefresh, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">火</div>
          <div>
            <strong>火锅菜品管理</strong>
            <span>Hotpot Ops</span>
          </div>
        </div>
        <nav className="module-nav">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <button
                className={activeModule === module.key ? 'active' : ''}
                key={module.key}
                onClick={() => onModuleChange(module.key)}
                type="button"
              >
                <Icon size={18} />
                <span>{module.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">门店运营台</span>
            <h1>{title}</h1>
          </div>
          <button className="icon-button labeled" onClick={onRefresh} type="button" title="刷新数据">
            <RefreshCw size={17} />
            <span>刷新</span>
          </button>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  )
}

