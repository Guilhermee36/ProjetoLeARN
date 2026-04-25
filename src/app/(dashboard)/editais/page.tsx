import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, FileText, Calendar, ExternalLink } from 'lucide-react'

export default async function EditaisPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const { data: edicts } = await supabase
    .from('edicts')
    .select(`*, edict_files(id)`)
    .order('last_update', { ascending: false })

  const statusLabel: Record<string, string> = {
    active: 'Vigente',
    closed: 'Encerrado',
    archived: 'Arquivado',
  }

  const statusStyle: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    closed: 'bg-slate-100 text-slate-500',
    archived: 'bg-slate-100 text-slate-400',
  }

  const categoryColors: Record<string, string> = {
    'Extensão': 'bg-orange-100 text-orange-700',
    'Ensino': 'bg-blue-100 text-blue-700',
    'Pesquisa': 'bg-green-100 text-green-700',
    'Assistência Estudantil': 'bg-purple-100 text-purple-700',
    'Grêmio Estudantil': 'bg-pink-100 text-pink-700',
    'Gestão de Pessoas': 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Central de Editais</h1>
          <p className="text-slate-500 mt-1">
            Editais de bolsas, auxílios e processos seletivos do IFRS Campus Sertão.
          </p>
        </div>
        {(profile?.role === 'teacher' || profile?.role === 'admin') && (
          <Link
            href="/editais/novo"
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <PlusCircle size={16} /> Novo Edital
          </Link>
        )}
      </div>

      {!edicts || edicts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-slate-500 font-medium">Nenhum edital publicado ainda.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Última Atualização</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Edital</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Data do Edital</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Categoria</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {edicts.map((edict: any) => (
                <tr key={edict.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                    {new Date(edict.last_update).toLocaleDateString('pt-BR')}<br />
                    <span className="text-xs text-slate-400">
                      {new Date(edict.last_update).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/editais/${edict.id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium leading-snug"
                    >
                      {edict.title}
                    </Link>
                    {(edict.edict_files?.length ?? 0) > 0 && (
                      <span className="ml-2 text-xs text-slate-400">
                        {edict.edict_files.length} arquivo{edict.edict_files.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                    {edict.published_at
                      ? new Date(edict.published_at).toLocaleDateString('pt-BR')
                      : '—'}
                  </td>
                  <td className="px-5 py-4">
                    {edict.category ? (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[edict.category] ?? 'bg-slate-100 text-slate-600'}`}>
                        {edict.category}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-4">
                    {edict.status ? (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle[edict.status]}`}>
                        {statusLabel[edict.status]}
                      </span>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}