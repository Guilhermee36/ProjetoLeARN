'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const CATEGORIAS = [
  'Ensino',
  'Pesquisa',
  'Extensão',
  'Assistência Estudantil',
  'Grêmio Estudantil',
  'Gestão de Pessoas',
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Vigente' },
  { value: 'closed', label: 'Encerrado' },
  { value: 'archived', label: 'Arquivado' },
]

export default function NovoEditalPage() {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [number, setNumber] = useState('')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [category, setCategory] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [status, setStatus] = useState<'active' | 'closed' | 'archived'>('active')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Não autenticado.'); setLoading(false); return }

    const { data: edict, error: err } = await supabase
      .from('edicts')
      .insert({
        title,
        description: description || null,
        number: number || null,
        year: year ? parseInt(year) : null,
        category: category || null,
        published_at: publishedAt || null,
        status,
        created_by: user.id,
        last_update: new Date().toISOString(),
      })
      .select()
      .single()

    if (err || !edict) {
      setError('Erro ao criar edital. Tente novamente.')
      setLoading(false)
      return
    }

    router.push(`/editais/${edict.id}`)
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Novo Edital</h1>
        <p className="text-slate-500 mt-1">Publique um edital de bolsas ou auxilios para os alunos.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">

        <div className="space-y-2">
          <Label htmlFor="title">Título do edital *</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ex: Edital DEX/IFRS Campus Sertão nº 15/2026 – Seleção de Bolsistas de Extensão 2026"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição / texto do edital</Label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Cole aqui o texto principal do edital..."
            rows={6}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="number">Número do edital</Label>
            <Input
              id="number"
              value={number}
              onChange={e => setNumber(e.target.value)}
              placeholder="Ex: 15/2026"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Ano</Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="2026"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Categoria</Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                  category === cat
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="publishedAt">Data do edital</Label>
            <Input
              id="publishedAt"
              type="date"
              value={publishedAt}
              onChange={e => setPublishedAt(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title="Status do edital"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1 bg-blue-700 hover:bg-blue-800" disabled={loading}>
            {loading ? 'Publicando...' : 'Publicar Edital'}
          </Button>
        </div>
      </form>
    </div>
  )
}