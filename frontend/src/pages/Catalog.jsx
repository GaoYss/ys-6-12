import { useState } from 'react'
import { AlertTriangle, Plus, Save, Trash2, X } from 'lucide-react'
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

const refTypeLabels = {
  specifications: '规格引用',
  purchase: '采购引用',
  reports: '报表引用',
}

export function Catalog({ dishes, refresh }) {
  const [form, setForm] = useState(emptyDish)
  const [saving, setSaving] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [impactData, setImpactData] = useState(null)
  const [loadingImpact, setLoadingImpact] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  const openDeleteModal = async (dish) => {
    setDeleteModal(dish)
    setImpactData(null)
    setLoadingImpact(true)
    try {
      const data = await api.checkDishImpact(dish.id)
      setImpactData(data)
    } catch (error) {
      console.error('Failed to check impact:', error)
    } finally {
      setLoadingImpact(false)
    }
  }

  const closeDeleteModal = () => {
    setDeleteModal(null)
    setImpactData(null)
    setLoadingImpact(false)
    setDeleting(false)
  }

  const confirmDelete = async () => {
    if (!deleteModal) return
    setDeleting(true)
    try {
      await api.deleteDish(deleteModal.id)
      closeDeleteModal()
      refresh()
    } catch (error) {
      console.error('Failed to delete dish:', error)
      setDeleting(false)
    }
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
                        <button className="danger" type="button" onClick={() => openDeleteModal(dish)} title="删除">
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

      {deleteModal && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>确认删除菜品</h3>
              <button className="modal-close" onClick={closeDeleteModal} type="button">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                确定要删除 <strong>{deleteModal.name}</strong> 吗？
              </p>

              {loadingImpact ? (
                <div className="notice info">正在检查数据引用...</div>
              ) : impactData ? (
                <>
                  {impactData.has_references && (
                    <div className="notice warning">
                      <AlertTriangle size={16} />
                      <span>检测到 {impactData.references.reduce((sum, r) => sum + r.count, 0)} 处数据引用，删除前请仔细阅读以下说明</span>
                    </div>
                  )}

                  {impactData.references.length > 0 && (
                    <div className="reference-list">
                      {impactData.references.map((ref) => (
                        <div key={ref.type} className="reference-item">
                          <strong>{refTypeLabels[ref.type] || ref.type} ({ref.count} 条)</strong>
                          <ul>
                            {ref.details.slice(0, 5).map((detail, idx) => (
                              <li key={idx}>{detail}</li>
                            ))}
                            {ref.details.length > 5 && <li>... 还有 {ref.details.length - 5} 条</li>}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="notice info">
                    <strong>规格处理说明：</strong>
                    <p style={{ marginTop: '6px', fontSize: '13px' }}>{impactData.spec_handling}</p>
                  </div>

                  {impactData.risks.length > 0 && (
                    <div>
                      <strong style={{ color: '#81520f', fontSize: '14px' }}>风险提示：</strong>
                      <div className="risk-list" style={{ marginTop: '8px' }}>
                        {impactData.risks.map((risk, idx) => (
                          <div key={idx} className="risk-item">{risk}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!impactData.has_references && (
                    <div className="notice info">此菜品暂无相关规格、采购或报表引用，可安全删除。</div>
                  )}
                </>
              ) : (
                <div className="notice error">无法检查数据引用，请稍后重试。</div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" onClick={closeDeleteModal} disabled={deleting}>取消</button>
              <button
                className="danger"
                type="button"
                onClick={confirmDelete}
                disabled={loadingImpact || deleting || !impactData}
              >
                {deleting ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

