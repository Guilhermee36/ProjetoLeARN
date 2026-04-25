'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bell, X } from 'lucide-react'

export default function CriarNotificacao() {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [referenceType, setReferenceType] = useState<'edict' | 'project' | 'general'>('general')
  const [referenceTitle, setReferenceTitle] = useState('')
  const [referenceId, setReferenceId] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Busca todos os alunos para notificar
    const { data: students } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'student')

    if (students && students.length > 0) {
      const notifications = students.map(s => ({
        user_id: s.id,
        message,
        type: referenceType,
        reference_type: referenceType !== 'general' ? referenceType : null,
        reference_id: referenceId || null,
        reference_title: referenceTitle || null,
        is_read: false,
      }))

      await supabase.from('notifications').insert(notifications)
    }

    setSent(true)
    setLoading(false)
    setTimeout(() => {
      setSent(false)
      setOpen(false)
      setMessage('')
      setReferenceType('general')
      setReferenceTitle('')
      setReferenceId('')
    }, 2000)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        <Bell size={15} /> Criar notificação
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Nova Notificação</h3>
          <button type="button" aria-label="Fechar" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {sent ? (
          <div className="text-center py-6 space-y-2">
            <div className="text-4xl">✅</div>
            <p className="font-medium text-green-700">Notificação enviada para todos os alunos!</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de referência</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['general', 'edict', 'project'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setReferenceType(t)}
                    className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                      referenceType === t
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {t === 'general' ? '🔔 Geral' : t === 'edict' ? '📋 Edital' : '🎓 Projeto'}
                  </button>
                ))}
              </div>
            </div>

            {referenceType !== 'general' && (
              <>
                <div className="space-y-2">
                  <Label>Título de referência</Label>
                  <Input
                    value={referenceTitle}
                    onChange={e => setReferenceTitle(e.target.value)}
                    placeholder={referenceType === 'edict' ? 'Nome do edital' : 'Nome do projeto'}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ID do {referenceType === 'edict' ? 'edital' : 'projeto'} (opcional)</Label>
                  <Input
                    value={referenceId}
                    onChange={e => setReferenceId(e.target.value)}
                    placeholder="Cole o UUID aqui para criar o link"
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-slate-400">Se preenchido, gera um link clicável na notificação.</p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Mensagem *</Label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Ex: Novo edital de bolsas de extensão disponível. Inscrições até 12/04/2026."
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-blue-700 hover:bg-blue-800" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar para todos alunos'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}