import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MarcarLidas from '@/components/MarcarLidas'

export default async function NotificacoesPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const unreadCount = notifications?.filter(n => !n.is_read).length ?? 0

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notificações</h1>
          <p className="text-slate-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Tudo em dia!'}
          </p>
        </div>
        {unreadCount > 0 && <MarcarLidas userId={user.id} />}
      </div>

      {!notifications || notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <div className="text-4xl mb-3">🔔</div>
          <p className="text-slate-500">Nenhuma notificação por enquanto.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`bg-white rounded-xl border p-4 flex items-start gap-3 transition-colors ${
                !n.is_read ? 'border-blue-200 bg-blue-50/50' : 'border-slate-200'
              }`}
            >
              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.is_read ? 'bg-blue-500' : 'bg-transparent'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(n.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}