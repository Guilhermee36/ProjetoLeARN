import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MapPin, Clock, User, Calendar, DollarSign, BookOpen } from 'lucide-react'
import CategoryBadge from '@/components/CategoryBadge'
import BotaoInscrever from '@/components/BotaoInscrever'

type Props = { params: { id: string } }

export default async function DetalhesBolsaPage({ params }: Props) {
  const supabase = createClient()

  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:teacher_id (
        id,
        full_name,
        lattes_url
      ),
      edicts (
        title,
        number,
        year,
        file_url
      ),
      scholarship_slots (
        id,
        slot_code,
        weekly_hours,
        monthly_value,
        start_date,
        end_date,
        status,
        is_open,
        assigned_student_id
      )
    `)
    .eq('id', params.id)
    .single()

  if (!project) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  // Verifica se o aluno já se inscreveu
  const { data: myApplication } = await supabase
    .from('applications')
    .select('id, status')
    .eq('student_id', user?.id ?? '')
    .eq('project_id', params.id)
    .maybeSingle()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id ?? '')
    .single()

  const openSlots = project.scholarship_slots?.filter(
    (s: any) => s.status === 'open'
  ) ?? []

  const categoryLabel: Record<string, string> = {
    teaching: 'Ensino',
    research: 'Pesquisa',
    extension: 'Extensão',
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400">
        <a href="/bolsas" className="hover:text-blue-600">Bolsas</a>
        <span className="mx-2">›</span>
        <span className="text-slate-600">{project.title}</span>
      </nav>

      {/* Header do projeto */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold text-slate-800 leading-snug">{project.title}</h1>
          <CategoryBadge category={project.category} />
        </div>

        {project.description && (
          <p className="text-slate-600 leading-relaxed">{project.description}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <InfoRow icon={User} label="Professor" value={(project.profiles as any)?.full_name} />
          {project.location && <InfoRow icon={MapPin} label="Local" value={project.location} />}
          {project.schedule && <InfoRow icon={Clock} label="Horário" value={project.schedule} />}
          {project.edicts && (
            <InfoRow
              icon={BookOpen}
              label="Edital"
              value={`${(project.edicts as any).title} (${(project.edicts as any).year})`}
            />
          )}
        </div>

        {/* Link Lattes do professor */}
        {(project.profiles as any)?.lattes_url && (
          <a
            href={(project.profiles as any).lattes_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-blue-600 hover:underline"
          >
            Currículo Lattes do professor →
          </a>
        )}
      </div>

      {/* Vagas */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="font-semibold text-slate-800">Vagas de Bolsa</h2>

        {project.scholarship_slots?.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhuma vaga cadastrada.</p>
        ) : (
          <div className="space-y-3">
            {project.scholarship_slots?.map((slot: any) => (
              <div
                key={slot.id}
                className={`rounded-lg border p-4 space-y-2 ${
                  slot.status === 'open'
                    ? 'border-green-200 bg-green-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    {slot.slot_code ? `Vaga ${slot.slot_code}` : 'Vaga de Bolsa'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    slot.status === 'open'
                      ? 'bg-green-100 text-green-700'
                      : slot.status === 'filled'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {slot.status === 'open' ? 'Aberta' : slot.status === 'filled' ? 'Preenchida' : 'Indisponível'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-slate-600">
                  {slot.weekly_hours && (
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      {slot.weekly_hours}h/semana
                    </div>
                  )}
                  {slot.monthly_value && (
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={13} className="text-slate-400" />
                      R$ {Number(slot.monthly_value).toFixed(2)}/mês
                    </div>
                  )}
                  {slot.start_date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      {new Date(slot.start_date).toLocaleDateString('pt-BR')}
                      {slot.end_date && ` → ${new Date(slot.end_date).toLocaleDateString('pt-BR')}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botão de inscrição — só para alunos */}
      {profile?.role === 'student' && openSlots.length > 0 && (
        <BotaoInscrever
          projectId={project.id}
          slots={openSlots}
          existingApplication={myApplication ?? null}
        />
      )}

      {profile?.role === 'student' && openSlots.length === 0 && (
        <div className="bg-slate-100 rounded-xl p-4 text-center text-sm text-slate-500">
          Não há vagas abertas no momento para este projeto.
        </div>
      )}
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any
  label: string
  value?: string | null
}) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2 text-sm text-slate-600">
      <Icon size={15} className="mt-0.5 text-slate-400 shrink-0" />
      <span>
        <span className="text-slate-400">{label}: </span>
        {value}
      </span>
    </div>
  )
}