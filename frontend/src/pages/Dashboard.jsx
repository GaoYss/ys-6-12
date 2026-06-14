import { MetricCard } from '../components/MetricCard.jsx'
import { StatusBadge } from '../components/StatusBadge.jsx'

export function Dashboard({ summary, ingredients, purchaseOrders, profitReport, loading }) {
  const topMargins = [...profitReport].sort((a, b) => b.gross_margin - a.gross_margin).slice(0, 4)
  const lowStock = ingredients.filter((item) => item.stock_qty <= item.safety_stock)

  if (loading && !summary) {
    return <div className="panel">数据加载中...</div>
  }

  return (
    <div className="page-grid">
      <section className="metrics">
        <MetricCard label="在售菜品" value={summary?.active_dishes ?? 0} helper="当前可售 SKU 基础数" />
        <MetricCard label="低库存原料" value={summary?.low_stock_items ?? 0} helper="低于或等于安全库存" />
        <MetricCard label="待处理采购" value={summary?.pending_purchase_orders ?? 0} helper="草稿与已下单状态" />
        <MetricCard
          label="平均毛利率"
          value={`${Math.round((summary?.average_margin ?? 0) * 100)}%`}
          helper={`库存估值 ¥${summary?.estimated_inventory_value ?? 0}`}
        />
      </section>

      <section className="panel split-panel">
        <div>
          <div className="section-title">
            <h2>高毛利规格</h2>
          </div>
          <div className="list">
            {topMargins.map((line) => (
              <div className="list-row" key={`${line.dish_id}-${line.spec_name}`}>
                <div>
                  <strong>{line.dish_name}</strong>
                  <span>{line.spec_name} · 成本 ¥{line.cost}</span>
                </div>
                <b>{Math.round(line.gross_margin * 100)}%</b>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-title">
            <h2>采购提醒</h2>
          </div>
          <div className="list">
            {lowStock.map((item) => (
              <div className="list-row" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.stock_qty}{item.unit} / 安全 {item.safety_stock}{item.unit}</span>
                </div>
                <b>补货</b>
              </div>
            ))}
            {purchaseOrders.slice(0, 2).map((order) => (
              <div className="list-row" key={order.id}>
                <div>
                  <strong>采购单 {order.id}</strong>
                  <span>预计 {order.expected_arrival} · ¥{order.total_amount}</span>
                </div>
                <StatusBadge value={order.status} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

