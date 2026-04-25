import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CriarNotificacao from '@/components/CriarNotificacao'

export default async function NotificacoesPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin'

  // Busca notificações globais (user_id null) — sem duplicatas
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .is('user_id', null)
    .order('created_at', { ascending: false })

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
            {notifications?.length
              ? `${notifications.length} publicação${notifications.length !== 1 ? 'ões' : ''}`
              : 'Nenhuma notificação ainda.'}
          </p>
        </div>
        {isTeacher && (
          <CriarNotificacao authorName={profile?.full_name ?? 'Professor'} />
        )}
      </div>

      {!notifications || notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <div className="text-4xl mb-3">🔔</div>
          <p className="text-slate-500">Nenhuma notificação por enquanto.</p>
          {isTeacher && <p className="text-sm text-slate-400 mt-1">Crie a primeira notificação.</p>}
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n: any) => {
            const link = refLink(n)
            return (
              <div key={n.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3">
                <div className="text-xl shrink-0 mt-0.5">
                  {typeIcon[n.reference_type ?? 'general'] ?? '🔔'}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm text-slate-700">{n.message}</p>
                  {n.created_by_name && (
                    <p className="text-xs text-slate-400">
                      Por <span className="font-medium text-slate-500">{n.created_by_name}</span>
                    </p>
                  )}
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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}