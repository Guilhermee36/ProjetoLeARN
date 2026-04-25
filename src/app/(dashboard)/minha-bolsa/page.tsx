import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Clock, DollarSign, Calendar, User } from 'lucide-react'
import CategoryBadge from '@/components/CategoryBadge'

export default async function MinhaBolsaPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'student') redirect('/bolsas')

  const { data: application } = await supabase
    .from('applications')
    .select('id, status, applied_at, project_id, slot_id')
    .eq('student_id', user.id)
    .eq('status', 'approved')
    .maybeSingle()

  // Busca separada para evitar problema de join aninhado
  let project: any = null
  let slot: any = null

  if (application?.project_id) {
    const { data: p } = await supabase
      .from('projects')
      .select(`
        id, title, description, category, location, schedule,
        profiles:teacher_id ( full_name, lattes_url )
      `)
      .eq('id', application.project_id)
      .single()
    project = p
  }

  if (application?.slot_id) {
    const { data: s } = await supabase
      .from('scholarship_slots')
      .select('slot_code, weekly_hours, monthly_value, start_date, end_date')
      .eq('id', application.slot_id)
      .single()
    slot = s
  }

  const { data: allApplications } = await supabase
    .from('applications')
    .select('id, status, applied_at, project_id')
    .eq('student_id', user.id)
    .order('applied_at', { ascending: false })

  // Busca títulos dos projetos para o histórico
  const projectIds = [...new Set(allApplications?.map(a => a.project_id).filter(Boolean) ?? [])]
  const { data: projectTitles } = await supabase
    .from('projects')
    .select('id, title, category')
    .in('id', projectIds.length > 0 ? projectIds : ['00000000-0000-0000-0000-000000000000'])

  const projectMap = Object.fromEntries((projectTitles ?? []).map(p => [p.id, p]))

  const statusLabel: Record<string, string> = {
    pending: 'Aguardando análise',
    approved: 'Aprovado ✅',
    rejected: 'Não aprovado',
    waitlisted: 'Lista de espera',
  }

  const statusStyle: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
    waitlisted: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Minha Bolsa</h1>
        <p className="text-slate-500 mt-1">Acompanhe sua bolsa e histórico de candidaturas.</p>
      </div>

      {project ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                Bolsa ativa
              </span>
              <h2 className="text-lg font-bold text-slate-800 mt-2">{project.title}</h2>
            </div>
            <CategoryBadge category={project.category} />
          </div>

          {project.description && (
            <p className="text-sm text-slate-600">{project.description}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.profiles?.full_name && (
              <InfoRow icon={User} label="Professor" value={project.profiles.full_name} />
            )}
            {project.location && <InfoRow icon={MapPin} label="Local" value={project.location} />}
            {project.schedule && <InfoRow icon={Clock} label="Horário" value={project.schedule} />}
            {slot?.weekly_hours && (
              <InfoRow icon={Clock} label="Carga horária" value={`${slot.weekly_hours}h/semana`} />
            )}
            {slot?.monthly_value && (
              <InfoRow icon={DollarSign} label="Valor" value={`R$ ${Number(slot.monthly_value).toFixed(2)}/mês`} />
            )}
            {slot?.start_date && (
              <InfoRow
                icon={Calendar}
                label="Vigência"
                value={`${new Date(slot.start_date).toLocaleDateString('pt-BR')} → ${
                  slot.end_date ? new Date(slot.end_date).toLocaleDateString('pt-BR') : 'Indefinido'
                }`}
              />
            )}
          </div>

          {project.profiles?.lattes_url && (
            <a href={project.profiles.lattes_url} target="_blank" rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline">
              Currículo Lattes do professor →
            </a>
          )}

          <Link
            href={`/bolsas/${application!.project_id}`}
            className="inline-block text-sm text-blue-600 hover:underline font-medium"
          >
            Ver página completa do projeto →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center space-y-3">
          <div className="text-5xl">🎓</div>
          <p className="font-medium text-slate-600">Você ainda não tem bolsa aprovada.</p>
          <p className="text-sm text-slate-400">Explore os projetos disponíveis e candidate-se.</p>
          <Link href="/bolsas" className="inline-block mt-2 text-sm text-blue-600 hover:underline font-medium">
            Ver bolsas disponíveis →
          </Link>
        </div>
      )}

      {allApplications && allApplications.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700">Histórico de Candidaturas</h2>
          <div className="space-y-2">
            {allApplications.map((app: any) => {
              const proj = projectMap[app.project_id]
              return (
                <div key={app.id} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0 gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {proj?.title ?? 'Projeto'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(app.applied_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {proj && (
                      <Link href={`/bolsas/${app.project_id}`}
                        className="text-xs text-blue-600 hover:underline">
                        Ver →
                      </Link>
                    )}
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle[app.status]}`}>
                      {statusLabel[app.status]}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-sm text-slate-600">
      <Icon size={15} className="mt-0.5 text-slate-400 shrink-0" />
      <span><span className="text-slate-400">{label}: </span>{value}</span>
    </div>
  )
}