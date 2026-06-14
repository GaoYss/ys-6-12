import { useEffect, useMemo, useState } from 'react'
import { BarChart3, Boxes, ClipboardList, CookingPot, Gauge, Settings2 } from 'lucide-react'
import { api } from './api/client.js'
import { AppShell } from './components/AppShell.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { Catalog } from './pages/Catalog.jsx'
import { Specifications } from './pages/Specifications.jsx'
import { Supply } from './pages/Supply.jsx'
import { Finance } from './pages/Finance.jsx'

const modules = [
  { key: 'dashboard', label: '经营看板', icon: Gauge },
  { key: 'catalog', label: '菜品库', icon: CookingPot },
  { key: 'specs', label: '规格设置', icon: Settings2 },
  { key: 'supply', label: '供应采购', icon: Boxes },
  { key: 'finance', label: '成本利润', icon: BarChart3 },
]

export default function App() {
  const [activeModule, setActiveModule] = useState('dashboard')
  const [state, setState] = useState({
    loading: true,
    error: '',
    summary: null,
    dishes: [],
    specifications: [],
    ingredients: [],
    suppliers: [],
    purchaseOrders: [],
    profitReport: [],
  })

  const refresh = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }))
    try {
      const [
        summary,
        dishes,
        specifications,
        ingredients,
        suppliers,
        purchaseOrders,
        profitReport,
      ] = await Promise.all([
        api.summary(),
        api.dishes(),
        api.specifications(),
        api.ingredients(),
        api.suppliers(),
        api.purchaseOrders(),
        api.profitReport(),
      ])
      setState({
        loading: false,
        error: '',
        summary,
        dishes,
        specifications,
        ingredients,
        suppliers,
        purchaseOrders,
        profitReport,
      })
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.message }))
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const moduleTitle = useMemo(
    () => modules.find((item) => item.key === activeModule)?.label || '',
    [activeModule],
  )

  const commonProps = { ...state, refresh }

  return (
    <AppShell
      modules={modules}
      activeModule={activeModule}
      onModuleChange={setActiveModule}
      title={moduleTitle}
      onRefresh={refresh}
    >
      {state.error && (
        <div className="notice error">
          <ClipboardList size={16} />
          <span>{state.error}</span>
        </div>
      )}
      {activeModule === 'dashboard' && <Dashboard {...commonProps} />}
      {activeModule === 'catalog' && <Catalog {...commonProps} />}
      {activeModule === 'specs' && <Specifications {...commonProps} />}
      {activeModule === 'supply' && <Supply {...commonProps} />}
      {activeModule === 'finance' && <Finance {...commonProps} />}
    </AppShell>
  )
}

