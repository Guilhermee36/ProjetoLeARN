type Props = {
  category: string
  label?: string
  clickable?: boolean
}

const styles: Record<string, string> = {
  teaching: 'bg-blue-100 text-blue-700',
  research: 'bg-green-100 text-green-700',
  extension: 'bg-orange-100 text-orange-700',
  all: 'bg-slate-100 text-slate-600',
}

const labels: Record<string, string> = {
  teaching: 'Ensino',
  research: 'Pesquisa',
  extension: 'Extensão',
  all: 'Todos',
}

export default function CategoryBadge({ category, label, clickable }: Props) {
  const text = label ?? labels[category] ?? category
  const style = styles[category] ?? 'bg-slate-100 text-slate-600'

  if (clickable) {
    return (
      <button className={`text-xs font-medium px-3 py-1.5 rounded-full transition-opacity hover:opacity-80 ${style}`}>
        {text}
      </button>
    )
  }

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${style}`}>
      {text}
    </span>
  )
}