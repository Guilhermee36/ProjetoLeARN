import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role={profile?.role ?? 'student'} userName={profile?.full_name ?? ''} />
      {/*
        Desktop: ml-64 para não sobrepor sidebar fixa
        Mobile: sem margin, pt-14 para compensar a topbar fixa
      */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 p-4 md:p-8 min-w-0">
        {children}
      </main>
    </div>
  )
}
