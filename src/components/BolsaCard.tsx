import Link from 'next/link'
import { MapPin, Clock, User, ChevronRight } from 'lucide-react'
import CategoryBadge from './CategoryBadge'

type Props = {
  id: string
  title: string
  description: string
  category: string
  teacherName: string
  location: string
  schedule: string
  openSlots: number
}

const categoryColors: Record<string, string> = {
  teaching: 'border-l-blue-500',
  research: 'border-l-green-500',
  extension: 'border-l-orange-500',
}

export default function BolsaCard({
  id, title, description, category, teacherName, location, schedule, openSlots
}: Props) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${categoryColors[category] ?? 'border-l-slate-300'} p-5 hover:shadow-md transition-shadow flex flex-col gap-3`}>
      
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-800 text-base leading-snug">{title}</h3>
        <CategoryBadge category={category} />
      </div>

      {description && (
        <p className="text-sm text-slate-500 line-clamp-2">{description}</p>
      )}

      <div className="space-y-1.5 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <User size={14} className="shrink-0" />
          <span className="truncate">{teacherName}</span>
        </div>
        {location && (
          <div className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}
        {schedule && (
          <div className="flex items-center gap-2">
            <Clock size={14} className="shrink-0" />
            <span>{schedule}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          openSlots > 0
            ? 'bg-green-100 text-green-700'
            : 'bg-slate-100 text-slate-500'
        }`}>
          {openSlots > 0 ? `${openSlots} vaga${openSlots > 1 ? 's' : ''} aberta${openSlots > 1 ? 's' : ''}` : 'Sem vagas abertas'}
        </span>
        <Link
          href={`/bolsas/${id}`}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Ver detalhes <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  )
}