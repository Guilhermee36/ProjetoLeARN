// src/app/(dashboard)/analytics/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AnalyticsCharts from '@/components/AnalyticsCharts'
import {
  Users, BookOpen, GraduationCap, FileText,
  TrendingUp, UserCheck, BarChart2, Award,
} from 'lucide-react'
 
export default async function AnalyticsPage() {
  const supabase = createClient()
 
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
 
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
 
  if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
    redirect('/bolsas')
  }
 
  // ── Queries paralelas ──────────────────────────────────────────
  const [
    { count: totalStudents },
    { count: totalTeachers },
    { count: totalProjects },
    { count: activeProjects },
    { count: totalSlots },
    { count: openSlots },
    { count: filledSlots },
    { count: totalApplications },
    { count: pendingApplications },
    { count: approvedApplications },
    { count: totalEdicts },
    { data: projectsByCategory },
    { data: applicationsByStatus },
    { data: slotsByProject },
    { data: recentApplications },
    { data: teacherStats },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('scholarship_slots').select('*', { count: 'exact', head: true }),
    supabase.from('scholarship_slots').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('scholarship_slots').select('*', { count: 'exact', head: true }).eq('status', 'filled'),
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('edicts').select('*', { count: 'exact', head: true }),
 
    // Projetos por categoria
    supabase.from('projects').select('category'),
 
    // Candidaturas por status
    supabase.from('applications').select('status'),
 
    // Vagas por projeto (top projetos)
    supabase.from('projects').select(`
      id, title, category,
      scholarship_slots(id, status),
      applications(id, status)
    `).eq('status', 'active').limit(10),
 
    // Candidaturas recentes
    supabase.from('applications')
      .select(`
        id, status, applied_at,
        profiles:student_id(full_name),
        projects:project_id(title, category)
      `)
      .order('applied_at', { ascending: false })
      .limit(8),
 
    // Professores com mais projetos
    supabase.from('profiles')
      .select(`id, full_name, projects(id, status, scholarship_slots(id, status), applications(id, status))`)
      .eq('role', 'teacher'),
  ])
 
  // ── Processar dados para gráficos ──────────────────────────────
  const categoryCount = (projectsByCategory ?? []).reduce((acc: any, p: any) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})
 
  const categoryChartData = [
    { name: 'Pesquisa', value: categoryCount['research'] ?? 0, color: '#16a34a' },
    { name: 'Ensino', value: categoryCount['teaching'] ?? 0, color: '#2563eb' },
    { name: 'Extensão', value: categoryCount['extension'] ?? 0, color: '#ea580c' },
  ]
 
  const statusCount = (applicationsByStatus ?? []).reduce((acc: any, a: any) => {
    acc[a.status] = (acc[a.status] || 0) + 1
    return acc
  }, {})
 
  const applicationChartData = [
    { name: 'Pendentes', value: statusCount['pending'] ?? 0, color: '#f59e0b' },
    { name: 'Aprovadas', value: statusCount['approved'] ?? 0, color: '#10b981' },
    { name: 'Recusadas', value: statusCount['rejected'] ?? 0, color: '#ef4444' },
    { name: 'Em espera', value: statusCount['waitlisted'] ?? 0, color: '#6366f1' },
  ]
 
  const slotBarData = (slotsByProject ?? [])
    .map((p: any) => ({
      name: p.title.length > 20 ? p.title.slice(0, 20) + '…' : p.title,
      abertas: p.scholarship_slots?.filter((s: any) => s.status === 'open').length ?? 0,
      preenchidas: p.scholarship_slots?.filter((s: any) => s.status === 'filled').length ?? 0,
      candidatos: p.applications?.length ?? 0,
    }))
    .filter((d: any) => d.abertas + d.preenchidas > 0)
 
  const teacherRanking = (teacherStats ?? [])
    .map((t: any) => ({
      name: t.full_name ?? 'Professor',
      projetos: t.projects?.length ?? 0,
      vagas: t.projects?.reduce((acc: number, p: any) => acc + (p.scholarship_slots?.length ?? 0), 0) ?? 0,
      aprovados: t.projects?.reduce((acc: number, p: any) =>
        acc + (p.applications?.filter((a: any) => a.status === 'approved').length ?? 0), 0) ?? 0,
    }))
    .sort((a: any, b: any) => b.projetos - a.projetos)
    .slice(0, 5)
 
  const taxaOcupacao = totalSlots ? Math.round(((filledSlots ?? 0) / totalSlots) * 100) : 0
  const taxaAprovacao = totalApplications ? Math.round(((approvedApplications ?? 0) / totalApplications) * 100) : 0
 
  const kpis = [
    { label: 'Estudantes', value: totalStudents ?? 0, icon: GraduationCap, color: 'blue', sub: 'cadastrados' },
    { label: 'Professores', value: totalTeachers ?? 0, icon: UserCheck, color: 'purple', sub: 'ativos' },
    { label: 'Projetos Ativos', value: activeProjects ?? 0, icon: BookOpen, color: 'green', sub: `de ${totalProjects ?? 0} total` },
    { label: 'Vagas Abertas', value: openSlots ?? 0, icon: Award, color: 'orange', sub: `de ${totalSlots ?? 0} total` },
    { label: 'Candidaturas', value: totalApplications ?? 0, icon: TrendingUp, color: 'teal', sub: `${pendingApplications ?? 0} pendentes` },
    { label: 'Editais', value: totalEdicts ?? 0, icon: FileText, color: 'slate', sub: 'publicados' },
    { label: 'Taxa de Ocupação', value: `${taxaOcupacao}%`, icon: BarChart2, color: 'indigo', sub: 'vagas preenchidas' },
    { label: 'Taxa de Aprovação', value: `${taxaAprovacao}%`, icon: Users, color: 'rose', sub: 'das candidaturas' },
  ]
 
  const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   icon: 'text-blue-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-500' },
    green:  { bg: 'bg-green-50',  text: 'text-green-700',  icon: 'text-green-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-500' },
    teal:   { bg: 'bg-teal-50',   text: 'text-teal-700',   icon: 'text-teal-500' },
    slate:  { bg: 'bg-slate-100', text: 'text-slate-700',  icon: 'text-slate-500' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'text-indigo-500' },
    rose:   { bg: 'bg-rose-50',   text: 'text-rose-700',   icon: 'text-rose-500' },
  }
 
  const statusLabel: Record<string, { label: string; style: string }> = {
    pending:   { label: 'Pendente',    style: 'bg-yellow-100 text-yellow-700' },
    approved:  { label: 'Aprovada',    style: 'bg-green-100 text-green-700' },
    rejected:  { label: 'Recusada',    style: 'bg-red-100 text-red-600' },
    waitlisted:{ label: 'Em espera',   style: 'bg-indigo-100 text-indigo-700' },
  }
 
  const categoryLabel: Record<string, { label: string; style: string }> = {
    research:  { label: 'Pesquisa',  style: 'bg-green-100 text-green-700' },
    teaching:  { label: 'Ensino',    style: 'bg-blue-100 text-blue-700' },
    extension: { label: 'Extensão',  style: 'bg-orange-100 text-orange-700' },
  }
 
  return (
    <div className="space-y-8">
 
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Painel de Análise</h1>
        <p className="text-slate-500 mt-1">
          Visão geral do programa de bolsas — dados em tempo real.
        </p>
      </div>
 
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(kpi => {
          const c = colorMap[kpi.color]
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  {kpi.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                  <kpi.icon size={16} className={c.icon} />
                </div>
              </div>
              <div>
                <div className={`text-3xl font-bold ${c.text}`}>{kpi.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{kpi.sub}</div>
              </div>
            </div>
          )
        })}
      </div>
 
      {/* Gráficos — componente client */}
      <AnalyticsCharts
        categoryData={categoryChartData}
        applicationData={applicationChartData}
        slotBarData={slotBarData}
        teacherRanking={teacherRanking}
      />
 
      {/* Tabela: candidaturas recentes */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Candidaturas Recentes</h2>
        </div>
        {!recentApplications?.length ? (
          <div className="py-10 text-center text-slate-400 text-sm">Nenhuma candidatura ainda.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Aluno</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Projeto</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Categoria</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Data</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentApplications.map((app: any) => {
                const st = statusLabel[app.status]
                const ct = categoryLabel[(app.projects as any)?.category]
                return (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-700">
                      {(app.profiles as any)?.full_name ?? '—'}
                    </td>
                    <td className="px-6 py-3 text-slate-600 max-w-[200px] truncate">
                      {(app.projects as any)?.title ?? '—'}
                    </td>
                    <td className="px-6 py-3">
                      {ct && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ct.style}`}>
                          {ct.label}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-400 whitespace-nowrap">
                      {new Date(app.applied_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-3">
                      {st && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.style}`}>
                          {st.label}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
 
      {/* Ranking de professores */}
      {teacherRanking.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700">Professores com mais projetos</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {teacherRanking.map((t: any, i: number) => (
              <div key={t.name} className="px-6 py-4 flex items-center gap-4">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  i === 0 ? 'bg-yellow-100 text-yellow-700'
                  : i === 1 ? 'bg-slate-100 text-slate-600'
                  : i === 2 ? 'bg-orange-100 text-orange-700'
                  : 'bg-slate-50 text-slate-400'
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{t.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t.projetos} projeto{t.projetos !== 1 ? 's' : ''} ·{' '}
                    {t.vagas} vaga{t.vagas !== 1 ? 's' : ''} ·{' '}
                    {t.aprovados} aprovado{t.aprovados !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex gap-6 text-center shrink-0">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{t.projetos}</div>
                    <div className="text-xs text-slate-400">Projetos</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{t.aprovados}</div>
                    <div className="text-xs text-slate-400">Aprovados</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}