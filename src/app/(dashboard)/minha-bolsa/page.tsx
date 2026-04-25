import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
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

  // Busca inscrição aprovada
  const { data: application } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      applied_at,
      projects (
        id,
        title,
        description,
        category,
        location,
        schedule,
        profiles:teacher_id (
          full_name,
          lattes_url
        )
      ),
      scholarship_slots (
        slot_code,
        weekly_hours,
        monthly_value,
        start_date,
        end_date
      )
    `)
    .eq('student_id', user.id)
    .eq('status', 'approved')
    .maybeSingle()

  // Busca todas as inscrições para histórico
  const { data: allApplications } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      applied_at,
      projects ( title, category )
    `)
    .eq('student_id', user.id)
    .order('applied_at', { ascending: false })

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

  const project = application?.projects as any
  const scholarshipSlot = application?.scholarship_slots as any

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Minha Bolsa</h1>
        <p className="text-slate-500 mt-1">Acompanhe sua bolsa e histórico de candidaturas.</p>
      </div>

      {/* Bolsa ativa */}
      {application ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                Bolsa ativa
              </span>
              <h2 className="text-lg font-bold text-slate-800 mt-2">
                {project?.title}
              </h2>
            </div>
            <CategoryBadge category={project?.category} />
          </div>

          {project?.description && (
            <p className="text-sm text-slate-600">{project.description}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project?.profiles?.full_name && (
              <InfoRow icon={User} label="Professor" value={project.profiles.full_name} />
            )}
            {project?.location && (
              <InfoRow icon={MapPin} label="Local" value={project.location} />
            )}
            {project?.schedule && (
              <InfoRow icon={Clock} label="Horário" value={project.schedule} />
            )}
            {scholarshipSlot?.weekly_hours && (
              <InfoRow icon={Clock} label="Carga horária" value={`${scholarshipSlot.weekly_hours}h/semana`} />
            )}
            {scholarshipSlot?.monthly_value && (
              <InfoRow
                icon={DollarSign}
                label="Valor da bolsa"
                value={`R$ ${Number(scholarshipSlot.monthly_value).toFixed(2)}/mês`}
              />
            )}
            {scholarshipSlot?.start_date && (
              <InfoRow
                icon={Calendar}
                label="Vigência"
                value={`${new Date(scholarshipSlot.start_date).toLocaleDateString('pt-BR')} → ${
                  scholarshipSlot.end_date
                    ? new Date(scholarshipSlot.end_date).toLocaleDateString('pt-BR')
                    : 'Indefinido'
                }`}
              />
            )}
          </div>

          {project?.profiles?.lattes_url && (
            <a
              href={project?.profiles?.lattes_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Currículo Lattes do professor →
            </a>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center space-y-3">
          <div className="text-5xl">🎓</div>
          <p className="font-medium text-slate-600">Você ainda não tem bolsa aprovada.</p>
          <p className="text-sm text-slate-400">Explore os projetos disponíveis e candidate-se.</p>
          
          <a
            href="/bolsas"
            className="inline-block mt-2 text-sm text-blue-600 hover:underline font-medium"
          >
            Ver bolsas disponíveis →
          </a>
        </div>
      )}

      {/* Histórico de candidaturas */}
      {allApplications && allApplications.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700">Histórico de Candidaturas</h2>
          <div className="space-y-2">
            {allApplications.map((app: any) => (
              <div key={app.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-700">{app.projects?.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(app.applied_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle[app.status]}`}>
                  {statusLabel[app.status]}
                </span>
              </div>
            ))}
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