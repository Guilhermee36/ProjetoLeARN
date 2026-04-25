import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PerfilForm from '@/components/PerfilForm'

export default async function PerfilPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Meu Perfil</h1>
        <p className="text-slate-500 mt-1">Mantenha seus dados atualizados.</p>
      </div>
      <PerfilForm profile={profile} email={user.email ?? ''} />
    </div>
  )
}