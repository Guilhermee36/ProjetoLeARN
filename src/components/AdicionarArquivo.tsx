'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle, X } from 'lucide-react'

const GRUPOS = ['Edital', 'Retificações', 'Resultado', 'Anexos', 'Outros']

export default function AdicionarArquivo({ edictId }: { edictId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [groupName, setGroupName] = useState('Edital')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase
      .from('edict_files')
      .insert({
        edict_id: edictId,
        name,
        file_url: fileUrl,
        group_name: groupName,
        published_at: new Date().toISOString(),
      })

    if (err) {
      setError('Erro ao adicionar arquivo.')
      setLoading(false)
      return
    }

    // Atualiza last_update do edital
    await supabase
      .from('edicts')
      .update({ last_update: new Date().toISOString() })
      .eq('id', edictId)

    setOpen(false)
    setName('')
    setFileUrl('')
    setGroupName('Edital')
    router.refresh()
    setLoading(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        <PlusCircle size={15} /> Adicionar arquivo
      </button>
    )
  }

  return (
    <form onSubmit={handleAdd} className="flex items-end gap-3 flex-wrap">
      <div className="space-y-1">
        <Label className="text-xs">Nome do arquivo</Label>
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ex: Edital DEX nº 15.2026"
          className="h-8 text-sm w-52"
          required
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">URL do arquivo (PDF)</Label>
        <Input
          type="url"
          value={fileUrl}
          onChange={e => setFileUrl(e.target.value)}
          placeholder="https://..."
          className="h-8 text-sm w-56"
          required
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Grupo</Label>
        <select
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          title="Selecione um grupo"
          className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {GRUPOS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      {error && <p className="text-xs text-red-500 w-full">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="h-8 bg-blue-700 hover:bg-blue-800" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
        <button type="button" onClick={() => setOpen(false)} title="Fechar" aria-label="Fechar formulário" className="text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
      </div>
    </form>
  )
}