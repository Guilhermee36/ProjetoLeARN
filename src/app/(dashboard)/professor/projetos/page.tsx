import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Users, Eye } from 'lucide-react'
import CategoryBadge from '@/components/CategoryBadge'

export default async function ProfessorProjetosPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'teacher') redirect('/bolsas')

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      scholarship_slots (id, status),
      applications (id, status)
    `)
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  const statusLabel: Record<string, string> = {
    draft: 'Rascunho',
    active: 'Ativo',
    closed: 'Encerrado',
    archived: 'Arquivado',
  }

  const statusStyle: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-700',
    active: 'bg-green-100 text-green-700',
    closed: 'bg-slate-100 text-slate-500',
    archived: 'bg-slate-100 text-slate-400',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Meus Projetos</h1>
          <p className="text-slate-500 mt-1">Gerencie seus projetos de bolsa e candidaturas.</p>
        </div>
        <Link
          href="/professor/novo-projeto"
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <PlusCircle size={16} />
          Novo Projeto
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <div className="text-5xl mb-4">📋</div>
          <p className="font-medium text-slate-600">Você ainda não tem projetos.</p>
          <p className="text-sm text-slate-400 mt-1 mb-6">Crie seu primeiro projeto de bolsa.</p>
          <Link
            href="/professor/novo-projeto"
            className="inline-flex items-center gap-2 bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-800"
          >
            <PlusCircle size={16} /> Criar projeto
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project: any) => {
            const totalSlots = project.scholarship_slots?.length ?? 0
            const openSlots = project.scholarship_slots?.filter((s: any) => s.status === 'open').length ?? 0
            const pendingApps = project.applications?.filter((a: any) => a.status === 'pending').length ?? 0

            return (
              <div key={project.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800">{project.title}</h3>
                      <CategoryBadge category={project.category} />
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[project.status]}`}>
                        {statusLabel[project.status]}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-sm text-slate-500 line-clamp-1">{project.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-500 pt-1">
                      <span>{totalSlots} vaga{totalSlots !== 1 ? 's' : ''} ({openSlots} aberta{openSlots !== 1 ? 's' : ''})</span>
                      {pendingApps > 0 && (
                        <span className="text-orange-600 font-medium">
                          {pendingApps} candidatura{pendingApps !== 1 ? 's' : ''} pendente{pendingApps !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      href={`/professor/projetos/${project.id}/candidaturas`}
                      className="flex items-center gap-1.5 text-sm border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-slate-600 transition-colors"
                    >
                      <Users size={14} /> Candidaturas
                    </Link>
                    <Link
                      href={`/bolsas/${project.id}`}
                      className="flex items-center gap-1.5 text-sm border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-slate-600 transition-colors"
                    >
                      <Eye size={14} /> Ver
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}