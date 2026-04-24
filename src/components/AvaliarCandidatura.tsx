'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

type Props = { applicationId: string }

export default function AvaliarCandidatura({ applicationId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState<'approved' | 'rejected' | null>(null)

  async function avaliar(status: 'approved' | 'rejected') {
    setLoading(status)

    await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)

    router.refresh()
    setLoading(null)
  }

  return (
    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
      <Button
        variant="outline"
        size="sm"
        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
        onClick={() => avaliar('rejected')}
        disabled={loading !== null}
      >
        {loading === 'rejected' ? 'Salvando...' : 'Não aprovar'}
      </Button>
      <Button
        size="sm"
        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        onClick={() => avaliar('approved')}
        disabled={loading !== null}
      >
        {loading === 'approved' ? 'Salvando...' : 'Aprovar candidatura'}
      </Button>
    </div>
  )
}