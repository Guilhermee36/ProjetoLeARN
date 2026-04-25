import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MarcarLidas from '@/components/MarcarLidas'
import CriarNotificacao from '@/components/CriarNotificacao'

export default async function NotificacoesPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const unreadCount = notifications?.filter(n => !n.is_read).length ?? 0

  const refLink = (n: any) => {
    if (n.reference_type === 'edict' && n.reference_id) return `/editais/${n.reference_id}`
    if (n.reference_type === 'project' && n.reference_id) return `/bolsas/${n.reference_id}`
    return null
  }

  const typeIcon: Record<string, string> = {
    edict: '📋',
    project: '🎓',
    general: '🔔',
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notificações</h1>
          <p className="text-slate-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Tudo em dia!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(profile?.role === 'teacher' || profile?.role === 'admin') && (
            <CriarNotificacao />
          )}
          {unreadCount > 0 && <MarcarLidas userId={user.id} />}
        </div>
      </div>

      {!notifications || notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <div className="text-4xl mb-3">🔔</div>
          <p className="text-slate-500">Nenhuma notificação por enquanto.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n: any) => {
            const link = refLink(n)
            return (
              <div
                key={n.id}
                className={`bg-white rounded-xl border p-4 flex items-start gap-3 transition-colors ${
                  !n.is_read ? 'border-blue-200 bg-blue-50/50' : 'border-slate-200'
                }`}
              >
                <div className="text-xl shrink-0 mt-0.5">
                  {typeIcon[n.reference_type ?? 'general'] ?? '🔔'}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm text-slate-700">{n.message}</p>
                  {n.reference_title && link && (
                    <Link href={link} className="text-xs text-blue-600 hover:underline">
                      {n.reference_title} →
                    </Link>
                  )}
                  <p className="text-xs text-slate-400">
                    {new Date(n.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                {!n.is_read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}