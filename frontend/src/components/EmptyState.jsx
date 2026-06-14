import { FileSearch } from 'lucide-react'

export function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <FileSearch size={22} />
      <span>{text}</span>
    </div>
  )
}

