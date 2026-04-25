'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function MarcarLidas({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function marcar() {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
    router.refresh()
  }

  return (
    <button onClick={marcar} className="text-sm text-blue-600 hover:underline font-medium">
      Marcar todas como lidas
    </button>
  )
}