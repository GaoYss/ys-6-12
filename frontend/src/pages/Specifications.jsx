import { useState } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { api } from '../api/client.js'
import { EmptyState } from '../components/EmptyState.jsx'

const initialForm = {
  dish_id: '',
  name: '标准份',
  serving_size: '',
  sale_price: '',
  ingredient_cost: '',
  packaging_cost: '',
}

export function Specifications({ dishes, specifications, refresh }) {
  const [form, setForm] = useState(initialForm)

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()
    await api.createSpecification({
      ...form,
      sale_price: Number(form.sale_price),
      ingredient_cost: Number(form.ingredient_cost),
      packaging_cost: Number(form.packaging_cost),
    })
    setForm(initialForm)
    refresh()
  }

  const remove = async (spec) => {
    await api.deleteSpecification(spec.id)
    refresh()
  }

  const dishName = (id) => dishes.find((dish) => dish.id === id)?.name || '未知菜品'

  return (
    <div className="two-column">
      <section className="panel">
        <div className="section-title">
          <h2>规格与价格</h2>
          <span>{specifications.length} 个规格</span>
        </div>
        {specifications.length === 0 ? (
          <EmptyState text="还没有规格" />
        ) : (
          <div className="card-grid">
            {specifications.map((spec) => (
              <article className="spec-card" key={spec.id}>
                <div>
                  <span>{dishName(spec.dish_id)}</span>
                  <h3>{spec.name}</h3>
                </div>
                <dl>
                  <div><dt>出品量</dt><dd>{spec.serving_size}</dd></div>
                  <div><dt>售价</dt><dd>¥{spec.sale_price}</dd></div>
                  <div><dt>成本</dt><dd>¥{(spec.ingredient_cost + spec.packaging_cost).toFixed(1)}</dd></div>
                  <div><dt>毛利率</dt><dd>{Math.round(spec.gross_margin * 100)}%</dd></div>
                </dl>
                <button className="danger icon-only" onClick={() => remove(spec)} type="button" title="删除规格">
                  <Trash2 size={15} />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="panel side-panel">
        <div className="section-title">
          <h2>新增规格</h2>
          <Plus size={18} />
        </div>
        <form className="form" onSubmit={submit}>
          <label>
            关联菜品
            <select value={form.dish_id} onChange={(event) => updateField('dish_id', event.target.value)} required>
              <option value="">选择菜品</option>
              {dishes.map((dish) => (
                <option key={dish.id} value={dish.id}>{dish.name}</option>
              ))}
            </select>
          </label>
          <label>
            规格名称
            <input value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
          </label>
          <label>
            出品量
            <input value={form.serving_size} onChange={(event) => updateField('serving_size', event.target.value)} placeholder="例如 250g" required />
          </label>
          <div className="form-grid">
            <label>
              售价
              <input type="number" min="0" step="0.1" value={form.sale_price} onChange={(event) => updateField('sale_price', event.target.value)} required />
            </label>
            <label>
              原料成本
              <input type="number" min="0" step="0.1" value={form.ingredient_cost} onChange={(event) => updateField('ingredient_cost', event.target.value)} required />
            </label>
          </div>
          <label>
            包装/损耗成本
            <input type="number" min="0" step="0.1" value={form.packaging_cost} onChange={(event) => updateField('packaging_cost', event.target.value)} required />
          </label>
          <button className="primary" type="submit">
            <Save size={16} />
            <span>保存规格</span>
          </button>
        </form>
      </section>
    </div>
  )
}

