const labelMap = {
  active: '在售',
  paused: '暂停',
  seasonal: '季节',
  draft: '草稿',
  ordered: '已下单',
  received: '已入库',
  cancelled: '已取消',
}

export function StatusBadge({ value }) {
  return <span className={`status status-${value}`}>{labelMap[value] || value}</span>
}

