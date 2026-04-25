import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Download, Pencil } from 'lucide-react'
import AdicionarArquivo from '@/components/AdicionarArquivo'

type Props = { params: { id: string } }

export default async function DetalheEditalPage({ params }: Props) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: edict } = await supabase
    .from('edicts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!edict) notFound()

  const { data: files } = await supabase
    .from('edict_files')
    .select('*')
    .eq('edict_id', params.id)
    .order('published_at', { ascending: false })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const canEdit = profile?.role === 'teacher' || profile?.role === 'admin'

  const categoryColors: Record<string, string> = {
    'Extensão': 'bg-orange-100 text-orange-700',
    'Ensino': 'bg-blue-100 text-blue-700',
    'Pesquisa': 'bg-green-100 text-green-700',
    'Assistência Estudantil': 'bg-purple-100 text-purple-700',
    'Grêmio Estudantil': 'bg-pink-100 text-pink-700',
    'Gestão de Pessoas': 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <nav className="text-sm text-slate-400">
        <Link href="/editais" className="hover:text-blue-600">Editais</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-600 line-clamp-1">{edict.title}</span>
      </nav>

      {/* Header */}
      <div className="bg-blue-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-10">
          <FileText size={80} />
        </div>
        <div className="relative space-y-2">
          {edict.category && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[edict.category] ?? 'bg-white/20 text-white'}`}>
              {edict.category}
            </span>
          )}
          <h1 className="text-xl font-bold leading-snug">{edict.title}</h1>
          {edict.published_at && (
            <p className="text-blue-200 text-sm">
              de {new Date(edict.published_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
        {canEdit && (
          <Link
            href={`/editais/${edict.id}/editar`}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Pencil size={12} /> Editar
          </Link>
        )}
      </div>

      {/* Descrição */}
      {edict.description && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{edict.description}</p>
        </div>
      )}

      {/* ID visível para referência — só professores/admins */}
      {canEdit && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 flex items-center gap-3 text-xs text-slate-500">
          <span className="font-medium text-slate-400 uppercase tracking-wide">ID:</span>
          <span className="font-mono">{edict.id}</span>
          <a href={`/editais/${edict.id}/editar`}
            className="ml-auto text-blue-600 hover:underline font-medium">
            ✏️ Editar edital
          </a>
        </div>
      )}

      {/* Arquivos */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Arquivos do Edital</h2>
          {canEdit && <AdicionarArquivo edictId={edict.id} />}
        </div>

        {!files || files.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">
            Nenhum arquivo publicado ainda.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Publicado em</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Arquivo</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Grupo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {files.map((file: any) => (
                <tr key={file.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(file.published_at).toLocaleDateString('pt-BR')}<br />
                    <span className="text-xs text-slate-400">
                      {new Date(file.published_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      <Download size={14} className="shrink-0" />
                      {file.name}
                    </a>
                  </td>
                  <td className="px-6 py-3 text-slate-500">{file.group_name ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}