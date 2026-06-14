const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || '请求失败')
  }
  return data
}

export const api = {
  summary: () => request('/summary'),
  dishes: () => request('/dishes'),
  createDish: (payload) => request('/dishes', { method: 'POST', body: JSON.stringify(payload) }),
  updateDish: (id, payload) => request(`/dishes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteDish: (id) => request(`/dishes/${id}`, { method: 'DELETE' }),
  specifications: () => request('/specifications'),
  createSpecification: (payload) => request('/specifications', { method: 'POST', body: JSON.stringify(payload) }),
  updateSpecification: (id, payload) => request(`/specifications/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteSpecification: (id) => request(`/specifications/${id}`, { method: 'DELETE' }),
  ingredients: () => request('/ingredients'),
  suppliers: () => request('/suppliers'),
  purchaseOrders: () => request('/purchase-orders'),
  createPurchaseOrder: (payload) => request('/purchase-orders', { method: 'POST', body: JSON.stringify(payload) }),
  updatePurchaseStatus: (id, status) => request(`/purchase-orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  profitReport: () => request('/finance/profit-report'),
}

