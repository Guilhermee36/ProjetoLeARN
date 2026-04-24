import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AvaliarCandidatura from '@/components/AvaliarCandidatura'

type Props = { params: { id: string } }

export default async function CandidaturasPage({ params }: Props) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id, title, teacher_id')
    .eq('id', params.id)
    .single()

  if (!project || project.teacher_id !== user.id) notFound()

  const { data: applications } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      applied_at,
      profiles:student_id (
        id,
        full_name,
        course
      ),
      scholarship_slots (
        slot_code,
        weekly_hours,
        monthly_value
      )
    `)
    .eq('project_id', params.id)
    .order('applied_at', { ascending: false })

  const statusLabel: Record<string, string> = {
    pending: 'Pendente',
    approved: 'Aprovado',
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <nav className="text-sm text-slate-400 mb-3">
          <a href="/professor/projetos" className="hover:text-blue-600">Meus Projetos</a>
          <span className="mx-2">›</span>
          <span className="text-slate-600">Candidaturas</span>
        </nav>
        <h1 className="text-2xl font-bold text-slate-800">{project.title}</h1>
        <p className="text-slate-500 mt-1">
          {applications?.length ?? 0} candidatura{(applications?.length ?? 0) !== 1 ? 's' : ''} recebida{(applications?.length ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>

      {!applications || applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-500">Nenhuma candidatura recebida ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app: any) => (
            <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800">
                    {app.profiles?.full_name ?? 'Aluno'}
                  </p>
                  {app.profiles?.course && (
                    <p className="text-sm text-slate-500">{app.profiles.course}</p>
                  )}
                  <p className="text-xs text-slate-400">
                    Inscrito em {new Date(app.applied_at).toLocaleDateString('pt-BR')}
                    {app.scholarship_slots?.slot_code && ` · Vaga ${app.scholarship_slots.slot_code}`}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${statusStyle[app.status]}`}>
                  {statusLabel[app.status]}
                </span>
              </div>

              {app.status === 'pending' && (
                <AvaliarCandidatura applicationId={app.id} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}