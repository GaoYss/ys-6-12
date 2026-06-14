import { useState } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { api } from '../api/client.js'
import { EmptyState } from '../components/EmptyState.jsx'
import { StatusBadge } from '../components/StatusBadge.jsx'

const emptyDish = {
  name: '',
  category: '肉类',
  flavor: '原味',
  status: 'active',
  description: '',
}

export function Catalog({ dishes, refresh }) {
  const [form, setForm] = useState(emptyDish)
  const [saving, setSaving] = useState(false)

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    await api.createDish(form)
    setForm(emptyDish)
    setSaving(false)
    refresh()
  }

  const pauseDish = async (dish) => {
    await api.updateDish(dish.id, { status: dish.status === 'active' ? 'paused' : 'active' })
    refresh()
  }

  const deleteDish = async (dish) => {
    await api.deleteDish(dish.id)
    refresh()
  }

  return (
    <div className="two-column">
      <section className="panel">
        <div className="section-title">
          <h2>菜品库维护</h2>
          <span>{dishes.length} 个菜品</span>
        </div>
        {dishes.length === 0 ? (
          <EmptyState text="还没有菜品" />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>菜品</th>
                  <th>分类</th>
                  <th>风味</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish) => (
                  <tr key={dish.id}>
                    <td>
                      <strong>{dish.name}</strong>
                      <small>{dish.description}</small>
                    </td>
                    <td>{dish.category}</td>
                    <td>{dish.flavor}</td>
                    <td><StatusBadge value={dish.status} /></td>
                    <td>
                      <div className="row-actions">
                        <button type="button" onClick={() => pauseDish(dish)}>
                          {dish.status === 'active' ? '暂停' : '上架'}
                        </button>
                        <button className="danger" type="button" onClick={() => deleteDish(dish)} title="删除">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel side-panel">
        <div className="section-title">
          <h2>新增菜品</h2>
          <Plus size={18} />
        </div>
        <form className="form" onSubmit={submit}>
          <label>
            菜品名称
            <input value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
          </label>
          <label>
            分类
            <select value={form.category} onChange={(event) => updateField('category', event.target.value)}>
              <option>肉类</option>
              <option>海鲜</option>
              <option>素菜</option>
              <option>主食</option>
              <option>饮品</option>
            </select>
          </label>
          <label>
            风味
            <input value={form.flavor} onChange={(event) => updateField('flavor', event.target.value)} required />
          </label>
          <label>
            状态
            <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
              <option value="active">在售</option>
              <option value="seasonal">季节</option>
              <option value="paused">暂停</option>
            </select>
          </label>
          <label>
            描述
            <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} rows="4" />
          </label>
          <button className="primary" type="submit" disabled={saving}>
            <Save size={16} />
            <span>{saving ? '保存中' : '保存菜品'}</span>
          </button>
        </form>
      </section>
    </div>
  )
}

