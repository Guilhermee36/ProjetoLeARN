'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Copy, Check } from 'lucide-react'

const CATEGORIAS = ['Ensino', 'Pesquisa', 'Extensão', 'Assistência Estudantil', 'Grêmio Estudantil', 'Gestão de Pessoas']
const STATUS_OPTIONS = [
  { value: 'active', label: 'Vigente' },
  { value: 'closed', label: 'Encerrado' },
  { value: 'archived', label: 'Arquivado' },
]
const GRUPOS = ['Edital', 'Retificações', 'Resultado', 'Anexos', 'Outros']

type EdictFile = { id: string; name: string; file_url: string; group_name: string | null; published_at: string }

export default function EditalEditForm({ edict, files: initialFiles }: { edict: any; files: EdictFile[] }) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(edict.title)
  const [description, setDescription] = useState(edict.description ?? '')
  const [number, setNumber] = useState(edict.number ?? '')
  const [year, setYear] = useState(edict.year?.toString() ?? '')
  const [category, setCategory] = useState(edict.category ?? '')
  const [publishedAt, setPublishedAt] = useState(edict.published_at ?? '')
  const [status, setStatus] = useState(edict.status ?? 'active')
  const [files, setFiles] = useState<EdictFile[]>(initialFiles)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  // Novo arquivo
  const [newFileName, setNewFileName] = useState('')
  const [newFileUrl, setNewFileUrl] = useState('')
  const [newFileGroup, setNewFileGroup] = useState('Edital')
  const [addingFile, setAddingFile] = useState(false)

  function copyId() {
    navigator.clipboard.writeText(edict.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase
      .from('edicts')
      .update({
        title,
        description: description || null,
        number: number || null,
        year: year ? parseInt(year) : null,
        category: category || null,
        published_at: publishedAt || null,
        status,
        last_update: new Date().toISOString(),
      })
      .eq('id', edict.id)

    if (err) { setError('Erro ao salvar.'); setLoading(false); return }

    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    setLoading(false)
    router.refresh()
  }

  async function handleAddFile(e: React.FormEvent) {
    e.preventDefault()
    setAddingFile(true)

    const { data: file, error: err } = await supabase
      .from('edict_files')
      .insert({
        edict_id: edict.id,
        name: newFileName,
        file_url: newFileUrl,
        group_name: newFileGroup,
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (!err && file) {
      setFiles(prev => [file, ...prev])
      setNewFileName('')
      setNewFileUrl('')
      setNewFileGroup('Edital')
      await supabase.from('edicts').update({ last_update: new Date().toISOString() }).eq('id', edict.id)
    }
    setAddingFile(false)
  }

  async function handleDeleteFile(fileId: string) {
    await supabase.from('edict_files').delete().eq('id', fileId)
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  return (
    <div className="space-y-6">
      {/* ID visível */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">ID do Edital</p>
          <p className="text-sm font-mono text-slate-600 mt-0.5">{edict.id}</p>
        </div>
        <button
          onClick={copyId}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium shrink-0"
        >
          {copied ? <><Check size={13} /> Copiado!</> : <><Copy size={13} /> Copiar ID</>}
        </button>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <textarea
            id="description"
            title="Descrição"
            placeholder="Descreva o edital"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={5}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="number">Número</Label>
            <Input id="number" value={number} onChange={e => setNumber(e.target.value)} placeholder="Ex: 15/2026" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Ano</Label>
            <Input id="year" type="number" value={year} onChange={e => setYear(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Categoria</Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map(cat => (
              <button key={cat} type="button" onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                  category === cat ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="publishedAt">Data do edital</Label>
            <Input id="publishedAt" type="date" value={publishedAt} onChange={e => setPublishedAt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              title="Status"
              value={status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
        {saved && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-lg">Salvo com sucesso!</div>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="flex-1 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            onClick={() => router.push(`/editais/${edict.id}`)}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>

      {/* Gerenciar arquivos */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Arquivos do Edital</h2>
        </div>

        {/* Adicionar novo arquivo */}
        <form onSubmit={handleAddFile} className="px-6 py-4 border-b border-slate-100 bg-slate-50 space-y-3">
          <p className="text-sm font-medium text-slate-600">Adicionar arquivo</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Nome do arquivo</Label>
              <Input value={newFileName} onChange={e => setNewFileName(e.target.value)}
                placeholder="Ex: Edital nº 15.2026" className="h-9 text-sm" required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">URL (PDF)</Label>
              <Input type="url" value={newFileUrl} onChange={e => setNewFileUrl(e.target.value)}
                placeholder="https://..." className="h-9 text-sm" required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Grupo</Label>
              <select
                name="group_name"
                title="Grupo"
                value={newFileGroup}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewFileGroup(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {GRUPOS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="h-8 rounded-md bg-blue-700 px-3 text-sm font-medium text-white hover:bg-blue-800 transition disabled:cursor-not-allowed disabled:opacity-50"
            disabled={addingFile}
          >
            {addingFile ? 'Adicionando...' : '+ Adicionar'}
          </button>
        </form>

        {/* Lista de arquivos */}
        {files.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">Nenhum arquivo ainda.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 font-medium text-slate-500 text-xs uppercase">Publicado</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500 text-xs uppercase">Arquivo</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500 text-xs uppercase">Grupo</th>
                <th className="px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {files.map(file => (
                <tr key={file.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-slate-500 whitespace-nowrap text-xs">
                    {new Date(file.published_at).toLocaleDateString('pt-BR')}<br />
                    {new Date(file.published_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-3">
                    <a href={file.file_url} target="_blank" rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium">
                      {file.name}
                    </a>
                  </td>
                  <td className="px-6 py-3 text-slate-500">{file.group_name ?? '—'}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      type="button"
                      title="Excluir arquivo"
                      aria-label="Excluir arquivo"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}