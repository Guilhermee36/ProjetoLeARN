'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

type Slot = { id: string; slot_code: string | null }

type Props = {
  projectId: string
  slots: Slot[]
  existingApplication: { id: string; status: string } | null
}

const statusLabel: Record<string, string> = {
  pending: 'Inscrição enviada — aguardando análise',
  approved: 'Inscrição aprovada ✅',
  rejected: 'Inscrição não aprovada',
  waitlisted: 'Em lista de espera',
}

export default function BotaoInscrever({ projectId, slots, existingApplication }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Já tem inscrição — mostra status
  if (existingApplication) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center text-sm text-blue-700 font-medium">
        {statusLabel[existingApplication.status] ?? 'Inscrição registrada'}
      </div>
    )
  }

  async function handleInscrever() {
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Você precisa estar logado.'); setLoading(false); return }

    // Inscreve na primeira vaga aberta disponível
    const slot = slots[0]

    const { error } = await supabase.from('applications').insert({
      student_id: user.id,
      project_id: projectId,
      slot_id: slot.id,
      status: 'pending',
    })

    if (error) {
      setError('Erro ao enviar inscrição. Tente novamente.')
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
      <div>
        <h3 className="font-semibold text-slate-800">Candidatar-se a esta bolsa</h3>
        <p className="text-sm text-slate-500 mt-0.5">
          Sua inscrição será enviada para análise do professor responsável.
        </p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
      <Button
        onClick={handleInscrever}
        className="w-full bg-blue-700 hover:bg-blue-800"
        disabled={loading}
      >
        {loading ? 'Enviando inscrição...' : 'Quero me inscrever'}
      </Button>
    </div>
  )
}