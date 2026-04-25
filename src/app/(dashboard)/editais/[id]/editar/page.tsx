import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import EditalEditForm from '@/components/EditalEditForm'

type Props = { params: { id: string } }

export default async function EditarEditalPage({ params }: Props) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'teacher' && profile?.role !== 'admin') redirect('/editais')

  const { data: edict } = await supabase
    .from('edicts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!edict) notFound()

  const { data: files } = await supabase
    .from('edict_files')
    .select('*')
    .eq('edict_id', params.id)
    .order('published_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <nav className="text-sm text-slate-400 mb-3">
          <a href="/editais" className="hover:text-blue-600">Editais</a>
          <span className="mx-2">›</span>
          <a href={`/editais/${params.id}`} className="hover:text-blue-600 line-clamp-1">{edict.title}</a>
          <span className="mx-2">›</span>
          <span className="text-slate-600">Editar</span>
        </nav>
        <h1 className="text-2xl font-bold text-slate-800">Editar Edital</h1>
      </div>
      <EditalEditForm edict={edict} files={files ?? []} />
    </div>
  )
}